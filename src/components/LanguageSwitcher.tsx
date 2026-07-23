import { Globe } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <button
      id="lang-switcher-btn"
      onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200/60 dark:border-slate-700 cursor-pointer shadow-xs"
      title={lang === 'ar' ? 'Switch to English' : 'التحويل إلى العربية'}
      aria-label="Switch Language"
    >
      <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
      <span className="font-sans font-bold uppercase tracking-wider text-[11px]">
        {lang === 'ar' ? 'EN' : 'عربي'}
      </span>
    </button>
  );
}
