import { Phone, MessageSquare, Shield, HelpCircle, FileText, Info } from 'lucide-react';

interface FooterProps {
  setCurrentView: (view: string) => void;
}

export default function Footer({ setCurrentView }: FooterProps) {
  const phone = '+201102140676';
  const displayPhone = '+20 11 0214 0676';

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-16 pb-8 font-sans" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Section 1: About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-md">
                A
              </div>
              <span className="font-bold text-xl text-white">منصة مستر عبدالله سيد</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              المنصة التعليمية الأولى والوحيدة المتكاملة لتدريس اللغة الإنجليزية للمراحل الإعدادية والثانوية. نسعى دائمًا لتقديم أفضل مستويات التعليم بأساليب تفاعلية حديثة واختبارات متطورة.
            </p>
            {/* Warning Message inside footer */}
            <div className="p-4 bg-slate-800/80 border border-slate-700/60 rounded-xl text-xs text-amber-400 leading-relaxed">
              إذا واجهت أي مشكلة أو أردت تجديد الاشتراك، تواصل مع مستر عبدالله سيد على الرقم{' '}
              <a href={`tel:${phone}`} className="font-bold underline hover:text-amber-300 whitespace-nowrap">
                {displayPhone}
              </a>
            </div>
          </div>

          {/* Section 2: Quick Links */}
          <div className="md:pr-12">
            <h3 className="text-lg font-bold text-white mb-6">روابط سريعة</h3>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => setCurrentView('about')}
                  className="flex items-center gap-2 text-sm text-slate-400 hover:text-blue-400 transition-colors cursor-pointer"
                >
                  <Info className="w-4 h-4 text-blue-500" />
                  من نحن (نبذة عن المستر)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('faq')}
                  className="flex items-center gap-2 text-sm text-slate-400 hover:text-blue-400 transition-colors cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4 text-blue-500" />
                  الأسئلة الشائعة
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('privacy')}
                  className="flex items-center gap-2 text-sm text-slate-400 hover:text-blue-400 transition-colors cursor-pointer"
                >
                  <Shield className="w-4 h-4 text-blue-500" />
                  سياسة الخصوصية
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('terms')}
                  className="flex items-center gap-2 text-sm text-slate-400 hover:text-blue-400 transition-colors cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-blue-500" />
                  الشروط والأحكام
                </button>
              </li>
            </ul>
          </div>

          {/* Section 3: Contact info */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6">تواصل معنا الآن</h3>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              يسعدنا دائماً تواصلكم معنا للاستفسار أو الدعم أو لتفعيل الحسابات والحصول على أكواد الاشتراك.
            </p>
            <div className="flex flex-col gap-3">
              <a
                href={`tel:${phone}`}
                className="flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg transition-all"
              >
                <Phone className="w-4 h-4" />
                اتصل بنا الآن
              </a>
              <a
                href={`https://wa.me/${phone.replace('+', '')}`}
                target="_blank"
                referrerPolicy="no-referrer"
                className="flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-lg transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                تواصل عبر واتساب
              </a>
            </div>
            <div className="mt-4 text-xs text-slate-500 text-center md:text-right">
              هاتف / واتساب: <span className="font-bold text-slate-400 select-all">{displayPhone}</span>
            </div>
          </div>
        </div>

        <hr className="border-slate-800 my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} منصة مستر عبدالله سيد لتدريس اللغة الإنجليزية. جميع الحقوق محفوظة.</p>
          <p>بنيت بالكامل بأعلى معايير الأمان والتفاعل السريع.</p>
        </div>
      </div>
    </footer>
  );
}
