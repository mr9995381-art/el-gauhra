import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebase';
import { seedInitialDataIfEmpty } from '../lib/seeder';
import {
  collection,
  doc,
  setDoc,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import {
  EducationalGrade,
  GRADE_LABELS,
  Course,
  Unit,
  Lesson,
  Test,
  Question,
  SubscriptionCode,
  UserProfile,
  Attachment,
  Announcement,
  SubscriptionRequest
} from '../types';
import {
  LayoutDashboard,
  BookOpen,
  Plus,
  Trash2,
  FilePlus,
  Key,
  Users,
  Video,
  FileText,
  AlertCircle,
  TrendingUp,
  Search,
  CheckCircle,
  X,
  Bell,
  HelpCircle,
  Edit,
  ChevronDown,
  ChevronUp,
  Award,
  Paperclip,
  Zap,
  Clock,
  XCircle,
  UserCheck,
  Phone,
  ShieldCheck
} from 'lucide-react';

interface MasterDashboardProps {
  userProfile: UserProfile;
  addToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export default function MasterDashboard({ userProfile, addToast }: MasterDashboardProps) {
  // Navigation
  // 'stats' | 'courses' | 'codes' | 'students' | 'requests' | 'announcements'
  const [tab, setTab] = useState<'stats' | 'courses' | 'codes' | 'students' | 'requests' | 'announcements'>('stats');

  // Loaders
  const [loading, setLoading] = useState(false);

  // Stats Counters
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeSubscribers: 0,
    totalCourses: 0,
    activeCodes: 0,
  });

  // Data collections
  const [courses, setCourses] = useState<Course[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [codes, setCodes] = useState<SubscriptionCode[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [subscriptionRequests, setSubscriptionRequests] = useState<SubscriptionRequest[]>([]);
  const [reqStatusFilter, setReqStatusFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');

  // Selection states for hierarchies
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [selectedUnitId, setSelectedUnitId] = useState<string>('');
  const [selectedLessonId, setSelectedLessonId] = useState<string>('');

  // Curriculum Browser UI States
  const [currGradeFilter, setCurrGradeFilter] = useState<EducationalGrade | 'all'>('all');
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);
  const [expandedUnitId, setExpandedUnitId] = useState<string | null>(null);

  // Course Form
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDesc, setCourseDesc] = useState('');
  const [courseGrade, setCourseGrade] = useState<EducationalGrade>('secondary_3');
  const [courseImgUrl, setCourseImgUrl] = useState('');
  const [uploadingImg, setUploadingImg] = useState(false);

  // Unit Form
  const [unitTitle, setUnitTitle] = useState('');
  const [unitDesc, setUnitDesc] = useState('');

  // Lesson Form
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonDesc, setLessonDesc] = useState('');
  const [lessonVideo, setLessonVideo] = useState('');
  const [lessonAttachments, setLessonAttachments] = useState<Attachment[]>([]);
  const [attachName, setAttachName] = useState('');
  const [attachUrl, setAttachUrl] = useState('');
  const [attachType, setAttachType] = useState<'pdf' | 'word' | 'ppt' | 'image' | 'other'>('pdf');
  const [uploadingFile, setUploadingFile] = useState(false);

  // Test / Questions Creator
  const [testTitle, setTestTitle] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [qText, setQText] = useState('');
  const [qType, setQType] = useState<'mcq' | 'true_false' | 'complete'>('mcq');
  const [qOpt1, setQOpt1] = useState('');
  const [qOpt2, setQOpt2] = useState('');
  const [qOpt3, setQOpt3] = useState('');
  const [qOpt4, setQOpt4] = useState('');
  const [qCorrect, setQCorrect] = useState('');

  // Code Generation Form
  const [numCodes, setNumCodes] = useState(5);
  const [generatingCodes, setGeneratingCodes] = useState(false);

  // Announcement Form
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annGrade, setAnnGrade] = useState<EducationalGrade | 'all'>('all');

  // Search/Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [studentSearch, setStudentSearch] = useState('');

  // Edit Student Subscription Date Form
  const [editingStudent, setEditingStudent] = useState<UserProfile | null>(null);
  const [newSubExpiry, setNewSubExpiry] = useState('');
  const [seeding, setSeeding] = useState(false);

  const handleForceSeed = async () => {
    setSeeding(true);
    addToast('جاري تهيئة البيانات الافتراضية والدروس النموذجية على المنصة...', 'info');
    try {
      await seedInitialDataIfEmpty();
      addToast('تمت تهيئة البيانات النموذجية للصف الأول الإعدادي بنجاح! 🎉', 'success');
      await fetchStats();
      await fetchCourses();
      await fetchUnits();
      await fetchLessons();
      await fetchTests();
      await fetchStudents();
      await fetchCodes();
      await fetchAnnouncements();
    } catch (err) {
      console.error(err);
      addToast('فشل تهيئة البيانات الافتراضية.', 'error');
    } finally {
      setSeeding(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchCourses();
    fetchUnits();
    fetchLessons();
    fetchTests();
    fetchStudents();
    fetchCodes();
    fetchAnnouncements();
    fetchSubscriptionRequests();
  }, []);

  const fetchSubscriptionRequests = async () => {
    try {
      const snap = await getDocs(query(collection(db, 'subscriptionRequests'), orderBy('requestedAt', 'desc')));
      const list: SubscriptionRequest[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as SubscriptionRequest);
      });
      setSubscriptionRequests(list);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApproveSubscriptionRequest = async (req: SubscriptionRequest) => {
    try {
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();

      await updateDoc(doc(db, 'subscriptionRequests', req.id), {
        status: 'approved',
        approvedAt: now.toISOString(),
      });

      await updateDoc(doc(db, 'users', req.studentUid), {
        subscriptionStatus: 'approved',
        subscriptionExpiresAt: expiresAt,
      });

      addToast(`تم قبول طلب الطالب ${req.studentName} وتفعيل اشتراكه لمدة شهر بنجاح!`, 'success');
      fetchSubscriptionRequests();
      fetchStudents();
      fetchStats();
    } catch (err) {
      console.error(err);
      addToast('حدث خطأ أثناء الموافقة على الطلب.', 'error');
    }
  };

  const handleRejectSubscriptionRequest = async (req: SubscriptionRequest) => {
    try {
      await updateDoc(doc(db, 'subscriptionRequests', req.id), {
        status: 'rejected',
      });

      await updateDoc(doc(db, 'users', req.studentUid), {
        subscriptionStatus: 'rejected',
      });

      addToast(`تم رفض طلب اشتراك الطالب ${req.studentName}.`, 'info');
      fetchSubscriptionRequests();
      fetchStudents();
      fetchStats();
    } catch (err) {
      console.error(err);
      addToast('حدث خطأ أثناء رفض الطلب.', 'error');
    }
  };

  const handleUpdateStudentGrade = async (studentUid: string, newGrade: EducationalGrade) => {
    try {
      await updateDoc(doc(db, 'users', studentUid), {
        grade: newGrade,
      });
      addToast('تم تحديث الصف الدراسي للطالب بنجاح.', 'success');
      fetchStudents();
    } catch (err) {
      console.error(err);
      addToast('حدث خطأ أثناء تحديث الصف الدراسي.', 'error');
    }
  };

  // Fetch all databases
  const fetchStats = async () => {
    try {
      const uSnap = await getDocs(collection(db, 'users'));
      let totalS = 0;
      let activeS = 0;
      uSnap.forEach((d) => {
        const u = d.data() as UserProfile;
        if (u.role === 'student') {
          totalS++;
          if (u.subscriptionExpiresAt && new Date(u.subscriptionExpiresAt).getTime() > Date.now()) {
            activeS++;
          }
        }
      });

      const cSnap = await getDocs(collection(db, 'courses'));
      const coSnap = await getDocs(query(collection(db, 'subscriptionCodes'), where('status', '==', 'active')));

      setStats({
        totalStudents: totalS,
        activeSubscribers: activeS,
        totalCourses: cSnap.size,
        activeCodes: coSnap.size,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCourses = async () => {
    try {
      const snap = await getDocs(query(collection(db, 'courses'), orderBy('createdAt', 'desc')));
      const list: Course[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as Course);
      });
      setCourses(list);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUnits = async () => {
    try {
      const snap = await getDocs(query(collection(db, 'units'), orderBy('createdAt', 'asc')));
      const list: Unit[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as Unit);
      });
      setUnits(list);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLessons = async () => {
    try {
      const snap = await getDocs(query(collection(db, 'lessons'), orderBy('createdAt', 'asc')));
      const list: Lesson[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as Lesson);
      });
      setLessons(list);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTests = async () => {
    try {
      const snap = await getDocs(collection(db, 'tests'));
      const list: Test[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as Test);
      });
      setTests(list);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStudents = async () => {
    try {
      const snap = await getDocs(collection(db, 'users'));
      const list: UserProfile[] = [];
      snap.forEach((d) => {
        const u = d.data() as UserProfile;
        if (u.role === 'student') {
          list.push(u);
        }
      });
      setStudents(list);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCodes = async () => {
    try {
      const snap = await getDocs(query(collection(db, 'subscriptionCodes'), orderBy('createdAt', 'desc')));
      const list: SubscriptionCode[] = [];
      snap.forEach((d) => {
        list.push(d.data() as SubscriptionCode);
      });
      setCodes(list);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const snap = await getDocs(query(collection(db, 'announcements'), orderBy('createdAt', 'desc')));
      const list: Announcement[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as Announcement);
      });
      setAnnouncements(list);
    } catch (err) {
      console.error(err);
    }
  };

  // Upload course image
  const handleCourseImageUpload = async (file: File) => {
    setUploadingImg(true);
    try {
      const storageRef = ref(storage, `courses/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      uploadTask.on(
        'state_changed',
        null,
        (err) => {
          console.error(err);
          addToast('فشل تحميل الصورة في سحابة التخزين.', 'error');
          setUploadingImg(false);
        },
        async () => {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          setCourseImgUrl(downloadUrl);
          addToast('تم رفع صورة الكورس بنجاح!', 'success');
          setUploadingImg(false);
        }
      );
    } catch (err) {
      console.error(err);
      setUploadingImg(false);
    }
  };

  // Upload Lesson Attachment file
  const handleAttachmentUpload = async (file: File) => {
    setUploadingFile(true);
    try {
      const storageRef = ref(storage, `lessons/attachments/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        null,
        (err) => {
          console.error(err);
          addToast('فشل رفع الملف في سحابة التخزين.', 'error');
          setUploadingFile(false);
        },
        async () => {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          setAttachUrl(downloadUrl);
          setAttachName(file.name);
          addToast('تم رفع الملف بنجاح! جاهز للإضافة للدرس.', 'success');
          setUploadingFile(false);
        }
      );
    } catch (err) {
      console.error(err);
      setUploadingFile(false);
    }
  };

  // Submit Course creation
  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle.trim() || !courseDesc.trim()) {
      addToast('يرجى ملء جميع حقول الكورس', 'error');
      return;
    }

    try {
      const courseId = 'course_' + Math.random().toString(36).substring(2, 9);
      const newCourse: Course = {
        id: courseId,
        title: courseTitle.trim(),
        description: courseDesc.trim(),
        grade: courseGrade,
        imageUrl: courseImgUrl || 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600',
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'courses', courseId), newCourse);
      addToast('تم إنشاء الكورس الجديد بنجاح!', 'success');
      setCourseTitle('');
      setCourseDesc('');
      setCourseImgUrl('');
      fetchCourses();
      fetchStats();
    } catch (err) {
      console.error(err);
      addToast('حدث خطأ أثناء إضافة الكورس.', 'error');
    }
  };

  // Submit Unit creation
  const handleCreateUnit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId) {
      addToast('يرجى اختيار الكورس أولاً المضاف إليه الوحدة', 'error');
      return;
    }
    if (!unitTitle.trim() || !unitDesc.trim()) {
      addToast('يرجى ملء جميع حقول الوحدة', 'error');
      return;
    }

    try {
      const unitId = 'unit_' + Math.random().toString(36).substring(2, 9);
      const newUnit: Unit = {
        id: unitId,
        courseId: selectedCourseId,
        title: unitTitle.trim(),
        description: unitDesc.trim(),
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'units', unitId), newUnit);
      addToast('تم إنشاء الوحدة الجديدة بنجاح!', 'success');
      setUnitTitle('');
      setUnitDesc('');
      fetchUnits();
    } catch (err) {
      console.error(err);
      addToast('حدث خطأ أثناء إضافة الوحدة.', 'error');
    }
  };

  // Add attachment to local list in lesson form
  const handleAddAttachmentLocal = () => {
    if (!attachName.trim() || !attachUrl.trim()) {
      addToast('يرجى كتابة اسم الملف والمسار الخاص به', 'error');
      return;
    }

    const newAttach: Attachment = {
      name: attachName.trim(),
      url: attachUrl.trim(),
      type: attachType,
    };

    setLessonAttachments([...lessonAttachments, newAttach]);
    setAttachName('');
    setAttachUrl('');
    addToast('تم إضافة الملف المرفق لقائمة المرفقات المحلية بنجاح!', 'success');
  };

  // Submit Lesson creation
  const handleCreateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId || !selectedUnitId) {
      addToast('يرجى تحديد الكورس والوحدة أولاً المضاف إليها الدرس', 'error');
      return;
    }
    if (!lessonTitle.trim() || !lessonVideo.trim()) {
      addToast('يرجى ملء الاسم ورابط فيديو يوتيوب', 'error');
      return;
    }

    try {
      const lessonId = 'lesson_' + Math.random().toString(36).substring(2, 9);
      const newLesson: Lesson = {
        id: lessonId,
        courseId: selectedCourseId,
        unitId: selectedUnitId,
        title: lessonTitle.trim(),
        description: lessonDesc.trim(),
        youtubeUrl: lessonVideo.trim(),
        attachments: lessonAttachments,
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'lessons', lessonId), newLesson);
      addToast('تم إنشاء الدرس وربط الفيديوهات والملفات بنجاح!', 'success');
      setLessonTitle('');
      setLessonDesc('');
      setLessonVideo('');
      setLessonAttachments([]);
      fetchLessons();
    } catch (err) {
      console.error(err);
      addToast('حدث خطأ أثناء إضافة الدرس.', 'error');
    }
  };

  // Add test questions helper
  const handleAddQuestionLocal = () => {
    if (!qText.trim() || !qCorrect.trim()) {
      addToast('يرجى ملء نص السؤال والحل النموذجي', 'error');
      return;
    }

    const qId = 'q_' + Math.random().toString(36).substring(2, 9);
    const opts: string[] = [];
    if (qType === 'mcq') {
      if (!qOpt1.trim() || !qOpt2.trim() || !qOpt3.trim() || !qOpt4.trim()) {
        addToast('يرجى ملء خيارات السؤال الأربعة بالكامل', 'error');
        return;
      }
      opts.push(qOpt1.trim(), qOpt2.trim(), qOpt3.trim(), qOpt4.trim());
    }

    const newQ: Question = {
      id: qId,
      type: qType,
      text: qText.trim(),
      options: opts,
      correctAnswer: qCorrect.trim(),
    };

    setQuestions([...questions, newQ]);
    setQText('');
    setQOpt1('');
    setQOpt2('');
    setQOpt3('');
    setQOpt4('');
    setQCorrect('');
    addToast('تم إضافة السؤال بنجاح للاختبار المحلي!', 'success');
  };

  // Save the full test to Firebase
  const handleSaveTest = async () => {
    if (!selectedLessonId) {
      addToast('يرجى اختيار الدرس الذي ترغب في ربط هذا الاختبار به', 'error');
      return;
    }
    if (!testTitle.trim() || questions.length === 0) {
      addToast('يرجى كتابة عنوان الاختبار وإضافة سؤال واحد على الأقل', 'error');
      return;
    }

    try {
      const testId = 'test_' + Math.random().toString(36).substring(2, 9);
      const newTest: Test = {
        id: testId,
        lessonId: selectedLessonId,
        title: testTitle.trim(),
        questions,
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'tests', testId), newTest);
      addToast('تم حفظ ونشر الاختبار التفاعلي للطلاب على المنصة!', 'success');
      setTestTitle('');
      setQuestions([]);
      setSelectedLessonId('');
    } catch (err) {
      console.error(err);
      addToast('حدث خطأ أثناء حفظ الاختبار.', 'error');
    }
  };

  // Code Generation
  const handleGenerateCodes = async () => {
    if (numCodes < 1 || numCodes > 50) {
      addToast('الرجاء توليد ما بين 1 إلى 50 كود في المرة الواحدة', 'error');
      return;
    }

    setGeneratingCodes(true);
    try {
      for (let i = 0; i < numCodes; i++) {
        // Generate a random 8-letter unique code
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = 'MR-';
        for (let j = 0; j < 8; j++) {
          code += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        const newCode: SubscriptionCode = {
          code,
          createdAt: new Date().toISOString(),
          usedAt: null,
          usedBy: null,
          usedByName: null,
          status: 'active',
        };

        await setDoc(doc(db, 'subscriptionCodes', code), newCode);
      }

      addToast(`تم توليد ${numCodes} كود اشتراك جديد بنجاح!`, 'success');
      fetchCodes();
      fetchStats();
    } catch (err) {
      console.error(err);
      addToast('فشل توليد الأكواد.', 'error');
    } finally {
      setGeneratingCodes(false);
    }
  };

  // Change or cancel code
  const handleCancelCode = async (code: string) => {
    try {
      await updateDoc(doc(db, 'subscriptionCodes', code), { status: 'cancelled' });
      addToast('تم إيقاف/إلغاء كود الاشتراك المحدد بنجاح.', 'info');
      fetchCodes();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Course
  const handleDeleteCourse = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الكورس وجميع الوحدات والدروس الملحقة به نهائياً؟')) return;
    try {
      await deleteDoc(doc(db, 'courses', id));
      addToast('تم حذف الكورس بنجاح.', 'success');
      fetchCourses();
      fetchStats();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Unit
  const handleDeleteUnit = async (id: string) => {
    if (!window.confirm('هل تريد حذف هذه الوحدة؟')) return;
    try {
      await deleteDoc(doc(db, 'units', id));
      addToast('تم حذف الوحدة.', 'success');
      fetchUnits();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Lesson
  const handleDeleteLesson = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الدرس؟')) return;
    try {
      await deleteDoc(doc(db, 'lessons', id));
      addToast('تم حذف الدرس بنجاح.', 'success');
      fetchLessons();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Test
  const handleDeleteTest = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الاختبار نهائياً؟')) return;
    try {
      await deleteDoc(doc(db, 'tests', id));
      addToast('تم حذف الاختبار بنجاح.', 'success');
      fetchTests();
    } catch (err) {
      console.error(err);
    }
  };

  // Add Announcement
  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) {
      addToast('الرجاء تعبئة العنوان والمحتوى', 'error');
      return;
    }

    try {
      const annId = 'ann_' + Math.random().toString(36).substring(2, 9);
      const newAnn: Announcement = {
        id: annId,
        title: annTitle.trim(),
        content: annContent.trim(),
        grade: annGrade,
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'announcements', annId), newAnn);
      addToast('تم إرسال ونشر الإشعار للطلاب بنجاح!', 'success');
      setAnnTitle('');
      setAnnContent('');
      fetchAnnouncements();
    } catch (err) {
      console.error(err);
    }
  };

  // Edit Student subscription directly
  const handleUpdateStudentSub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    try {
      const parsedDate = newSubExpiry ? new Date(newSubExpiry).toISOString() : null;
      await updateDoc(doc(db, 'users', editingStudent.uid), {
        subscriptionExpiresAt: parsedDate,
      });

      addToast(`تم تحديث انتهاء اشتراك الطالب ${editingStudent.name} بنجاح!`, 'success');
      setEditingStudent(null);
      setNewSubExpiry('');
      fetchStudents();
      fetchStats();
    } catch (err) {
      console.error(err);
      addToast('فشل تعديل الاشتراك.', 'error');
    }
  };

  // Quick Activate Student Subscription for N days
  const quickActivateStudentSub = async (student: UserProfile, days: number) => {
    try {
      let expiresAt: string | null = null;
      if (days > 0) {
        const d = new Date();
        d.setDate(d.getDate() + days);
        expiresAt = d.toISOString();
      }

      await updateDoc(doc(db, 'users', student.uid), {
        subscriptionExpiresAt: expiresAt,
      });

      if (days > 0) {
        addToast(`تم تفعيل اشتراك الطالب ${student.name} بنجاح لمدة ${days} يوماً! 🎉`, 'success');
      } else {
        addToast(`تم إلغاء تفعيل اشتراك الطالب ${student.name}.`, 'info');
      }

      if (editingStudent && editingStudent.uid === student.uid) {
        setEditingStudent(null);
      }
      fetchStudents();
      fetchStats();
    } catch (err) {
      console.error(err);
      addToast('حدث خطأ أثناء تفعيل الاشتراك.', 'error');
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen font-sans" dir="rtl">
      {/* Container wrapper */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Banner with stats */}
        <div className="bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-md mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">لوحة تحكم المعلم والإدارة</span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100 mt-1">
              مرحباً، مستر عبدالله سيد
            </h1>
            <p className="text-xs text-slate-500 mt-1">يمكنك إدارة الطلاب، الكورسات، الفيديوهات، وملفات المرفقات وأكواد الاشتراك بسهولة.</p>
          </div>
          <div className="flex gap-2">
            <span className="p-2 bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl font-bold text-xs">
              دور المستخدم: أدمن المنصة
            </span>
          </div>
        </div>

        {/* Navigation Tabs Header */}
        <div className="flex flex-wrap gap-2 sm:gap-4 border-b border-slate-200 dark:border-slate-800 pb-3 mb-8">
          <button
            onClick={() => setTab('stats')}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-bold rounded-xl transition-all cursor-pointer ${
              tab === 'stats'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            الإحصائيات العامة
          </button>
          <button
            onClick={() => setTab('courses')}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-bold rounded-xl transition-all cursor-pointer ${
              tab === 'courses'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            المحتوى التعليمي والدروس
          </button>
          <button
            onClick={() => setTab('codes')}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-bold rounded-xl transition-all cursor-pointer ${
              tab === 'codes'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40'
            }`}
          >
            <Key className="w-4 h-4" />
            أكواد الاشتراك
          </button>
          <button
            onClick={() => setTab('students')}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-bold rounded-xl transition-all cursor-pointer ${
              tab === 'students'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40'
            }`}
          >
            <Users className="w-4 h-4" />
            إدارة الطلاب المشتركين
          </button>
          <button
            onClick={() => setTab('requests')}
            className={`relative flex items-center gap-1.5 px-4 py-2 text-sm font-bold rounded-xl transition-all cursor-pointer ${
              tab === 'requests'
                ? 'bg-amber-500 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>طلبات الاشتراك</span>
            {subscriptionRequests.filter((r) => r.status === 'pending').length > 0 && (
              <span className="px-2 py-0.5 text-[10px] font-black bg-rose-600 text-white rounded-full animate-pulse">
                {subscriptionRequests.filter((r) => r.status === 'pending').length}
              </span>
            )}
          </button>
          <button
            onClick={() => setTab('announcements')}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-bold rounded-xl transition-all cursor-pointer ${
              tab === 'announcements'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40'
            }`}
          >
            <Bell className="w-4 h-4" />
            الإشعارات العامة للطلاب
          </button>
        </div>

        {/* TAB 1: General Stats */}
        {tab === 'stats' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
                <div className="p-4 bg-blue-100 dark:bg-blue-950/20 text-blue-600 rounded-xl shrink-0">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-3xl font-black text-slate-800 dark:text-slate-100">{stats.totalStudents}</div>
                  <div className="text-xs text-slate-400 mt-1">الطلاب المسجلين بالمنصة</div>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
                <div className="p-4 bg-emerald-100 dark:bg-emerald-950/20 text-emerald-600 rounded-xl shrink-0">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-3xl font-black text-slate-800 dark:text-slate-100">{stats.activeSubscribers}</div>
                  <div className="text-xs text-slate-400 mt-1">الاشتراكات الفعالة الحالية</div>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
                <div className="p-4 bg-purple-100 dark:bg-purple-950/20 text-purple-600 rounded-xl shrink-0">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-3xl font-black text-slate-800 dark:text-slate-100">{stats.totalCourses}</div>
                  <div className="text-xs text-slate-400 mt-1">إجمالي الكورسات التعليمية</div>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
                <div className="p-4 bg-amber-100 dark:bg-amber-950/20 text-amber-600 rounded-xl shrink-0">
                  <Key className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-3xl font-black text-slate-800 dark:text-slate-100">{stats.activeCodes}</div>
                  <div className="text-xs text-slate-400 mt-1">أكواد تفعيل غير مستخدمة</div>
                </div>
              </div>
            </div>

            {/* Seeding & Quick guidelines row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Seeding Card */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-indigo-950/20 p-6 rounded-3xl border border-blue-100/50 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
                <div className="space-y-2 text-right">
                  <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-lg flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-pulse" />
                    <span>توليد البيانات الافتراضية الذكية</span>
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-semibold">
                    هل لوحة التحكم الخاصة بك فارغة؟ يمكنك تهيئة المنصة فوراً وتوليد كورس نموذجي متكامل للصف الأول الإعدادي يشتمل على وحدة تعليمية، درس فيديو يوتيوب، ملخصات ومذكرات بصيغة PDF، واختبار تفاعلي تفصيلي، بالإضافة لتوليد أكواد اشتراك فعالة للطلاب بضغطة زر واحدة!
                  </p>
                </div>
                <button
                  onClick={handleForceSeed}
                  disabled={seeding}
                  className="w-full sm:w-auto self-start px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-extrabold text-xs rounded-2xl shadow-md shadow-blue-200 dark:shadow-none transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                >
                  {seeding ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>جاري تهيئة المنهج والدروس...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>تهيئة المنصة بالبيانات والدروس الافتراضية فوراً 🚀</span>
                    </>
                  )}
                </button>
              </div>

              {/* Quick tips */}
              <div className="bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4 text-right">
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg flex items-center gap-1.5">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  إرشادات مهمة للمشرف
                </h3>
                <ul className="space-y-3 text-slate-600 dark:text-slate-400 text-xs list-decimal list-inside pr-4 leading-relaxed font-medium">
                  <li>لا تقم برفع فيديوهاتك للشرح إلى الاستضافة لتجنب امتلاء السعة. فقط استخدم رابط فيديو يوتيوب وسيتم تضمينه تلقائياً للطلاب.</li>
                  <li>تأكد من أن كود الاشتراك فريد وسهل النقل. يمكنك إنشاء مجموعة من الأكواد وحفظها للطلاب لتفعيل اشتراكاتهم.</li>
                  <li>تتم مراجعة سجلات الدرجات وحلول الطلاب من صفحة الطلاب لمتابعة تقدمهم بانتظام.</li>
                  <li>قم بتسجيل الدخول مباشرة ببريدك الإلكتروني المخصص للمستتر لتفعيل كامل صلاحيات التحكم والرفع التلقائي.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Educational Content (Courses, Units, Lessons & Tests) */}
        {tab === 'courses' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left 2 Columns: Add forms and lists */}
            <div className="lg:col-span-2 space-y-8">

              {/* Curriculum & Lessons Browser */}
              <div className="bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-md space-y-6 text-right font-sans" dir="rtl">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4 border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="font-black text-slate-800 dark:text-slate-100 text-lg flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                      <span>مستعرض ومقسم المناهج والدروس والامتحانات</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">تصفح وقسم المنهج والدروس والملفات والامتحانات المنشورة حسب كل صف دراسي بمرونة وسهولة.</p>
                  </div>
                </div>

                {/* Filter grade pills */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setCurrGradeFilter('all')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all cursor-pointer ${
                      currGradeFilter === 'all'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                    }`}
                  >
                    كل الصفوف المتاحة ({courses.length})
                  </button>
                  {Object.entries(GRADE_LABELS).map(([g, label]) => {
                    const count = courses.filter((c) => c.grade === g).length;
                    return (
                      <button
                        key={g}
                        onClick={() => setCurrGradeFilter(g as EducationalGrade)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all cursor-pointer ${
                          currGradeFilter === g
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                        }`}
                      >
                        {label} ({count})
                      </button>
                    );
                  })}
                </div>

                {/* Filtered Courses List */}
                {courses.filter((c) => currGradeFilter === 'all' || c.grade === currGradeFilter).length === 0 ? (
                  <div className="p-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center space-y-2">
                    <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
                    <p className="text-sm font-bold text-slate-600 dark:text-slate-400">لا توجد كورسات مضافة لهذا صف حالياً.</p>
                    <p className="text-xs text-slate-400">يمكنك استخدام النموذج على اليسار لإضافة أول كورس دراسي جديد مع وحداته ودروسه التفاعلية.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {courses
                      .filter((c) => currGradeFilter === 'all' || c.grade === currGradeFilter)
                      .map((c) => {
                        const courseUnits = units.filter((u) => u.courseId === c.id);
                        const isCourseExpanded = expandedCourseId === c.id;

                        return (
                          <div
                            key={c.id}
                            className="border border-slate-100 dark:border-slate-800/80 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 overflow-hidden"
                          >
                            {/* Course Header */}
                            <div className="p-4 flex items-center justify-between gap-4 bg-slate-100/50 dark:bg-slate-900/50">
                              <div className="flex items-center gap-3">
                                <img
                                  src={c.imageUrl || 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=200'}
                                  alt={c.title}
                                  className="w-12 h-12 rounded-xl object-cover"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="text-right">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h4 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">{c.title}</h4>
                                    <span className="text-[10px] px-2 py-0.5 bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-full font-black">
                                      {GRADE_LABELS[c.grade]}
                                    </span>
                                  </div>
                                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{c.description}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setExpandedCourseId(isCourseExpanded ? null : c.id)}
                                  className="px-3 py-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
                                >
                                  <span>{isCourseExpanded ? 'إغلاق التفاصيل' : `استعراض الوحدات (${courseUnits.length})`}</span>
                                  {isCourseExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                </button>
                                <button
                                  onClick={() => handleDeleteCourse(c.id)}
                                  className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-colors cursor-pointer"
                                  title="حذف الكورس بأكمله"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            {/* Course Units Area */}
                            {isCourseExpanded && (
                              <div className="p-4 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 space-y-4">
                                {courseUnits.length === 0 ? (
                                  <p className="text-slate-400 text-xs text-center py-4">لا توجد وحدات تعليمية مضافة في هذا الكورس بعد.</p>
                                ) : (
                                  <div className="space-y-3">
                                    {courseUnits.map((u) => {
                                      const unitLessons = lessons.filter((l) => l.unitId === u.id);
                                      const isUnitExpanded = expandedUnitId === u.id;

                                      return (
                                        <div
                                          key={u.id}
                                          className="border border-slate-100 dark:border-slate-800/60 rounded-xl p-3 bg-slate-50/30 dark:bg-slate-900/10 space-y-2"
                                        >
                                          {/* Unit Title and description */}
                                          <div className="flex items-center justify-between gap-4">
                                            <div>
                                              <h5 className="font-bold text-slate-800 dark:text-slate-200 text-xs">{u.title}</h5>
                                              <p className="text-[10px] text-slate-400 mt-0.5">{u.description}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                              <button
                                                onClick={() => setExpandedUnitId(isUnitExpanded ? null : u.id)}
                                                className="px-2.5 py-1 bg-white dark:bg-slate-950 border rounded-lg text-[10px] font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 flex items-center gap-1 cursor-pointer"
                                              >
                                                <span>{isUnitExpanded ? 'إخفاء الدروس' : `الدروس والمرفقات (${unitLessons.length})`}</span>
                                                {isUnitExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                              </button>
                                              <button
                                                onClick={() => handleDeleteUnit(u.id)}
                                                className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-colors cursor-pointer"
                                                title="حذف هذه الوحدة"
                                              >
                                                <Trash2 className="w-3.5 h-3.5" />
                                              </button>
                                            </div>
                                          </div>

                                          {/* Unit Lessons list */}
                                          {isUnitExpanded && (
                                            <div className="mt-3 pl-2 pr-4 border-r-2 border-blue-500/40 dark:border-blue-500/20 space-y-3 pt-2">
                                              {unitLessons.length === 0 ? (
                                                <p className="text-slate-400 text-[10px] py-2">لا توجد دروس مضافة في هذه الوحدة حالياً.</p>
                                              ) : (
                                                unitLessons.map((l) => {
                                                  const lessonTests = tests.filter((t) => t.lessonId === l.id);

                                                  return (
                                                    <div
                                                      key={l.id}
                                                      className="p-3 bg-white dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
                                                    >
                                                      <div className="space-y-1 text-right">
                                                        <h6 className="font-bold text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1.5">
                                                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                                                          {l.title}
                                                        </h6>
                                                        <p className="text-[10px] text-slate-400 max-w-xl">{l.description}</p>
                                                        
                                                        {/* YouTube / video details */}
                                                        <div className="flex items-center gap-3 pt-1 flex-wrap">
                                                          <span className="inline-flex items-center gap-1 text-[9px] text-rose-600 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-950/20 px-1.5 py-0.5 rounded">
                                                            <Video className="w-3 h-3" />
                                                            رابط يوتيوب: {l.youtubeUrl}
                                                          </span>

                                                          {/* Attachments List */}
                                                          {l.attachments && l.attachments.length > 0 && (
                                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                              {l.attachments.map((at, idx) => (
                                                                <a
                                                                  key={idx}
                                                                  href={at.url}
                                                                  target="_blank"
                                                                  rel="noreferrer"
                                                                  className="inline-flex items-center gap-0.5 text-[9px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/20 px-1.5 py-0.5 rounded hover:underline"
                                                                >
                                                                  <Paperclip className="w-2.5 h-2.5" />
                                                                  {at.name} ({at.type.toUpperCase()})
                                                                </a>
                                                              ))}
                                                            </div>
                                                          )}
                                                        </div>

                                                        {/* Tests Linked */}
                                                        {lessonTests.length > 0 && (
                                                          <div className="flex items-center gap-1.5 pt-1.5 flex-wrap">
                                                            <span className="text-[9px] text-slate-400">الاختبارات المرتبطة:</span>
                                                            {lessonTests.map((t) => (
                                                              <span
                                                                key={t.id}
                                                                className="inline-flex items-center gap-1 text-[9px] text-purple-700 dark:text-purple-400 font-black bg-purple-50 dark:bg-purple-950/20 px-2 py-0.5 rounded-full border border-purple-100 dark:border-purple-900/30"
                                                              >
                                                                <Award className="w-3 h-3" />
                                                                <span>{t.title}</span>
                                                                <button
                                                                  onClick={() => handleDeleteTest(t.id)}
                                                                  className="text-rose-500 hover:text-rose-700 p-0.5 transition-colors cursor-pointer"
                                                                  title="حذف هذا الاختبار"
                                                                >
                                                                  <X className="w-2.5 h-2.5" />
                                                                </button>
                                                              </span>
                                                            ))}
                                                          </div>
                                                        )}
                                                      </div>

                                                      <button
                                                        onClick={() => handleDeleteLesson(l.id)}
                                                        className="self-start md:self-center p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-colors cursor-pointer"
                                                        title="حذف هذا الدرس"
                                                      >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                      </button>
                                                    </div>
                                                  );
                                                })
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>

              {/* Add Interactive Test Creator */}
              <div className="bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-md space-y-6">
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg border-b pb-2">منشئ الاختبارات التفاعلية</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">حدد الدرس المرتبط بالاختبار *</label>
                    <select
                      value={selectedLessonId}
                      onChange={(e) => setSelectedLessonId(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs"
                    >
                      <option value="">-- اختر الدرس --</option>
                      {lessons.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">عنوان أو اسم الاختبار *</label>
                    <input
                      type="text"
                      value={testTitle}
                      onChange={(e) => setTestTitle(e.target.value)}
                      placeholder="مثال: اختبار شامل على القواعد الأساسية"
                      className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs outline-none"
                    />
                  </div>
                </div>

                {/* Question Creator panel */}
                <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 space-y-4">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">إضافة سؤال جديد لـ هذا الاختبار</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-1">نوع السؤال</label>
                      <select
                        value={qType}
                        onChange={(e) => setQType(e.target.value as any)}
                        className="w-full px-3 py-2 border rounded-xl bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-xs"
                      >
                        <option value="mcq">اختيار من متعدد (MCQ)</option>
                        <option value="true_false">صح أو خطأ (True/False)</option>
                        <option value="complete">أكمل الفراغ (Complete)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-1">نص السؤال بالكامل *</label>
                      <input
                        type="text"
                        value={qText}
                        onChange={(e) => setQText(e.target.value)}
                        placeholder="ما هو نص السؤال؟"
                        className="w-full px-3 py-2 border rounded-xl bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-xs outline-none"
                      />
                    </div>
                  </div>

                  {/* If MCQ option inputs */}
                  {qType === 'mcq' && (
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={qOpt1}
                        onChange={(e) => setQOpt1(e.target.value)}
                        placeholder="خيارات أ"
                        className="px-3 py-1.5 border rounded-lg bg-white dark:bg-slate-950 text-xs outline-none"
                      />
                      <input
                        type="text"
                        value={qOpt2}
                        onChange={(e) => setQOpt2(e.target.value)}
                        placeholder="خيارات ب"
                        className="px-3 py-1.5 border rounded-lg bg-white dark:bg-slate-950 text-xs outline-none"
                      />
                      <input
                        type="text"
                        value={qOpt3}
                        onChange={(e) => setQOpt3(e.target.value)}
                        placeholder="خيارات ج"
                        className="px-3 py-1.5 border rounded-lg bg-white dark:bg-slate-950 text-xs outline-none"
                      />
                      <input
                        type="text"
                        value={qOpt4}
                        onChange={(e) => setQOpt4(e.target.value)}
                        placeholder="خيارات د"
                        className="px-3 py-1.5 border rounded-lg bg-white dark:bg-slate-950 text-xs outline-none"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">الإجابة النموذجية الصحيحة بالكامل *</label>
                    <input
                      type="text"
                      value={qCorrect}
                      onChange={(e) => setQCorrect(e.target.value)}
                      placeholder={qType === 'true_false' ? 'صح أو خطأ' : 'اكتب الحل المطابق تماماً'}
                      className="w-full px-3 py-2 border rounded-xl bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-xs outline-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleAddQuestionLocal}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-all cursor-pointer"
                  >
                    أضف هذا السؤال للاختبار
                  </button>
                </div>

                {/* Local Questions count & publish */}
                {questions.length > 0 && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-2xl border flex justify-between items-center">
                    <span className="text-xs text-blue-700 dark:text-blue-300 font-bold">
                      تم تحضير عدد {questions.length} أسئلة في المسودة المخصصة للاختبار.
                    </span>
                    <button
                      type="button"
                      onClick={handleSaveTest}
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow cursor-pointer"
                    >
                      حفظ ونشر الاختبار الآن
                    </button>
                  </div>
                )}
              </div>

            </div>

            {/* Right 1 Column: Create Forms (Course, Unit, Lesson) */}
            <div className="space-y-6">
              
              {/* Add Course form */}
              <div className="bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-md">
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base mb-4 border-b pb-2">إضافة كورس جديد</h3>
                <form onSubmit={handleCreateCourse} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">اسم أو عنوان الكورس *</label>
                    <input
                      type="text"
                      required
                      value={courseTitle}
                      onChange={(e) => setCourseTitle(e.target.value)}
                      placeholder="كورس القواعد الشاملة"
                      className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">الصف الدراسي للكورس *</label>
                    <select
                      value={courseGrade}
                      onChange={(e) => setCourseGrade(e.target.value as EducationalGrade)}
                      className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs"
                    >
                      {Object.entries(GRADE_LABELS).map(([g, l]) => (
                        <option key={g} value={g}>
                          {l}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">وصف الكورس *</label>
                    <textarea
                      rows={3}
                      required
                      value={courseDesc}
                      onChange={(e) => setCourseDesc(e.target.value)}
                      placeholder="اكتب وصف الكورس بالتفصيل هنا..."
                      className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">صورة الكورس (ارفع ملف أو اكتب رابط يدوي)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleCourseImageUpload(e.target.files[0]);
                        }
                      }}
                      className="w-full text-xs text-slate-500 mb-2 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <input
                      type="text"
                      value={courseImgUrl}
                      onChange={(e) => setCourseImgUrl(e.target.value)}
                      placeholder="أو اكتب رابط الصورة يدوياً هنا"
                      className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={uploadingImg}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center cursor-pointer"
                  >
                    {uploadingImg ? 'جاري الرفع للـ Cloud...' : 'إضافة الكورس'}
                  </button>
                </form>
              </div>

              {/* Add Unit form */}
              <div className="bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-md">
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base mb-4 border-b pb-2">إضافة وحدة جديدة</h3>
                <form onSubmit={handleCreateUnit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">اختر الكورس التابع له الوحدة *</label>
                    <select
                      value={selectedCourseId}
                      onChange={(e) => setSelectedCourseId(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs"
                    >
                      <option value="">-- اختر الكورس --</option>
                      {courses.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.title} ({GRADE_LABELS[c.grade]})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">اسم أو عنوان الوحدة *</label>
                    <input
                      type="text"
                      required
                      value={unitTitle}
                      onChange={(e) => setUnitTitle(e.target.value)}
                      placeholder="مثال: الوحدة الأولى: زمن الماضي البسيط"
                      className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">وصف مختصر للوحدة *</label>
                    <textarea
                      rows={2}
                      required
                      value={unitDesc}
                      onChange={(e) => setUnitDesc(e.target.value)}
                      placeholder="اكتب ماذا سيتعلم الطالب في هذه الوحدة..."
                      className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all cursor-pointer"
                  >
                    إضافة الوحدة
                  </button>
                </form>
              </div>

              {/* Add Lesson form */}
              <div className="bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-md">
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base mb-4 border-b pb-2">إضافة درس جديد</h3>
                <form onSubmit={handleCreateLesson} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">اختر الكورس والوحدة *</label>
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={selectedCourseId}
                        onChange={(e) => setSelectedCourseId(e.target.value)}
                        className="px-2 py-2 border rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs outline-none"
                      >
                        <option value="">-- كورس --</option>
                        {courses.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.title}
                          </option>
                        ))}
                      </select>
                      <select
                        value={selectedUnitId}
                        onChange={(e) => setSelectedUnitId(e.target.value)}
                        className="px-2 py-2 border rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs outline-none"
                      >
                        <option value="">-- الوحدة --</option>
                        {units.filter((u) => u.courseId === selectedCourseId).map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">اسم الدرس الجديد *</label>
                    <input
                      type="text"
                      required
                      value={lessonTitle}
                      onChange={(e) => setLessonTitle(e.target.value)}
                      placeholder="درس 1: شرح التفاصيل والتركيبات"
                      className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">وصف وشرح الدرس بالتفصيل</label>
                    <textarea
                      rows={3}
                      value={lessonDesc}
                      onChange={(e) => setLessonDesc(e.target.value)}
                      placeholder="اكتب ملاحظات الشرح للطلاب..."
                      className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">رابط فيديو YouTube المرفق *</label>
                    <input
                      type="text"
                      required
                      value={lessonVideo}
                      onChange={(e) => setLessonVideo(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs outline-none text-left"
                    />
                  </div>

                  {/* Attachment Addition sub-panel */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-dashed text-right space-y-2">
                    <span className="text-[10px] font-bold text-slate-500">مرفقات ومذكرات الدرس (اختياري)</span>
                    <input
                      type="file"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleAttachmentUpload(e.target.files[0]);
                        }
                      }}
                      className="w-full text-[10px] file:mr-2 file:py-1 file:px-2 file:rounded-xl file:border-0 file:bg-blue-50 file:text-blue-700"
                    />
                    <input
                      type="text"
                      value={attachName}
                      onChange={(e) => setAttachName(e.target.value)}
                      placeholder="اسم الملف المرفق (مثال: ملزمة زمن الماضي)"
                      className="w-full px-2 py-1 border rounded-lg text-xs outline-none bg-white dark:bg-slate-950"
                    />
                    <input
                      type="text"
                      value={attachUrl}
                      onChange={(e) => setAttachUrl(e.target.value)}
                      placeholder="رابط الملف المكتوب يدوياً (أو الرابط المرفوع)"
                      className="w-full px-2 py-1 border rounded-lg text-xs outline-none bg-white dark:bg-slate-950 text-left"
                    />
                    <div className="flex justify-between items-center">
                      <select
                        value={attachType}
                        onChange={(e) => setAttachType(e.target.value as any)}
                        className="px-2 py-1 border rounded bg-white dark:bg-slate-950 text-[10px]"
                      >
                        <option value="pdf">ملف PDF</option>
                        <option value="word">ملف Word</option>
                        <option value="ppt">ملف PowerPoint</option>
                        <option value="image">صورة / رسم توضيحي</option>
                        <option value="other">أخرى</option>
                      </select>
                      <button
                        type="button"
                        disabled={uploadingFile}
                        onClick={handleAddAttachmentLocal}
                        className="px-3 py-1 bg-blue-600 text-white font-bold rounded-lg text-[10px] cursor-pointer"
                      >
                        {uploadingFile ? 'جاري الرفع...' : 'أضف لقائمة الدرس'}
                      </button>
                    </div>

                    {/* Local Attachments Count */}
                    {lessonAttachments.length > 0 && (
                      <div className="pt-2 text-[10px] text-emerald-600 font-bold">
                        سيتم حفظ عدد ({lessonAttachments.length}) ملفات مرفقة مع هذا الدرس.
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all cursor-pointer"
                  >
                    حفظ ونشر الدرس
                  </button>
                </form>
              </div>

            </div>

          </div>
        )}

        {/* TAB 3: Subscription Codes Management */}
        {tab === 'codes' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Generator Form */}
            <div className="bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-md h-fit">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg mb-2">منشئ أكواد الاشتراكات</h3>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                أنشئ مجموعة من أكواد الاشتراكات العشوائية، كل كود يمكنه تفعيل حساب الطالب لمدة شهر واحد (30 يوماً).
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">عدد الأكواد المراد توليدها دفعة واحدة</label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={numCodes}
                    onChange={(e) => setNumCodes(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm outline-none text-center font-bold"
                  />
                </div>

                <button
                  onClick={handleGenerateCodes}
                  disabled={generatingCodes}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow transition-all cursor-pointer flex justify-center items-center"
                >
                  {generatingCodes ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    'توليد ونشر الأكواد النشطة'
                  )}
                </button>
              </div>
            </div>

            {/* Right 2 Columns: Codes Table */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-md">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">سجل الأكواد المنتجة</h3>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث عن كود مخصص..."
                    className="w-full pr-9 pl-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 outline-none text-right"
                  />
                </div>
              </div>

              {codes.length === 0 ? (
                <p className="text-slate-400 text-xs text-center py-12">لم يتم توليد أي أكواد اشتراك بالمنصة بعد.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs sm:text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 text-slate-500">
                      <tr>
                        <th className="p-3 font-bold">الكود</th>
                        <th className="p-3 font-bold text-center">تاريخ الإنشاء</th>
                        <th className="p-3 font-bold text-center">الوضعية</th>
                        <th className="p-3 font-bold text-center">مفعل بواسطة</th>
                        <th className="p-3 font-bold text-center">إجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {codes
                        .filter((c) => c.code.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map((c) => (
                          <tr key={c.code} className="hover:bg-slate-50 dark:hover:bg-slate-900/20">
                            <td className="p-3 font-extrabold text-blue-600 select-all font-mono tracking-wider">{c.code}</td>
                            <td className="p-3 text-center text-slate-400 text-[10px]">
                              {new Date(c.createdAt).toLocaleDateString('ar-EG')}
                            </td>
                            <td className="p-3 text-center">
                              <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                                c.status === 'active'
                                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20'
                                  : c.status === 'used'
                                  ? 'bg-slate-100 text-slate-500 dark:bg-slate-900'
                                  : 'bg-rose-50 text-rose-600'
                              }`}>
                                {c.status === 'active' ? 'متاح للطلاب' : c.status === 'used' ? 'تم استخدامه' : 'ملغى'}
                              </span>
                            </td>
                            <td className="p-3 text-center font-bold text-slate-800 dark:text-slate-100">
                              {c.usedByName || <span className="text-slate-400 font-normal">--</span>}
                            </td>
                            <td className="p-3 text-center">
                              {c.status === 'active' && (
                                <button
                                  onClick={() => handleCancelCode(c.code)}
                                  className="text-xs font-bold text-rose-500 hover:underline cursor-pointer"
                                >
                                  إلغاء الكود
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: Students Management */}
        {tab === 'students' && (
          <div className="space-y-6">
            
            {/* Search Student filter */}
            <div className="bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">الطلاب المسجلين بالمنصة</h3>
              <div className="relative w-full sm:w-80">
                <Search className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  placeholder="ابحث عن طالب بالاسم أو الهاتف..."
                  className="w-full pr-9 pl-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 outline-none text-right"
                />
              </div>
            </div>

            {/* Students Table */}
            {students.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-3xl text-slate-400 border">لا يوجد طلاب مسجلين بالمنصة بعد.</div>
            ) : (
              <div className="bg-white dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs sm:text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 text-slate-500">
                      <tr>
                        <th className="p-4 font-bold">اسم الطالب</th>
                        <th className="p-4 font-bold">هاتف الطالب</th>
                        <th className="p-4 font-bold">هاتف ولي الأمر</th>
                        <th className="p-4 font-bold">الصف الدراسي</th>
                        <th className="p-4 font-bold text-center">انتهاء الاشتراك</th>
                        <th className="p-4 font-bold text-center">حالة الحساب</th>
                        <th className="p-4 font-bold text-center">إجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                      {students
                        .filter(
                          (s) =>
                            s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
                            s.phone.includes(studentSearch) ||
                            (s.parentPhone && s.parentPhone.includes(studentSearch))
                        )
                        .map((s) => {
                          const hasSub =
                            s.subscriptionStatus === 'approved' ||
                            (s.subscriptionExpiresAt &&
                              new Date(s.subscriptionExpiresAt).getTime() > Date.now());
                          return (
                            <tr key={s.uid} className="hover:bg-slate-50 dark:hover:bg-slate-900/20">
                              <td className="p-4 font-bold text-slate-800 dark:text-slate-100">
                                <div>{s.name}</div>
                                <div className="text-[10px] text-slate-400 font-mono font-normal">{s.email}</div>
                              </td>
                              <td className="p-4 select-all font-mono">
                                <a href={`https://wa.me/2${s.phone}`} target="_blank" referrerPolicy="no-referrer" className="text-emerald-600 hover:underline">
                                  {s.phone}
                                </a>
                              </td>
                              <td className="p-4 select-all font-mono text-slate-500">
                                {s.parentPhone ? (
                                  <a href={`https://wa.me/2${s.parentPhone}`} target="_blank" referrerPolicy="no-referrer" className="text-emerald-600 hover:underline">
                                    {s.parentPhone}
                                  </a>
                                ) : (
                                  'غير مسجل'
                                )}
                              </td>
                              <td className="p-4">
                                <select
                                  value={s.grade}
                                  onChange={(e) => handleUpdateStudentGrade(s.uid, e.target.value as EducationalGrade)}
                                  className="px-2 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-blue-600 dark:text-blue-400 outline-none cursor-pointer"
                                  title="تغيير صف الطالب"
                                >
                                  {Object.entries(GRADE_LABELS).map(([gKey, gLabel]) => (
                                    <option key={gKey} value={gKey}>
                                      {gLabel}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td className="p-4 text-center font-mono text-slate-500 text-xs">
                                {s.subscriptionExpiresAt
                                  ? new Date(s.subscriptionExpiresAt).toLocaleDateString('ar-EG')
                                  : 'غير محدد'}
                              </td>
                              <td className="p-4 text-center">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                  hasSub
                                    ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20'
                                    : s.subscriptionStatus === 'pending'
                                    ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/20'
                                    : 'bg-rose-50 text-rose-500 dark:bg-rose-950/20'
                                }`}>
                                  {hasSub ? 'مقبول ومفعل' : s.subscriptionStatus === 'pending' ? 'قيد المراجعة' : 'غير مفعل'}
                                </span>
                              </td>
                               <td className="p-4 text-center">
                                 <div className="flex items-center justify-center gap-1.5 flex-wrap">
                                   {!hasSub ? (
                                     <button
                                       onClick={() => quickActivateStudentSub(s, 30)}
                                       className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow cursor-pointer"
                                       title="تفعيل سريع لمدة 30 يوم"
                                     >
                                       <Zap className="w-3.5 h-3.5" />
                                       تفعيل شهر
                                     </button>
                                   ) : (
                                     <button
                                       onClick={() => quickActivateStudentSub(s, 0)}
                                       className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-bold transition-all cursor-pointer"
                                       title="إلغاء التفعيل"
                                     >
                                       إلغاء الاشتراك
                                     </button>
                                   )}
                                   <button
                                     onClick={() => {
                                       setEditingStudent(s);
                                       setNewSubExpiry(
                                         s.subscriptionExpiresAt
                                           ? s.subscriptionExpiresAt.substring(0, 10)
                                           : ''
                                       );
                                     }}
                                     className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold transition-all cursor-pointer"
                                   >
                                     <Edit className="w-3.5 h-3.5" />
                                     خيارات أخرى
                                   </button>
                                 </div>
                               </td>
                             </tr>
                           );
                         })}
                     </tbody>
                   </table>
                 </div>
               </div>
             )}

             {/* Edit student subscription Modal */}
             {editingStudent && (
               <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                 <div className="bg-white dark:bg-slate-900 rounded-2xl border p-6 w-full max-w-md space-y-4">
                   <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">تفعيل وتعديل اشتراك: {editingStudent.name}</h3>
                   
                   {/* Quick preset activation buttons */}
                   <div className="space-y-2">
                     <label className="block text-xs font-bold text-slate-500">تفعيل سريع بضغطة زر:</label>
                     <div className="grid grid-cols-3 gap-2">
                       <button
                         type="button"
                         onClick={() => quickActivateStudentSub(editingStudent, 30)}
                         className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer"
                       >
                         <span>⚡ شهر كامل</span>
                         <span className="text-[10px] text-emerald-600 font-normal">(30 يوم)</span>
                       </button>
                       <button
                         type="button"
                         onClick={() => quickActivateStudentSub(editingStudent, 120)}
                         className="px-3 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer"
                       >
                         <span>⚡ ترم دراسي</span>
                         <span className="text-[10px] text-blue-600 font-normal">(120 يوم)</span>
                       </button>
                       <button
                         type="button"
                         onClick={() => quickActivateStudentSub(editingStudent, 365)}
                         className="px-3 py-2 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer"
                       >
                         <span>⚡ سنة دراسية</span>
                         <span className="text-[10px] text-purple-600 font-normal">(365 يوم)</span>
                       </button>
                     </div>
                   </div>

                   <hr className="border-slate-100 dark:border-slate-800 my-2" />

                   <form onSubmit={handleUpdateStudentSub} className="space-y-4 text-right">
                     <div>
                       <label className="block text-xs font-bold text-slate-500 mb-1">أو حدد تاريخ انتهاء مخصص:</label>
                       <input
                         type="date"
                         value={newSubExpiry}
                         onChange={(e) => setNewSubExpiry(e.target.value)}
                         className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 text-sm outline-none"
                       />
                     </div>
                     <div className="flex gap-2 justify-between items-center pt-2">
                       <button
                         type="button"
                         onClick={() => quickActivateStudentSub(editingStudent, 0)}
                         className="px-3 py-2 text-xs bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-xl cursor-pointer"
                       >
                         إلغاء الاشتراك
                       </button>

                       <div className="flex gap-2">
                         <button
                           type="button"
                           onClick={() => setEditingStudent(null)}
                           className="px-4 py-2 text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl cursor-pointer"
                         >
                           إلغاء
                         </button>
                         <button
                           type="submit"
                           className="px-4 py-2 text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl cursor-pointer"
                         >
                           حفظ التاريخ
                         </button>
                       </div>
                     </div>
                   </form>
                 </div>
               </div>
             )}
          </div>
        )}

        {/* TAB: Subscription Requests (طلبات الاشتراك والقبول) */}
        {tab === 'requests' && (
          <div className="space-y-6" dir="rtl">
            {/* Requests Header & Filter */}
            <div className="bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-xl flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-500" />
                  <span>طلبات اشتراك الطلاب بالمرحلة التعليمية</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  راجع طلبات الطلاب الجدد وقم بقبول وتفعيل اشتراكاتهم أو رفضها قبل منحهم صلاحية فتح الدروس والكورسات.
                </p>
              </div>

              {/* Status Filter Pills */}
              <div className="flex flex-wrap gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800">
                <button
                  onClick={() => setReqStatusFilter('pending')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    reqStatusFilter === 'pending'
                      ? 'bg-amber-500 text-white shadow'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-800'
                  }`}
                >
                  قيد المراجعة ({subscriptionRequests.filter((r) => r.status === 'pending').length})
                </button>
                <button
                  onClick={() => setReqStatusFilter('approved')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    reqStatusFilter === 'approved'
                      ? 'bg-emerald-600 text-white shadow'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-800'
                  }`}
                >
                  المقبولة ({subscriptionRequests.filter((r) => r.status === 'approved').length})
                </button>
                <button
                  onClick={() => setReqStatusFilter('rejected')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    reqStatusFilter === 'rejected'
                      ? 'bg-rose-600 text-white shadow'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-800'
                  }`}
                >
                  المرفوضة ({subscriptionRequests.filter((r) => r.status === 'rejected').length})
                </button>
                <button
                  onClick={() => setReqStatusFilter('all')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    reqStatusFilter === 'all'
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-800'
                  }`}
                >
                  الكل ({subscriptionRequests.length})
                </button>
              </div>
            </div>

            {/* Requests List */}
            {subscriptionRequests.filter((r) => reqStatusFilter === 'all' || r.status === reqStatusFilter).length === 0 ? (
              <div className="bg-white dark:bg-slate-950 p-12 text-center rounded-3xl border border-slate-100 dark:border-slate-800 text-slate-400 shadow-md">
                لا توجد طلبات اشتراك ضمن هذا الفلتر حالياً.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subscriptionRequests
                  .filter((r) => reqStatusFilter === 'all' || r.status === reqStatusFilter)
                  .map((req) => (
                    <div
                      key={req.id}
                      className="bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-md flex flex-col justify-between space-y-4 hover:shadow-lg transition-all"
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-black text-slate-800 dark:text-slate-100 text-base">{req.studentName}</h4>
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              req.status === 'pending'
                                ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 border border-amber-200/60'
                                : req.status === 'approved'
                                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 border border-emerald-200/60'
                                : 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 border border-rose-200/60'
                            }`}
                          >
                            {req.status === 'pending' ? '⏳ قيد المراجعة' : req.status === 'approved' ? '✅ مقبول ومفعل' : '❌ مرفوض'}
                          </span>
                        </div>

                        <div className="text-xs space-y-2 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-100/50 dark:border-slate-800">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400 font-bold">الصف الدراسي:</span>
                            <span className="font-extrabold text-blue-600 dark:text-blue-400">{GRADE_LABELS[req.grade]}</span>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-slate-400 font-bold">هاتف الطالب:</span>
                            <a
                              href={`https://wa.me/2${req.studentPhone}`}
                              target="_blank"
                              referrerPolicy="no-referrer"
                              className="font-mono text-emerald-600 font-bold hover:underline"
                            >
                              {req.studentPhone}
                            </a>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-slate-400 font-bold">هاتف ولي الأمر:</span>
                            {req.parentPhone ? (
                              <a
                                href={`https://wa.me/2${req.parentPhone}`}
                                target="_blank"
                                referrerPolicy="no-referrer"
                                className="font-mono text-emerald-600 font-bold hover:underline"
                              >
                                {req.parentPhone}
                              </a>
                            ) : (
                              <span className="text-slate-400 font-normal">غير متاح</span>
                            )}
                          </div>

                          <div className="flex justify-between items-center pt-1 border-t border-slate-200/40 dark:border-slate-800 text-[11px] text-slate-400">
                            <span>تاريخ الطلب:</span>
                            <span className="font-mono">
                              {new Date(req.requestedAt).toLocaleDateString('ar-EG', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                        {req.status === 'pending' && (
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => handleApproveSubscriptionRequest(req)}
                              className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <UserCheck className="w-4 h-4" />
                              <span>قبول وتفعيل شهر</span>
                            </button>
                            <button
                              onClick={() => handleRejectSubscriptionRequest(req)}
                              className="py-2.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs rounded-xl border border-rose-200/60 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <XCircle className="w-4 h-4" />
                              <span>رفض الطلب</span>
                            </button>
                          </div>
                        )}

                        {req.status === 'approved' && (
                          <div className="flex items-center justify-between p-2 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-xl border border-emerald-200/40">
                            <span>تم قبول الاشتراك وتفعيل الصف بنجاح</span>
                            <button
                              onClick={() => handleRejectSubscriptionRequest(req)}
                              className="text-[11px] text-rose-500 hover:underline cursor-pointer"
                            >
                              إلغاء التفعيل
                            </button>
                          </div>
                        )}

                        {req.status === 'rejected' && (
                          <button
                            onClick={() => handleApproveSubscriptionRequest(req)}
                            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow cursor-pointer"
                          >
                            إعادة النظر والموافقة
                          </button>
                        )}

                        {/* WhatsApp Communication Shortcut */}
                        <div className="flex gap-2 pt-1">
                          <a
                            href={`https://wa.me/2${req.studentPhone}`}
                            target="_blank"
                            referrerPolicy="no-referrer"
                            className="flex-1 py-1.5 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-[11px] rounded-xl text-center cursor-pointer flex items-center justify-center gap-1"
                          >
                            <Phone className="w-3 h-3 text-emerald-500" />
                            <span>واتساب الطالب</span>
                          </a>
                          {req.parentPhone && (
                            <a
                              href={`https://wa.me/2${req.parentPhone}`}
                              target="_blank"
                              referrerPolicy="no-referrer"
                              className="flex-1 py-1.5 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-[11px] rounded-xl text-center cursor-pointer flex items-center justify-center gap-1"
                            >
                              <Phone className="w-3 h-3 text-emerald-500" />
                              <span>ولي الأمر</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: Announcements management */}
        {tab === 'announcements' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left form column */}
            <div className="bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-md h-fit">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg border-b pb-2 mb-4">نشر إعلان جديد</h3>
              
              <form onSubmit={handleCreateAnnouncement} className="space-y-4 text-right">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">عنوان الإعلان *</label>
                  <input
                    type="text"
                    required
                    value={annTitle}
                    onChange={(e) => setAnnTitle(e.target.value)}
                    placeholder="مثال: تنويه بخصوص عطلة عيد الأضحى"
                    className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">الصف المستهدف *</label>
                  <select
                    value={annGrade}
                    onChange={(e) => setAnnGrade(e.target.value as any)}
                    className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs outline-none"
                  >
                    <option value="all">جميع المراحل والطلاب (العام)</option>
                    {Object.entries(GRADE_LABELS).map(([g, l]) => (
                      <option key={g} value={g}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">محتوى ونص الإعلان بالتفصيل *</label>
                  <textarea
                    rows={4}
                    required
                    value={annContent}
                    onChange={(e) => setAnnContent(e.target.value)}
                    placeholder="اكتب تفاصيل الإعلان هنا..."
                    className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow cursor-pointer"
                >
                  نشر وإرسال الإعلان للطلاب
                </button>
              </form>
            </div>

            {/* Right announcements history column */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-md">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg mb-6">سجل الإعلانات السابقة</h3>
              
              {announcements.length === 0 ? (
                <p className="text-slate-400 text-xs text-center py-12">لم يتم نشر أي إعلانات حتى الآن.</p>
              ) : (
                <div className="space-y-4">
                  {announcements.map((ann) => (
                    <div
                      key={ann.id}
                      className="p-5 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-800 flex justify-between items-start gap-4"
                    >
                      <div className="space-y-1.5 text-right">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm leading-tight">{ann.title}</h4>
                          <span className="text-[9px] px-2 py-0.5 bg-blue-50 dark:bg-blue-950/20 text-blue-600 rounded-full font-bold">
                            {ann.grade === 'all' ? 'عام للجميع' : GRADE_LABELS[ann.grade]}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 whitespace-pre-line leading-relaxed">{ann.content}</p>
                        <span className="text-[10px] text-slate-400 select-none block">
                          نشر بتاريخ: {new Date(ann.createdAt).toLocaleDateString('ar-EG')}
                        </span>
                      </div>
                      <button
                        onClick={async () => {
                          if (window.confirm('هل تريد حذف هذا الإعلان؟')) {
                            await deleteDoc(doc(db, 'announcements', ann.id));
                            addToast('تم حذف الإعلان.', 'success');
                            fetchAnnouncements();
                          }
                        }}
                        className="p-1.5 text-rose-500 hover:bg-rose-100 rounded-lg shrink-0 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
