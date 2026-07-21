import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FAQItem {
  q: string;
  a: string;
}

export default function FAQView() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      q: 'كيف يمكنني الاشتراك في منصة مستر عبدالله سيد؟',
      a: 'الاشتراك سهل جداً: أولاً، قم بإنشاء حساب جديد على المنصة مجاناً واختيار الصف الدراسي الخاص بك. ثانياً، تواصل مع مستر عبدالله سيد هاتفياً أو عبر واتساب للحصول على كود التفعيل المخصص لصفك الدراسي.',
    },
    {
      q: 'ما هي مدة صلاحية الاشتراك؟ وكيف يتم التجديد؟',
      a: 'مدة الاشتراك هي شهر واحد (30 يوماً) تبدأ من تاريخ تفعيل الكود. عند انتهاء الاشتراك يتوقف الحساب تلقائياً عن عرض الدروس وتصفح الكورسات، وتظهر لك شاشة تطلب منك كود تفعيل جديد لتجديد الاشتراك لشهر آخر.',
    },
    {
      q: 'هل يمكنني تشغيل حسابي على أكثر من جهاز في نفس الوقت؟',
      a: 'لا، تمنع المنصة مشاركة الحسابات حمايةً للمحتوى التعليمي وجهد المستر. عند تسجيل الدخول من جهاز جديد، سيتم تلقائياً تسجيل الخروج من الجهاز الآخر ومنع الاستخدام المتزامن.',
    },
    {
      q: 'هل يمكنني مشاهدة الدروس أو تحميل المذكرات بدون اشتراك؟',
      a: 'لا، جميع الكورسات والدروس وملفات PDF والمذكرات مغلقة تماماً، ولا يمكن الوصول لأي منها أو مشاهدة الفيديوهات أو حل الاختبارات دون تسجيل الدخول بحساب يحتوي على اشتراك ساري الفعالية.',
    },
    {
      q: 'ما هي أنواع الاختبارات المتاحة وكيف أعرف نتيجتي؟',
      a: 'تضم المنصة اختبارات شاملة ومتنوعة (اختيار من متعدد، صح وخطأ، أكمل الفراغات). يتم تصحيح الاختبارات تلقائياً بمجرد إرسال الحل وتظهر لك نتيجتك التفصيلية على الفور وتُحفظ في لوحة الطالب الخاصة بك لمتابعة الإنجاز.',
    },
    {
      q: 'ماذا أفعل إذا واجهت مشكلة في تشغيل الفيديوهات أو تفعيل الكود؟',
      a: 'إذا واجهتك أي مشكلة تقنية أو أردت تجديد الاشتراك، يمكنك دائماً الضغط على زر "تواصل عبر واتساب" أو الاتصال مباشرة بمستر عبدالله سيد على الرقم الموحد +20 11 0214 0676 وسنكون سعداء بمساعدتك فوراً.',
    },
  ];

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 py-16 font-sans" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Title */}
        <div className="text-center mb-12">
          <HelpCircle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-2">
            الأسئلة الشائعة
          </h1>
          <p className="text-base text-slate-500 dark:text-slate-400">
            كل ما تود معرفته عن منصة مستر عبدالله سيد وكيفية تشغيل الدروس والاختبارات والتجديد.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-md overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => handleToggle(index)}
                  className="w-full flex items-center justify-between p-5 text-right font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-900/40 outline-none transition-colors"
                >
                  <span className="text-base sm:text-lg leading-6">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-blue-600 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-50 dark:border-slate-900/60">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Banner */}
        <div className="mt-12 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 p-6 rounded-2xl text-center">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-2">هل لديك سؤال آخر لم نجيب عليه؟</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            تواصل معنا مباشرة عبر واتساب للحصول على استجابة فورية.
          </p>
          <a
            href="https://wa.me/201102140676"
            target="_blank"
            referrerPolicy="no-referrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all text-sm cursor-pointer"
          >
            اسأل مستر عبدالله الآن
          </a>
        </div>
      </div>
    </div>
  );
}
