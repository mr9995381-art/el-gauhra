import React, { useState } from 'react';
import { 
  BookOpen, User, Sparkles, Phone, GraduationCap, 
  ShieldCheck, Video, FileText, Award, 
  MessageSquare, ChevronDown, ChevronUp, Star,
  Search, CheckCircle2, Download, HelpCircle,
  ExternalLink, ArrowLeft, ArrowRight, Languages,
  PenTool, BrainCircuit, PlayCircle
} from 'lucide-react';
import { UserProfile } from '../types';
import { useLanguage } from '../lib/LanguageContext';

interface HomeViewProps {
  userProfile: UserProfile | null;
  onOpenAuth: () => void;
  setCurrentView: (view: string) => void;
  onOpenMasterAccess?: () => void;
}

export default function HomeView({ userProfile, onOpenAuth, setCurrentView }: HomeViewProps) {
  const { t, isRtl, lang } = useLanguage();
  const phone = '+201102140676';
  const displayPhone = '01102140676';

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [activeStageTab, setActiveStageTab] = useState<'secondary' | 'prep'>('secondary');
  const [parentSearchQuery, setParentSearchQuery] = useState('');
  const [parentSearchResult, setParentSearchResult] = useState<null | {
    studentName: string;
    grade: string;
    attendanceRate: number;
    lastExamScore: string;
    status: string;
    teacherNotes: string;
  }>(null);
  const [isSearchingParent, setIsSearchingParent] = useState(false);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleParentSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentSearchQuery.trim()) return;
    setIsSearchingParent(true);
    setTimeout(() => {
      setIsSearchingParent(false);
      setParentSearchResult({
        studentName: parentSearchQuery.length > 6 ? 'أحمد محمد حسني' : 'طالب متميز في اللغة الإنجليزية',
        grade: 'الصف الثالث الثانوي (English Master Course)',
        attendanceRate: 98,
        lastExamScore: '49.5 / 50 (امتحان شامل على Grammar & Vocab Units 1-6)',
        status: 'مستمر ومؤهل للدرجة النهائية (Full Mark)',
        teacherNotes: 'مستوى استثنائي في حل أسئلة الترجمة والقطع المتحررة وفهم الفروق الدقيقة في الجرامر، ومواظب على أداء الواجبات والتصحيح الأسبوعي مع مستر عبدالله.',
      });
    }, 450);
  };

  // Secondary English Modules
  const secondarySubjects = [
    {
      title: 'كبسولات الجرامر والقواعد الشاملة',
      subtitle: 'شرح مبسط لكافة أزمنة وقواعد الإنجليزي وتفكيك التريكات الصعبة',
      icon: <BrainCircuit className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      topics: [
        'أزمنة الماضي والمضارع والمستقبل بكل تفاصيلها',
        'قواعد المجهول Passive والروابط والحالات الشرطية If',
        'أفعال المودال Modal Verbs والكلام المنقول Reported Speech',
        'تريكات وحيل استبعاد الإجابات في الامتحان النهائي',
      ],
      badge: 'الجرامر الأساسي والتراكمي',
      color: 'from-blue-900 to-indigo-950',
    },
    {
      title: 'بنك الكلمات والمصطلحات والاشتقاقات',
      subtitle: 'حفظ وفهم متقن للـ Vocab والـ Idioms والـ Collocations والـ Phrasal Verbs',
      icon: <BookOpen className="w-5 h-5 text-amber-500 dark:text-amber-400" />,
      topics: [
        'معاني الكلمات ومشتقاتها والمرادفات والمضادات Synonyms & Antonyms',
        'أهم حروف الجر المصاحبة للأفعال والصفات Prepositions',
        'مصطلحات الامتحانات والأسئلة المكررة في السنوات السابقة',
        'كويزات أسبوعية تفاعلية لتثبيت الكلمات في الذاكرة طويلة المدى',
      ],
      badge: 'الثروة اللغوية',
      color: 'from-amber-900 to-slate-900',
    },
    {
      title: 'فنيات الترجمة الاحترافية (Translation Skills)',
      subtitle: 'الترجمة من العربية إلى الإنجليزية والعكس بأسلوب احترافي خالٍ من الأخطاء',
      icon: <Languages className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      topics: [
        'صياغة الجمل الإنجليزية وقواعد ترتيب الصفات والظروف',
        'ترجمة المصطلحات المعاصرة والاقتصادية والعلمية والثقافية',
        'تجنب الترجمة الحرفية القاتلة واختيار المعنى السياقي الأدق',
        'حل مئات الجمل المتوقعة لامتحانات الثانوية العامة والأزهرية',
      ],
      badge: 'مهارة الترجمة',
      color: 'from-emerald-900 to-slate-900',
    },
    {
      title: 'فنون حل القطع المتحررة (Reading Comprehension)',
      subtitle: 'استراتيجيات Skimming & Scanning واستخراج الفكرة الرئيسية تحت ضغط الوقت',
      icon: <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
      topics: [
        'كيفية استنتاج المعاني المجهولة من السياق بسهولة',
        'التعامل مع أسئلة الاستنتاج Inference والعنوان المناسب',
        'فنيات قراءة الأسئلة أولاً لتوفير 50% من وقت الحل',
        'حل وتصحيح أكثر من 100 قطعة امتحانية شاملة',
      ],
      badge: 'الفهم القرائي',
      color: 'from-purple-900 to-slate-900',
    },
    {
      title: 'مهارات الكتابة والمقال (Writing & Punctuation)',
      subtitle: 'قواعد الترقيم، كتابة الإيميل والمقال، والتركيب الصحيح للفقرات Paragraphs',
      icon: <PenTool className="w-5 h-5 text-rose-500 dark:text-rose-400" />,
      topics: [
        'أسرار علامات الترقيم Punctuation Marks وحالات استخدامها',
        'هيكل المقال: Introduction, Body Paragraphs, Conclusion',
        'كلمات الربط الانتقالية Transition Words لإثراء النص',
        'نماذج مقالات مقترحة ومراجعة كتابات الطلاب تفصيلياً',
      ],
      badge: 'مهارات التعبير',
      color: 'from-rose-900 to-slate-900',
    },
    {
      title: 'القصة المقررة والتحليل النقدي (Literature & Story)',
      subtitle: 'شرح الفصول وتحليل الشخصيات، الأحداث، والاقتباسات وأسئلة التفكير النقدي',
      icon: <Award className="w-5 h-5 text-sky-600 dark:text-sky-400" />,
      topics: [
        'ملخص شيق لكل فصل مع أهم الكلمات والعبارات',
        'خرائط العلاقات بين الشخصيات الرئيسية والثانوية',
        'أسئلة التفكير النقدي Critical Thinking وكيفية الإجابة عليها',
        'توقعات أسئلة القصة في الامتحان النهائي',
      ],
      badge: 'الأدب والقصة',
      color: 'from-sky-900 to-slate-900',
    },
  ];

  // Prep English Modules
  const prepSubjects = [
    {
      title: 'كورس التأسيس والجرامر للمرحلة الإعدادية',
      subtitle: 'بناء قاعدة قوية في قواعد اللغة الإنجليزية والأزمنة الأساسية',
      topics: ['أزمنة المضارع والماضي البسيط والمستمر والمستقبل', 'الضمائر وتكوين الجمل والأسئلة Wh-Questions', 'الصفات ومقارنتها والمبني للمجهول الميسر'],
      badge: 'التأسيس اللغوي',
    },
    {
      title: 'شرح وحدات المنهج والمحادثات (Dialogue & Vocab)',
      subtitle: 'شرح تفاعلي لكل وحدة مع حل المحادثات وسؤال أكمل النص',
      topics: ['فنيات حل سؤال المحادثة وسؤال المواقف', 'حفظ الكلمات واستخدامها في جمل عملية', 'قراءة النصوص واستخراج الأفكار الرئيسية'],
      badge: 'المنهج الدراسي',
    },
    {
      title: 'تدريبات وامتحانات المحافظات للشهادة الإعدادية',
      subtitle: 'نماذج امتحانات نصف ونهاية العام مطابقة لورقة الامتحان الوزارية',
      topics: ['حل امتحانات كافة المحافظات للسنوات السابقة', 'مراجعة ليلة الامتحان وكبسولة الدرجة النهائية', 'تصحيح مباشر وإرشاد الطالب لتفادي الأخطاء الشائعة'],
      badge: 'بنك الامتحانات',
    },
  ];

  // Features of Mr. Abdullah Sayed Platform
  const whyChooseUs = [
    {
      icon: <Sparkles className="w-6 h-6 text-amber-500 dark:text-amber-400" />,
      title: 'كبسولات مستر عبدالله السحرية',
      description: 'طرق مبتكرة ومبسطة لشرح أصعب قواعد الجرامر، وحيل ذكية لاستبعاد الإجابات الخاطئة واختيار الصحيحة في ثوانٍ.',
    },
    {
      icon: <Video className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      title: 'مشغل حصص فائق الجودة والسرعة',
      description: 'مشاهدة شروحات الفيديو بجودة عالية 1080p مع نظام حماية ذكي بعلامة مائية، وتشغيل سلس على أي باقة إنترنت.',
    },
    {
      icon: <Award className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
      title: 'اختبارات دورية مع تصحيح وتفسير فوري',
      description: 'كويزات أسبوعية وامتحانات شهرية تحاكي مواصفات الامتحان النهائي، مع شرح بالفيديو لسبب اختيار كل إجابة.',
    },
    {
      icon: <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
      title: 'سلسلة مذكرات "The Master" بصيغة PDF',
      description: 'مذكرات منسقة ومطبوعة بأعلى جودة للشرح وبنك الأسئلة والمراجعة النهائية، متوفرة للتحميل والطباعة فوراً.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-sky-600 dark:text-sky-400" />,
      title: 'بوابة متابعة ولي الأمر المتكاملة',
      description: 'إشراك ولي الأمر في مسيرة الطالب لحظة بلحظة؛ معرفة نسب الحضور، درجات الامتحانات، وملاحظات مستر عبدالله.',
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-purple-600 dark:text-purple-400" />,
      title: 'تواصل مباشر ومتابعة مستمرة عبر الواتساب',
      description: 'فريق دعم ومساعدين متفرغين للرد على استفسارات الطلاب في المنهج على مدار الساعة ومع مستر عبدالله شخصياً.',
    },
  ];

  // English Booklets Showcase
  const booklets = [
    {
      title: 'The Master in English Grammar',
      grade: 'المرحلة الثانوية الشاملة (1st, 2nd, 3rd Sec)',
      desc: 'الدليل الذهبي الكامل لقواعد وأزمنة اللغة الإنجليزية التراكمية مع 1500 جملة محلولة.',
      pages: '190 صفحة',
      author: 'مستر عبدالله سيد',
    },
    {
      title: 'قاموس الكلمات والمشتقات والترجمة',
      grade: 'الشهادة الثانوية العامة والأزهرية',
      desc: 'تجميعة شاملة لأهم الكلمات والاشتقاقات والتعبيرات الاصطلاحية وتدريبات الترجمة الحديثة.',
      pages: '160 صفحة',
      author: 'مستر عبدالله سيد',
    },
    {
      title: 'بنك أسئلة امتحانات الثانوية الشامل',
      grade: 'الصف الثالث الثانوي',
      desc: 'نماذج امتحانات الوزارة والسنوات السابقة وتوقعات ليلة الامتحان مع الإجابات النموذجية.',
      pages: '220 صفحة',
      author: 'مستر عبدالله سيد',
    },
    {
      title: 'The Starter: كبسولة مهارات اللغة الإنجليزية',
      grade: 'المرحلتين الإعدادية والثانوية',
      desc: 'فنيات حل سؤال المحادثة، القطعة المتحررة، علامات الترقيم، وكتابة الإيميل والمقال.',
      pages: '110 صفحة',
      author: 'مستر عبدالله سيد',
    },
  ];

  // Top Rankers / Testimonials for Mr. Abdullah
  const rankersReviews = [
    {
      name: 'مريم عادل محمود',
      rank: 'الدرجة النهائية 50/50 في اللغة الإنجليزية (ثانوية عامة)',
      text: 'مستر عبدالله سيد مش مجرد مدرس، ده أسلوب حياة في الإنجليزي! كبسولات الجرامر وطريقة استبعاد الإجابات فرقت معايا جداً في لجنة الامتحان، والحمد لله قفلت المادة بدون أي تردد.',
      rating: 5,
    },
    {
      name: 'يوسف طارق إبراهيم',
      rank: 'المركز الخامس على المحافظة - 49.5/50 إنجليزي',
      text: 'كنت دايماً بخاف من سؤال الترجمة والقطع المتحررة، لكن مع كورس المهارات ومذكرات The Master وبنك الأسئلة، بقيت بحل القطعة في أقل من 10 دقائق وبمنتهى الثقة.',
      rating: 5,
    },
    {
      name: 'الأستاذ حسن عبدالمجيد (ولي أمر)',
      rank: 'ولي أمر طالبة بالصف الثالث الثانوي',
      text: 'منصة مستر عبدالله نموذج مشرف في التعليم الرقمي. تقارير ولي الأمر كانت بتطمني أسبوعياً على درجات بنتي ونسبة التزامها، والمستوى في اللغة الإنجليزية اختلف 180 درجة.',
      rating: 5,
    },
  ];

  // FAQ
  const faqs = [
    {
      q: 'هل تغطي كورسات مستر عبدالله مناهج الثانوية العامة والأزهرية واللغات؟',
      a: 'نعم بكل تأكيد! المنهج مصمم ليغطي بدقة كافة متطلبات الثانوية العامة، والثانوية الأزهرية، والمرحلة الإعدادية، مع التركيز على المهارات اللغوية المشتركة، والجرامر، والكلمات، والقصة المقررة، وامتحانات البوكليت والامتحانات العامة.',
    },
    {
      q: 'كيف يمكنني الاشتراك وتفعيل المحاضرات مع مستر عبدالله؟',
      a: 'يمكنك إنشاء حساب جديد مجاناً في دقيقة واحدة، ثم اختيار صفك الدراسي، والتواصل مع إدارة المنصة عبر الواتساب أو الاتصال على 01102140676 لتفعيل المحاضرات أو الحصول على كود الاشتراك الفوري.',
    },
    {
      q: 'هل تتوفر مذكرات الشرح والتدريبات بصيغة PDF للطباعة؟',
      a: 'نعم، سلسلة مذكرات "The Master" في الجرامر والكلمات والترجمة وبنك الأسئلة متوفرة لجميع الطلاب المسجلين بالمنصة بصيغة PDF بجودة طباعة فائقة.',
    },
    {
      q: 'كيف يستفيد ولي الأمر من خدمة المتابعة في المنصة؟',
      a: 'بإمكان ولي الأمر الدخول في أي وقت إلى بوابة المتابعة وإدخال رقم هاتف الطالب للاطلاع على تقرير تفصيلي لنسبة حضور الفيديوهات، درجات الكويزات الأسبوعية، والامتحانات الشاملة وملاحظات المستر.',
    },
    {
      q: 'هل يمكنني طرح الأسئلة والحصول على إجابات من مستر عبدالله؟',
      a: 'نعم، المنصة توفر قنوات تواصل تفاعلية ومجموعات متابعة دورية وميزة طرح الأسئلة تحت كل محاضرة ليجيبك مستر عبدالله وفريقه الأكاديمي سريعاً.',
    },
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100 transition-colors" dir="rtl">
      
      {/* 1. Hero Section: Mr. Abdullah Sayed English Master */}
      <section className="relative pt-6 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-[#071c35] to-[#0a2342] text-white rounded-[32px] sm:rounded-[44px] p-6 sm:p-10 md:p-14 shadow-2xl border border-blue-500/30">
          
          {/* Ambient Lighting */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            
            {/* Hero Text Content */}
            <div className="lg:col-span-7 space-y-6 text-start">
              
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-200 rounded-full text-xs sm:text-sm font-extrabold border border-blue-400/30 backdrop-blur-md">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>المنصة الرسمية لخبير اللغة الإنجليزية | Mr. Abdullah Sayed 🇬🇧</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-[1.25] tracking-tight">
                منصة مستر عبدالله سيد <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-sky-300">
                  طريقك للدرجة النهائية (Full Mark)
                </span>{' '}
                في اللغة الإنجليزية
              </h1>

              <p className="text-slate-200 text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed font-normal">
                المنظومة التعليمية المتكاملة لطلاب المرحلة الإعدادية والثانوية. شروحات تفاعلية، كبسولات الجرامر المبتكرة، بنك الكلمات الشامل، فنيات الترجمة والقطع المتحررة، مع متابعة شخصية واختبارات دورية تحاكي أحدث مواصفات الامتحانات.
              </p>

              {/* Support & Booking Banner */}
              <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-blue-400/30 text-xs sm:text-sm text-slate-100 max-w-xl flex flex-wrap items-center justify-between gap-3 shadow-inner">
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-amber-300 shrink-0" />
                  <span className="font-bold">للاشتراك وحجز الكورسات وتفعيل الأكواد:</span>
                </div>
                <div className="flex items-center gap-2">
                  <a 
                    href={`tel:${phone}`} 
                    className="px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-xl text-xs sm:text-sm transition-all shadow-md dir-ltr"
                  >
                    {displayPhone}
                  </a>
                  <a 
                    href={`https://wa.me/201102140676?text=${encodeURIComponent('السلام عليكم مستر عبدالله، أريد الاستفسار عن اشتراك كورسات اللغة الإنجليزية')}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center gap-1"
                  >
                    <span>واتساب</span>
                  </a>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
                {userProfile ? (
                  <button
                    onClick={() => setCurrentView(userProfile.role === 'master' ? 'master_dashboard' : 'student_dashboard')}
                    className="px-8 py-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black rounded-2xl shadow-xl transition-all flex items-center gap-3 text-base cursor-pointer"
                  >
                    <User className="w-5 h-5" />
                    <span>الدخول إلى لوحتي التعليمية</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={onOpenAuth}
                      className="px-8 py-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black rounded-2xl shadow-xl hover:shadow-amber-400/20 transition-all flex items-center gap-3 text-base cursor-pointer"
                    >
                      <GraduationCap className="w-6 h-6" />
                      <span>اشترك وابدأ رحلة الـ Full Mark</span>
                    </button>
                    <button
                      onClick={() => setCurrentView('courses')}
                      className="px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl border border-white/20 backdrop-blur-md transition-all flex items-center gap-2.5 text-base cursor-pointer"
                    >
                      <PlayCircle className="w-5 h-5 text-amber-300" />
                      <span>استكشف المحاضرات</span>
                    </button>
                    <a
                      href="#parent-tracking-section"
                      className="px-5 py-4 bg-slate-900/80 hover:bg-slate-900 text-amber-300 font-bold rounded-2xl border border-blue-500/30 transition-all flex items-center gap-2 text-sm"
                    >
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      <span>متابعة ولي الأمر</span>
                    </a>
                  </>
                )}
              </div>

              {/* Quick Hero Numbers */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/15 max-w-lg text-center">
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-amber-300">+15,000</div>
                  <div className="text-xs text-blue-200 mt-0.5">طالب مستفيد</div>
                </div>
                <div className="border-x border-white/15 px-2">
                  <div className="text-2xl sm:text-3xl font-black text-blue-300">+450</div>
                  <div className="text-xs text-blue-200 mt-0.5">محاضرة ومذكرة</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-300">99.4%</div>
                  <div className="text-xs text-blue-200 mt-0.5">نسبة التفوق والنجاح</div>
                </div>
              </div>

            </div>

            {/* Hero Spotlight: Teacher Card Mr. Abdullah Sayed */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative group w-full max-w-md">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-amber-500 to-indigo-600 rounded-[34px] blur-md opacity-60 group-hover:opacity-100 transition duration-1000"></div>
                
                <div className="relative bg-slate-900/95 border border-blue-400/30 rounded-[30px] p-6 text-center shadow-2xl overflow-hidden flex flex-col items-center">
                  
                  {/* Decorative Header Badge */}
                  <div className="w-full bg-gradient-to-r from-blue-600/30 via-indigo-600/30 to-blue-600/30 border border-blue-400/30 rounded-2xl py-2 px-4 mb-5 flex items-center justify-between">
                    <span className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-amber-400" />
                      خبير أول اللغة الإنجليزية
                    </span>
                    <span className="text-[10px] px-2 py-0.5 bg-blue-400/20 text-blue-200 rounded-full font-bold">
                      The English Master
                    </span>
                  </div>

                  {/* Teacher Avatar & Identity */}
                  <div className="relative mb-4">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-tr from-blue-600 via-blue-800 to-indigo-900 text-white font-black rounded-3xl flex items-center justify-center text-4xl shadow-xl border-4 border-blue-400/40">
                      AS
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-amber-400 text-slate-950 p-1.5 rounded-xl shadow-lg border-2 border-slate-900" title="معتمد ومتخصص">
                      <Award className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-white">مستر عبدالله سيد</h3>
                  <p className="text-xs font-bold text-amber-300 mt-1">Mr. Abdullah Sayed</p>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed max-w-xs">
                    خبير ومحاضر مادة اللغة الإنجليزية للمرحلتين الإعدادية والثانوية (عام، أزهر، ولغات). صاحب الأسلوب الأسهل والأشمل في تبسيط أصعب قواعد المنهج وتدريب الطلاب على مهارات التفكير العليا.
                  </p>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-2 gap-2.5 w-full mt-4 text-start">
                    <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700 text-xs">
                      <span className="font-bold text-sky-400 block">كبسولات الجرامر:</span>
                      <span className="text-[11px] text-slate-300">تبسيط التريكات وقواعد الأزمنة</span>
                    </div>
                    <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700 text-xs">
                      <span className="font-bold text-emerald-400 block">فنيات الترجمة:</span>
                      <span className="text-[11px] text-slate-300">صياغة احترافية بدون ترجمة حرفية</span>
                    </div>
                  </div>

                  {/* Trust Footer */}
                  <div className="w-full pt-4 mt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1 text-emerald-400 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      شروحات تفاعلية بأعلى جودة
                    </span>
                    <span className="text-amber-400 font-bold">
                      ★ 4.98/5 تقييم الطلاب
                    </span>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. English Curriculum & Stages (المراحل والمناهج) */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 font-extrabold text-xs rounded-full border border-blue-300 dark:border-blue-800">
            <BookOpen className="w-3.5 h-3.5" />
            <span>المناهج والكورسات المعتمدة</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white">
            خطة دراسة اللغة الإنجليزية مع مستر عبدالله سيد
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            محتوى تعليمي شامل يغطي كافة المهارات المطلوبة للوصول إلى الدرجة النهائية في الامتحانات الشهرية ونصف العام ونهاية العام.
          </p>
        </div>

        {/* Stage Tabs Switcher */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 bg-slate-200/80 dark:bg-slate-800 rounded-2xl border border-slate-300 dark:border-slate-700">
            <button
              onClick={() => setActiveStageTab('secondary')}
              className={`px-6 py-3 rounded-xl font-black text-sm transition-all cursor-pointer ${
                activeStageTab === 'secondary'
                  ? 'bg-blue-700 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              المرحلة الثانوية (1st, 2nd, 3rd Secondary)
            </button>
            <button
              onClick={() => setActiveStageTab('prep')}
              className={`px-6 py-3 rounded-xl font-black text-sm transition-all cursor-pointer ${
                activeStageTab === 'prep'
                  ? 'bg-blue-700 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              المرحلة الإعدادية (1st, 2nd, 3rd Prep)
            </button>
          </div>
        </div>

        {/* Modules Grid */}
        {activeStageTab === 'secondary' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {secondarySubjects.map((sub, idx) => (
              <div 
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold px-3 py-1 bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 rounded-full">
                      {sub.badge}
                    </span>
                    <span className="text-xs font-bold text-slate-400">
                      مستر عبدالله سيد
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-900">
                      {sub.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-amber-400 transition-colors">
                        {sub.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {sub.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-400">أبرز المحاور والشروحات:</span>
                    <ul className="space-y-1">
                      {sub.topics.map((t, ti) => (
                        <li key={ti} className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full shrink-0"></span>
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => setCurrentView('courses')}
                    className="w-full py-2.5 bg-slate-100 hover:bg-blue-700 hover:text-white dark:bg-slate-800 dark:hover:bg-blue-700 text-slate-800 dark:text-slate-200 font-black text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>استعراض المحاضرات والدروس</span>
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {prepSubjects.map((sub, idx) => (
              <div 
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-3 py-1 bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 rounded-full">
                      {sub.badge}
                    </span>
                    <span className="text-xs font-bold text-slate-400">مستر عبدالله سيد</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">{sub.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{sub.subtitle}</p>
                  <ul className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                    {sub.topics.map((t, ti) => (
                      <li key={ti} className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full shrink-0"></span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  onClick={() => setCurrentView('courses')}
                  className="w-full mt-6 py-2.5 bg-slate-100 hover:bg-blue-600 dark:bg-slate-800 dark:hover:bg-blue-600 text-slate-800 hover:text-white dark:text-slate-200 font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  استعراض كورسات الإعدادي
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 3. Parent Tracking Portal (بوابة متابعة ولي الأمر) */}
      <section id="parent-tracking-section" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 md:p-12 border border-blue-500/40 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-6 space-y-4 text-start">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/20 text-amber-300 rounded-full text-xs font-extrabold border border-amber-400/30">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>شريك النجاح والتفوق</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black">
                بوابة متابعة ولي الأمر الفورية
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                متابعة ولي الأمر هي الركيزة الأساسية لتفوق الطالب في اللغة الإنجليزية. أدخل رقم هاتف الطالب المسجل لدينا للاطلاع الفوري على نسب مشاهدة المحاضرات، نتائج امتحانات الجرامر والترجمة، وملاحظات مستر عبدالله سيد.
              </p>

              <form onSubmit={handleParentSearch} className="space-y-3 pt-2">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Search className="w-5 h-5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={parentSearchQuery}
                      onChange={(e) => setParentSearchQuery(e.target.value)}
                      placeholder="أدخل رقم هاتف الطالب أو ولي الأمر..."
                      className="w-full pr-11 pl-4 py-3.5 bg-slate-800/90 border border-slate-700 rounded-2xl text-white text-sm placeholder-slate-400 focus:outline-none focus:border-blue-400"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSearchingParent}
                    className="px-6 py-3.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-2xl text-sm transition-all shadow-lg cursor-pointer whitespace-nowrap"
                  >
                    {isSearchingParent ? 'جاري الاستعلام...' : 'استعلام عن مستوى الطالب'}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  * أدخل رقم الهاتف أو اضغط "استعلام عن مستوى الطالب" لمعاينة التقرير النموذجي.
                </p>
              </form>
            </div>

            {/* Live Result Card */}
            <div className="lg:col-span-6">
              {parentSearchResult ? (
                <div className="bg-slate-800/90 border border-blue-500/40 rounded-3xl p-6 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                    <div>
                      <h4 className="font-black text-white text-base">{parentSearchResult.studentName}</h4>
                      <p className="text-xs text-amber-300">{parentSearchResult.grade}</p>
                    </div>
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-xs font-bold">
                      {parentSearchResult.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-700">
                      <span className="text-[11px] text-slate-400 block">نسبة الحضور والالتزام:</span>
                      <span className="text-xl font-black text-amber-300">{parentSearchResult.attendanceRate}%</span>
                    </div>
                    <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-700">
                      <span className="text-[11px] text-slate-400 block">درجة آخر امتحان شامل:</span>
                      <span className="text-sm font-black text-emerald-300">{parentSearchResult.lastExamScore}</span>
                    </div>
                  </div>

                  <div className="bg-slate-900/40 p-3.5 rounded-2xl border border-slate-700 text-xs leading-relaxed text-slate-200">
                    <span className="font-bold text-amber-300 block mb-1">ملاحظة مستر عبدالله سيد:</span>
                    "{parentSearchResult.teacherNotes}"
                  </div>
                </div>
              ) : (
                <div className="bg-slate-800/40 border border-dashed border-slate-700 rounded-3xl p-8 text-center space-y-3">
                  <div className="w-14 h-14 bg-slate-800 text-blue-400 rounded-2xl flex items-center justify-center mx-auto">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <h4 className="font-extrabold text-white text-base">تقرير أداء الطالب في الإنجليزي</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    أدخل رقم الهاتف في الحقل المقابل لتفقد إحصائيات حضور المحاضرات، درجات كويزات الجرامر، وملاحظات مستر عبدالله.
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* 4. Booklets & Memorandums (سلسلة مذكرات The Master) */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 font-extrabold text-xs rounded-full">
            <FileText className="w-3.5 h-3.5" />
            <span>المذكرات والملازم المعتمدة</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white">
            سلسلة مذكرات "The Master" لمستر عبدالله سيد
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            مذكرات الشرح الشامل وبنك أسئلة الامتحانات وتوقعات ليلة الامتحان، متوفرة لجميع الطلاب المسجلين بصيغة PDF قابلة للتحميل والطباعة.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {booklets.map((b, idx) => (
            <div 
              key={idx}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="w-full h-36 bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 rounded-2xl p-4 flex flex-col justify-between border border-blue-500/20 text-white relative overflow-hidden">
                  <div className="flex justify-between items-center text-[11px] font-bold text-amber-300">
                    <span>{b.pages}</span>
                    <FileText className="w-4 h-4 text-amber-400" />
                  </div>
                  <h4 className="font-black text-sm text-blue-100 line-clamp-2">{b.title}</h4>
                  <span className="text-[10px] text-amber-300 font-medium">{b.author}</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 block mb-1">{b.grade}</span>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                    {b.desc}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 flex items-center justify-between">
                <button
                  onClick={onOpenAuth}
                  className="w-full py-2 bg-blue-50 hover:bg-blue-700 hover:text-white text-blue-700 dark:bg-blue-950/50 dark:hover:bg-blue-700 dark:text-blue-300 dark:hover:text-white rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>تحميل المذكرة (PDF)</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Features Grid (لماذا مستر عبدالله سيد) */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-slate-100/70 dark:bg-slate-900/50 rounded-3xl border border-slate-200/80 dark:border-slate-800">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            لماذا يختار آلاف الطلاب مستر عبدالله سيد سنوياً؟
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            بيئة تعليمية تفاعلية حديثة تضمن لك التفوق وفهم أدق تفاصيل اللغة الإنجليزية بكل ثقة ويسر.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {whyChooseUs.map((feat, idx) => (
            <div 
              key={idx}
              className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-lg transition-all space-y-3"
            >
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/40 rounded-2xl flex items-center justify-center border border-blue-200/50 dark:border-blue-900/50">
                {feat.icon}
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">{feat.title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{feat.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Top Rankers & Student Testimonials (أوائل ومتميزو مستر عبدالله) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 font-extrabold text-xs rounded-full">
            <Award className="w-3.5 h-3.5" />
            <span>سجل الشرف والدرجات النهائية</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            قصص نجاح طلاب مستر عبدالله سيد
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {rankersReviews.map((r, i) => (
            <div key={i} className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex gap-1 text-amber-400">
                  {[...Array(r.rating)].map((_, k) => (
                    <Star key={k} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
                  "{r.text}"
                </p>
              </div>
              <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
                <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">{r.name}</h4>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-bold mt-0.5">{r.rank}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Approved Payment Methods */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 text-center space-y-4">
          <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
            طرق الدفع وتفعيل الاشتراكات المعتمدة
          </h3>
          <p className="text-xs text-slate-500 max-w-xl mx-auto">
            نوفر لك أسهل وأأمن وسائل الدفع في مصر لتفعيل الكورسات والمذكرات فوراً
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <span className="px-4 py-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200">
              🔴 فودافون كاش (Vodafone Cash)
            </span>
            <span className="px-4 py-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200">
              ⚡ إنستاباي (InstaPay)
            </span>
            <span className="px-4 py-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200">
              🟡 فوري ومحافظ إلكترونية
            </span>
            <span className="px-4 py-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200">
              💳 بطاقات فيزا وميزة
            </span>
          </div>
        </div>
      </section>

      {/* 8. FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300 font-extrabold text-xs rounded-full">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>الأسئلة الشائعة</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            كل ما يهمك معرفته عن المنصة وكورسات الإنجليزي
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div 
              key={i}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs"
            >
              <button
                onClick={() => toggleFaq(i)}
                className="w-full px-6 py-4 text-start flex items-center justify-between font-bold text-sm sm:text-base text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
              >
                <span>{f.q}</span>
                {openFaqIndex === i ? (
                  <ChevronUp className="w-5 h-5 text-blue-600 shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                )}
              </button>
              {openFaqIndex === i && (
                <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800">
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 9. Final Bottom CTA Banner */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white rounded-[32px] p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-5">
            <h2 className="text-2xl sm:text-4xl font-black">
              جاهز لتحقيق الدرجة النهائية في اللغة الإنجليزية؟
            </h2>
            <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
              انضم الآن إلى آلاف الطلاب المتفوقين مع مستر عبدالله سيد، وابدأ تجربة تعليمية ممتعة وسهلة تقودك مباشرة نحو القمة.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                onClick={onOpenAuth}
                className="px-8 py-4 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-2xl shadow-xl transition-all text-base cursor-pointer"
              >
                سجل حسابك وابدأ الآن مجاناً
              </button>
              <a
                href={`tel:${phone}`}
                className="px-6 py-4 bg-white/15 hover:bg-white/25 text-white font-bold rounded-2xl border border-white/20 transition-all text-base flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>اتصل بنا: {displayPhone}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
