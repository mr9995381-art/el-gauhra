import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../firebase';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  addDoc,
  getDoc,
  deleteDoc,
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import {
  Course,
  Unit,
  Lesson,
  Test,
  TestResult,
  UserProfile,
  Attachment
} from '../types';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
  Play,
  FileText,
  HelpCircle,
  Download,
  Eye,
  MessageSquare,
  Bookmark,
  Share2,
  Maximize2,
  Minimize2,
  Award,
  RotateCcw,
  Check,
  X,
  Search,
  BookOpen,
  Clock,
  Sparkles,
  ShieldCheck,
  Send,
  Trash2,
  Menu,
  ChevronDown,
  ChevronUp,
  Volume2,
  Lightbulb,
  GraduationCap
} from 'lucide-react';

export interface CoursePlayerProps {
  courseId: string;
  initialUnitIndex?: number;
  initialLessonIndex?: number;
  initialLessonId?: string;
  userProfile: UserProfile;
  addToast: (msg: string, type: 'success' | 'error' | 'info') => void;
  onBack: () => void;
}

interface LessonComment {
  id: string;
  lessonId: string;
  studentId: string;
  studentName: string;
  text: string;
  createdAt: string;
  reply?: string;
  replyAuthor?: string;
  likes?: number;
}

interface StudentNote {
  id: string;
  lessonId: string;
  studentId: string;
  content: string;
  createdAt: string;
}

export default function CoursePlayer({
  courseId,
  initialUnitIndex = 0,
  initialLessonIndex = 0,
  initialLessonId,
  userProfile,
  addToast,
  onBack,
}: CoursePlayerProps) {
  // Core Data
  const [course, setCourse] = useState<Course | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  // Active Navigation
  const [activeUnitId, setActiveUnitId] = useState<string>('');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  // Sidebar controls
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarFilter, setSidebarFilter] = useState<'all' | 'completed' | 'uncompleted'>('all');
  const [expandedUnits, setExpandedUnits] = useState<Record<string, boolean>>({});

  // Theater / Focus Mode
  const [theaterMode, setTheaterMode] = useState(false);

  // Tabs: overview | quiz | files | qa | notes
  const [activeTab, setActiveTab] = useState<'overview' | 'quiz' | 'files' | 'qa' | 'notes'>('overview');

  // Student progress
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);

  // Quiz State for current lesson
  const [currentTest, setCurrentTest] = useState<Test | null>(null);
  const [testAnswers, setTestAnswers] = useState<Record<string, string>>({});
  const [testScore, setTestScore] = useState<number | null>(null);
  const [testSubmitting, setTestSubmitting] = useState(false);
  const [testResultReview, setTestResultReview] = useState<TestResult | null>(null);

  // Q&A Comments State
  const [comments, setComments] = useState<LessonComment[]>([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  // Private Notes State
  const [notes, setNotes] = useState<StudentNote[]>([]);
  const [newNoteText, setNewNoteText] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  // Document preview modal
  const [previewAttachment, setPreviewAttachment] = useState<Attachment | null>(null);

  // Watermark positioning effect
  const [watermarkPos, setWatermarkPos] = useState({ top: '15%', right: '15%' });

  // Helper to extract YouTube ID
  const getYouTubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Watermark floating animation across the video player
  useEffect(() => {
    const positions = [
      { top: '12%', right: '12%' },
      { top: '75%', right: '15%' },
      { top: '20%', right: '65%' },
      { top: '70%', right: '60%' },
      { top: '45%', right: '35%' },
    ];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % positions.length;
      setWatermarkPos(positions[idx]);
    }, 9000);
    return () => clearInterval(interval);
  }, []);

  // Sync URL hash with current course, unit, lesson
  const updateUrlParams = (unitIdx: number, lessonIdx: number, lId: string) => {
    const params = new URLSearchParams();
    params.set('courseId', courseId);
    params.set('unit', unitIdx.toString());
    params.set('lesson', lessonIdx.toString());
    params.set('lessonId', lId);
    window.location.hash = `course_player?${params.toString()}`;
  };

  // Fetch Course, Units, and Lessons
  useEffect(() => {
    const fetchCourseData = async () => {
      setLoading(true);
      try {
        // 1. Fetch Course
        const cRef = doc(db, 'courses', courseId);
        const cSnap = await getDoc(cRef);
        if (cSnap.exists()) {
          setCourse({ id: cSnap.id, ...cSnap.data() } as Course);
        }

        // 2. Fetch Units
        const uSnap = await getDocs(
          query(
            collection(db, 'units'),
            where('courseId', '==', courseId),
            orderBy('createdAt', 'asc')
          )
        );
        const uList: Unit[] = [];
        uSnap.forEach((d) => uList.push({ id: d.id, ...d.data() } as Unit));
        setUnits(uList);

        // Expand all units by default
        const expandMap: Record<string, boolean> = {};
        uList.forEach((u) => {
          expandMap[u.id] = true;
        });
        setExpandedUnits(expandMap);

        // 3. Fetch Lessons
        const lSnap = await getDocs(
          query(
            collection(db, 'lessons'),
            where('courseId', '==', courseId),
            orderBy('createdAt', 'asc')
          )
        );
        const lList: Lesson[] = [];
        lSnap.forEach((d) => lList.push({ id: d.id, ...d.data() } as Lesson));
        setLessons(lList);

        // 4. Fetch Student Progress
        const pSnap = await getDocs(
          query(collection(db, 'studentProgress'), where('studentId', '==', userProfile.uid))
        );
        const completedIds: string[] = [];
        pSnap.forEach((d) => {
          if (d.data().completed !== false) {
            completedIds.push(d.data().lessonId);
          }
        });
        setCompletedLessonIds(completedIds);

        // 5. Determine Initial Lesson
        if (lList.length > 0) {
          let targetLesson: Lesson | undefined;
          if (initialLessonId) {
            targetLesson = lList.find((l) => l.id === initialLessonId);
          }
          if (!targetLesson && uList[initialUnitIndex]) {
            const targetUnit = uList[initialUnitIndex];
            const unitLessons = lList.filter((l) => l.unitId === targetUnit.id);
            targetLesson = unitLessons[initialLessonIndex] || unitLessons[0];
          }
          if (!targetLesson) {
            targetLesson = lList[0];
          }

          setActiveLesson(targetLesson);
          setActiveUnitId(targetLesson.unitId);
        }
      } catch (err) {
        console.error('Error fetching course player data:', err);
        addToast('حدث خطأ أثناء تحميل محتويات مشغل الكورس.', 'error');
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourseData();
    }
  }, [courseId, userProfile.uid]);

  // When active lesson changes, fetch its Test, Comments, and Notes
  useEffect(() => {
    if (!activeLesson) return;

    // Reset quiz state
    setCurrentTest(null);
    setTestAnswers({});
    setTestScore(null);
    setTestResultReview(null);

    // Fetch test for this lesson
    const fetchLessonTest = async () => {
      try {
        const testSnap = await getDocs(
          query(collection(db, 'tests'), where('lessonId', '==', activeLesson.id))
        );
        if (!testSnap.empty) {
          const tDoc = testSnap.docs[0];
          const testData = { id: tDoc.id, ...tDoc.data() } as Test;
          setCurrentTest(testData);

          // Check if student already solved this test
          const resSnap = await getDocs(
            query(
              collection(db, 'testResults'),
              where('studentId', '==', userProfile.uid),
              where('testId', '==', testData.id)
            )
          );
          if (!resSnap.empty) {
            const pastResult = { id: resSnap.docs[0].id, ...resSnap.docs[0].data() } as TestResult;
            setTestScore(pastResult.score);
            setTestResultReview(pastResult);
            if (pastResult.answers) {
              setTestAnswers(pastResult.answers);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching test:', err);
      }
    };

    // Listen to lesson comments
    const commentsQuery = query(
      collection(db, 'lessonComments'),
      where('lessonId', '==', activeLesson.id),
      orderBy('createdAt', 'desc')
    );
    const unsubComments = onSnapshot(commentsQuery, (snapshot) => {
      const cList: LessonComment[] = [];
      snapshot.forEach((d) => cList.push({ id: d.id, ...d.data() } as LessonComment));
      setComments(cList);
    });

    // Listen to student private notes
    const notesQuery = query(
      collection(db, 'studentNotes'),
      where('lessonId', '==', activeLesson.id),
      where('studentId', '==', userProfile.uid),
      orderBy('createdAt', 'desc')
    );
    const unsubNotes = onSnapshot(notesQuery, (snapshot) => {
      const nList: StudentNote[] = [];
      snapshot.forEach((d) => nList.push({ id: d.id, ...d.data() } as StudentNote));
      setNotes(nList);
    });

    fetchLessonTest();

    return () => {
      unsubComments();
      unsubNotes();
    };
  }, [activeLesson?.id, userProfile.uid]);

  // Calculate overall progress
  const progressPercent = useMemo(() => {
    if (lessons.length === 0) return 0;
    const completedCount = lessons.filter((l) => completedLessonIds.includes(l.id)).length;
    return Math.round((completedCount / lessons.length) * 100);
  }, [lessons, completedLessonIds]);

  // Find current index in full lessons list
  const currentLessonIndex = useMemo(() => {
    if (!activeLesson) return -1;
    return lessons.findIndex((l) => l.id === activeLesson.id);
  }, [activeLesson, lessons]);

  const prevLesson = currentLessonIndex > 0 ? lessons[currentLessonIndex - 1] : null;
  const nextLesson = currentLessonIndex < lessons.length - 1 ? lessons[currentLessonIndex + 1] : null;

  // Change active lesson handler
  const handleSelectLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setActiveUnitId(lesson.unitId);

    // Ensure parent unit is expanded
    setExpandedUnits((prev) => ({ ...prev, [lesson.unitId]: true }));

    // Find unit index and lesson index inside that unit
    const unitIdx = units.findIndex((u) => u.id === lesson.unitId);
    const unitLessons = lessons.filter((l) => l.unitId === lesson.unitId);
    const lessonIdx = unitLessons.findIndex((l) => l.id === lesson.id);
    updateUrlParams(unitIdx >= 0 ? unitIdx : 0, lessonIdx >= 0 ? lessonIdx : 0, lesson.id);

    // Scroll to player top on mobile
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toggle unit expansion
  const toggleUnitExpand = (uId: string) => {
    setExpandedUnits((prev) => ({ ...prev, [uId]: !prev[uId] }));
  };

  // Toggle completion
  const handleToggleComplete = async (lessonId: string) => {
    const isCompleted = completedLessonIds.includes(lessonId);
    const docRef = doc(db, 'studentProgress', `${userProfile.uid}_${lessonId}`);
    try {
      if (isCompleted) {
        await setDoc(docRef, { completed: false, studentId: userProfile.uid, lessonId });
        setCompletedLessonIds((prev) => prev.filter((id) => id !== lessonId));
        addToast('تم إلغاء علامة إكمال الدرس.', 'info');
      } else {
        await setDoc(docRef, {
          completed: true,
          studentId: userProfile.uid,
          lessonId,
          completedAt: new Date().toISOString(),
        });
        setCompletedLessonIds((prev) => [...prev, lessonId]);
        addToast('أحسنت! تم تحديد الدرس كـ مكتمل بنجاح.', 'success');
      }
    } catch (err) {
      console.error(err);
      addToast('تعذر تحديث حالة الإكمال.', 'error');
    }
  };

  // Complete and advance to next lesson
  const handleCompleteAndNext = async () => {
    if (!activeLesson) return;
    if (!completedLessonIds.includes(activeLesson.id)) {
      await handleToggleComplete(activeLesson.id);
    }
    if (nextLesson) {
      handleSelectLesson(nextLesson);
      addToast(`تم الانتقال إلى: ${nextLesson.title}`, 'info');
    } else {
      addToast('تهانينا! لقد أتممت جميع دروس هذا الكورس بالكامل!', 'success');
    }
  };

  // Submit Interactive Quiz
  const handleSubmitTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTest || !activeLesson) return;

    // Validate all questions answered
    const unanswered = currentTest.questions.filter((q) => !testAnswers[q.id]);
    if (unanswered.length > 0) {
      addToast('يرجى الإجابة على جميع أسئلة الواجب أولاً قبل الإرسال.', 'error');
      return;
    }

    setTestSubmitting(true);
    let calculatedScore = 0;
    currentTest.questions.forEach((q) => {
      const studentAns = (testAnswers[q.id] || '').trim().toLowerCase();
      const correctAns = q.correctAnswer.trim().toLowerCase();
      if (studentAns === correctAns) {
        calculatedScore++;
      }
    });

    try {
      const resultData: Omit<TestResult, 'id'> = {
        studentId: userProfile.uid,
        studentName: userProfile.name,
        testId: currentTest.id,
        testTitle: currentTest.title,
        score: calculatedScore,
        totalQuestions: currentTest.questions.length,
        solvedAt: new Date().toISOString(),
        answers: testAnswers,
      };

      const docRef = await addDoc(collection(db, 'testResults'), resultData);
      setTestScore(calculatedScore);
      setTestResultReview({ id: docRef.id, ...resultData });

      // Automatically mark lesson as completed if student passes
      if (calculatedScore >= Math.ceil(currentTest.questions.length / 2)) {
        if (!completedLessonIds.includes(activeLesson.id)) {
          handleToggleComplete(activeLesson.id);
        }
      }

      addToast(`تم تصحيح الواجب بنجاح! نتيجتك: ${calculatedScore} من ${currentTest.questions.length}`, 'success');
    } catch (err) {
      console.error(err);
      addToast('حدث خطأ أثناء حفظ نتيجة الاختبار.', 'error');
    } finally {
      setTestSubmitting(false);
    }
  };

  // Submit new Q&A comment
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !activeLesson) return;

    setSubmittingComment(true);
    try {
      const commentData: Omit<LessonComment, 'id'> = {
        lessonId: activeLesson.id,
        studentId: userProfile.uid,
        studentName: userProfile.name,
        text: newCommentText.trim(),
        createdAt: new Date().toISOString(),
        likes: 0,
      };
      await addDoc(collection(db, 'lessonComments'), commentData);
      setNewCommentText('');
      addToast('تم نشر سؤالك بنجاح! سيقوم المستر بالإجابة عليه قريباً.', 'success');
    } catch (err) {
      console.error(err);
      addToast('تعذر إرسال السؤال.', 'error');
    } finally {
      setSubmittingComment(false);
    }
  };

  // Save private note
  const handleSaveNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim() || !activeLesson) return;

    setSavingNote(true);
    try {
      const noteData: Omit<StudentNote, 'id'> = {
        lessonId: activeLesson.id,
        studentId: userProfile.uid,
        content: newNoteText.trim(),
        createdAt: new Date().toISOString(),
      };
      await addDoc(collection(db, 'studentNotes'), noteData);
      setNewNoteText('');
      addToast('تم حفظ ملاحظتك الشخصية بنجاح.', 'success');
    } catch (err) {
      console.error(err);
      addToast('تعذر حفظ الملاحظة.', 'error');
    } finally {
      setSavingNote(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await deleteDoc(doc(db, 'studentNotes', noteId));
      addToast('تم حذف الملاحظة.', 'info');
    } catch (err) {
      console.error(err);
    }
  };

  // Filter lessons in sidebar
  const filteredLessons = useMemo(() => {
    return lessons.filter((l) => {
      const matchesSearch =
        l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (l.description && l.description.toLowerCase().includes(searchQuery.toLowerCase()));
      if (!matchesSearch) return false;

      const isDone = completedLessonIds.includes(l.id);
      if (sidebarFilter === 'completed') return isDone;
      if (sidebarFilter === 'uncompleted') return !isDone;
      return true;
    });
  }, [lessons, searchQuery, sidebarFilter, completedLessonIds]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white px-4" dir="rtl">
        <div className="relative mb-6">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-2xl animate-pulse">
            AS
          </div>
          <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500"></span>
          </span>
        </div>
        <h2 className="text-xl font-bold mb-2">جاري تجهيز مشغل الحصة والكورس...</h2>
        <p className="text-xs text-slate-400">منصة مستر عبدالله سيد التعليمية • خبير اللغة الإنجليزية</p>
      </div>
    );
  }

  if (!course || lessons.length === 0 || !activeLesson) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-6" dir="rtl">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-4">
          <BookOpen className="w-12 h-12 text-blue-500 mx-auto" />
          <h2 className="text-xl font-bold">لا يوجد محتوى متاح حالياً في هذا الكورس</h2>
          <p className="text-xs text-slate-400">لم يتم إضافة دروس أو وحدات نشطة في هذا المساق بعد.</p>
          <button
            onClick={onBack}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all cursor-pointer"
          >
            الرجوع إلى لوحة الكورسات
          </button>
        </div>
      </div>
    );
  }

  const activeUnit = units.find((u) => u.id === activeLesson.unitId);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none overflow-x-hidden" dir="rtl">
      
      {/* 1. TOP HEADER - COURSE PLAYER NAVBAR */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        
        {/* Right side: Exit button & Breadcrumbs */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer border border-slate-700/60"
            title="الرجوع إلى الكورسات"
          >
            <ArrowRight className="w-4 h-4" />
            <span className="hidden sm:inline">الكورسات</span>
          </button>

          <div className="h-5 w-px bg-slate-800 shrink-0 hidden sm:block"></div>

          {/* Breadcrumb info */}
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[11px] text-blue-400 font-semibold truncate">
              <span className="truncate">{course.title}</span>
              {activeUnit && (
                <>
                  <span className="text-slate-600">/</span>
                  <span className="text-slate-400 truncate">{activeUnit.title}</span>
                </>
              )}
            </div>
            <h1 className="text-xs sm:text-sm font-black text-white truncate max-w-[240px] sm:max-w-md lg:max-w-xl">
              {activeLesson.title}
            </h1>
          </div>
        </div>

        {/* Center: Overall Course Progress indicator */}
        <div className="hidden md:flex items-center gap-3 bg-slate-950/60 border border-slate-800/80 px-4 py-1.5 rounded-full">
          <div className="flex flex-col text-right">
            <span className="text-[10px] text-slate-400 font-medium">التقدم العام بالدورة</span>
            <span className="text-xs font-black text-emerald-400 leading-tight">
              {progressPercent}% مكتمل
            </span>
          </div>
          <div className="w-24 bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-l from-emerald-400 to-blue-500 h-full transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <span className="text-[10px] text-slate-400 font-bold">
            {completedLessonIds.length}/{lessons.length}
          </span>
        </div>

        {/* Left side: Navigation arrows, Focus Mode, and Sidebar toggle */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* Previous Lesson Button */}
          <button
            onClick={() => prevLesson && handleSelectLesson(prevLesson)}
            disabled={!prevLesson}
            className="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-200 rounded-xl transition-all border border-slate-700/60 cursor-pointer"
            title={prevLesson ? `الدرس السابق: ${prevLesson.title}` : 'لا يوجد درس سابق'}
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Next Lesson Button */}
          <button
            onClick={() => nextLesson && handleSelectLesson(nextLesson)}
            disabled={!nextLesson}
            className="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-200 rounded-xl transition-all border border-slate-700/60 cursor-pointer"
            title={nextLesson ? `الدرس التالي: ${nextLesson.title}` : 'لا يوجد درس تالٍ'}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Theater / Focus mode toggle */}
          <button
            onClick={() => setTheaterMode(!theaterMode)}
            className={`p-2 rounded-xl border transition-all cursor-pointer hidden lg:block ${
              theaterMode
                ? 'bg-blue-600 border-blue-500 text-white'
                : 'bg-slate-800 border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
            title={theaterMode ? 'إلغاء وضع المسرح والتركيز' : 'وضع المسرح والتركيز'}
          >
            {theaterMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Toggle Sidebar Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              sidebarOpen
                ? 'bg-blue-600/20 border-blue-500/60 text-blue-400'
                : 'bg-slate-800 border-slate-700/60 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Menu className="w-4 h-4" />
            <span className="hidden sm:inline">فهرس المحتوى</span>
          </button>

        </div>
      </header>

      {/* 2. MAIN PLAYER BODY & SIDEBAR SPLIT */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">

        {/* A. PRIMARY CONTENT AREA (VIDEO + ACTION BAR + TABS) */}
        <div className={`flex-1 overflow-y-auto transition-all duration-300 ${theaterMode ? 'w-full' : ''}`}>
          
          {/* VIDEO PLAYER STAGE */}
          <div className="bg-black relative group w-full flex justify-center items-center">
            
            {/* 16:9 Aspect Video Wrapper */}
            <div className="w-full max-w-6xl aspect-video relative bg-slate-950 overflow-hidden shadow-2xl">
              
              {getYouTubeId(activeLesson.youtubeUrl) ? (
                <iframe
                  src={`https://www.youtube.com/embed/${getYouTubeId(activeLesson.youtubeUrl)}?autoplay=0&rel=0&modestbranding=1`}
                  title={activeLesson.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full object-cover z-10"
                ></iframe>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-slate-900 text-slate-400 space-y-3 z-10">
                  <Play className="w-16 h-16 text-blue-500/40 animate-pulse" />
                  <p className="text-sm font-bold text-slate-300">رابط الفيديو غير صالح أو غير مرفوع عبر يوتيوب.</p>
                  <p className="text-xs text-slate-500">{activeLesson.youtubeUrl || 'لم يتم إرفاق رابط'}</p>
                </div>
              )}

              {/* DYNAMIC ANTI-THEFT FLOATING WATERMARK (منصة مستر عبدالله سيد) */}
              <div
                className="absolute z-20 pointer-events-none transition-all duration-1000 ease-in-out px-3 py-1.5 rounded-xl bg-slate-950/40 backdrop-blur-[2px] border border-white/10 text-white/40 text-[11px] font-mono tracking-wider flex items-center gap-1.5 select-none shadow-sm"
                style={{ top: watermarkPos.top, right: watermarkPos.right }}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400/50" />
                <span>{userProfile.name} • {userProfile.phone || userProfile.uid.slice(0, 8)}</span>
              </div>

            </div>
          </div>

          {/* LESSON ACTION BAR (DIRECTLY BELOW VIDEO) */}
          <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
            
            {/* Right: Lesson completion toggle */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleToggleComplete(activeLesson.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all shadow-md cursor-pointer ${
                  completedLessonIds.includes(activeLesson.id)
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700'
                }`}
              >
                {completedLessonIds.includes(activeLesson.id) ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>تم إكمال الدرس ✓</span>
                  </>
                ) : (
                  <>
                    <Circle className="w-4 h-4 text-slate-400" />
                    <span>تحديد الدرس كمكتمل</span>
                  </>
                )}
              </button>

              <span className="text-[11px] text-slate-400 hidden sm:inline">
                {completedLessonIds.includes(activeLesson.id) ? 'تم تسجيل حضورك في هذا الدرس' : 'اضغط للتأكيد بعد المشاهدة'}
              </span>
            </div>

            {/* Left: Next & Advance button */}
            <div className="flex items-center gap-2">
              {prevLesson && (
                <button
                  onClick={() => handleSelectLesson(prevLesson)}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all border border-slate-700 flex items-center gap-1.5 cursor-pointer"
                  title={prevLesson.title}
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span>الدرس السابق</span>
                </button>
              )}

              {nextLesson ? (
                <button
                  onClick={handleCompleteAndNext}
                  className="px-4 py-2 bg-gradient-to-l from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-black transition-all shadow-lg flex items-center gap-1.5 cursor-pointer"
                  title={nextLesson.title}
                >
                  <span>إنهاء ومتابعة للدرس التالي</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => addToast('تهانينا! لقد وصلت لنهاية محتوى هذا الكورس بالكامل!', 'success')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black transition-all shadow-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <Award className="w-4 h-4" />
                  <span>اكتمل الكورس بالكامل</span>
                </button>
              )}
            </div>

          </div>

          {/* TAB NAVIGATION HEADER (NAHJ AL-AZHAR 5 TABS) */}
          <div className="bg-slate-900/60 border-b border-slate-800 px-4 sm:px-8 flex items-center gap-1 overflow-x-auto no-scrollbar">
            
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 py-3 px-4 border-b-2 text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-400 bg-blue-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>نظرة عامة وشرح الدرس</span>
            </button>

            <button
              onClick={() => setActiveTab('quiz')}
              className={`flex items-center gap-2 py-3 px-4 border-b-2 text-xs font-bold transition-all whitespace-nowrap cursor-pointer relative ${
                activeTab === 'quiz'
                  ? 'border-blue-500 text-blue-400 bg-blue-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>الواجب والاختبار التفاعلي</span>
              {currentTest && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('files')}
              className={`flex items-center gap-2 py-3 px-4 border-b-2 text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'files'
                  ? 'border-blue-500 text-blue-400 bg-blue-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>المذكرات والملفات المرفقة ({activeLesson.attachments?.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab('qa')}
              className={`flex items-center gap-2 py-3 px-4 border-b-2 text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'qa'
                  ? 'border-blue-500 text-blue-400 bg-blue-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>أسئلة واستفسارات الحصة ({comments.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('notes')}
              className={`flex items-center gap-2 py-3 px-4 border-b-2 text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'notes'
                  ? 'border-blue-500 text-blue-400 bg-blue-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>ملاحظاتي الخاصة ({notes.length})</span>
            </button>

          </div>

          {/* TAB CONTENTS CONTAINER */}
          <div className="p-4 sm:p-8 max-w-5xl">
            
            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                
                {/* Header Information */}
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="px-3 py-1 bg-blue-950/60 border border-blue-500/30 text-blue-400 text-xs font-bold rounded-full">
                      {activeUnit?.title || 'الوحدة الحالية'}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      تاريخ النشر: {new Date(activeLesson.createdAt).toLocaleDateString('ar-EG')}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black text-white leading-snug">
                    {activeLesson.title}
                  </h2>

                  {/* Teacher signature banner */}
                  <div className="flex items-center gap-3 pt-3 border-t border-slate-800/80">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-black text-white text-sm shadow-md">
                      AS
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">مستر عبدالله سيد</h4>
                      <p className="text-[11px] text-slate-400">خبير اللغة الإنجليزية • منصة مستر عبدالله سيد التعليمية</p>
                    </div>
                  </div>
                </div>

                {/* Lesson Description */}
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
                  <h3 className="text-sm font-bold text-blue-400 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" />
                    <span>موضوع الشرح وتفاصيل الدرس:</span>
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                    {activeLesson.description || 'يقدم هذا الدرس شرحاً وافياً وتطبيقاً عملياً على أهم النقاط والقواعد والمفردات المقررة مع نماذج أسئلة امتحانات وتدريبات تفاعلية.'}
                  </p>
                </div>

                {/* Learning Outcomes */}
                <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-3">
                  <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    <span>مخرجات التعلم وأهداف الحصة:</span>
                  </h3>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-300 list-disc list-inside">
                    <li>فهم واستيعاب المفاهيم والقواعد الأساسية المشروحة في الفيديو بشكل تطبيقي.</li>
                    <li>حل تدريبات ونماذج أسئلة الامتحانات المحاكية لمنهج الشهادة الثانوية والإعدادية.</li>
                    <li>تحميل ومراجعة مذكرة الحصة المرفقة وإنجاز الاختبار والواجب التفاعلي.</li>
                  </ul>
                </div>

              </div>
            )}

            {/* TAB 2: INTERACTIVE QUIZ & HOMEWORK */}
            {activeTab === 'quiz' && (
              <div className="space-y-6">
                {!currentTest ? (
                  <div className="bg-slate-900 border border-slate-800 p-12 rounded-2xl text-center space-y-4">
                    <HelpCircle className="w-12 h-12 text-slate-600 mx-auto" />
                    <h3 className="text-lg font-bold text-white">لا يوجد اختبار أو واجب تفاعلي مخصص لهذا الدرس حالياً</h3>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                      يمكنك مراجعة المذكرات المرفقة، أو طرح أسئلتك في تبويب النقاشات، أو الانتقال للدرس التالي.
                    </p>
                  </div>
                ) : testScore !== null && testResultReview ? (
                  /* RESULTS & CORRECTION REVIEW CARD */
                  <div className="space-y-6">
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                        <Award className="w-8 h-8" />
                      </div>
                      <h3 className="text-lg font-black text-white">تم تصحيح الواجب بنجاح!</h3>
                      <div className="text-4xl font-black text-emerald-400 font-mono">
                        {testScore} / {currentTest.questions.length}
                      </div>
                      <p className="text-xs text-slate-400">
                        {testScore === currentTest.questions.length
                          ? 'ممتاز جداً! الدرجة النهائية وإتقان تام للمفاهيم.'
                          : testScore >= Math.ceil(currentTest.questions.length / 2)
                          ? 'أحسنت! أداء جيد، راجع الأسئلة الخاطئة أدناه للوصول للدرجة النهائية.'
                          : 'تحتاج إلى إعادة مراجعة الفيديو والتدريب مجدداً.'}
                      </p>
                      <button
                        onClick={() => {
                          setTestScore(null);
                          setTestResultReview(null);
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-xl text-xs font-bold transition-all cursor-pointer border border-slate-700"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>إعادة محاولة حل الاختبار</span>
                      </button>
                    </div>

                    {/* Question by question model answer review */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-white">مراجعة الإجابات والحلول النموذجية:</h4>
                      {currentTest.questions.map((q, idx) => {
                        const studentAns = testAnswers[q.id] || '';
                        const isCorrect = studentAns.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
                        return (
                          <div
                            key={q.id}
                            className={`p-5 rounded-2xl border transition-all space-y-3 ${
                              isCorrect
                                ? 'bg-emerald-950/20 border-emerald-800/40'
                                : 'bg-rose-950/20 border-rose-800/40'
                            }`}
                          >
                            <div className="flex items-center justify-between text-xs font-bold">
                              <span className="text-slate-400">سؤال {idx + 1}</span>
                              <span className={isCorrect ? 'text-emerald-400' : 'text-rose-400'}>
                                {isCorrect ? 'إجابة صحيحة ✓' : 'إجابة خاطئة ✗'}
                              </span>
                            </div>
                            <p className="text-sm font-bold text-white">{q.text}</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                                <span className="text-slate-400 block text-[11px]">إجابتك:</span>
                                <span className={isCorrect ? 'text-emerald-300 font-bold' : 'text-rose-300 font-bold'}>
                                  {studentAns || '(لم تجب)'}
                                </span>
                              </div>
                              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                                <span className="text-slate-400 block text-[11px]">الإجابة النموذجية الصحيحة:</span>
                                <span className="text-emerald-400 font-bold">{q.correctAnswer}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  /* QUIZ SOLVING FORM */
                  <form onSubmit={handleSubmitTest} className="space-y-6">
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-bold text-white">{currentTest.title}</h3>
                        <p className="text-xs text-slate-400 mt-1">عدد الأسئلة: {currentTest.questions.length} أسئلة</p>
                      </div>
                      <span className="px-3 py-1 bg-amber-500/20 text-amber-300 text-xs font-bold rounded-xl border border-amber-500/30">
                        واجب تفاعلي
                      </span>
                    </div>

                    <div className="space-y-5">
                      {currentTest.questions.map((q, qIdx) => (
                        <div
                          key={q.id}
                          className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-sm"
                        >
                          <div className="flex items-center justify-between text-xs text-slate-400">
                            <span className="font-bold text-blue-400">سؤال {qIdx + 1} من {currentTest.questions.length}</span>
                            <span>
                              {q.type === 'mcq'
                                ? 'اختيار من متعدد'
                                : q.type === 'true_false'
                                ? 'صح أو خطأ'
                                : 'أكمل الفراغ'}
                            </span>
                          </div>

                          <p className="text-sm font-bold text-white leading-relaxed">{q.text}</p>

                          {/* MCQ options */}
                          {q.type === 'mcq' && (
                            <div className="grid grid-cols-1 gap-2 pt-1">
                              {q.options.map((opt, optIdx) => (
                                <label
                                  key={optIdx}
                                  className={`flex items-center gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                                    testAnswers[q.id] === opt
                                      ? 'bg-blue-600/20 border-blue-500 text-blue-300 font-bold'
                                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
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
                                  <span className="w-4 h-4 rounded-full border border-slate-600 flex items-center justify-center shrink-0">
                                    {testAnswers[q.id] === opt && <span className="w-2 h-2 rounded-full bg-blue-400"></span>}
                                  </span>
                                  <span>{opt}</span>
                                </label>
                              ))}
                            </div>
                          )}

                          {/* True / False */}
                          {q.type === 'true_false' && (
                            <div className="grid grid-cols-2 gap-3 pt-1">
                              {['صح', 'خطأ'].map((opt) => (
                                <label
                                  key={opt}
                                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                                    testAnswers[q.id] === opt
                                      ? 'bg-blue-600/20 border-blue-500 text-blue-300 font-bold'
                                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
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

                          {/* Fill blanks */}
                          {q.type === 'complete' && (
                            <input
                              type="text"
                              value={testAnswers[q.id] || ''}
                              onChange={(e) => setTestAnswers({ ...testAnswers, [q.id]: e.target.value })}
                              placeholder="اكتب إجابتك هنا بدقة..."
                              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-blue-500"
                            />
                          )}

                        </div>
                      ))}
                    </div>

                    <button
                      type="submit"
                      disabled={testSubmitting}
                      className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-black text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {testSubmitting ? (
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      ) : (
                        'تسليم الواجب وتصحيح الإجابات فورياً'
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* TAB 3: ATTACHMENTS & BOOKLETS */}
            {activeTab === 'files' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">الملفات والمذكرات التابعة للحصة:</h3>
                  <span className="text-xs text-slate-400">صيغ قابلة للتحميل والطباعة</span>
                </div>

                {(!activeLesson.attachments || activeLesson.attachments.length === 0) ? (
                  <div className="bg-slate-900 border border-slate-800 p-10 rounded-2xl text-center text-slate-500 text-xs">
                    لا توجد ملفات أو مذكرات مرفقة بهذا الدرس حالياً.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {activeLesson.attachments.map((file, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between gap-4 hover:border-slate-700 transition-all"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="p-3 bg-blue-950/60 text-blue-400 border border-blue-500/30 rounded-xl shrink-0">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs sm:text-sm font-bold text-white truncate">{file.name}</h4>
                            <span className="text-[10px] text-slate-400 uppercase font-mono">{file.type}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {/* Preview button */}
                          <button
                            onClick={() => setPreviewAttachment(file)}
                            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-all border border-slate-700 cursor-pointer"
                            title="معاينة الملف"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Direct download button */}
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-md cursor-pointer"
                            title="تحميل الملف"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: Q&A COMMENTS DISCUSSION FORUM */}
            {activeTab === 'qa' && (
              <div className="space-y-6">
                
                {/* Submit question box */}
                <form onSubmit={handleAddComment} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
                  <h4 className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4" />
                    <span>اسأل المستر سؤالك حول هذا الدرس:</span>
                  </h4>
                  <textarea
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder="اكتب سؤالك أو النقطة التي تحتاج توضيحاً فيها بالتفصيل وسيقوم المستر أو المشرف بالرد عليك..."
                    rows={3}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-blue-500 resize-none leading-relaxed"
                  ></textarea>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={submittingComment || !newCommentText.trim()}
                      className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>إرسال السؤال</span>
                    </button>
                  </div>
                </form>

                {/* Questions List */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400">الأسئلة والنقاشات السابقة ({comments.length}):</h4>
                  {comments.length === 0 ? (
                    <div className="bg-slate-900/40 border border-slate-800/80 p-8 rounded-2xl text-center text-slate-500 text-xs">
                      كن أول من يطرح سؤالاً في هذه الحصة!
                    </div>
                  ) : (
                    comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-white flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-[10px]">
                              {comment.studentName.slice(0, 1)}
                            </span>
                            {comment.studentName}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {new Date(comment.createdAt).toLocaleDateString('ar-EG')}
                          </span>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pr-8 whitespace-pre-line">
                          {comment.text}
                        </p>

                        {/* Teacher Reply */}
                        {comment.reply && (
                          <div className="mr-6 p-3.5 bg-blue-950/40 border-r-2 border-blue-500 rounded-xl space-y-1.5">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>{comment.replyAuthor || 'إجابة مستر عبدالله سيد'}:</span>
                            </div>
                            <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">
                              {comment.reply}
                            </p>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>

              </div>
            )}

            {/* TAB 5: PRIVATE STUDY NOTES */}
            {activeTab === 'notes' && (
              <div className="space-y-6">
                
                {/* Note creation box */}
                <form onSubmit={handleSaveNote} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
                  <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <Bookmark className="w-4 h-4" />
                    <span>سجل ملاحظاتك وتلخيصك الشخصي لهذه الحصة:</span>
                  </h4>
                  <textarea
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="اكتب ملاحظة خاصة بك (لن يراها أحد غيرك)، تفيدك أثناء مراجعة ليلة الامتحان..."
                    rows={3}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-amber-500 resize-none leading-relaxed"
                  ></textarea>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={savingNote || !newNoteText.trim()}
                      className="px-5 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 text-xs font-black rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                      <span>حفظ الملاحظة</span>
                    </button>
                  </div>
                </form>

                {/* Notes List */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400">ملاحظاتك المسجلة ({notes.length}):</h4>
                  {notes.length === 0 ? (
                    <div className="bg-slate-900/40 border border-slate-800/80 p-8 rounded-2xl text-center text-slate-500 text-xs">
                      لم تسجل ملاحظات خاصة بك في هذه الحصة بعد.
                    </div>
                  ) : (
                    notes.map((note) => (
                      <div
                        key={note.id}
                        className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2 relative group"
                      >
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span>{new Date(note.createdAt).toLocaleString('ar-EG')}</span>
                          <button
                            onClick={() => handleDeleteNote(note.id)}
                            className="text-slate-500 hover:text-rose-400 transition-colors p-1 cursor-pointer"
                            title="حذف الملاحظة"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                          {note.content}
                        </p>
                      </div>
                    ))
                  )}
                </div>

              </div>
            )}

          </div>

        </div>

        {/* B. COURSE CONTENT DRAWER / SIDEBAR (فهرس وحدات ودروس الكورس) */}
        {sidebarOpen && (
          <aside className="w-full lg:w-96 bg-slate-900 border-t lg:border-t-0 lg:border-r border-slate-800 flex flex-col h-[500px] lg:h-auto lg:max-h-full shrink-0 z-30 shadow-2xl">
            
            {/* Sidebar Header & Search */}
            <div className="p-4 border-b border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-sm text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-400" />
                  <span>فهرس محتوى الكورس</span>
                </h3>
                <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md">
                  {completedLessonIds.length}/{lessons.length} مكتمل
                </span>
              </div>

              {/* Search input */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث في دروس ووحدات الكورس..."
                  className="w-full pl-3 pr-8 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-blue-500"
                />
              </div>

              {/* Filter chips */}
              <div className="flex gap-1.5 pt-1 text-[11px]">
                <button
                  onClick={() => setSidebarFilter('all')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    sidebarFilter === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  الكل ({lessons.length})
                </button>
                <button
                  onClick={() => setSidebarFilter('completed')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    sidebarFilter === 'completed'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  المكتمل ({completedLessonIds.length})
                </button>
                <button
                  onClick={() => setSidebarFilter('uncompleted')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    sidebarFilter === 'uncompleted'
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  المتبقي ({lessons.length - completedLessonIds.length})
                </button>
              </div>
            </div>

            {/* Units and Lessons List (Accordion) */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {units.map((unit, unitIdx) => {
                const unitLessons = filteredLessons.filter((l) => l.unitId === unit.id);
                if (searchQuery && unitLessons.length === 0) return null;

                const isExpanded = expandedUnits[unit.id] ?? true;
                const unitCompletedCount = unitLessons.filter((l) => completedLessonIds.includes(l.id)).length;

                return (
                  <div
                    key={unit.id}
                    className="bg-slate-950/60 rounded-2xl border border-slate-800/80 overflow-hidden"
                  >
                    {/* Unit Accordion Header */}
                    <button
                      onClick={() => toggleUnitExpand(unit.id)}
                      className="w-full p-3.5 bg-slate-800/50 hover:bg-slate-800 flex items-center justify-between text-right transition-colors cursor-pointer"
                    >
                      <div className="min-w-0 pr-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-blue-400 font-bold bg-blue-950 px-2 py-0.5 rounded">
                            الوحدة {unitIdx + 1}
                          </span>
                          <h4 className="text-xs font-bold text-white truncate">{unit.title}</h4>
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          {unitCompletedCount}/{unitLessons.length} درس مكتمل
                        </span>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                    </button>

                    {/* Unit Lessons */}
                    {isExpanded && (
                      <div className="divide-y divide-slate-800/50">
                        {unitLessons.length === 0 ? (
                          <div className="p-4 text-center text-xs text-slate-500">لا توجد دروس في هذه الوحدة.</div>
                        ) : (
                          unitLessons.map((lesson, lIdx) => {
                            const isCurrent = activeLesson.id === lesson.id;
                            const isDone = completedLessonIds.includes(lesson.id);

                            return (
                              <div
                                key={lesson.id}
                                onClick={() => handleSelectLesson(lesson)}
                                className={`p-3 flex items-start gap-3 transition-all cursor-pointer ${
                                  isCurrent
                                    ? 'bg-blue-600/20 border-r-4 border-blue-500'
                                    : 'hover:bg-slate-850 hover:bg-slate-800/30'
                                }`}
                              >
                                {/* Checkmark completion status */}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleComplete(lesson.id);
                                  }}
                                  className="mt-0.5 shrink-0 text-slate-500 hover:text-emerald-400 transition-colors"
                                  title={isDone ? 'مكتمل' : 'غير مكتمل'}
                                >
                                  {isDone ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                  ) : (
                                    <Circle className="w-4 h-4 text-slate-600" />
                                  )}
                                </button>

                                {/* Lesson Info */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-1">
                                    <h5
                                      className={`text-xs font-bold leading-snug line-clamp-2 ${
                                        isCurrent ? 'text-blue-300' : 'text-slate-200'
                                      }`}
                                    >
                                      {lesson.title}
                                    </h5>
                                    {isCurrent && (
                                      <span className="shrink-0 px-1.5 py-0.5 bg-blue-500 text-slate-950 text-[9px] font-black rounded">
                                        الحالي
                                      </span>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-1.5">
                                    <span className="flex items-center gap-1">
                                      <Play className="w-2.5 h-2.5 text-blue-400" />
                                      فيديو
                                    </span>
                                    {lesson.attachments && lesson.attachments.length > 0 && (
                                      <span className="flex items-center gap-1">
                                        <FileText className="w-2.5 h-2.5 text-amber-400" />
                                        {lesson.attachments.length} ملف
                                      </span>
                                    )}
                                  </div>
                                </div>
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

          </aside>
        )}

      </div>

      {/* 3. INLINE DOCUMENT PREVIEW MODAL */}
      {previewAttachment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn" dir="rtl">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-blue-400" />
                <h3 className="text-sm font-bold text-white truncate">{previewAttachment.name}</h3>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={previewAttachment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>تحميل المذكرة</span>
                </a>
                <button
                  onClick={() => setPreviewAttachment(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 bg-slate-950 p-2 overflow-hidden">
              <iframe
                src={previewAttachment.url}
                title={previewAttachment.name}
                className="w-full h-full rounded-2xl border border-slate-800"
              ></iframe>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
