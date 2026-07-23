import { Scale } from 'lucide-react';

export default function TermsView() {
  return (
    <div className="bg-slate-50 dark:bg-slate-900 py-16 font-sans leading-relaxed text-right" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-white dark:bg-slate-950 p-8 sm:p-12 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <Scale className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">الشروط والأحكام</h1>
          </div>

          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
            تاريخ التحديث الأخير: يوليو 2026
          </p>

          <div className="space-y-6 text-slate-600 dark:text-slate-300 text-sm sm:text-base">
            <p>
              باستخدامك لـ <strong>منصة مستر عبدالله سيد لتدريس اللغة الإنجليزية</strong>، فإنك توافق بالكامل على الالتزام بالشروط والأحكام المبينة أدناه. يرجى قراءتها بعناية لضمان تجربة تعليمية متميزة وآمنة للجميع.
            </p>

            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 pt-4 border-t border-slate-100 dark:border-slate-800">
              1. سياسة استخدام الأجهزة والوصول للحساب
            </h2>
            <p className="font-bold text-slate-800 dark:text-slate-100">
              يمكنك تسجيل الدخول واستخدام حسابك الشخصي من أجهزة متعددة بسهولة (مثل الهاتف والتابلت والكمبيوتر).
            </p>
            <p>
              يستطيع الطالب متابعة دروسه واختباراته في أي وقت ومن أي جهاز يرغب فيه دون أي قيود على عدد الأجهزة المسجلة.
            </p>

            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 pt-4 border-t border-slate-100 dark:border-slate-800">
              2. تفعيل الحساب والاشتراك الشهري
            </h2>
            <ul className="list-disc list-inside space-y-2 pr-4">
              <li>الاشتراك في المنصة يعتمد على نظام تفعيل شهري (30 يوماً متواصلة) باستخدام أكواد اشتراك يقوم المستر بإنشائها وتزويدك بها.</li>
              <li>كل كود اشتراك مخصص للاستخدام لمرة واحدة فقط ويرتبط بحساب الطالب الذي قام بتفعيله.</li>
              <li>عند انتهاء فترة الـ 30 يوماً، يتوقف حساب الطالب فوراً عن إظهار الدروس أو تشغيل مقاطع الفيديو التعليمية، ويجب على الطالب الحصول على كود جديد للتجديد.</li>
            </ul>

            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 pt-4 border-t border-slate-100 dark:border-slate-800">
              3. حقوق الملكية الفكرية وحماية المحتوى
            </h2>
            <p>
              جميع المواد التعليمية المنشورة على المنصة بما في ذلك الشروحات، ومذكرات PDF، والاختبارات التفاعلية، والملفات المرفقة هي ملكية فكرية حصرية لـ <strong>مستر عبدالله سيد</strong>. يمنع منعاً باتاً:
            </p>
            <ul className="list-disc list-inside space-y-2 pr-4">
              <li>إعادة نشر أو بيع مذكرات الشرح أو المذكرات والملفات المرفقة خارج المنصة دون إذن خطي مسبق.</li>
              <li>محاولة تصوير الشاشة للفيديوهات التعليمية المدمجة بغرض تسريبها أو توزيعها.</li>
            </ul>

            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 pt-4 border-t border-slate-100 dark:border-slate-800">
              4. الدعم الفني وحل المشكلات
            </h2>
            <p>
              إذا واجه الطالب أي مشكلة تقنية، أو خلل في تفعيل الكود، أو رغب في تجديد الاشتراك، يجب عليه فوراً التواصل مع الإدارة الموحدة لمستر عبدالله سيد على الرقم المباشر والدعم: <span className="font-bold text-blue-600 dark:text-blue-400 select-all">+20 11 0214 0676</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
