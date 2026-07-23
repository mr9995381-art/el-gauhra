export type EducationalGrade =
  | 'prep_1'
  | 'prep_2'
  | 'prep_3'
  | 'secondary_1'
  | 'secondary_2'
  | 'secondary_3';

export type EducationSystem = 'general' | 'azhar' | 'languages' | 'other';
export type EducationStage = 'prep' | 'secondary';

export const EDUCATION_SYSTEM_LABELS: Record<EducationSystem, string> = {
  general: 'التعليم العام (حكومي / خاص)',
  azhar: 'التعليم الأزهري',
  languages: 'مدارس اللغات (تجريبي / خاص)',
  other: 'أنظمة أخرى',
};

export const EDUCATION_STAGE_LABELS: Record<EducationStage, string> = {
  prep: 'المرحلة الإعدادية',
  secondary: 'المرحلة الثانوية',
};

export const GRADE_LABELS: Record<EducationalGrade, string> = {
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
  parentPhone?: string;
  educationSystem?: EducationSystem | string;
  educationStage?: EducationStage | string;
  grade: EducationalGrade;
  role: 'student' | 'master' | 'admin';
  subscriptionStatus?: 'none' | 'pending' | 'approved' | 'rejected' | 'expired';
  subscriptionExpiresAt: string | null; // ISO string
  activeCodeUsed: string | null;
  deviceSessionId: string | null;
  photoURL?: string;
  createdAt: string;
  isProfileComplete?: boolean;
}

export interface SubscriptionRequest {
  id: string;
  studentUid: string;
  studentName: string;
  studentPhone: string;
  parentPhone?: string;
  educationSystem?: string;
  educationStage?: string;
  grade: EducationalGrade;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  approvedAt?: string;
  notes?: string;
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
