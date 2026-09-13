import { useState, useEffect, FormEvent } from 'react';
import {
  Search,
  ShieldCheck,
  Award,
  BookOpen,
  Calendar,
  Phone,
  CheckCircle2,
  AlertCircle,
  FileText,
  Printer,
  Sparkles,
  UserCheck,
  Send,
  MessageSquare,
  Clock,
  ChevronLeft,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { StudentFollowupReport, GRADE_LABELS } from '../types';
import { searchStudentForParent, generateParentWhatsAppText } from '../lib/parentFollowup';

interface ParentPortalViewProps {
  initialQuery?: string;
  embedded?: boolean;
  onOpenAuth?: () => void;
}

export default function ParentPortalView({
  initialQuery = '',
  embedded = false,
  onOpenAuth,
}: ParentPortalViewProps) {
  const [queryInput, setQueryInput] = useState(initialQuery);
  const [isSearching, setIsSearching] = useState(false);
  const [report, setReport] = useState<StudentFollowupReport | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'exams' | 'notes'>('overview');

  const executeSearch = async (searchQuery: string) => {
    const q = searchQuery.trim();
    if (!q) {
      setSearchError('يرجى كتابة رقم هاتف الطالب أو ولي الأمر للاستعلام.');
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      const result = await searchStudentForParent(q);
      if (result) {
        setReport(result);
        setSearchError(null);
      } else {
        setReport(null);
        setSearchError(
          'لم يتم العثور على طالب مسجل بهذا الرقم أو الكود. يرجى التأكد من كتابة رقم الهاتف المسجل بالحساب بدقة، أو التواصل مع إدارة المنصة.'
        );
      }
    } catch (err) {
      console.error(err);
      setSearchError('حدث خطأ أثناء الاستعلام من قاعدة البيانات. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    executeSearch(queryInput);
  };

  useEffect(() => {
    if (initialQuery) {
      executeSearch(initialQuery);
    }
  }, [initialQuery]);

  const handlePrint = () => {
    window.print();
  };

  const handleSendWhatsApp = () => {
    if (!report) return;
    const phoneToUse = report.student.parentPhone || report.student.phone;
    const cleanPhone = phoneToUse.replace(/\D/g, '');
    const message = generateParentWhatsAppText(report);
    const encoded = encodeURIComponent(message);
    const targetUrl = cleanPhone
      ? `https://wa.me/2${cleanPhone}?text=${encoded}`
      : `https://wa.me/201102140676?text=${encoded}`;
    window.open(targetUrl, '_blank', 'noreferrer');
  };

  const getRatingBadge = (rating: string) => {
    switch (rating) {
      case 'excellent':
        return {
          label: 'طالب متميز ومتفوق (Full Mark)',
          bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
        };
      case 'very_good':
        return {
          label: 'مستوى طيب ومواظب',
          bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30',
        };
      case 'good':
        return {
          label: 'مستوى متوسط يحتاج تدريب',
          bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
        };
      default:
        return {
          label: 'يحتاج إلى متابعة واهتمام',
          bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30',
        };
    }
  };

  return (
    <div
      id="parent-tracking-section"
      className={`${
        embedded ? 'w-full' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14'
      }`}
      dir="rtl"
    >
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-[32px] p-6 sm:p-10 border border-blue-500/30 shadow-2xl mb-8">
        <div className="absolute top-0 left-0 -mt-8 -ml-8 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 -mb-8 -mr-8 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-400/20 text-amber-300 rounded-full text-xs font-black border border-amber-400/30 mb-4">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>منظومة المتابعة الفورية اللحظية • مستر عبدالله سيد</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black mb-3">
            بوابة متابعة ولي الأمر الفورية
          </h1>
          <p className="text-slate-300 text-xs sm:text-base leading-relaxed mb-6">
            استعلام حقيقي ومباشر من قاعدة بيانات المنصة. أدخل رقم هاتف الطالب أو ولي الأمر المسجل
            للاطلاع على كشف الدرجات التفصيلي، نسب مشاهدة الحصص، وملاحظات مستر عبدالله سيد الدورية.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={queryInput}
                  onChange={(e) => setQueryInput(e.target.value)}
                  placeholder="أدخل رقم هاتف الطالب أو رقم هاتف ولي الأمر..."
                  className="w-full pr-12 pl-4 py-3.5 sm:py-4 bg-slate-800/90 border border-slate-700 rounded-2xl text-white text-sm sm:text-base placeholder-slate-400 focus:outline-none focus:border-blue-400 shadow-inner"
                />
              </div>
              <button
                type="submit"
                disabled={isSearching}
                className="px-7 py-3.5 sm:py-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-2xl text-sm sm:text-base transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2 shrink-0"
              >
                {isSearching ? (
                  <>
                    <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                    <span>جاري الاستعلام...</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="w-5 h-5" />
                    <span>استعلام عن الطالب</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Search Error Alert */}
          {searchError && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs sm:text-sm flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold mb-1">تعذر العثور على سجل الطالب</p>
                <p className="text-slate-300 leading-relaxed">{searchError}</p>
                <div className="mt-2.5 flex items-center gap-2">
                  <a
                    href="https://wa.me/201102140676"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-all"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>تواصل مع الدعم الفني لمستر عبدالله</span>
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Real-time Student Followup Report Card */}
      <AnimatePresence>
        {report && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Student Header Profile Banner */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-600 to-indigo-800 rounded-2xl sm:rounded-3xl flex items-center justify-center text-white text-2xl sm:text-3xl font-black shadow-md border border-blue-400/30 shrink-0">
                    {report.student.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                        {report.student.name}
                      </h2>
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-bold border ${
                          getRatingBadge(report.behaviorRating).bg
                        }`}
                      >
                        {getRatingBadge(report.behaviorRating).label}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400">
                      {GRADE_LABELS[report.student.grade] || report.student.grade} • مادة اللغة الإنجليزية
                    </p>
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-2 text-xs text-slate-500 dark:text-slate-400">
                      <span>هاتف الطالب: <strong className="font-mono text-slate-700 dark:text-slate-300">{report.student.phone || 'غير مسجل'}</strong></span>
                      <span>•</span>
                      <span>هاتف ولي الأمر: <strong className="font-mono text-slate-700 dark:text-slate-300">{report.student.parentPhone || 'غير مسجل'}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Parent Action Buttons */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={handleSendWhatsApp}
                    className="flex-1 sm:flex-none px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>إرسال التقرير واتساب</span>
                  </button>
                  <button
                    onClick={handlePrint}
                    className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>طباعة التقرير</span>
                  </button>
                  <a
                    href="https://wa.me/201102140676"
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 text-blue-600 dark:text-blue-400 font-bold text-xs rounded-xl border border-blue-200 dark:border-blue-900 transition-all flex items-center gap-1.5"
                  >
                    <Phone className="w-4 h-4" />
                    <span>محادثة المستر</span>
                  </a>
                </div>
              </div>

              {/* Top KPI Metrics Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-6">
                <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-bold mb-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>نسبة الحضور والمشاهدة</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                      {report.attendanceRate}%
                    </span>
                    <span className="text-[11px] text-slate-400">
                      ({report.completedLessonsCount} حصة مكتملة)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full mt-2.5 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-700"
                      style={{ width: `${Math.min(100, report.attendanceRate)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-bold mb-1">
                    <Award className="w-4 h-4 text-blue-500" />
                    <span>متوسط درجات الامتحانات</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                      {report.averageScore}%
                    </span>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                      {report.averageScore >= 85 ? 'ممتاز' : report.averageScore >= 70 ? 'جيد جداً' : 'متوسط'}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full mt-2.5 overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all duration-700"
                      style={{ width: `${Math.min(100, report.averageScore)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-bold mb-1">
                    <FileText className="w-4 h-4 text-purple-500" />
                    <span>إجمالي الاختبارات</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                      {report.totalTestsCount}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      (تم اجتياز {report.passedCount})
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2">اختبارات دورية وكويزات شاملة</p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-bold mb-1">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>حالة الاشتراك الحالي</span>
                  </div>
                  <div>
                    <span
                      className={`text-sm sm:text-base font-black inline-block px-2.5 py-0.5 rounded-lg ${
                        report.status === 'active'
                          ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                          : 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                      }`}
                    >
                      {report.status === 'active' ? 'اشتراك مفعل ونشط' : 'الاشتراك بحاجة لتجديد'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">
                    {report.student.subscriptionExpiresAt
                      ? `ينتهي في: ${new Date(report.student.subscriptionExpiresAt).toLocaleDateString('ar-EG')}`
                      : 'تاريخ الانتهاء غير محدد'}
                  </p>
                </div>
              </div>
            </div>

            {/* Official Teacher Notes & Evaluation Box */}
            <div className="bg-gradient-to-l from-blue-50/70 via-indigo-50/40 to-white dark:from-slate-900 dark:via-blue-950/30 dark:to-slate-900 border border-blue-200 dark:border-blue-900/60 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center font-black">
                  AS
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    توجيهات وملاحظات مستر عبدالله سيد لولي الأمر
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    تقييم مباشر للأداء اللغوي والانضباط في المذاكرة وحل كبسولات الإنجليزي
                  </p>
                </div>
              </div>

              <div className="bg-white/80 dark:bg-slate-800/80 p-5 rounded-2xl border border-blue-100 dark:border-blue-900/40 text-slate-800 dark:text-slate-200 text-sm sm:text-base leading-relaxed">
                "{report.teacherNotes}"
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400 pt-2">
                <span>تحديث التقييم: يتم التحديث أسبوعياً بناءً على كويزات المراجعة ونسب الحضور</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  إشراف: مستر عبدالله سيد • 01102140676
                </span>
              </div>
            </div>

            {/* Detailed Exam & Test Results History */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                    سجل الاختبارات والكويزات المنجزة
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    كافة الامتحانات التي خاضها الطالب مع الدرجة وتاريخ الأداء
                  </p>
                </div>
                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold">
                  {report.testResults.length} امتحان
                </span>
              </div>

              {report.testResults.length === 0 ? (
                <div className="py-12 text-center text-slate-400 space-y-2">
                  <BookOpen className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600" />
                  <p className="text-sm font-bold">لم يقم الطالب بحل أي اختبارات حتى الآن.</p>
                  <p className="text-xs">
                    عندما يقوم الطالب بحل اختبار في مشغل الحصة أو لوحة التحكم، ستظهر درجاته هنا فوراً.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {report.testResults.map((test, idx) => {
                    const pct = test.totalQuestions > 0 ? Math.round((test.score / test.totalQuestions) * 100) : 0;
                    const isPassed = pct >= 50;

                    return (
                      <div
                        key={test.id || idx}
                        className="bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:border-blue-400/40"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-black">
                              {idx + 1}
                            </span>
                            <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                              {test.testTitle || 'اختبار مهارات اللغة الإنجليزية'}
                            </h4>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-400 mr-8">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>{new Date(test.solvedAt || Date.now()).toLocaleDateString('ar-EG')}</span>
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{new Date(test.solvedAt || Date.now()).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</span>
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 sm:gap-6 self-end sm:self-center">
                          <div className="text-start sm:text-end">
                            <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                              {test.score} <span className="text-xs text-slate-400 font-normal">/ {test.totalQuestions}</span>
                            </div>
                            <span
                              className={`text-xs font-black ${
                                pct >= 85
                                  ? 'text-emerald-600 dark:text-emerald-400'
                                  : pct >= 60
                                  ? 'text-blue-600 dark:text-blue-400'
                                  : 'text-rose-600 dark:text-rose-400'
                              }`}
                            >
                              {pct}% {pct >= 85 ? 'ممتاز' : isPassed ? 'ناجح' : 'يحتاج إعادة'}
                            </span>
                          </div>

                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${
                              isPassed
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                            }`}
                          >
                            {isPassed ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Direct WhatsApp Callout for Parent */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border border-slate-800">
              <div className="space-y-1 text-center sm:text-start">
                <h4 className="text-lg font-black text-amber-300">
                  هل لديك أي سؤال أو استفسار بخصوص مستوى ابنك / ابنتك؟
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                  مستر عبدالله سيد وفريق المساعدين يرحبون دائماً بتواصل أولياء الأمور لمناقشة خطة
                  تطوير مستوى الطالب وضمان حصوله على الدرجة النهائية في الامتحان.
                </p>
              </div>
              <a
                href="https://wa.me/201102140676"
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm rounded-2xl shadow-lg transition-all flex items-center gap-2 cursor-pointer shrink-0"
              >
                <MessageSquare className="w-5 h-5" />
                <span>محادثة الإدارة عبر واتساب</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
