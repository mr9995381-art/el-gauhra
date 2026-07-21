import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Course, Unit, Lesson, Test, SubscriptionCode } from '../types';

export async function seedInitialDataIfEmpty() {
  try {
    // 1. Seed Prep 1 Course
    const courseId = 'course_prep_1';
    const courseRef = doc(db, 'courses', courseId);
    const courseSnap = await getDoc(courseRef);

    if (!courseSnap.exists()) {
      const prep1Course: Course = {
        id: courseId,
        title: 'منهج اللغة الإنجليزية - الصف الأول الإعدادي',
        description: 'شرح متكامل ومبسط لقواعد ومنهج اللغة الإنجليزية للصف الأول الإعدادي مع مستر عبدالله سيد، يغطي المناهج الجديدة بأحدث الطرق التفاعلية.',
        grade: 'prep_1',
        imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800',
        createdAt: new Date().toISOString()
      };

      await setDoc(courseRef, prep1Course);
      console.log('Seeded prep_1 course');

      // 2. Seed Unit for Prep 1 Course
      const unitId = 'unit_prep_1_u1';
      const unitRef = doc(db, 'units', unitId);
      const unit: Unit = {
        id: unitId,
        courseId: courseId,
        title: 'الوحدة الأولى: قواعد التأسيس الأساسية',
        description: 'مراجعة وتأسيس القواعد والجرامر لطلاب الصف الأول الإعدادي لضمان بداية قوية وتفوق دائم.',
        createdAt: new Date().toISOString()
      };
      await setDoc(unitRef, unit);
      console.log('Seeded unit_prep_1_u1');

      // 3. Seed Lesson with the requested YouTube video
      const lessonId = 'lesson_prep_1_l1';
      const lessonRef = doc(db, 'lessons', lessonId);
      const lesson: Lesson = {
        id: lessonId,
        courseId: courseId,
        unitId: unitId,
        title: 'الدرس الأول: أساسيات قواعد الجرامر والتأسيس الصحيح',
        description: 'شرح ممتع وتفاعلي يقدمه مستر عبدالله سيد لتأسيس طلاب الصف الأول الإعدادي وتوضيح أهم القواعد اللغوية وكيفية تجنب الأخطاء الشائعة.',
        youtubeUrl: 'https://www.youtube.com/watch?v=850SZydhGCI',
        attachments: [
          {
            name: 'مذكرة شرح الدرس الأول وتدريباته PDF',
            url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            type: 'pdf'
          }
        ],
        createdAt: new Date().toISOString()
      };
      await setDoc(lessonRef, lesson);
      console.log('Seeded lesson_prep_1_l1');

      // 4. Seed Test for this Lesson
      const testId = 'test_prep_1_l1';
      const testRef = doc(db, 'tests', testId);
      const test: Test = {
        id: testId,
        lessonId: lessonId,
        title: 'اختبار تفاعلي ذكي على الدرس الأول',
        questions: [
          {
            id: 'q1',
            type: 'mcq',
            text: 'Choose the correct answer: Ahmed ________ tennis with his friends every weekend.',
            options: ['plays', 'play', 'playing', 'played'],
            correctAnswer: 'plays'
          },
          {
            id: 'q2',
            type: 'mcq',
            text: 'Choose the correct answer: Look! The birds ________ in the sky.',
            options: ['are flying', 'fly', 'flies', 'flying'],
            correctAnswer: 'are flying'
          },
          {
            id: 'q3',
            type: 'mcq',
            text: 'Choose the correct answer: I bought a new book ________ English grammar.',
            options: ['about', 'on', 'with', 'for'],
            correctAnswer: 'about'
          },
          {
            id: 'q4',
            type: 'mcq',
            text: 'Choose the correct answer: She ________ go to school yesterday because she was ill.',
            options: ['didn\'t', 'doesn\'t', 'don\'t', 'wasn\'t'],
            correctAnswer: 'didn\'t'
          }
        ],
        createdAt: new Date().toISOString()
      };
      await setDoc(testRef, test);
      console.log('Seeded test_prep_1_l1');
    }

    // 5. Seed some active subscription codes if they do not exist
    const codesToSeed = ['EGYPT_2026', 'ABDULLAH_2026', 'FREE_TEST'];
    for (const code of codesToSeed) {
      const codeRef = doc(db, 'subscriptionCodes', code);
      const codeSnap = await getDoc(codeRef);
      if (!codeSnap.exists()) {
        const subCode: SubscriptionCode = {
          code: code,
          createdAt: new Date().toISOString(),
          usedAt: null,
          usedBy: null,
          usedByName: null,
          status: 'active'
        };
        await setDoc(codeRef, subCode);
        console.log(`Seeded subscription code: ${code}`);
      }
    }

  } catch (err: any) {
    const isPermissionError = err.code === 'permission-denied' || 
      err.message?.includes('permissions') || 
      err.message?.includes('Permission') ||
      err.message?.includes('insufficient');
    if (isPermissionError) {
      console.log('Seeding skipped: Current user does not have permission to seed data (admin only).');
    } else {
      console.error('Error seeding data: ', err);
    }
  }
}
