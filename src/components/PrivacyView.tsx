import { ShieldCheck } from 'lucide-react';

export default function PrivacyView() {
  return (
    <div className="bg-slate-50 dark:bg-slate-900 py-16 font-sans leading-relaxed text-right" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-white dark:bg-slate-950 p-8 sm:p-12 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <ShieldCheck className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">سياسة الخصوصية</h1>
          </div>

          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
            تاريخ التحديث الأخير: يوليو 2026
          </p>

          <div className="space-y-6 text-slate-600 dark:text-slate-300 text-sm sm:text-base">
            <p>
              أهلاً بك في <strong>منصة مستر عبدالله سيد لتدريس اللغة الإنجليزية</strong>. نحن نولي خصوصيتك وحماية بياناتك الشخصية أهمية قصوى. تهدف هذه السياسة إلى توضيح نوع البيانات التي نجمعها وكيفية استخدامها وحمايتها عند استخدامك لمنصتنا التعليمية.
            </p>

            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 pt-4 border-t border-slate-100 dark:border-slate-800">
              1. البيانات التي نجمعها
            </h2>
            <p>
              عند قيامك بإنشاء حساب جديد، نقوم بجمع بعض المعلومات الأساسية التي تساعدنا على تقديم خدمتنا التعليمية وتفعيل اشتراكك بشكل آمن، وهي تشمل:
            </p>
            <ul className="list-disc list-inside space-y-2 pr-4">
              <li>الاسم الكامل للطالب لتخصيص لوحة التحكم والشهادات والنتائج.</li>
              <li>البريد الإلكتروني لإدارة تسجيل الدخول واستعادة كلمة المرور بشكل آمن.</li>
              <li>رقم الهاتف أو واتساب لتسهيل التواصل بخصوص تجديد الاشتراك وتلقي الدعم.</li>
              <li>الصف الدراسي الحالي لعرض الكورسات والدروس الملائمة لك فقط.</li>
            </ul>

            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 pt-4 border-t border-slate-100 dark:border-slate-800">
              2. كيف نستخدم بياناتك الشخصية؟
            </h2>
            <p>
              نستخدم معلوماتك الشخصية في الأغراض التالية فقط:
            </p>
            <ul className="list-disc list-inside space-y-2 pr-4">
              <li>تشغيل وتأمين حسابك على المنصة وعرض المحتوى المخصص لصفك الدراسي.</li>
              <li>التحقق من حالة اشتراكك الشهري النشط وتفعيل الأكواد.</li>
              <li>حماية حسابك من الاختراق أو الاستخدام المتعدد في نفس الوقت عن طريق تسجيل معرف الجلسة الفردية للجهاز النشط.</li>
              <li>تسجيل نتائج وحلول الاختبارات لتظهر لك في لوحتك الخاصة ومشاركتها مع المستر لتقييم مستواك.</li>
            </ul>

            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 pt-4 border-t border-slate-100 dark:border-slate-800">
              3. أمن وحماية البيانات
            </h2>
            <p>
              نحن نستخدم خدمات <strong>Google Firebase</strong> الموثوقة عالمياً لتأمين وتخزين كلمات المرور مشفرة تماماً، ولا يمكن لأحد (حتى إدارة المنصة) الاطلاع على كلمة المرور الخاصة بك. كما نلتزم بعدم بيع أو مشاركة أو توزيع بيانات الطلاب الشخصية لأي جهات خارجية أو أطراف ثالثة لأغراض تجارية أو دعائية.
            </p>

            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 pt-4 border-t border-slate-100 dark:border-slate-800">
              4. اتصل بنا
            </h2>
            <p>
              إذا كان لديك أي أسئلة أو مخاوف تتعلق بسياسة الخصوصية الخاصة بنا، لا تتردد في الاتصال بمستر عبدالله سيد على الرقم الموحد والدعم: <span className="font-bold text-blue-600 dark:text-blue-400 select-all">+20 11 0214 0676</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
