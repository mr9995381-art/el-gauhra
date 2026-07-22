import { Award, BookOpen, Clock, Heart, Phone, MessageSquare } from 'lucide-react';

export default function AboutView() {
  const phone = '+201102140676';
  const displayPhone = '+20 11 0214 0676';

  const stats = [
    { label: 'سنة من الخبرة التعليمية', value: '+10', icon: <Clock className="w-6 h-6 text-blue-600" /> },
    { label: 'طالب وطالبة في مختلف المراحل', value: '+5,000', icon: <Award className="w-6 h-6 text-blue-600" /> },
    { label: 'درس ومحاضرة تفاعلية كاملة', value: '+1,200', icon: <BookOpen className="w-6 h-6 text-blue-600" /> },
    { label: 'معدل نجاح وتفوق طلابنا', value: '100%', icon: <Heart className="w-6 h-6 text-blue-600" /> },
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-900 py-16 font-sans" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-slate-100 mb-4">
            نبذة عن مستر عبدالله سيد
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            تعرف على رحلة مستر عبدالله سيد ورؤيته في جعل تعلم الإنجليزية تجربة ممتعة وسهلة.
          </p>
        </div>

        {/* Content Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              شعارنا: "اللغة الإنجليزية ليست مجرد مادة دراسية، بل هي نافذتك على العالم"
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-base">
              مستر عبدالله سيد، خبير تدريس اللغة الإنجليزية للمراحل الإعدادية والثانوية في جمهورية مصر العربية. على مدار أكثر من 10 سنوات، قام مستر عبدالله بتمكين آلاف الطلاب من اجتياز الامتحانات بتفوق منقطع النظير، وبناء أساس لغوي قوي يساعدهم في مستقبلهم الجامعي والمهني.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-base">
              تعتمد منصتنا على دمج التعليم الأكاديمي الرصين بالأدوات التكنولوجية الحديثة كالفيديوهات التفاعلية والاختبارات التلقائية الذكية التي تمنح الطالب تغذية راجعة فورية، مع نظام متابعة دقيق لنسبة الإنجاز للحفاظ على الشغف والتطور المستمر للطلاب.
            </p>
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href={`tel:${phone}`}
                className="flex items-center gap-2 px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-full shadow-lg shadow-blue-200/50 dark:shadow-none transition-all text-sm"
              >
                <Phone className="w-4 h-4" />
                اتصل بمستر عبدالله
              </a>
              <a
                href={`https://wa.me/${phone.replace('+', '')}`}
                target="_blank"
                referrerPolicy="no-referrer"
                className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-full shadow-lg shadow-emerald-200/50 dark:shadow-none transition-all text-sm"
              >
                <MessageSquare className="w-4 h-4" />
                تواصل واتساب
              </a>
            </div>
          </div>

          {/* Visual card */}
          <div className="relative bg-white dark:bg-slate-950 rounded-[32px] border-2 border-blue-100 dark:border-slate-800 shadow-2xl p-8 overflow-hidden flex flex-col items-center text-center">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
            <div className="w-32 h-32 bg-blue-700 rounded-full flex items-center justify-center mb-6 border-4 border-white dark:border-slate-800 shadow-xl">
              <span className="text-4xl font-extrabold text-white">MR</span>
            </div>
            <h3 className="text-2xl font-black text-blue-900 dark:text-blue-400 mb-2">مستر عبدالله سيد</h3>
            <p className="text-sm text-blue-700 dark:text-blue-350 font-bold uppercase tracking-wider mb-4">
              خبير ومحاضر اللغة الإنجليزية
            </p>
            <p className="text-slate-600 dark:text-slate-400 text-sm max-w-sm mb-6 leading-relaxed">
              مبتكر أسلوب "الخريطة الذهنية التفاعلية" لتبسيط قواعد اللغة الإنجليزية وحفظ الكلمات بسهولة ويسر دون عناء.
            </p>
            <div className="w-full grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="font-extrabold text-lg text-blue-700 dark:text-blue-400">رؤيتنا</div>
                <div className="text-xs text-slate-500 mt-1">تسهيل التعليم وجعله في متناول الجميع بجودة لا تقارن.</div>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="font-extrabold text-lg text-blue-700 dark:text-blue-400">رسالتنا</div>
                <div className="text-xs text-slate-500 mt-1">تخريج أجيال متفوقة لغوياً قادرة على المنافسة عالمياً.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-md flex items-center gap-4 transition-transform hover:-translate-y-1"
            >
              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-xl shrink-0">
                {stat.icon}
              </div>
              <div>
                <div className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">{stat.value}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
