import { BookOpen, User, Sparkles, MessageSquare, Phone, HelpCircle, GraduationCap, CheckCircle, ArrowLeft } from 'lucide-react';
import { UserProfile } from '../types';

interface HomeViewProps {
  userProfile: UserProfile | null;
  onOpenAuth: () => void;
  setCurrentView: (view: string) => void;
}

export default function HomeView({ userProfile, onOpenAuth, setCurrentView }: HomeViewProps) {
  const phone = '+201102140676';
  const displayPhone = '+20 11 0214 0676';

  const reviews = [
    {
      name: 'أحمد محمود',
      grade: 'الصف الثالث الثانوي',
      text: 'بفضل مستر عبدالله قدرت أقفل امتحان الإنجليزي في تالتة ثانوي! أسلوبه مبسط جداً وطريقة الشرح بخرائط ذهنية بتخلي القواعد تثبت في الرأس ومستحيل تنساها.',
    },
    {
      name: 'سارة خالد',
      grade: 'الصف الثاني الإعدادي',
      text: 'المنصة ممتازة جداً وسهلة الاستخدام، الاختبارات التفاعلية والدرجة اللي بتظهر فوراً بتخليني أعرف غلطاتي وأصلحها في نفس اللحظة. مجهود عظيم مستر عبدالله!',
    },
    {
      name: 'يوسف عمرو',
      grade: 'الصف الأول الثانوي',
      text: 'أفضل مدرس لغة إنجليزية بلا منازع! الكورسات مرتبة جداً والمذكرات المرفقة PDF واضحة وسهلة المذاكرة. أنصح كل زمايلي بالاشتراك فوراً.',
    },
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-900 font-sans" dir="rtl">
      {/* Hero Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-10 max-w-7xl mx-auto" dir="rtl">
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-950 to-slate-950 text-white rounded-[40px] p-8 sm:p-12 shadow-2xl">
          {/* Artistic Shape Decor */}
          <div className="absolute left-[-10%] top-[-10%] w-[400px] h-[400px] bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse pointer-events-none"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            
            {/* Hero text */}
            <div className="space-y-6 text-right">
              <span className="inline-block px-4 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-bold mb-2 backdrop-blur-md border border-blue-400/30">
                أهلاً بك في رحلة تعلم الإنجليزية
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-[1.2] mb-6">
                اتقن اللغة الإنجليزية <br />
                <span className="text-blue-400">بسهولة واحترافية</span> مع مستر عبدالله
              </h1>
              <p className="text-blue-100 text-base sm:text-lg max-w-xl opacity-85 leading-relaxed">
                منصة تعليمية متكاملة ومصممة خصيصاً لطلاب جميع المراحل الدراسية (الابتدائية، الإعدادية، والثانوية) لشرح المناهج وتأصيل قواعد اللغة الإنجليزية بأحدث الاستراتيجيات العلمية.
              </p>

              {/* Support Message Alert */}
              <div className="p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 text-xs sm:text-sm text-slate-100 max-w-lg">
                إذا واجهت أي مشكلة أو أردت تجديد الاشتراك، تواصل مع مستر عبدالله سيد على الرقم{' '}
                <a href={`tel:${phone}`} className="font-bold underline text-amber-300 hover:text-amber-200 select-all whitespace-nowrap">
                  {displayPhone}
                </a>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={() => setCurrentView('courses')}
                  className="px-6 py-3 bg-amber-400 hover:bg-amber-500 text-slate-900 font-extrabold rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer"
                >
                  <BookOpen className="w-5 h-5" />
                  تصفح الكورسات المتاحة
                </button>

                {userProfile ? (
                  <button
                    onClick={() => setCurrentView(userProfile.role === 'master' ? 'master_dashboard' : 'student_dashboard')}
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full border border-white/20 backdrop-blur-sm transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <User className="w-5 h-5" />
                    لوحتك التعليمية
                  </button>
                ) : (
                  <button
                    onClick={onOpenAuth}
                    className="px-6 py-3 bg-white hover:bg-slate-100 text-blue-900 font-bold rounded-full shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <GraduationCap className="w-5 h-5" />
                    سجل حسابك مجاناً
                  </button>
                )}
              </div>

              {/* Little stats display in hero */}
              <div className="flex gap-6 pt-4 border-t border-white/10 max-w-sm">
                <div className="flex flex-col">
                  <span className="text-white text-2xl font-bold">+500</span>
                  <span className="text-blue-300 text-xs">درس مصور وتفاعلي</span>
                </div>
                <div className="w-px bg-blue-700/60 my-1"></div>
                <div className="flex flex-col">
                  <span className="text-white text-2xl font-bold">+12</span>
                  <span className="text-blue-300 text-xs">مرحلة دراسية</span>
                </div>
              </div>
            </div>

            {/* Rotated Mockup container of the trainer */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative w-72 h-72 bg-slate-150 dark:bg-slate-800 rounded-3xl rotate-6 overflow-hidden border-4 border-white dark:border-slate-700 shadow-2xl flex flex-col items-center justify-center p-6 text-center">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-700/20 to-transparent"></div>
                <div className="text-blue-900 dark:text-blue-400 flex flex-col items-center gap-3">
                  <div className="w-20 h-20 bg-blue-100 dark:bg-blue-950/40 rounded-full flex items-center justify-center text-blue-700 dark:text-blue-400 font-extrabold text-2xl shadow-inner">
                    MR
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-slate-800 dark:text-slate-100 leading-tight">مستر عبدالله سيد</h4>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 font-bold">معلم وخبير اللغة الإنجليزية</p>
                  </div>
                  <div className="mt-2 text-[10px] bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full font-bold">
                    نشط الآن بالمنصة
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Educational Stages Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-slate-100 dark:border-slate-800" dir="rtl">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block px-3 py-1 text-xs font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 rounded-full uppercase tracking-wider">
            المراحل والصفوف الدراسية
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100 mt-3">
            اختر مرحلتك الدراسية وابدأ التفوق
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            محتوى تعليمي متكامل ومخصص لكل صف دراسي يغطي المناهج والقواعد والكلمات مع اختبارات ذكية ومتابعة فورية.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* المرحلة الابتدائية */}
          <div className="bg-white dark:bg-slate-950 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow group flex flex-col justify-between text-right">
            <div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950/40 rounded-2xl flex items-center justify-center text-blue-750 font-sans font-bold text-xl mb-4 group-hover:bg-blue-700 group-hover:text-white transition-colors">
                1
              </div>
              <h4 className="text-xl font-bold mb-2 text-slate-800 dark:text-slate-100">المرحلة الابتدائية</h4>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 leading-relaxed">
                تأسيس سليم وممتع لطلاب الصف الأول حتى السادس الابتدائي بأحدث الأساليب التعليمية لتبسيط الكلمات والجرامر والنطق الصحيح.
              </p>
            </div>
            <button
              onClick={() => setCurrentView('courses')}
              className="w-full py-3 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold rounded-xl group-hover:bg-blue-50 dark:group-hover:bg-blue-950/35 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors text-sm cursor-pointer"
            >
              استعراض المناهج
            </button>
          </div>

          {/* المرحلة الإعدادية */}
          <div className="bg-white dark:bg-slate-950 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow group flex flex-col justify-between text-right">
            <div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950/40 rounded-2xl flex items-center justify-center text-blue-750 font-sans font-bold text-xl mb-4 group-hover:bg-blue-700 group-hover:text-white transition-colors">
                2
              </div>
              <h4 className="text-xl font-bold mb-2 text-slate-800 dark:text-slate-100">المرحلة الإعدادية</h4>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 leading-relaxed">
                شرح وافي لكافة القواعد والجرامر والوحدات المقررة لطلاب الصف الأول، الثاني، والثالث الإعدادي مع اختبارات تفاعلية لكل درس.
              </p>
            </div>
            <button
              onClick={() => setCurrentView('courses')}
              className="w-full py-3 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold rounded-xl group-hover:bg-blue-50 dark:group-hover:bg-blue-950/35 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors text-sm cursor-pointer"
            >
              استعراض المناهج
            </button>
          </div>

          {/* المرحلة الثانوية */}
          <div className="bg-white dark:bg-slate-950 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow group flex flex-col justify-between text-right">
            <div>
              <div className="w-12 h-12 bg-blue-700 text-white rounded-2xl flex items-center justify-center font-sans font-bold text-xl mb-4">
                3
              </div>
              <h4 className="text-xl font-bold mb-2 text-slate-800 dark:text-slate-100">المرحلة الثانوية</h4>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 leading-relaxed">
                تغطية شاملة ومكثفة لطلاب المرحلة الثانوية (الأول، الثاني، والثالث الثانوي)، مع حل آلاف التدريبات والامتحانات السابقة وتدريبات الترجمة.
              </p>
            </div>
            <button
              onClick={() => setCurrentView('courses')}
              className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl shadow-lg shadow-blue-200 dark:shadow-none transition-all text-sm cursor-pointer"
            >
              عرض الكورسات المتاحة
            </button>
          </div>
        </div>
      </section>

      {/* About Mr. Abdullah Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-right">
            <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">نبذة عن مستر عبدالله سيد</h2>
            <div className="w-20 h-1.5 bg-blue-600 rounded-full"></div>
            <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">
              خبير تدريس اللغة الإنجليزية وصاحب خبرة تمتد لأكثر من عشر سنوات في تيسير المناهج لجميع المراحل الدراسية. يقوم مستر عبدالله بتقديم المادة العلمية بطريقة مبسطة جداً تجعل من الصعب سهلاً، وتركز على الفهم الحقيقي للغة لتمكين الطالب من التفوق في الامتحانات والوصول للدرجة النهائية.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300">
                <CheckCircle className="w-5 h-5 text-blue-600 shrink-0" />
                <span>شرح مبسط لقواعد الجرامر بأحدث أسلوب تعليمي.</span>
              </li>
              <li className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300">
                <CheckCircle className="w-5 h-5 text-blue-600 shrink-0" />
                <span>متابعة تفصيلية لمستوى الطلاب ونتائج اختباراتهم.</span>
              </li>
              <li className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300">
                <CheckCircle className="w-5 h-5 text-blue-600 shrink-0" />
                <span>مذكرات شرح وملازم تدريبات جاهزة للطباعة والتحميل.</span>
              </li>
            </ul>
            <div className="pt-2">
              <button
                onClick={() => setCurrentView('about')}
                className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all text-sm cursor-pointer"
              >
                <span>اقرأ المزيد عن مستر عبدالله</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-950 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl space-y-6 flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-blue-50 dark:bg-blue-950/30 rounded-full flex items-center justify-center text-blue-600 text-3xl font-black shadow-inner">
              عبدالله
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">مستشارك الأول في التفوق بالإنجليزية</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              نحن لا نلقن بل نُعلّم، ونسعى لبناء شخصية طالب واثقة تتحدث وتكتب الإنجليزية ببراعة واقتدار.
            </p>
            <div className="w-full border-t border-slate-100 dark:border-slate-800 pt-6 grid grid-cols-2 gap-4">
              <div>
                <div className="text-2xl font-black text-blue-600">10+</div>
                <div className="text-xs text-slate-400 mt-1">سنين خبرة</div>
              </div>
              <div>
                <div className="text-2xl font-black text-blue-600">100%</div>
                <div className="text-xs text-slate-400 mt-1">نسبة تفوق</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews (آراء الطلاب) */}
      <section className="bg-white dark:bg-slate-950 py-20 px-4 sm:px-6 lg:px-8 border-y border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-4">آراء وقصص نجاح طلابنا</h2>
            <div className="w-20 h-1.5 bg-blue-600 rounded-full mx-auto mb-4"></div>
            <p className="text-slate-500 dark:text-slate-400">
              ماذا يقول طلابنا وأولياء الأمور عن تجربتهم التعليمية على منصة مستر عبدالله سيد.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((rev, idx) => (
              <div
                key={idx}
                className="bg-slate-50 dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-md flex flex-col justify-between"
              >
                <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed italic text-right mb-6">
                  "{rev.text}"
                </p>
                <div className="flex items-center gap-3 border-t border-slate-200/50 dark:border-slate-800/50 pt-4" dir="rtl">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-950/30 rounded-full flex items-center justify-center font-bold text-blue-600 text-sm shrink-0">
                    {rev.name[0]}
                  </div>
                  <div className="text-right">
                    <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">{rev.name}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{rev.grade}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Summary section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <HelpCircle className="w-10 h-10 text-blue-600 mx-auto mb-3" />
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100">الأسئلة الشائعة للطلاب</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">نساعدك في معرفة كل التفاصيل سريعاً.</p>
        </div>

        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-950 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-md">
            <h4 className="font-bold text-slate-800 dark:text-slate-100 text-base mb-2 text-right">كيف أحصل على كود تفعيل الاشتراك؟</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 text-right leading-relaxed">
              ببساطة شديدة، قم بالتواصل مباشرة مع مستر عبدالله سيد على الهاتف أو عبر واتساب على الرقم +20 11 0214 0676، وسيتم تزويدك بكود خاص لتفعيل صفك الدراسي لمدة شهر كامل.
            </p>
          </div>
          <div className="bg-white dark:bg-slate-950 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-md">
            <h4 className="font-bold text-slate-800 dark:text-slate-100 text-base mb-2 text-right">هل تعمل المنصة على الموبايل والتابلت؟</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 text-right leading-relaxed">
              نعم، المنصة سريعة جداً ومتجاوبة بالكامل لتناسب جميع مقاسات الشاشات كالهواتف الذكية، التابلت، والكمبيوتر، مع ميزة حفظ نسبة إنجاز الطالب في تصفح الدروس وحل الاختبارات.
            </p>
          </div>
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => setCurrentView('faq')}
            className="text-sm text-blue-600 dark:text-blue-400 font-bold hover:underline"
          >
            عرض كافة الأسئلة الشائعة بالتفصيل
          </button>
        </div>
      </section>

      {/* Support Message Alert Footer */}
      <section className="bg-blue-600 text-white py-12 px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold">تواجه مشكلة في تسجيل الدخول أو تشغيل فيديو أو ملفات؟</h2>
          <p className="text-sm sm:text-base text-blue-100">
            إذا واجهت أي مشكلة أو أردت تجديد الاشتراك، تواصل مع مستر عبدالله سيد على الرقم المباشر:
          </p>
          <div className="text-2xl font-black text-amber-300 select-all tracking-wider">
            {displayPhone}
          </div>
          <div className="pt-2 flex justify-center gap-4">
            <a
              href={`tel:${phone}`}
              className="px-5 py-2.5 bg-white text-blue-800 font-extrabold rounded-xl shadow-lg transition-all text-sm"
            >
              اتصل بنا الآن
            </a>
            <a
              href={`https://wa.me/${phone.replace('+', '')}`}
              target="_blank"
              referrerPolicy="no-referrer"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-lg transition-all text-sm"
            >
              مراسلة واتساب دافئة
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
