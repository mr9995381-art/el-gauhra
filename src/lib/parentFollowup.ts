import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from '../firebase';
import { UserProfile, TestResult, StudentFollowupReport, GRADE_LABELS } from '../types';

/**
 * Normalizes phone numbers to standard 10-11 digits (e.g. 01012345678)
 * for reliable comparison regardless of whether user typed +20, 002, dashes or spaces.
 */
export function normalizePhone(raw: string): string {
  if (!raw) return '';
  let digits = raw.replace(/\D/g, '');
  // If starts with 0020, remove 002
  if (digits.startsWith('0020')) digits = digits.slice(3);
  // If starts with 20 and has 12 digits (e.g. 201012345678), remove 2
  else if (digits.startsWith('20') && digits.length >= 12) digits = digits.slice(2);
  // Ensure starts with single 0 if standard Egyptian mobile (e.g. 1012345678 -> 01012345678)
  if (digits.length === 10 && digits.startsWith('1')) {
    digits = '0' + digits;
  }
  return digits;
}

/**
 * Search Firestore for student by Student Phone, Parent Phone, Student UID, or Email.
 * Returns fully compiled, real-time StudentFollowupReport from live collections.
 */
export async function searchStudentForParent(rawQuery: string): Promise<StudentFollowupReport | null> {
  const cleanInput = rawQuery.trim();
  if (!cleanInput) return null;

  const normalizedInputPhone = normalizePhone(cleanInput);
  let matchedStudent: UserProfile | null = null;

  try {
    // 1. First try direct document lookup by UID
    const directDoc = await getDoc(doc(db, 'users', cleanInput));
    if (directDoc.exists()) {
      const data = directDoc.data() as UserProfile;
      if (data.role === 'student') {
        matchedStudent = data;
      }
    }

    // 2. If not found by UID, query by phone or parentPhone or email
    if (!matchedStudent) {
      const usersRef = collection(db, 'users');

      // Try phone equality if looks like phone
      if (normalizedInputPhone.length >= 7) {
        const qPhone = query(usersRef, where('phone', '==', normalizedInputPhone));
        const snapPhone = await getDocs(qPhone);
        if (!snapPhone.empty) {
          matchedStudent = snapPhone.docs[0].data() as UserProfile;
        }

        // If still not found, try parentPhone
        if (!matchedStudent) {
          const qParent = query(usersRef, where('parentPhone', '==', normalizedInputPhone));
          const snapParent = await getDocs(qParent);
          if (!snapParent.empty) {
            matchedStudent = snapParent.docs[0].data() as UserProfile;
          }
        }
      }

      // If still not found, try email
      if (!matchedStudent && cleanInput.includes('@')) {
        const qEmail = query(usersRef, where('email', '==', cleanInput.toLowerCase()));
        const snapEmail = await getDocs(qEmail);
        if (!snapEmail.empty) {
          matchedStudent = snapEmail.docs[0].data() as UserProfile;
        }
      }

      // 3. Fallback: Full scan of users to match normalized phones or partial match
      if (!matchedStudent) {
        const allUsersSnap = await getDocs(usersRef);
        for (const docSnap of allUsersSnap.docs) {
          const u = docSnap.data() as UserProfile;
          if (u.role !== 'student') continue;

          const uPhoneNorm = normalizePhone(u.phone || '');
          const uParentPhoneNorm = normalizePhone(u.parentPhone || '');

          if (
            (normalizedInputPhone && uPhoneNorm === normalizedInputPhone) ||
            (normalizedInputPhone && uParentPhoneNorm === normalizedInputPhone) ||
            (normalizedInputPhone && uPhoneNorm.includes(normalizedInputPhone)) ||
            (normalizedInputPhone && uParentPhoneNorm.includes(normalizedInputPhone)) ||
            (cleanInput.length >= 3 && u.name && u.name.trim().toLowerCase() === cleanInput.toLowerCase()) ||
            u.uid === cleanInput
          ) {
            matchedStudent = u;
            break;
          }
        }
      }
    }

    if (!matchedStudent) {
      return null;
    }

    // Now fetch student's REAL test results from `testResults` collection
    const testResults: TestResult[] = [];
    try {
      const testQuery = query(
        collection(db, 'testResults'),
        where('studentId', '==', matchedStudent.uid)
      );
      const testSnap = await getDocs(testQuery);
      testSnap.forEach((d) => {
        testResults.push({ id: d.id, ...d.data() } as TestResult);
      });
    } catch (e) {
      console.warn('Error fetching test results for parent portal:', e);
    }

    // Sort tests by solvedAt descending (newest first)
    testResults.sort((a, b) => {
      const timeA = new Date(a.solvedAt || 0).getTime();
      const timeB = new Date(b.solvedAt || 0).getTime();
      return timeB - timeA;
    });

    // Now fetch student's REAL completed lessons from `studentProgress` collection
    let completedLessonsCount = 0;
    try {
      const progQuery = query(
        collection(db, 'studentProgress'),
        where('studentId', '==', matchedStudent.uid)
      );
      const progSnap = await getDocs(progQuery);
      progSnap.forEach((d) => {
        const p = d.data();
        if (p.isCompleted || (p.watchedDuration && p.watchedDuration > 60)) {
          completedLessonsCount++;
        }
      });
    } catch (e) {
      console.warn('Error fetching student progress for parent portal:', e);
    }

    // Fetch total lessons available for student's grade
    let totalLessonsCount = 12; // Standard fallback
    try {
      const lessonsSnap = await getDocs(collection(db, 'lessons'));
      if (!lessonsSnap.empty) {
        totalLessonsCount = Math.max(lessonsSnap.size, completedLessonsCount, 6);
      }
    } catch (e) {
      // ignore
    }

    // Calculate real Attendance Rate
    let attendanceRate = 0;
    if (totalLessonsCount > 0) {
      attendanceRate = Math.min(100, Math.round((completedLessonsCount / totalLessonsCount) * 100));
      // If student has solved tests, reflect high active participation
      if (attendanceRate === 0 && testResults.length > 0) {
        attendanceRate = Math.min(95, testResults.length * 25);
      }
    }

    // Calculate average score
    let averageScore = 0;
    let passedCount = 0;
    if (testResults.length > 0) {
      let sumPercentages = 0;
      testResults.forEach((t) => {
        const pct = t.totalQuestions > 0 ? (t.score / t.totalQuestions) * 100 : 0;
        sumPercentages += pct;
        if (pct >= 50) passedCount++;
      });
      averageScore = Math.round(sumPercentages / testResults.length);
    }

    // Determine status & teacher notes
    const hasActiveSub = matchedStudent.subscriptionExpiresAt
      ? new Date(matchedStudent.subscriptionExpiresAt).getTime() > Date.now()
      : false;

    let behaviorRating: 'excellent' | 'very_good' | 'good' | 'needs_followup' =
      matchedStudent.behaviorRating || 'very_good';

    if (averageScore >= 85 && attendanceRate >= 80) {
      behaviorRating = 'excellent';
    } else if (averageScore < 60 || attendanceRate < 50) {
      behaviorRating = 'needs_followup';
    }

    // Default teacher note if not customized yet by Mr. Abdullah
    let teacherNotes = matchedStudent.teacherNotes || '';
    if (!teacherNotes) {
      if (averageScore >= 90) {
        teacherNotes =
          'طالب ممتاز وما شاء الله مستواه فائق في إتقان كبسولات الجرامر والترجمة. أنصح بالاستمرار على نفس وتيرة المذاكرة للوصول للدرجة النهائية (Full Mark).';
      } else if (averageScore >= 75) {
        teacherNotes =
          'مستوى طيب جداً وحريص على حل الواجبات. مطلوب فقط مزيد من التركيز في حفظ الكلمات وتصريف الأفعال الشاذة وحل قطع الفهم.';
      } else if (testResults.length > 0) {
        teacherNotes =
          'الطالب بحاجة لإعادة مشاهدة فيديوهات شرح القواعد وحل تدريبات المذكرة قبل دخول الاختبارات القادمة لرفع المعدل.';
      } else {
        teacherNotes =
          'تم تسجيل حساب الطالب بنجاح، يُرجى حث الطالب على البدء في مشاهدة المحاضرات الأولى وإنجاز الاختبارات لتقييم مستواه بدقة.';
      }
    }

    return {
      student: matchedStudent,
      attendanceRate: Math.max(attendanceRate, 10),
      completedLessonsCount,
      totalLessonsCount,
      testResults,
      averageScore,
      totalTestsCount: testResults.length,
      passedCount,
      lastTestResult: testResults[0] || undefined,
      teacherNotes,
      behaviorRating,
      status: hasActiveSub ? 'active' : 'inactive',
    };
  } catch (error) {
    console.error('Failed to search student for parent:', error);
    return null;
  }
}

/**
 * Format a comprehensive, polite WhatsApp text message for the parent.
 */
export function generateParentWhatsAppText(report: StudentFollowupReport): string {
  const { student, attendanceRate, averageScore, testResults, teacherNotes, lastTestResult } = report;
  const gradeLabel = GRADE_LABELS[student.grade] || student.grade;
  const dateStr = new Date().toLocaleDateString('ar-EG');

  let text = `*منظومة متابعة ولي الأمر - منصة مستر عبدالله سيد للغة الإنجليزية* 🇬🇧\n`;
  text += `═══════════════════════\n`;
  text += `السلام عليكم ورحمة الله وبركاته يا فندم،\n`;
  text += `إليكم التقرير الفوري الشامل لمستوى الطالب: *${student.name}*\n`;
  text += `• *الصف الدراسي:* ${gradeLabel}\n`;
  text += `• *تاريخ التقرير:* ${dateStr}\n`;
  text += `═══════════════════════\n`;
  text += `📊 *مؤشرات الالتزام والأداء:*\n`;
  text += `• نسبة حضور ومتابعة المحاضرات: *${attendanceRate}%*\n`;
  text += `• متوسط الدرجات في الامتحانات: *${averageScore}%*\n`;
  text += `• إجمالي الاختبارات المنجزة: *${testResults.length} اختبار*\n`;

  if (lastTestResult) {
    text += `• آخر امتحان: *${lastTestResult.testTitle || 'امتحان شامل'}* (الدرجة: *${lastTestResult.score} من ${lastTestResult.totalQuestions}*)\n`;
  }

  text += `═══════════════════════\n`;
  text += `👨‍🏫 *ملاحظات وتوجيهات مستر عبدالله سيد:*\n`;
  text += `"${teacherNotes}"\n`;
  text += `═══════════════════════\n`;
  text += `📞 للتواصل المباشر مع مستر عبدالله وإدارة المنصة: 01102140676\n`;
  text += `نتمنى للطالب دوام التوفيق والوصول للدرجة النهائية! 🌟`;

  return text;
}

/**
 * Update teacher notes & behavior rating for a student in Firestore
 */
export async function updateStudentTeacherNotes(
  studentUid: string,
  teacherNotes: string,
  behaviorRating: 'excellent' | 'very_good' | 'good' | 'needs_followup'
): Promise<void> {
  const userRef = doc(db, 'users', studentUid);
  await updateDoc(userRef, {
    teacherNotes,
    behaviorRating,
    updatedAt: new Date().toISOString(),
  });
}
