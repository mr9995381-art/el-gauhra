import { Award, BookOpen, Clock, Heart, Phone, MessageSquare, GraduationCap, Sparkles, CheckCircle2, Languages, BrainCircuit } from 'lucide-react';

export default function AboutView() {
  const phone = '+201102140676';
  const displayPhone = '01102140676';

  const stats = [
    { label: 'سنة من الخبرة في تدريس اللغة الإنجليزية', value: '+12', icon: <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" /> },
    { label: 'طالب وطالبة حققوا الدرجة النهائية (Full Mark)', value: '+15,000', icon: <Award className="w-6 h-6 text-amber-500" /> },
    { label: 'محاضرة وكبسولة جرامر وبنك أسئلة ومذكرة', value: '+650', icon: <BookOpen className="w-6 h-6 text-indigo-500" /> },
    { label: 'نسبة رضا وتقييم الطلاب وأولياء الأمور', value: '99.8%', icon: <Heart className="w-6 h-6 text-rose-500" /> },
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-950 py-16 font-sans text-slate-800 dark:text-slate-100" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 font-extrabold text-xs rounded-full border border-blue-300 dark:border-blue-800">
            <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>عن مستر عبدالله سيد</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black">
            خبير أول ومحاضر مادة اللغة الإنجليزية
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            صاحب الأسلوب الأقوى والأبسط في تبسيط قواعد وأزمنة اللغة الإنجليزية، وفك شفرات الترجمة والقطع المتحررة، والوصول بالطلاب لأعلى مراتب التفوق والدرجة النهائية.
          </p>
        </div>

        {/* Content Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-snug">
              رؤيتنا في التدريس: "اللغة الإنجليزية مهارة ممتعة وطريقك المضمون للتفوق والدرجة النهائية"
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base">
              يُعد <strong>مستر عبدالله سيد</strong> واحداً من أبرز معلمي ومحاضري اللغة الإنجليزية في مصر للمرحلتين الثانوية والإعدادية، ومؤلف سلسلة مذكرات <strong>"The Master"</strong> الشاملة في القواعد والكلمات وبنوك الأسئلة الامتحانية.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base">
              اعتمد مستر عبدالله على مدار أكثر من 12 عاماً نهجاً تعليمياً متطوراً يدمج بين الفهم العميق لأساسيات وقواعد اللغة والتدريب المكثف على أنماط أسئلة الامتحانات الحديثة، وابتكار "كبسولات الجرامر" السريعة التي تمكن الطالب من الإجابة على أدق الأسئلة التراكمية في ثوانٍ معدودة.
            </p>

            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>شرح مبسط وتفكيك لتريكات الجرامر والاستثناءات اللغوية الصعبة.</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>إتقان مهارات الترجمة والصياغة الاحترافية بدون أخطاء تركيبية.</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>بنك أسئلة واختبارات شاملة تحاكي مواصفات الورقة الامتحانية الوزارية.</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>متابعة تفصيلية منتظمة مع أولياء الأمور لضمان استمرارية التميز.</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-4 pt-4">
              <a
                href={`tel:${phone}`}
                className="flex items-center gap-2 px-6 py-3.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-2xl shadow-lg transition-all text-sm"
              >
                <Phone className="w-4 h-4" />
                <span>اتصل بنا لحجز الكورسات: {displayPhone}</span>
              </a>
              <a
                href={`https://wa.me/201102140676?text=${encodeURIComponent('السلام عليكم مستر عبدالله سيد، أريد الاستفسار عن تفاصيل كورسات الإنجليزي')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg transition-all text-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span>تواصل عبر الواتساب</span>
              </a>
            </div>
          </div>

          {/* Visual Showcase Card */}
          <div className="lg:col-span-5 relative bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white rounded-[36px] border border-blue-400/40 shadow-2xl p-8 overflow-hidden flex flex-col items-center text-center">
            
            {/* Monogram / Icon */}
            <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-800 text-white rounded-3xl flex items-center justify-center mb-6 shadow-xl border-2 border-white/20 text-3xl font-black">
              AS
            </div>
            
            <h3 className="text-2xl font-black text-amber-300 mb-1">مستر عبدالله سيد</h3>
            <p className="text-xs text-blue-200 font-bold tracking-wider mb-6">
              MR. ABDULLAH SAYED | THE ENGLISH MASTER
            </p>

            <div className="w-full space-y-3">
              <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 text-start">
                <div className="font-extrabold text-sm text-sky-400 flex items-center gap-1.5">
                  <BrainCircuit className="w-4 h-4" />
                  مبتكر كبسولات الجرامر
                </div>
                <div className="text-xs text-slate-300 mt-1">
                  أسلوب تفكيكي فريد يجعل قواعد اللغة الإنجليزية والأزمنة التراكمية في غاية السهولة والوضوح.
                </div>
              </div>

              <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 text-start">
                <div className="font-extrabold text-sm text-amber-400 flex items-center gap-1.5">
                  <Languages className="w-4 h-4" />
                  مؤلف سلسلة "The Master"
                </div>
                <div className="text-xs text-slate-300 mt-1">
                  سلسلة المذكرات الأشهر في تدريس مهارات المقال، الترجمة، القصة المقررة، وبنك أسئلة الامتحانات.
                </div>
              </div>
            </div>

            <div className="w-full grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-800">
              <div className="p-3 bg-slate-900/60 rounded-xl text-center">
                <span className="text-xs font-bold text-amber-300 block">رسالتنا</span>
                <span className="text-[11px] text-slate-400">الريادة في تعليم اللغة الإنجليزية</span>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl text-center">
                <span className="text-xs font-bold text-amber-300 block">هدفنا الأسمى</span>
                <span className="text-[11px] text-slate-400">Full Mark لكل طالب</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4 transition-transform hover:-translate-y-1"
            >
              <div className="p-3.5 bg-blue-50 dark:bg-blue-950/40 rounded-2xl shrink-0 border border-blue-200 dark:border-blue-900">
                {stat.icon}
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
