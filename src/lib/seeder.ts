import { doc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export async function seedInitialDataIfEmpty() {
  // Clean up any old default sample courses/videos if present
  try {
    const courseId = 'course_prep_1';
    const courseRef = doc(db, 'courses', courseId);
    const courseSnap = await getDoc(courseRef);
    if (courseSnap.exists()) {
      await deleteDoc(courseRef);
      await deleteDoc(doc(db, 'units', 'unit_prep_1_u1'));
      await deleteDoc(doc(db, 'lessons', 'lesson_prep_1_l1'));
      await deleteDoc(doc(db, 'tests', 'test_prep_1_l1'));
      console.log('Cleaned up default sample course, unit, lesson, and test.');
    }
  } catch (err) {
    // Ignore permissions or non-existing doc errors during cleanup
  }

  // Clean up and permanently remove the demo student account and demo tests
  try {
    const sampleUid = 'student_sample_parent_demo';
    const sampleUserRef = doc(db, 'users', sampleUid);
    const userSnap = await getDoc(sampleUserRef);

    if (userSnap.exists()) {
      await deleteDoc(sampleUserRef);
      await deleteDoc(doc(db, 'testResults', 'demo_test_1'));
      await deleteDoc(doc(db, 'testResults', 'demo_test_2'));
      await deleteDoc(doc(db, 'testResults', 'demo_test_3'));

      for (let i = 1; i <= 6; i++) {
        await deleteDoc(doc(db, 'studentProgress', `${sampleUid}_lesson_${i}`));
      }
      console.log('Removed demo student account and test records from Firestore.');
    }
  } catch (err) {
    console.warn('Demo account cleanup note:', err);
  }

  // Ensure fallback_master_admin_account does not retain oa958792@gmail.com
  try {
    const masterAdminRef = doc(db, 'users', 'fallback_master_admin_account');
    const masterAdminSnap = await getDoc(masterAdminRef);
    if (masterAdminSnap.exists() && masterAdminSnap.data()?.email === 'oa958792@gmail.com') {
      await deleteDoc(masterAdminRef);
    }
  } catch (err) {
    // Ignore
  }
}
