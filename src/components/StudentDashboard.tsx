import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebase';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  getDoc,
  setDoc,
  addDoc,
  orderBy
} from 'firebase/firestore';
import {
  EducationalGrade,
  GRADE_LABELS,
  UserProfile,
  Course,
  Unit,
  Lesson,
  Test,
  TestResult,
  Question,
  Attachment,
  Announcement
} from '../types';
import {
  BookOpen,
  Video,
  FileText,
  CheckCircle,
  HelpCircle,
  Award,
  Lock,
  ArrowRight,
  Download,
  AlertCircle,
  Play,
  RotateCcw,
  Check,
  X,
  Megaphone,
  Search,
  Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface StudentDashboardProps {
  userProfile: UserProfile;
  setUserProfile: (profile: UserProfile | null) => void;
  addToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export default function StudentDashboard({
  userProfile,
  setUserProfile,
  addToast,
}: StudentDashboardProps) {
  // Navigation inside student dashboard
  // 'courses' | 'course_detail' | 'lesson_detail' | 'test_view' | 'results_history' | 'feed' | 'memorandums'
  const [subView, setSubView] = useState<'courses' | 'course_detail' | 'lesson_detail' | 'test_view' | 'results_history' | 'feed' | 'memorandums'>('courses');

  // Announcements (Feed) states
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(false);

  // Memorandums (Booklets) states
  const [memorandums, setMemorandums] = useState<{
    id: string;
    courseTitle: string;
    lessonTitle: string;
    name: string;
    url: string;
    type: string;
  }[]>([]);
  const [loadingMems, setLoadingMems] = useState(false);
  const [memorandumSearch, setMemorandumSearch] = useState('');

  // Subscription code activation
  const [activationCode, setActivationCode] = useState('');
  const [activating, setActivating] = useState(false);

  // Loaded Data States
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [test, setTest] = useState<Test | null>(null);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  
  // Results History state
  const [resultsHistory, setResultsHistory] = useState<TestResult[]>([]);

  // Test Solving states
  const [testAnswers, setTestAnswers] = useState<Record<string, string>>({});
  const [testScore, setTestScore] = useState<number | null>(null);
  const [submittingTest, setSubmittingTest] = useState(false);

  // Loading indicator
  const [loadingData, setLoadingData] = useState(false);

  // Check subscription active
  const isSubscriptionActive = () => {
    if (userProfile.role === 'master') return true;
    if (!userProfile.subscriptionExpiresAt) return false;
    const expires = new Date(userProfile.subscriptionExpiresAt);
    return expires.getTime() > Date.now();
  };

  const getRemainingDays = () => {
    if (!userProfile.subscriptionExpiresAt) return 0;
    const expires = new Date(userProfile.subscriptionExpiresAt);
    const diff = expires.getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  // Helper to extract YouTube ID
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Handle subscriber activation
  const handleActivateCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activationCode.trim()) {
      addToast('يرجى إدخال كود التفعيل', 'error');
      return;
    }

    setActivating(true);
    try {
      const codeRef = doc(db, 'subscriptionCodes', activationCode.trim());
      const codeSnap = await getDoc(codeRef);

      if (!codeSnap.exists()) {
        addToast('كود التفعيل غير صحيح أو منتهي الصلاحية.', 'error');
        setActivating(false);
        return;
      }

      const codeData = codeSnap.data();
      if (codeData.status !== 'active') {
        addToast('هذا الكود تم استخدامه بالفعل أو تم إلغاؤه.', 'error');
        setActivating(false);
        return;
      }

      // Activate for 1 month (30 days)
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();

      // Update code status
      await updateDoc(codeRef, {
        status: 'used',
        usedAt: now.toISOString(),
        usedBy: userProfile.uid,
        usedByName: userProfile.name,
      });

      // Update student profile
      const userRef = doc(db, 'users', userProfile.uid);
      await updateDoc(userRef, {
        subscriptionExpiresAt: expiresAt,
        activeCodeUsed: activationCode.trim(),
      });

      // Update local state
      const updatedProfile = {
        ...userProfile,
        subscriptionExpiresAt: expiresAt,
        activeCodeUsed: activationCode.trim(),
      };
      setUserProfile(updatedProfile);
      addToast('تم تفعيل اشتراكك بنجاح لمدة 30 يوماً! استمتع بالتعليم المتميز.', 'success');
      setActivationCode('');
    } catch (err) {
      console.error(err);
      addToast('حدث خطأ أثناء تفعيل الكود، يرجى المحاولة لاحقاً.', 'error');
    } finally {
      setActivating(false);
    }
  };

  // Fetch announcements for specific grade (Feed)
  const fetchAnnouncements = async () => {
    setLoadingAnnouncements(true);
    try {
      const q = query(
        collection(db, 'announcements'),
        where('grade', 'in', ['all', userProfile.grade]),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);
      const list: Announcement[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as Announcement);
      });
      setAnnouncements(list);
    } catch (err) {
      console.error('Error fetching announcements: ', err);
    } finally {
      setLoadingAnnouncements(false);
    }
  };

  // Fetch all memorandums (PDF attachments from all lessons of courses belonging to student's grade)
  const fetchAllMemorandums = async (currentCourses: Course[]) => {
    if (currentCourses.length === 0) {
      setMemorandums([]);
      return;
    }
    setLoadingMems(true);
    try {
      const courseIds = currentCourses.map((c) => c.id);
      const chunks: string[][] = [];
      for (let i = 0; i < courseIds.length; i += 10) {
        chunks.push(courseIds.slice(i, i + 10));
      }

      let allLessons: Lesson[] = [];
      for (const chunk of chunks) {
        const q = query(
          collection(db, 'lessons'),
          where('courseId', 'in', chunk)
        );
        const snap = await getDocs(q);
        snap.forEach((d) => {
          allLessons.push({ id: d.id, ...d.data() } as Lesson);
        });
      }

      const memsList: any[] = [];
      allLessons.forEach((lesson) => {
        const course = currentCourses.find((c) => c.id === lesson.courseId);
        if (lesson.attachments && lesson.attachments.length > 0) {
          lesson.attachments.forEach((attach, index) => {
            memsList.push({
              id: `${lesson.id}_${index}`,
              courseTitle: course ? course.title : 'كورس عام',
              lessonTitle: lesson.title,
              name: attach.name,
              url: attach.url,
              type: attach.type,
            });
          });
        }
      });
      setMemorandums(memsList);
    } catch (err) {
      console.error('Error fetching memorandums: ', err);
    } finally {
      setLoadingMems(false);
    }
  };

  // Fetch courses on mount or grade change
  useEffect(() => {
    const fetchCourses = async () => {
      setLoadingData(true);
      try {
        const q = query(
          collection(db, 'courses'),
          where('grade', '==', userProfile.grade),
          orderBy('createdAt', 'desc')
        );
        const snap = await getDocs(q);
        const list: Course[] = [];
        snap.forEach((d) => {
          list.push({ id: d.id, ...d.data() } as Course);
        });
        setCourses(list);
        fetchAllMemorandums(list);
      } catch (err) {
        console.error('Error fetching courses: ', err);
      } finally {
        setLoadingData(false);
      }
    };

    fetchCourses();
    fetchStudentProgress();
    fetchResultsHistory();
    fetchAnnouncements();
  }, [userProfile.grade, userProfile.uid]);

  // Fetch student progress
  const fetchStudentProgress = async () => {
    try {
      const snap = await getDocs(
        query(collection(db, 'studentProgress'), where('studentId', '==', userProfile.uid))
      );
      const ids: string[] = [];
      snap.forEach((d) => {
        ids.push(d.data().lessonId);
      });
      setCompletedLessonIds(ids);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch student test results history
  const fetchResultsHistory = async () => {
    try {
      const snap = await getDocs(
        query(
          collection(db, 'testResults'),
          where('studentId', '==', userProfile.uid),
          orderBy('solvedAt', 'desc')
        )
      );
      const list: TestResult[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as TestResult);
      });
      setResultsHistory(list);
    } catch (err) {
      console.error(err);
    }
  };

  // Mark lesson as complete
  const toggleLessonComplete = async (lessonId: string) => {
    try {
      const progressRef = doc(db, 'studentProgress', `${userProfile.uid}_${lessonId}`);
      const isCompleted = completedLessonIds.includes(lessonId);

      if (isCompleted) {
        // Remove from state & remove doc
        // Actually, just delete the doc or update
        // We can just set/add doc, but for simplicity we will write code
        await updateDoc(progressRef, { completed: false }); // Or delete doc.
        // Let's create a robust toggle
        setCompletedLessonIds(completedLessonIds.filter((id) => id !== lessonId));
        addToast('تم إزالة علامة الإنجاز للدرس', 'info');
      } else {
        await setDoc(progressRef, {
          studentId: userProfile.uid,
          lessonId,
          completedAt: new Date().toISOString(),
        });
        setCompletedLessonIds([...completedLessonIds, lessonId]);
        addToast('مبروك! تم تحديد الدرس كـ مكتمل بنجاح.', 'success');
      }
    } catch (err) {
      // In case doc does not exist, let's setDoc with custom id
      const progressRef = doc(db, 'studentProgress', `${userProfile.uid}_${lessonId}`);
      await setDoc(progressRef, {
        studentId: userProfile.uid,
        lessonId,
        completedAt: new Date().toISOString(),
      });
      setCompletedLessonIds([...completedLessonIds, lessonId]);
      addToast('مبروك! تم تحديد الدرس كـ مكتمل بنجاح.', 'success');
    }
  };

  // Open course details
  const handleOpenCourse = async (course: Course) => {
    if (!isSubscriptionActive()) {
      addToast('عذراً، يجب تفعيل الاشتراك بمفتاح اشتراك نشط لتصفح محتوى الكورس.', 'error');
      return;
    }

    setSelectedCourse(course);
    setLoadingData(true);
    try {
      // Fetch Units
      const unitsSnap = await getDocs(
        query(
          collection(db, 'units'),
          where('courseId', '==', course.id),
          orderBy('createdAt', 'asc')
        )
      );
      const uList: Unit[] = [];
      unitsSnap.forEach((d) => {
        uList.push({ id: d.id, ...d.data() } as Unit);
      });
      setUnits(uList);

      // Fetch Lessons
      const lessonsSnap = await getDocs(
        query(
          collection(db, 'lessons'),
          where('courseId', '==', course.id),
          orderBy('createdAt', 'asc')
        )
      );
      const lList: Lesson[] = [];
      lessonsSnap.forEach((d) => {
        lList.push({ id: d.id, ...d.data() } as Lesson);
      });
      setLessons(lList);

      setSubView('course_detail');
    } catch (err) {
      console.error(err);
      addToast('حدث خطأ أثناء تحميل الكورس.', 'error');
    } finally {
      setLoadingData(false);
    }
  };

  // Open lesson details
  const handleOpenLesson = async (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setTest(null);
    setTestAnswers({});
    setTestScore(null);

    // Fetch tests for this lesson
    try {
      const snap = await getDocs(
        query(collection(db, 'tests'), where('lessonId', '==', lesson.id))
      );
      if (!snap.empty) {
        const testDoc = snap.docs[0];
        setTest({ id: testDoc.id, ...testDoc.data() } as Test);
      }
    } catch (err) {
      console.error(err);
    }

    setSubView('lesson_detail');
  };

  // Submit interactive test
  const handleSubmitTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!test || !selectedLesson) return;

    // Check that all questions are answered
    const unanswered = test.questions.filter((q) => !testAnswers[q.id]);
    if (unanswered.length > 0) {
      addToast('يرجى الإجابة على جميع الأسئلة أولاً قبل الإرسال', 'error');
      return;
    }

    setSubmittingTest(true);

    // Correcting Test
    let score = 0;
    test.questions.forEach((q) => {
      const studentAns = (testAnswers[q.id] || '').trim().toLowerCase();
      const correctAns = q.correctAnswer.trim().toLowerCase();
      if (studentAns === correctAns) {
        score++;
      }
    });

    try {
      const result: Omit<TestResult, 'id'> = {
        studentId: userProfile.uid,
        studentName: userProfile.name,
        testId: test.id,
        testTitle: test.title,
        score,
        totalQuestions: test.questions.length,
        solvedAt: new Date().toISOString(),
        answers: testAnswers,
      };

      await addDoc(collection(db, 'testResults'), result);
      setTestScore(score);
      addToast(`تم إرسال حل الاختبار وحفظ النتيجة: ${score} من ${test.questions.length}`, 'success');
      
      // Update local history
      fetchResultsHistory();
    } catch (err) {
      console.error(err);
      addToast('حدث خطأ أثناء حفظ النتيجة، يرجى المحاولة مجدداً.', 'error');
    } finally {
      setSubmittingTest(false);
    }
  };

  const changeGrade = async (g: EducationalGrade) => {
    try {
      await updateDoc(doc(db, 'users', userProfile.uid), { grade: g });
      setUserProfile({ ...userProfile, grade: g });
      addToast(`تم تعديل صفك الدراسي إلى: ${GRADE_LABELS[g]}`, 'success');
    } catch (err) {
      console.error(err);
      addToast('حدث خطأ أثناء تغيير الصف الدراسي.', 'error');
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen py-8 font-sans" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Welcome Dashboard Ribbon */}
        <div className="bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-md mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <span className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">لوحة الطالب التعليمية</span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100 mt-1">
              مرحباً بك، {userProfile.name}
            </h1>
            
            {/* Grade selector */}
            <div className="flex items-center gap-2 mt-3 text-slate-600 dark:text-slate-400 text-sm">
              <span>الصف الحالي:</span>
              <select
                value={userProfile.grade}
                onChange={(e) => changeGrade(e.target.value as EducationalGrade)}
                className="font-bold text-blue-600 dark:text-blue-400 bg-transparent outline-none focus:ring-0 border-b border-dashed border-blue-400 cursor-pointer text-sm"
              >
                {Object.entries(GRADE_LABELS).map(([g, label]) => (
                  <option key={g} value={g} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Subscription Ribbon */}
          <div className="w-full md:w-auto p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80 shrink-0">
            {isSubscriptionActive() ? (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 font-bold">
                  <CheckCircle className="w-4 h-4" />
                  <span>اشتراكك نشط وساري المفعول</span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  متبقي على الانتهاء: <span className="font-extrabold text-blue-600">{getRemainingDays()} يوم</span>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-rose-500 font-bold">
                  <AlertCircle className="w-4 h-4" />
                  <span>اشتراكك غير فعال حالياً</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-[200px] leading-relaxed">
                  تواصل مع المستر عبدالله سيد لتفعيل اشتراكك وتنشيط حسابك بالمنصة.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Support Message Box */}
        {!isSubscriptionActive() && (
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 p-6 rounded-3xl mb-8 text-right space-y-3">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">هل تحتاج لتفعيل أو تجديد حسابك التعليمي؟</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              إذا واجهت أي مشكلة أو أردت تجديد الاشتراك، تواصل مع مستر عبدالله سيد على الرقم <a href="tel:+201102140676" className="font-extrabold underline text-blue-600 dark:text-blue-400">+20 11 0214 0676</a>.
            </p>
            <div className="flex gap-3">
              <a
                href="https://wa.me/201102140676"
                target="_blank"
                referrerPolicy="no-referrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow"
              >
                تواصل واتساب فوراً
              </a>
            </div>
          </div>
        )}

        {/* Sub-view navigation tabs */}
        <div className="flex flex-wrap gap-2 sm:gap-4 border-b border-slate-200 dark:border-slate-800 pb-3 mb-6">
          <button
            onClick={() => { setSubView('courses'); setSelectedCourse(null); setSelectedLesson(null); }}
            className={`pb-2 text-sm font-bold border-b-2 px-2 transition-colors ${
              subView === 'courses' || subView === 'course_detail' || subView === 'lesson_detail'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            الكورسات والدروس
          </button>
          <button
            onClick={() => { setSubView('feed'); setSelectedCourse(null); setSelectedLesson(null); }}
            className={`pb-2 text-sm font-bold border-b-2 px-2 transition-colors ${
              subView === 'feed'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            المنشورات والأخبار (الفيد)
          </button>
          <button
            onClick={() => { setSubView('memorandums'); setSelectedCourse(null); setSelectedLesson(null); }}
            className={`pb-2 text-sm font-bold border-b-2 px-2 transition-colors ${
              subView === 'memorandums'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            المذكرات والملخصات
          </button>
          <button
            onClick={() => { setSubView('results_history'); setSelectedCourse(null); setSelectedLesson(null); }}
            className={`pb-2 text-sm font-bold border-b-2 px-2 transition-colors ${
              subView === 'results_history'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            سجل اختباراتي ونتائجي
          </button>
        </div>

        {/* VIEW 1: Courses Grid */}
        {subView === 'courses' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">الكورسات المتاحة لصفك الدراسي</h2>
            {loadingData ? (
              <div className="flex justify-center py-12">
                <span className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></span>
              </div>
            ) : courses.length === 0 ? (
              <div className="bg-white dark:bg-slate-950 p-12 rounded-3xl text-center border border-slate-100 dark:border-slate-800 shadow-md text-slate-500">
                لا توجد كورسات مضافة حالياً لهذا الصف الدراسي.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-md hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between"
                  >
                    {course.imageUrl && (
                      <div className="h-44 overflow-hidden relative bg-blue-100">
                        <img
                          src={course.imageUrl}
                          alt={course.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 leading-snug">{course.title}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                          {course.description}
                        </p>
                      </div>
                      <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex justify-between items-center">
                        <span className="text-xs text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-950/30 px-2.5 py-1 rounded-full">
                          {GRADE_LABELS[course.grade]}
                        </span>
                        <button
                          onClick={() => handleOpenCourse(course)}
                          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                        >
                          {!isSubscriptionActive() ? (
                            <>
                              <Lock className="w-3.5 h-3.5" />
                              مغلق
                            </>
                          ) : (
                            'ابدأ المذاكرة'
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: Course Details */}
        {subView === 'course_detail' && selectedCourse && (
          <div className="space-y-6">
            <button
              onClick={() => setSubView('courses')}
              className="flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:underline outline-none"
            >
              <ArrowRight className="w-4 h-4" />
              العودة لكافة الكورسات
            </button>

            <div className="bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-md">
              <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">{selectedCourse.title}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{selectedCourse.description}</p>
            </div>

            {/* Units & Lessons structure */}
            {units.length === 0 ? (
              <div className="bg-white dark:bg-slate-950 p-8 rounded-3xl text-center text-slate-500 border">
                لا توجد وحدات أو دروس مضافة في هذا الكورس حالياً.
              </div>
            ) : (
              <div className="space-y-6">
                {units.map((unit) => {
                  const unitLessons = lessons.filter((l) => l.unitId === unit.id);
                  return (
                    <div
                      key={unit.id}
                      className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-md overflow-hidden"
                    >
                      <div className="p-5 bg-blue-50/50 dark:bg-blue-950/10 border-b border-slate-100 dark:border-slate-800/80">
                        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{unit.title}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{unit.description}</p>
                      </div>
                      <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                        {unitLessons.length === 0 ? (
                          <div className="p-5 text-sm text-slate-400 text-center">لا توجد دروس مضافة في هذه الوحدة بعد.</div>
                        ) : (
                          unitLessons.map((lesson) => {
                            const isCompleted = completedLessonIds.includes(lesson.id);
                            return (
                              <div
                                key={lesson.id}
                                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-colors"
                              >
                                <div className="flex items-start gap-3">
                                  <div className="p-2.5 bg-blue-100 dark:bg-blue-950/30 rounded-xl text-blue-600 shrink-0">
                                    <Video className="w-5 h-5" />
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm leading-snug">{lesson.title}</h4>
                                    <p className="text-xs text-slate-400 dark:text-slate-400 mt-1 line-clamp-1">{lesson.description}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                                  {/* Mark complete checkbox */}
                                  <button
                                    onClick={() => toggleLessonComplete(lesson.id)}
                                    className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                                      isCompleted
                                        ? 'bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-950/30 dark:border-emerald-900/40'
                                        : 'bg-transparent border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600'
                                    }`}
                                    title={isCompleted ? 'إلغاء وضع علامة مكتمل' : 'وضع علامة مكتمل'}
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleOpenLesson(lesson)}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow transition-all flex items-center gap-1 cursor-pointer"
                                  >
                                    <Play className="w-3.5 h-3.5 fill-current" />
                                    عرض الدرس والشرح
                                  </button>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: Lesson Details & Video & Test */}
        {subView === 'lesson_detail' && selectedLesson && selectedCourse && (
          <div className="space-y-6">
            <button
              onClick={() => setSubView('course_detail')}
              className="flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:underline outline-none"
            >
              <ArrowRight className="w-4 h-4" />
              العودة للوحدات والدروس
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left 2 Cols: Video and PDF info */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Embedded Video Card */}
                <div className="bg-white dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-md overflow-hidden">
                  <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-blue-600 text-white">
                    <div>
                      <h2 className="font-extrabold text-base sm:text-lg leading-tight">{selectedLesson.title}</h2>
                      <p className="text-xs text-blue-200 mt-1">كورس: {selectedCourse.title}</p>
                    </div>
                    {/* Lesson progress check */}
                    <button
                      onClick={() => toggleLessonComplete(selectedLesson.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                        completedLessonIds.includes(selectedLesson.id)
                          ? 'bg-emerald-500 border-emerald-400 text-white'
                          : 'bg-white/10 border-white/20 hover:bg-white/20 text-white'
                      }`}
                    >
                      <Check className="w-4 h-4" />
                      <span>{completedLessonIds.includes(selectedLesson.id) ? 'مكتمل' : 'أكملت الدرس؟'}</span>
                    </button>
                  </div>

                  {/* YouTube Embed Player */}
                  {getYouTubeId(selectedLesson.youtubeUrl) ? (
                    <div className="aspect-video w-full bg-black relative">
                      <iframe
                        src={`https://www.youtube.com/embed/${getYouTubeId(selectedLesson.youtubeUrl)}`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full"
                      ></iframe>
                    </div>
                  ) : (
                    <div className="p-12 text-center text-slate-400 bg-slate-900/10 border-b min-h-64 flex flex-col justify-center items-center gap-2">
                      <AlertCircle className="w-12 h-12 text-blue-600" />
                      <p className="text-sm font-bold">لا يوجد فيديو صالح للتشغيل أو الرابط غير صالح.</p>
                      <p className="text-xs text-slate-500">رابط المستر: {selectedLesson.youtubeUrl}</p>
                    </div>
                  )}

                  <div className="p-6 space-y-4">
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">وصف الدرس وتفاصيل الشرح:</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed whitespace-pre-line">
                      {selectedLesson.description}
                    </p>
                  </div>
                </div>

                {/* Attachments / Worksheets Card */}
                <div className="bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-md">
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base mb-4">الملفات والمذكرات المرفقة بالدرس:</h3>
                  {selectedLesson.attachments && selectedLesson.attachments.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {selectedLesson.attachments.map((attach, idx) => (
                        <div
                          key={idx}
                          className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-950/20 text-blue-600 rounded-lg shrink-0">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div className="text-right">
                              <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100 line-clamp-1">{attach.name}</h4>
                              <p className="text-[10px] text-slate-400 mt-0.5 uppercase">{attach.type}</p>
                            </div>
                          </div>
                          <a
                            href={attach.url}
                            target="_blank"
                            referrerPolicy="no-referrer"
                            className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition-all shrink-0 cursor-pointer"
                            title="تحميل الملف"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-400 text-xs text-center py-6">لا توجد ملفات مرفقة بهذا الدرس حالياً.</p>
                  )}
                </div>

              </div>

              {/* Right 1 Col: Test Solving Card */}
              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-md">
                  <div className="flex items-center gap-2 mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <HelpCircle className="w-6 h-6 text-blue-600" />
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">اختبار تفاعلي على الدرس</h3>
                  </div>

                  {!test ? (
                    <p className="text-slate-400 text-xs text-center py-8">لا يوجد اختبار متاح لهذا الدرس حالياً.</p>
                  ) : testScore !== null ? (
                    /* Score Show card */
                    <div className="text-center py-6 space-y-4">
                      <div className="w-20 h-20 bg-blue-50 dark:bg-blue-950/20 rounded-full flex items-center justify-center mx-auto text-blue-600 shadow-inner">
                        <Award className="w-10 h-10" />
                      </div>
                      <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100">تهانينا! لقد أتممت الاختبار</h4>
                      <div className="text-3xl font-black text-blue-600">
                        {testScore} / {test.questions.length}
                      </div>
                      <p className="text-xs text-slate-400">تم تصحيح الاختبار وحفظ نتيجتك بنجاح.</p>
                      <button
                        onClick={() => { setTestScore(null); setTestAnswers({}); }}
                        className="flex items-center gap-1 mx-auto text-xs text-blue-600 hover:underline mt-2 font-bold cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        إعادة المحاولة
                      </button>
                    </div>
                  ) : (
                    /* Solve Form */
                    <form onSubmit={handleSubmitTest} className="space-y-6">
                      <div className="space-y-5 max-h-[500px] overflow-y-auto pr-2">
                        {test.questions.map((q, qIdx) => (
                          <div key={q.id} className="space-y-3 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                            <div className="flex gap-1.5 text-xs text-slate-400">
                              <span>سؤال {qIdx + 1} -</span>
                              <span>{q.type === 'mcq' ? 'اختيار من متعدد' : q.type === 'true_false' ? 'صح أو خطأ' : 'أكمل الفراغ'}</span>
                            </div>
                            <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">{q.text}</p>
                            
                            {/* Type 1: MCQ */}
                            {q.type === 'mcq' && (
                              <div className="grid grid-cols-1 gap-2">
                                {q.options.map((opt, optIdx) => (
                                  <label
                                    key={optIdx}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs cursor-pointer transition-all ${
                                      testAnswers[q.id] === opt
                                        ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-500/50 text-blue-600 dark:text-blue-400 font-bold'
                                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-slate-900/30'
                                    }`}
                                  >
                                    <input
                                      type="radio"
                                      name={q.id}
                                      value={opt}
                                      checked={testAnswers[q.id] === opt}
                                      onChange={() => setTestAnswers({ ...testAnswers, [q.id]: opt })}
                                      className="sr-only"
                                    />
                                    <span>{opt}</span>
                                  </label>
                                ))}
                              </div>
                            )}

                            {/* Type 2: True/False */}
                            {q.type === 'true_false' && (
                              <div className="grid grid-cols-2 gap-2">
                                {['صح', 'خطأ'].map((opt) => (
                                  <label
                                    key={opt}
                                    className={`flex items-center justify-center gap-1 py-2 rounded-xl border text-xs cursor-pointer transition-all ${
                                      testAnswers[q.id] === opt
                                        ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-500/50 text-blue-600 dark:text-blue-400 font-bold'
                                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-slate-900/30'
                                    }`}
                                  >
                                    <input
                                      type="radio"
                                      name={q.id}
                                      value={opt}
                                      checked={testAnswers[q.id] === opt}
                                      onChange={() => setTestAnswers({ ...testAnswers, [q.id]: opt })}
                                      className="sr-only"
                                    />
                                    <span>{opt}</span>
                                  </label>
                                ))}
                              </div>
                            )}

                            {/* Type 3: Fill Blanks */}
                            {q.type === 'complete' && (
                              <input
                                type="text"
                                value={testAnswers[q.id] || ''}
                                onChange={(e) => setTestAnswers({ ...testAnswers, [q.id]: e.target.value })}
                                placeholder="اكتب الإجابة الصحيحة بالإنجليزية"
                                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs focus:ring-2 focus:ring-blue-500 outline-none text-left"
                              />
                            )}

                          </div>
                        ))}
                      </div>

                      <button
                        type="submit"
                        disabled={submittingTest}
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {submittingTest ? (
                          <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                          'إرسال الإجابات والتصحيح'
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* VIEW: Feed (Announcements) */}
        {subView === 'feed' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Megaphone className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <span>المنشورات والأخبار التعليمية</span>
              </h2>
            </div>

            {loadingAnnouncements ? (
              <div className="flex justify-center py-12">
                <span className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></span>
              </div>
            ) : announcements.length === 0 ? (
              <div className="bg-white dark:bg-slate-950 p-12 rounded-3xl text-center border border-slate-100 dark:border-slate-800 shadow-md text-slate-500">
                لا توجد منشورات أو تنويهات منشورة حالياً لصفك الدراسي.
              </div>
            ) : (
              <div className="space-y-4">
                {announcements.map((ann) => (
                  <div
                    key={ann.id}
                    className="bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-md transition-all hover:shadow-lg text-right"
                  >
                    <div className="flex justify-between items-start gap-4 flex-col sm:flex-row">
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="p-1.5 bg-blue-50/50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-lg shrink-0">
                            <Bell className="w-4 h-4" />
                          </span>
                          <h3 className="font-extrabold text-base sm:text-lg text-slate-800 dark:text-slate-100 leading-tight">
                            {ann.title}
                          </h3>
                          <span className="text-[10px] px-2.5 py-0.5 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-full font-bold">
                            {ann.grade === 'all' ? 'تنويه عام للجميع' : GRADE_LABELS[ann.grade]}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                          {ann.content}
                        </p>
                      </div>
                      <span className="text-xs text-slate-400 shrink-0 select-none">
                        تم النشر: {new Date(ann.createdAt).toLocaleDateString('ar-EG', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW: Memorandums (Study Booklet Downloads) */}
        {subView === 'memorandums' && (
          !isSubscriptionActive() ? (
            <div className="bg-white dark:bg-slate-950 p-12 rounded-3xl text-center border border-slate-100 dark:border-slate-800 shadow-md text-slate-500 space-y-4 flex flex-col items-center justify-center py-16" dir="rtl">
              <div className="p-4 bg-rose-50 dark:bg-rose-950/20 text-rose-500 rounded-full">
                <Lock className="w-12 h-12" />
              </div>
              <h3 className="font-black text-xl text-slate-850 dark:text-slate-100">المذكرات والملخصات مغلقة</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                عذراً، يجب تفعيل الاشتراك الخاص بك لتتمكن من تصفح وتحميل المذكرات والملخصات الدراسية. يرجى التواصل مع المستر لتفعيل حسابك وتنشيط صلاحيات التحميل بالمنصة.
              </p>
              <a
                href="https://wa.me/201102140676"
                target="_blank"
                referrerPolicy="no-referrer"
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-full shadow transition-all cursor-pointer"
              >
                تواصل مع مستر عبدالله لتفعيل الاشتراك
              </a>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    <span>مكتبة المذكرات والمراجعات</span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    تصفح وحمل كافة المذكرات، الملخصات وأوراق العمل المرفقة بدروس صفك الدراسي.
                  </p>
                </div>

                {/* Search filter */}
                <div className="relative w-full md:w-80 shrink-0">
                  <Search className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={memorandumSearch}
                    onChange={(e) => setMemorandumSearch(e.target.value)}
                    placeholder="ابحث عن مذكرة أو ملخص بالاسم..."
                    className="w-full pr-9 pl-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 outline-none text-right"
                  />
                </div>
              </div>

              {loadingMems ? (
                <div className="flex justify-center py-12">
                  <span className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></span>
                </div>
              ) : memorandums.length === 0 ? (
                <div className="bg-white dark:bg-slate-950 p-12 rounded-3xl text-center border border-slate-100 dark:border-slate-800 shadow-md text-slate-500">
                  لا توجد مذكرات أو ملفات مرفقة مضافة حالياً لصفك الدراسي.
                </div>
              ) : (
                (() => {
                  const filteredMems = memorandums.filter((m) =>
                    m.name.toLowerCase().includes(memorandumSearch.toLowerCase()) ||
                    m.courseTitle.toLowerCase().includes(memorandumSearch.toLowerCase()) ||
                    m.lessonTitle.toLowerCase().includes(memorandumSearch.toLowerCase())
                  );

                  if (filteredMems.length === 0) {
                    return (
                      <div className="bg-white dark:bg-slate-950 p-12 rounded-3xl text-center border text-slate-400">
                        لم يتم العثور على أي مذكرة تطابق كلمة البحث "{memorandumSearch}".
                      </div>
                    );
                  }

                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredMems.map((mem) => (
                        <div
                          key={mem.id}
                          className="bg-white dark:bg-slate-950 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-md flex flex-col justify-between gap-4 transition-all hover:shadow-lg text-right"
                        >
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="p-3 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl shrink-0">
                                <FileText className="w-6 h-6" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm leading-snug line-clamp-2" title={mem.name}>
                                  {mem.name}
                                </h4>
                                <span className="inline-block text-[9px] uppercase px-2 py-0.5 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 rounded-full font-bold mt-1.5">
                                  {mem.type}
                                </span>
                              </div>
                            </div>

                            <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1 bg-slate-50 dark:bg-slate-900/40 p-2.5 rounded-xl border border-slate-100/50 dark:border-slate-800/40">
                              <div>
                                <span className="font-bold text-slate-400 ml-1">الكورس:</span>
                                <span className="text-slate-700 dark:text-slate-300 font-medium">{mem.courseTitle}</span>
                              </div>
                              <div>
                                <span className="font-bold text-slate-400 ml-1">الدرس:</span>
                                <span className="text-slate-700 dark:text-slate-300 font-medium">{mem.lessonTitle}</span>
                              </div>
                            </div>
                          </div>

                          <a
                            href={mem.url}
                            target="_blank"
                            referrerPolicy="no-referrer"
                            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>تحميل المذكرة</span>
                          </a>
                        </div>
                      ))}
                    </div>
                  );
                })()
              )}
            </div>
          )
        )}

        {/* VIEW 4: Results History */}
        {subView === 'results_history' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">سجل درجاتك واختباراتك السابقة</h2>

            {resultsHistory.length === 0 ? (
              <div className="bg-white dark:bg-slate-950 p-12 rounded-3xl text-center border text-slate-400">
                لم تقم بحل أي اختبارات تفاعلية حتى الآن. ابدأ بمشاهدة الدروس وحل اختباراتها!
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-right" dir="rtl">
                    <thead className="bg-blue-600 text-white text-xs sm:text-sm">
                      <tr>
                        <th className="p-4 font-bold">اسم الاختبار / الدرس</th>
                        <th className="p-4 font-bold text-center">الدرجة</th>
                        <th className="p-4 font-bold text-center">النسبة المئوية</th>
                        <th className="p-4 font-bold text-center">تاريخ وتوقيت الحل</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-700 dark:text-slate-300 divide-y divide-slate-100 dark:divide-slate-800 text-xs sm:text-sm">
                      {resultsHistory.map((res) => {
                        const pct = Math.round((res.score / res.totalQuestions) * 100);
                        return (
                          <tr key={res.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                            <td className="p-4 font-bold text-slate-800 dark:text-slate-100">{res.testTitle}</td>
                            <td className="p-4 text-center font-bold text-blue-600">{res.score} من {res.totalQuestions}</td>
                            <td className="p-4 text-center">
                              <span className={`px-2.5 py-1 rounded-full font-bold text-xs ${
                                pct >= 80 ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20' : pct >= 50 ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/20' : 'bg-rose-50 text-rose-600 dark:bg-rose-950/20'
                              }`}>
                                {pct}%
                              </span>
                            </td>
                            <td className="p-4 text-center text-slate-400 text-[11px]">
                              {new Date(res.solvedAt).toLocaleDateString('ar-EG', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
