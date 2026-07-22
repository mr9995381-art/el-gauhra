import { useState } from 'react';
import { 
  BookOpen, User, Sparkles, MessageSquare, Phone, HelpCircle, GraduationCap, 
  CheckCircle2, ArrowLeft, ShieldCheck, Video, FileText, Award, 
  Users, PlayCircle, Star, Target, CheckCircle, ChevronDown, ChevronUp, Lock, Send
} from 'lucide-react';
import { UserProfile, GRADE_LABELS, EducationalGrade } from '../types';
import teacherProfileImg from '../assets/images/mr_abdullah_profile_1784715476238.jpg';
import courseCoverImg from '../assets/images/english_course_cover_1784715488481.jpg';

interface HomeViewProps {
  userProfile: UserProfile | null;
  onOpenAuth: () => void;
  setCurrentView: (view: string) => void;
  onOpenMasterAccess?: () => void;
}

export default function HomeView({ userProfile, onOpenAuth, setCurrentView, onOpenMasterAccess }: HomeViewProps) {
  const phone = '+201102140676';
  const displayPhone = '+20 11 0214 0676';

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const gradesList: { grade: EducationalGrade; title: string; stage: string; lessonsCount: number; level: string; color: string }[] = [
    { grade: 'prep_1', title: 'الصف الأول الإعدادي', stage: 'المرحلة الإعدادية', lessonsCount: 24, level: 'مبتدئ / متوسط', color: 'from-blue-600 to-indigo-700' },
    { grade: 'prep_2', title: 'الصف الثاني الإعدادي', stage: 'المرحلة الإعدادية', lessonsCount: 28, level: 'متوسط', color: 'from-indigo-600 to-purple-700' },
    { grade: 'prep_3', title: 'الصف الثالث الإعدادي', stage: 'المرحلة الإعدادية (الشهادة)', lessonsCount: 32, level: 'متقدم', color: 'from-blue-700 to-sky-800' },
    { grade: 'secondary_1', title: 'الصف الأول الثانوي', stage: 'المرحلة الثانوية', lessonsCount: 36, level: 'متوسط علوي', color: 'from-emerald-600 to-teal-800' },
    { grade: 'secondary_2', title: 'الصف الثاني الثانوي', stage: 'المرحلة الثانوية', lessonsCount: 40, level: 'متقدم', color: 'from-amber-600 to-orange-700' },
    { grade: 'secondary_3', title: 'الصف الثالث الثانوي', stage: 'المرحلة الثانوية (الشهادة)', lessonsCount: 50, level: 'احترافي / الشامل', color: 'from-rose-600 to-red-800' },
  ];

  const whyChooseUs = [
    {
      icon: <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      title: 'شرح مبسط بخرائط ذهنية',
      description: 'تسهيل الجرامر والقواعد الصعبة وتحويلها لأشكال وخرائط بصرية تثبت في الذهن بشكل دائم.',
    },
    {
      icon: <Video className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
      title: 'فيديوهات HD بدون تقطيع',
      description: 'سيرفرات فائقة السرعة تضمن مشاهدة الشروحات بجودة عالية وبدون إعلانات مزعجة.',
    },
    {
      icon: <FileText className="w-6 h-6 text-amber-600 dark:text-amber-400" />,
      title: 'مذكرات ملونة جاهزة للتحميل',
      description: 'ملازم ومذكرات PDF شاملة ومصممة للطباعة تحوي ملخصات الوحدات والكلمات الهامة.',
    },
    {
      icon: <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />,
      title: 'امتحانات تفاعلية بالدرجات',
      description: 'اختبارات فورية بعد كل درس مع إظهار النتيجة والإجابات النموذجية والدرجة المستحقة.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-sky-600 dark:text-sky-400" />,
      title: 'منظومة أمان مخصصة لكل طالب',
      description: 'ربط الحساب بجهاز الطالب لمنع التشتت وحماية المحتوى والاشتراك التعليمي الخاص بك.',
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-rose-600 dark:text-rose-400" />,
      title: 'دعم مباشر مع مستر عبدالله',
      description: 'إمكانية التواصل واستفسار الطالب أو ولي الأمر هاتفياً أو عبر الواتساب في أي وقت.',
    },
  ];

  const studySteps = [
    { step: '01', title: 'إنشاء الحساب واختيار الصف', desc: 'سجل حسابك مجاناً وحدد الصف الدراسي الخاص بك في ثوانٍ معدودة.' },
    { step: '02', title: 'طلب اشتراك الكورس', desc: 'تواصل مع مستر عبدالله للحصول على كود التفعيل أو أرسل طلب اشتراك من المنصة.' },
    { step: '03', title: 'مشاهدة الشروحات والدروس', desc: 'استمتع بشرح الدروس والوحدات فيديو مع تحميل المذكرات المرفقة.' },
    { step: '04', title: 'أداء الامتحانات وتتبع النسبة', desc: 'حل الاختبارات التفاعلية وشاهد نسبة إنجازك ترتفع نحو التميز.' },
  ];

  const reviews = [
    {
      name: 'أحمد محمود العبد',
      grade: 'الصف الثالث الثانوي (دفعة 2025)',
      text: 'بفضل الله ثم مستر عبدالله سيد قدرت أقفل امتحان الإنجليزي بالثانوية العامة! أسلوبه في شرح الجرامر خرافة وبيخلي المادة أسهل مادة عندك.',
      rating: 5,
    },
    {
      name: 'سارة خالد السيد',
      grade: 'الصف الثاني الإعدادي',
      text: 'المنصة ممتازة وسريعة جداً على الموبايل. الاختبارات التفاعلية والدرجة الفورية بتخليني أعرف أخطائي وأعدلها في نفس اللحظة. شكراً مستر عبدالله!',
      rating: 5,
    },
    {
      name: 'المهندس عمرو مصطفى (ولي أمر)',
      grade: 'ولي أمر طالب بالصف الأول الثانوي',
      text: 'أشكر مستر عبدالله على المنصة الاحترافية جداً. المنظومة أتاحت لي متابعة مستوى ابني والتأكد من التزامه بالدروس ونتائجه في الامتحانات بانتظام.',
      rating: 5,
    },
  ];

  const faqs = [
    {
      q: 'كيف يمكنني الاشتراك وتفعيل الكورسات الخاصة بصفي الدراسي؟',
      a: 'يمكنك إنشاء حسابك على المنصة وتحديد صفك الدراسي، ثم التواصل مع مستر عبدالله سيد عبر الواتساب أو الهاتف على الرقم 01102140676 للحصول على كود التفعيل أو إرسال طلب اشتراك مباشر من لوحتك.'
    },
    {
      q: 'هل تعمل المنصة على الهواتف والتابلت والكمبيوتر؟',
      a: 'نعم، المنصة مصممة بأحدث تقنيات الويب المتجاوبة وتعمل بمرونة فائقة وسرعة عالية على جميع أنواع الهواتف الذكية (أندرويد وآيفون)، التابلت، وأجهزة الكمبيوتر.'
    },
    {
      q: 'هل المحتوى يشمل الشرح والواجبات والمذكرات؟',
      a: 'بالتأكيد، كل كورس يحتوى على وحدات مقسمة لدروس فيديو، مذكرات وملخصات PDF جاهزة للتحميل والطباعة، واختبارات إلكترونية تفاعلية بعد كل درس.'
    },
    {
      q: 'كيف يتابع ولي الأمر مستوى الطالب ونتائجه؟',
      a: 'يمكن لولي الأمر مشاهدة نسبة إنجاز الطالب ودرجاته في الاختبارات مباشرة من داخل لوحة الطالب، أو التواصل المباشر مع المستر لمتابعة التقييم الدوري.'
    }
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-900 font-sans text-slate-800 dark:text-slate-100 transition-colors" dir="rtl">
      
      {/* 1. Hero Section */}
      <section className="relative pt-8 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-950 to-slate-950 text-white rounded-[36px] sm:rounded-[48px] p-6 sm:p-12 md:p-16 shadow-2xl border border-blue-800/40">
          {/* Background Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            
            {/* Hero Text Content */}
            <div className="lg:col-span-7 space-y-6 text-right">
              
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/20 text-blue-300 rounded-full text-xs sm:text-sm font-bold border border-blue-400/30 backdrop-blur-md">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>المنصة التعليمية الأولى لتدريس اللغة الإنجليزية</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-[1.25] tracking-tight">
                ابدأ رحلة تعلم اللغة الإنجليزية <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-amber-300">
                  مع مستر عبدالله سيد
                </span>
              </h1>

              <p className="text-blue-100/90 text-base sm:text-lg max-w-2xl leading-relaxed font-normal">
                منظومة تعليمية متكاملة تضمن لك فهم القواعد والجرامر وإتقان المنهج بأعلى معايير التفوق والوصول للدرجة النهائية في الامتحانات.
              </p>

              {/* Support Alert Phone Banner */}
              <div className="p-3.5 sm:p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 text-xs sm:text-sm text-slate-100 max-w-xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>تواصل مباشر مع المستر للاشتراك والتفعيل:</span>
                </div>
                <a href={`tel:${phone}`} className="font-extrabold text-amber-300 underline dir-ltr select-all text-xs sm:text-sm whitespace-nowrap">
                  {displayPhone}
                </a>
              </div>

              {/* CTA Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                {userProfile ? (
                  <button
                    onClick={() => setCurrentView(userProfile.role === 'master' ? 'master_dashboard' : 'student_dashboard')}
                    className="px-8 py-4 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-full shadow-xl hover:shadow-amber-400/20 transition-all flex items-center gap-3 text-base cursor-pointer"
                  >
                    <User className="w-5 h-5" />
                    <span>الدخول للوحة التعليمية</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={onOpenAuth}
                      className="px-8 py-4 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-full shadow-xl hover:shadow-amber-400/20 transition-all flex items-center gap-3 text-base cursor-pointer"
                    >
                      <GraduationCap className="w-6 h-6" />
                      <span>ابدأ التعلم الآن</span>
                    </button>
                    <button
                      onClick={() => setCurrentView('courses')}
                      className="px-8 py-4 bg-white/15 hover:bg-white/25 text-white font-bold rounded-full border border-white/20 backdrop-blur-md transition-all flex items-center gap-3 text-base cursor-pointer"
                    >
                      <BookOpen className="w-5 h-5" />
                      <span>تصفح الكورسات والصفوف</span>
                    </button>
                  </>
                )}
              </div>

              {/* Quick Hero Numbers */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/15 max-w-lg text-center">
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-amber-300">+12,000</div>
                  <div className="text-xs text-blue-200 mt-0.5">طالب مشترك</div>
                </div>
                <div className="border-r border-white/15 pr-4">
                  <div className="text-2xl sm:text-3xl font-black text-blue-300">+500</div>
                  <div className="text-xs text-blue-200 mt-0.5">درس فيديو تفاعلي</div>
                </div>
                <div className="border-r border-white/15 pr-4">
                  <div className="text-2xl sm:text-3xl font-black text-emerald-300">100%</div>
                  <div className="text-xs text-blue-200 mt-0.5">نسبة تفوق ورضا</div>
                </div>
              </div>

            </div>

            {/* Hero Teacher Profile Image Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative group">
                {/* Glowing ring border */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-amber-400 to-indigo-500 rounded-[32px] blur opacity-70 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                
                <div className="relative bg-slate-900 border border-slate-800 rounded-[30px] p-4 text-center max-w-sm shadow-2xl overflow-hidden">
                  <img 
                    src={teacherProfileImg} 
                    alt="مستر عبدالله سيد" 
                    className="w-full h-80 object-cover rounded-2xl mb-4 shadow-md object-top"
                  />
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-xs font-extrabold mb-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                      <span>خبير تدريس اللغة الإنجليزية</span>
                    </div>
                    <h3 className="text-xl font-black text-white">مستر عبدالله سيد</h3>
                    <p className="text-xs text-slate-400">أكثر من 10 سنوات في تبسيط المناهج وتفوق الطلاب</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Platform Highlights / Why Choose Us */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 font-extrabold text-xs rounded-full uppercase">
            مميزات الاستثمار في تعليمك
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white">
            لماذا تختار منصة مستر عبدالله سيد؟
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            صُممت المنصة خصيصاً لتوفير أفضل بيئة دراسية تفاعلية خالية من المشتتات مع تركيز كامل على الدرجة النهائية.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {whyChooseUs.map((item, idx) => (
            <div 
              key={idx}
              className="bg-white dark:bg-slate-950 p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 space-y-4"
            >
              <div className="w-12 h-12 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center border border-slate-100 dark:border-slate-800 shadow-inner">
                {item.icon}
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">{item.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. How Study Works Roadmap */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-50/50 dark:bg-slate-950/50 border-y border-slate-200/60 dark:border-slate-800/60">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-extrabold text-xs rounded-full">
              خطوات بسيطة للتفوق
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white">
              طريقة الدراسة بالمنصة
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base">
              أربع خطوات سهلة تبدأ بها رحلتك نحو إتقان اللغة الإنجليزية.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {studySteps.map((s, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                <div className="text-4xl font-black text-blue-100 dark:text-slate-800 mb-3 font-mono">
                  {s.step}
                </div>
                <h3 className="text-base font-black text-slate-900 dark:text-slate-100 mb-2">{s.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Grade Courses Showcase Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="px-3 py-1 bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-extrabold text-xs rounded-full uppercase">
            الكورسات الشاملة لكافة الصفوف
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white">
            اختر صفك الدراسي وابدأ التعلم
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base">
            كورسات مصممة وفقاً لأحدث تعديلات المناهج الوزارية للمرحلتين الإعدادية والثانوية.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {gradesList.map((g, idx) => (
            <div 
              key={idx}
              className="bg-white dark:bg-slate-950 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-44 overflow-hidden">
                  <img 
                    src={courseCoverImg} 
                    alt={g.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                  <div className="absolute top-3 right-3 px-3 py-1 bg-blue-600/90 backdrop-blur-md text-white text-[11px] font-black rounded-full">
                    {g.stage}
                  </div>
                  <div className="absolute bottom-3 right-3 left-3 text-white">
                    <h3 className="text-lg font-black">{g.title}</h3>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <PlayCircle className="w-4 h-4 text-blue-600" />
                      {g.lessonsCount} درس فيديو
                    </span>
                    <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-900 rounded-lg font-bold text-slate-700 dark:text-slate-300">
                      {g.level}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    تغطية شاملة لكل القواعد، الكلمات، المحادثات والتدريبات بأسلوب شائق ومبسط مع مذكرات PDF واختبارات قياس مستوى.
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  onClick={() => {
                    if (userProfile) {
                      setCurrentView(userProfile.role === 'master' ? 'master_dashboard' : 'student_dashboard');
                    } else {
                      onOpenAuth();
                    }
                  }}
                  className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white font-extrabold rounded-xl shadow-md transition-all text-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>{userProfile ? 'دخول كورسات الصف' : 'اشترك بـ ' + g.title}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Parent Experience Section (تجربة ولي الأمر) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-[36px] p-8 sm:p-12 md:p-14 shadow-2xl border border-blue-900/50">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-7 space-y-6 text-right">
              <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 font-extrabold text-xs rounded-full border border-blue-400/30">
                راحة بال وأمان تام
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black leading-snug">
                تجربة ولي الأمر: متابعة دقيقة وأمان كامل لمستقبل ابنك
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                نعلم أن ولي الأمر شريك أساسي في نجاح الطالب؛ لذا صممنا نظاماً يتيح لك الاطمئنان التام على انتظام الطالب ونتائج اختباراته وتقدمه في المنهج.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-white text-sm">متابعة نتائج الامتحانات الفورية</h4>
                    <p className="text-xs text-slate-400">اطّلع على درجات الطالب وتقييم مستواه بعد كل امتحان تفاعلي.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-white text-sm">بيئة تعليمية آمنة ومحمية</h4>
                    <p className="text-xs text-slate-400">حسابات محمية مرتبطة بأجهزة الطلاب تضمن عدم التشتت أثناء المذاكرة.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-white text-sm">خط تواصل مباشر مع المستر</h4>
                    <p className="text-xs text-slate-400">يمكن لولي الأمر الاتصال أو المراسلة بالواتساب للاستفسار عن الطالب.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-4">
                <a
                  href={`tel:${phone}`}
                  className="px-6 py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-full shadow-lg transition-all text-xs sm:text-sm flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>تواصل ولي الأمر مباشرة مع المستر</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white/5 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 text-center">
              <div className="w-16 h-16 bg-blue-600/30 text-blue-300 rounded-2xl flex items-center justify-center mx-auto">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-extrabold text-white">ضمان أعلى مستويات الجودة والالتزام</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                مع مستر عبدالله سيد، لا يوجد مكان للعشوائية. كل درس مصحوب بملخص واجب، وكل وحدة تليها مراجعة واختبار تقييمي شامل.
              </p>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-xs text-amber-300 font-bold">
                رقم التواصل والدعم المباشر: {displayPhone}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. Student Reviews / Testimonials */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="px-3 py-1 bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-extrabold text-xs rounded-full uppercase">
            آراء المتميزين
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white">
            قصص نجاح وآراء أبطالنا الطلاب
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base">
            انطباعات حقيقية لطلاب وأولياء أمور مروا بتجربة التعلم مع مستر عبدالله سيد.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((r, idx) => (
            <div 
              key={idx}
              className="bg-white dark:bg-slate-950 p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(r.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed italic">
                  "{r.text}"
                </p>
              </div>

              <div className="pt-6 border-t border-slate-100 dark:border-slate-900 mt-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 font-bold rounded-full flex items-center justify-center text-sm shrink-0">
                  {r.name[0]}
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">{r.name}</h4>
                  <p className="text-[11px] text-slate-400">{r.grade}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Frequently Asked Questions (FAQ) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-12 space-y-3">
          <HelpCircle className="w-10 h-10 text-blue-600 mx-auto" />
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">الأسئلة الشائعة</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">كل ما ترغب في معرفته قبل بدء رحلتك التعليمية.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden transition-all shadow-sm"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full text-right p-5 flex items-center justify-between font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50"
              >
                <span>{faq.q}</span>
                {openFaqIndex === idx ? <ChevronUp className="w-5 h-5 text-blue-600 shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />}
              </button>
              {openFaqIndex === idx && (
                <div className="px-5 pb-5 text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed border-t border-slate-100 dark:border-slate-900 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 8. Bottom Contact Callout */}
      <section className="bg-blue-700 text-white py-14 px-4 sm:px-6 lg:px-8 text-center" dir="rtl">
        <div className="max-w-3xl mx-auto space-y-5">
          <h2 className="text-2xl sm:text-3xl font-black">جاهز للبدء والتفوق في اللغة الإنجليزية؟</h2>
          <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
            اشترك الآن بصفك الدراسي وتواصل مع مستر عبدالله سيد لتفعيل كود الاشتراك والبدء فوراً.
          </p>
          <div className="text-3xl font-black text-amber-300 tracking-wider dir-ltr select-all py-2">
            {displayPhone}
          </div>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <a
              href={`tel:${phone}`}
              className="px-6 py-3 bg-white text-blue-900 font-extrabold rounded-full shadow-lg transition-all text-xs sm:text-sm flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>اتصال هاتفي مباشر</span>
            </a>
            <a
              href={`https://wa.me/${phone.replace('+', '')}`}
              target="_blank"
              referrerPolicy="no-referrer"
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-full shadow-lg transition-all text-xs sm:text-sm flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>مراسلة عبر الواتساب</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
