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
}

