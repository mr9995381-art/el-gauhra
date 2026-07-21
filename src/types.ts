export type EducationalGrade =
  | 'primary_1'
  | 'primary_2'
  | 'primary_3'
  | 'primary_4'
  | 'primary_5'
  | 'primary_6'
  | 'prep_1'
  | 'prep_2'
  | 'prep_3'
  | 'secondary_1'
  | 'secondary_2'
  | 'secondary_3';

export const GRADE_LABELS: Record<EducationalGrade, string> = {
  primary_1: 'الصف الأول الابتدائي',
  primary_2: 'الصف الثاني الابتدائي',
  primary_3: 'الصف الثالث الابتدائي',
  primary_4: 'الصف الرابع الابتدائي',
  primary_5: 'الصف الخامس الابتدائي',
  primary_6: 'الصف السادس الابتدائي',
  prep_1: 'الصف الأول الإعدادي',
  prep_2: 'الصف الثاني الإعدادي',
  prep_3: 'الصف الثالث الإعدادي',
  secondary_1: 'الصف الأول الثانوي',
  secondary_2: 'الصف الثاني الثانوي',
  secondary_3: 'الصف الثالث الثانوي',
};

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone: string;
  grade: EducationalGrade;
  role: 'student' | 'master';
  subscriptionExpiresAt: string | null; // ISO string
  activeCodeUsed: string | null;
  deviceSessionId: string | null;
  createdAt: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  grade: EducationalGrade;
  imageUrl?: string;
  createdAt: string;
}

export interface Unit {
  id: string;
  courseId: string;
  title: string;
  description: string;
  createdAt: string;
}

export interface Attachment {
  name: string;
  url: string;
  type: 'pdf' | 'word' | 'ppt' | 'image' | 'other';
}

export interface Lesson {
  id: string;
  courseId: string;
  unitId: string;
  title: string;
  description: string;
  youtubeUrl: string; // YouTube Video link
  attachments: Attachment[];
  createdAt: string;
}

export interface Question {
  id: string;
  type: 'mcq' | 'true_false' | 'complete';
  text: string;
  options: string[]; // For MCQ, empty otherwise
  correctAnswer: string; // The correct answer string
}

export interface Test {
  id: string;
  lessonId: string;
  title: string;
  questions: Question[];
  createdAt: string;
}

export interface TestResult {
  id: string;
  studentId: string;
  studentName: string;
  testId: string;
  testTitle: string;
  score: number;
  totalQuestions: number;
  solvedAt: string;
  answers: Record<string, string>;
}

export interface SubscriptionCode {
  code: string;
  createdAt: string;
  usedAt: string | null;
  usedBy: string | null;
  usedByName: string | null;
  status: 'active' | 'used' | 'cancelled';
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  grade: EducationalGrade | 'all';
}
