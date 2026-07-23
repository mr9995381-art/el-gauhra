import { Phone, MessageSquare, Shield, HelpCircle, FileText, Info } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';

const WhatsAppIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.119.553 4.11 1.519 5.84L0 24l6.336-1.492C8.012 23.447 9.948 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.82 0-3.535-.483-5.025-1.325l-.36-.203-3.738.88.899-3.642-.224-.356C2.64 15.82 2 13.98 2 12c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10z"/>
  </svg>
);

interface FooterProps {
  setCurrentView: (view: string) => void;
}

export default function Footer({ setCurrentView }: FooterProps) {
  const { t, isRtl } = useLanguage();
  const phone = '+201102140676';
  const displayPhone = '+20 11 0214 0676';

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-16 pb-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Section 1: About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-md">
                AS
              </div>
              <span className="font-bold text-xl text-white">{t('footer_platform_name')}</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              {t('footer_desc')}
            </p>
            {/* Warning Message inside footer */}
            <div className="p-4 bg-slate-800/80 border border-slate-700/60 rounded-xl text-xs text-amber-400 leading-relaxed">
              {isRtl ? 'إذا واجهت أي مشكلة أو أردت تجديد الاشتراك، تواصل مع مستر عبدالله سيد على الرقم ' : 'If you face any issues or want to renew subscription, contact Mr. Abdullah Sayed at '}
              <a href={`tel:${phone}`} className="font-bold underline hover:text-amber-300 whitespace-nowrap">
                {displayPhone}
              </a>
            </div>
          </div>

          {/* Section 2: Quick Links */}
          <div className={isRtl ? 'md:pr-12' : 'md:pl-12'}>
            <h3 className="text-lg font-bold text-white mb-6">{t('footer_quick_links')}</h3>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => setCurrentView('about')}
                  className="flex items-center gap-2 text-sm text-slate-400 hover:text-blue-400 transition-colors cursor-pointer"
                >
                  <Info className="w-4 h-4 text-blue-500" />
                  {t('nav_about')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('faq')}
                  className="flex items-center gap-2 text-sm text-slate-400 hover:text-blue-400 transition-colors cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4 text-blue-500" />
                  {t('nav_faq')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('privacy')}
                  className="flex items-center gap-2 text-sm text-slate-400 hover:text-blue-400 transition-colors cursor-pointer"
                >
                  <Shield className="w-4 h-4 text-blue-500" />
                  {t('footer_privacy')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('terms')}
                  className="flex items-center gap-2 text-sm text-slate-400 hover:text-blue-400 transition-colors cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-blue-500" />
                  {t('footer_terms')}
                </button>
              </li>
            </ul>
          </div>

          {/* Section 3: Contact info */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6">{t('footer_contact_us')}</h3>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              {isRtl ? 'يسعدنا دائماً تواصلكم معنا للاستفسار أو الدعم أو لتفعيل الحسابات والحصول على أكواد الاشتراك.' : 'We are always happy to answer your inquiries, support, or activate accounts and codes.'}
            </p>
            <div className="flex flex-col gap-3">
              <a
                href={`tel:${phone}`}
                className="flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg transition-all"
              >
                <Phone className="w-4 h-4" />
                {t('contact_call')}
              </a>
              <a
                href={`https://wa.me/${phone.replace('+', '')}`}
                target="_blank"
                referrerPolicy="no-referrer"
                className="flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-lg transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                {t('contact_whatsapp')}
              </a>
            </div>
            <div className="mt-4 text-xs text-slate-500 text-center">
              {isRtl ? 'هاتف / واتساب: ' : 'Phone / WhatsApp: '}<span className="font-bold text-slate-400 select-all">{displayPhone}</span>
            </div>
          </div>
        </div>

        <hr className="border-slate-800/80 my-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {t('footer_rights')}</p>
        </div>

        {/* Developer Credit Footer Bar (Must remain intact) */}
        <div className="mt-6 pt-5 border-t border-slate-800/60 flex items-center justify-center text-center text-xs text-slate-400 font-sans" dir="ltr">
          <div className="flex items-center justify-center gap-1.5 flex-wrap">
            <span className="text-slate-400 font-medium">Designed & Developed by</span>
            <a
              href="https://wa.me/201146780736"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/80 px-3 py-1 rounded-full border border-emerald-500/30 transition-all duration-200 shadow-sm hover:scale-105 group"
            >
              <WhatsAppIcon className="w-3.5 h-3.5 fill-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="underline underline-offset-2">Omar Ahmed</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
