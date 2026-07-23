import { useState } from 'react';
import { 
  BookOpen, User, Sparkles, Phone, GraduationCap, 
  ShieldCheck, Video, FileText, Award, 
  MessageSquare, ChevronDown, ChevronUp, Star
} from 'lucide-react';
import { UserProfile, EducationalGrade } from '../types';
import { useLanguage } from '../lib/LanguageContext';

interface HomeViewProps {
  userProfile: UserProfile | null;
  onOpenAuth: () => void;
  setCurrentView: (view: string) => void;
  onOpenMasterAccess?: () => void;
}

export default function HomeView({ userProfile, onOpenAuth, setCurrentView }: HomeViewProps) {
  const { t, getGradeLabel, getEducationStageLabel, isRtl, lang } = useLanguage();
  const phone = '+201102140676';
  const displayPhone = '+20 11 0214 0676';

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const gradesList: { grade: EducationalGrade; lessonsCount: number; color: string }[] = [
    { grade: 'prep_1', lessonsCount: 24, color: 'from-blue-600 to-indigo-700' },
    { grade: 'prep_2', lessonsCount: 28, color: 'from-indigo-600 to-purple-700' },
    { grade: 'prep_3', lessonsCount: 32, color: 'from-blue-700 to-sky-800' },
    { grade: 'secondary_1', lessonsCount: 36, color: 'from-emerald-600 to-teal-800' },
    { grade: 'secondary_2', lessonsCount: 40, color: 'from-amber-600 to-orange-700' },
    { grade: 'secondary_3', lessonsCount: 50, color: 'from-rose-600 to-red-800' },
  ];

  const whyChooseUs = [
    {
      icon: <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      title: t('feat_1_title'),
      description: t('feat_1_desc'),
    },
    {
      icon: <Video className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
      title: t('feat_2_title'),
      description: t('feat_2_desc'),
    },
    {
      icon: <FileText className="w-6 h-6 text-amber-600 dark:text-amber-400" />,
      title: t('feat_3_title'),
      description: t('feat_3_desc'),
    },
    {
      icon: <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />,
      title: t('feat_4_title'),
      description: t('feat_4_desc'),
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-sky-600 dark:text-sky-400" />,
      title: t('feat_5_title'),
      description: t('feat_5_desc'),
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-rose-600 dark:text-rose-400" />,
      title: t('feat_6_title'),
      description: t('feat_6_desc'),
    },
  ];

  const studySteps = [
    { step: '01', title: isRtl ? 'إنشاء الحساب واختيار الصف' : 'Create Account & Choose Grade', desc: isRtl ? 'سجل حسابك مجاناً وحدد الصف الدراسي الخاص بك في ثوانٍ معدودة.' : 'Register for free and select your grade level in seconds.' },
    { step: '02', title: isRtl ? 'طلب اشتراك الكورس' : 'Request Course Subscription', desc: isRtl ? 'تواصل مع مستر عبدالله للحصول على كود التفعيل أو أرسل طلب اشتراك من المنصة.' : 'Get an activation code from Mr. Abdullah or send a request directly.' },
    { step: '03', title: isRtl ? 'مشاهدة الشروحات والدروس' : 'Watch Video Lessons & Download Notes', desc: isRtl ? 'استمتع بشرح الدروس والوحدات فيديو مع تحميل المذكرات المرفقة.' : 'Enjoy structured video lessons and download attached summary notes.' },
    { step: '04', title: isRtl ? 'أداء الامتحانات وتتبع النسبة' : 'Take Online Quizzes & Track Progress', desc: isRtl ? 'حل الاختبارات التفاعلية وشاهد نسبة إنجازك ترتفع نحو التميز.' : 'Solve interactive tests and watch your mastery score rise.' },
  ];

  const reviews = [
    {
      name: isRtl ? 'أحمد محمود العبد' : 'Ahmed Mahmoud',
      grade: isRtl ? 'الصف الثالث الثانوي (دفعة 2025)' : 'Secondary Grade 3 (2025 Class)',
      text: isRtl ? 'بفضل الله ثم مستر عبدالله سيد قدرت أقفل امتحان الإنجليزي بالثانوية العامة! أسلوبه في شرح الجرامر خرافة وبيخلي المادة أسهل مادة عندك.' : 'Thanks to Mr. Abdullah Sayed I scored full marks in Thanawya Amma English! His grammar explanations are incredible.',
      rating: 5,
    },
    {
      name: isRtl ? 'سارة خالد السيد' : 'Sara Khaled',
      grade: isRtl ? 'الصف الثاني الإعدادي' : 'Preparatory Grade 2',
      text: isRtl ? 'المنصة ممتازة وسريعة جداً على الموبايل. الاختبارات التفاعلية والدرجة الفورية بتخليني أعرف أخطائي وأعدلها في نفس اللحظة.' : 'The platform is super smooth on mobile! The instant quiz grading helps me fix my mistakes right away.',
      rating: 5,
    },
    {
      name: isRtl ? 'المهندس عمرو مصطفى (ولي أمر)' : 'Eng. Amr Moustafa (Parent)',
      grade: isRtl ? 'ولي أمر طالب بالصف الأول الثانوي' : 'Parent of Sec 1 Student',
      text: isRtl ? 'أشكر مستر عبدالله على المنصة الاحترافية جداً. المنظومة أتاحت لي متابعة مستوى ابني والتأكد من التزامه بالدروس ونتائجه.' : 'I highly appreciate Mr. Abdullah for this professional platform. It allows me to monitor my son\'s commitment and quiz scores regularly.',
      rating: 5,
    },
  ];

  const faqs = [
    {
      q: isRtl ? 'كيف يمكنني الاشتراك وتفعيل الكورسات الخاصة بصفي الدراسي؟' : 'How can I subscribe and activate courses for my grade?',
      a: isRtl ? 'يمكنك إنشاء حسابك على المنصة وتحديد صفك الدراسي، ثم التواصل مع مستر عبدالله سيد عبر الواتساب أو الهاتف على الرقم 01102140676 للحصول على كود التفعيل أو إرسال طلب اشتراك مباشر من لوحتك.' : 'You can create an account, select your grade, and contact Mr. Abdullah on WhatsApp/Phone (+201102140676) for activation.'
    },
    {
      q: isRtl ? 'هل تعمل المنصة على الهواتف والتابلت والكمبيوتر؟' : 'Does the platform work on phones, tablets, and computers?',
      a: isRtl ? 'نعم، المنصة مصممة بأحدث تقنيات الويب المتجاوبة وتعمل بمرونة فائقة وسرعة عالية على جميع أنواع الهواتف الذكية، التابلت، وأجهزة الكمبيوتر.' : 'Yes! The platform is fully responsive and optimized for mobile phones, tablets, and desktop browsers.'
    },
    {
      q: isRtl ? 'هل المحتوى يشمل الشرح والواجبات والمذكرات؟' : 'Does the content include videos, worksheets, and tests?',
      a: isRtl ? 'بالتأكيد، كل كورس يحتوى على وحدات مقسمة لدروس فيديو، مذكرات وملخصات PDF جاهزة للتحميل والطباعة، واختبارات إلكترونية تفاعلية بعد كل درس.' : 'Absolutely! Each course includes video lessons, downloadable PDF summaries, and instant online quizzes.'
    },
    {
      q: isRtl ? 'كيف يتابع ولي الأمر مستوى الطالب ونتائجه؟' : 'How can parents monitor student progress?',
      a: isRtl ? 'يمكن لولي الأمر مشاهدة نسبة إنجاز الطالب ودرجاته في الاختبارات مباشرة من داخل لوحة الطالب، أو التواصل المباشر مع المستر لمتابعة التقييم الدوري.' : 'Parents can check student progress and quiz scores directly from the student dashboard or by contacting Mr. Abdullah.'
    }
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-900 font-sans text-slate-800 dark:text-slate-100 transition-colors">
      
      {/* 1. Hero Section */}
      <section className="relative pt-8 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-950 to-slate-950 text-white rounded-[36px] sm:rounded-[48px] p-6 sm:p-12 md:p-16 shadow-2xl border border-blue-800/40">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            
            {/* Hero Text Content */}
            <div className="lg:col-span-7 space-y-6 text-start">
              
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/20 text-blue-300 rounded-full text-xs sm:text-sm font-bold border border-blue-400/30 backdrop-blur-md">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{t('hero_badge')}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-[1.25] tracking-tight">
                {t('hero_title_1')} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-amber-300">
                  {lang === 'en' ? 'English Language' : 'اللغة الإنجليزية'}
                </span>{' '}
                {t('hero_title_2')}
              </h1>

              <p className="text-blue-100/90 text-base sm:text-lg max-w-2xl leading-relaxed font-normal">
                {t('hero_subtitle')}
              </p>

              {/* Support Phone Banner */}
              <div className="p-3.5 sm:p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 text-xs sm:text-sm text-slate-100 max-w-xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>{isRtl ? 'تواصل مباشر مع المستر للاشتراك والتفعيل:' : 'Direct WhatsApp/Phone for Activation:'}</span>
                </div>
                <a href={`tel:${phone}`} className="font-extrabold text-amber-300 underline dir-ltr select-all text-xs sm:text-sm whitespace-nowrap">
                  {displayPhone}
                </a>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                {userProfile ? (
                  <button
                    onClick={() => setCurrentView(userProfile.role === 'master' ? 'master_dashboard' : 'student_dashboard')}
                    className="px-8 py-4 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-full shadow-xl hover:shadow-amber-400/20 transition-all flex items-center gap-3 text-base cursor-pointer"
                  >
                    <User className="w-5 h-5" />
                    <span>{t('nav_student_dashboard')}</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={onOpenAuth}
                      className="px-8 py-4 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-full shadow-xl hover:shadow-amber-400/20 transition-all flex items-center gap-3 text-base cursor-pointer"
                    >
                      <GraduationCap className="w-6 h-6" />
                      <span>{t('hero_btn_start')}</span>
                    </button>
                    <button
                      onClick={() => setCurrentView('courses')}
                      className="px-8 py-4 bg-white/15 hover:bg-white/25 text-white font-bold rounded-full border border-white/20 backdrop-blur-md transition-all flex items-center gap-3 text-base cursor-pointer"
                    >
                      <BookOpen className="w-5 h-5" />
                      <span>{t('hero_btn_courses')}</span>
                    </button>
                  </>
                )}
              </div>

              {/* Quick Hero Numbers */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/15 max-w-lg text-center">
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-amber-300">+12,000</div>
                  <div className="text-xs text-blue-200 mt-0.5">{t('hero_stat_students')}</div>
                </div>
                <div className="border-x border-white/15 px-2">
                  <div className="text-2xl sm:text-3xl font-black text-blue-300">+500</div>
                  <div className="text-xs text-blue-200 mt-0.5">{t('hero_stat_lessons')}</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-300">100%</div>
                  <div className="text-xs text-blue-200 mt-0.5">{t('hero_stat_success')}</div>
                </div>
              </div>

            </div>

            {/* Hero Teacher Profile Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative group w-full max-w-sm">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-amber-400 to-indigo-500 rounded-[32px] blur opacity-70 group-hover:opacity-100 transition duration-1000"></div>
                
                <div className="relative bg-slate-900 border border-slate-800 rounded-[30px] p-6 text-center shadow-2xl overflow-hidden flex flex-col items-center">
                  <div className="w-full h-64 bg-gradient-to-br from-blue-900 via-slate-800 to-indigo-950 rounded-2xl mb-5 flex flex-col items-center justify-center relative overflow-hidden border border-blue-500/20">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent"></div>
                    <div className="w-24 h-24 bg-gradient-to-tr from-amber-400 to-amber-200 text-slate-950 font-black rounded-3xl flex items-center justify-center text-4xl shadow-xl mb-3 border-2 border-white/30">
                      AS
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/20 text-blue-200 rounded-full text-xs font-bold border border-blue-400/30">
                      <GraduationCap className="w-4 h-4 text-amber-300" />
                      <span>Mr. Abdullah Sayed</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-xs font-extrabold mb-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                      <span>{isRtl ? 'خبير تدريس اللغة الإنجليزية' : 'English Education Specialist'}</span>
                    </div>
                    <h3 className="text-xl font-black text-white">{isRtl ? 'مستر عبدالله سيد' : 'Mr. Abdullah Sayed'}</h3>
                    <p className="text-xs text-slate-400">{isRtl ? 'أكثر من 10 سنوات في تبسيط المناهج وتفوق الطلاب' : '10+ years simplifying English for top achievement'}</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Features Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 font-extrabold text-xs rounded-full uppercase">
            {t('features_title')}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white">
            {t('features_title')}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            {t('features_subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {whyChooseUs.map((feat, idx) => (
            <div 
              key={idx}
              className="p-6 bg-white dark:bg-slate-800/80 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs hover:shadow-lg transition-all duration-300 space-y-3"
            >
              <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700/60 rounded-2xl flex items-center justify-center">
                {feat.icon}
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">{feat.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{feat.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Grades List */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-slate-100/60 dark:bg-slate-800/40 rounded-3xl my-8 border border-slate-200/60 dark:border-slate-700/40">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {t('grades_title')}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base">
            {t('grades_subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {gradesList.map((g) => (
            <div 
              key={g.grade}
              onClick={() => setCurrentView('courses')}
              className="group p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col justify-between"
            >
              <div className={`h-2 w-full bg-gradient-to-r ${g.color} absolute top-0 left-0 right-0`}></div>
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full">
                    {g.grade.startsWith('prep') ? getEducationStageLabel('prep') : getEducationStageLabel('secondary')}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {g.lessonsCount} {t('course_lessons_count')}
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {getGradeLabel(g.grade)}
                </h3>
              </div>
              <div className="pt-6 flex items-center justify-between text-xs font-bold text-blue-700 dark:text-blue-400 border-t border-slate-100 dark:border-slate-800 mt-4">
                <span>{t('course_view_btn')}</span>
                <span className="text-lg font-black group-hover:translate-x-1 transition-transform">
                  {isRtl ? '←' : '→'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Steps Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {isRtl ? 'خطوات بسيطة للبدء والتفوق' : 'Simple Steps to Get Started'}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {studySteps.map((s, idx) => (
            <div key={idx} className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3 relative">
              <span className="text-3xl font-black text-blue-600/30 dark:text-blue-400/30">
                {s.step}
              </span>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">{s.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Reviews */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {isRtl ? 'آراء واعتزاز طلابنا وأولياء الأمور' : 'Student & Parent Testimonials'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <div key={i} className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4 flex flex-col justify-between">
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
              <div className="border-t border-slate-100 dark:border-slate-700 pt-3">
                <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">{r.name}</h4>
                <p className="text-xs text-slate-400">{r.grade}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FAQ Accordion */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {t('faq_title')}
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-5 text-start font-bold text-slate-900 dark:text-white flex items-center justify-between gap-4 cursor-pointer"
              >
                <span>{faq.q}</span>
                {openFaqIndex === idx ? <ChevronUp className="w-5 h-5 text-blue-600" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
              </button>
              {openFaqIndex === idx && (
                <div className="px-5 pb-5 pt-0 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-700/50">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 7. CTA Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-3xl p-8 sm:p-12 text-center text-white space-y-6 shadow-xl">
          <h2 className="text-2xl sm:text-4xl font-black">{t('cta_title')}</h2>
          <p className="text-blue-100 text-sm sm:text-base max-w-2xl mx-auto">{t('cta_subtitle')}</p>
          <button
            onClick={onOpenAuth}
            className="px-8 py-4 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-full shadow-lg transition-all text-base cursor-pointer"
          >
            {t('cta_btn')}
          </button>
        </div>
      </section>

    </div>
  );
}

