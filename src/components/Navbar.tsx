import { useState } from 'react';
import { Menu, X, LogOut, User, ShieldAlert, BookOpen, GraduationCap, Phone, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '../lib/LanguageContext';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  userProfile: UserProfile | null;
  onLogout: () => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}

export default function Navbar({
  currentView,
  setCurrentView,
  userProfile,
  onLogout,
  onOpenAuth,
  darkMode,
  setDarkMode,
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { t, isRtl, lang } = useLanguage();

  const navItems = [
    { key: 'home', label: 'الرئيسية' },
    { key: 'courses', label: 'المراحل وكورسات الإنجليزي' },
    { key: 'parent_portal', label: 'متابعة ولي الأمر' },
    { key: 'about', label: 'عن مستر عبدالله' },
    { key: 'faq', label: 'الأسئلة الشائعة' },
    { key: 'contact', label: 'تواصل معنا' },
  ];

  const handleNavClick = (view: string) => {
    setCurrentView(view);
    window.location.hash = view;
    setIsOpen(false);
  };

  return (
    <>
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-amber-300 py-1.5 px-4 text-xs text-center font-bold border-b border-amber-500/20 flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span className="truncate">
          مرحباً بكم في منصة مستر عبدالله سيد التعليمية للغة الإنجليزية | للاشتراك وحجز المحاضرات:
        </span>
        <a href="tel:+201102140676" className="text-white hover:text-amber-300 underline font-black dir-ltr shrink-0">
          01102140676
        </a>
      </div>

      <nav className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo: Mr. Abdullah Sayed */}
            <div className="flex-shrink-0 flex items-center gap-3 cursor-pointer" onClick={() => handleNavClick('home')}>
              <div className="w-11 h-11 bg-gradient-to-br from-blue-700 via-blue-900 to-indigo-950 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg border border-blue-400/30">
                AS
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-2xl font-black text-slate-900 dark:text-amber-400 tracking-tight font-sans leading-tight">
                  مستر عبدالله سيد
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-blue-700 dark:text-blue-300 tracking-wider">
                  English Language Master
                </span>
              </div>
            </div>

            {/* Desktop Nav Items */}
            <div className="hidden lg:flex items-center gap-4 xl:gap-6">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => handleNavClick(item.key)}
                  className={`px-3 py-2 text-xs sm:text-sm font-bold font-sans rounded-xl transition-all cursor-pointer ${
                    currentView === item.key
                      ? 'text-blue-700 bg-blue-50 dark:bg-blue-950/50 dark:text-amber-400 border border-blue-200/50 dark:border-blue-900'
                      : 'text-slate-600 dark:text-slate-300 hover:text-blue-700 dark:hover:text-amber-300 hover:bg-slate-50 dark:hover:bg-slate-900'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="hidden md:flex items-center gap-2 sm:gap-3">
              <LanguageSwitcher />
              <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />

              {/* Master Access Quick Action when logged in as admin */}
              {userProfile && (userProfile.role === 'admin' || userProfile.role === 'master') && (
                <button
                  onClick={() => handleNavClick('master_dashboard')}
                  className="p-2 text-amber-500 hover:text-amber-400 transition-colors rounded-xl cursor-pointer"
                  title="لوحة تحكم المستر"
                  aria-label="Master Dashboard"
                >
                  <ShieldAlert className="w-5 h-5" />
                </button>
              )}

              {userProfile ? (
                <div className="flex items-center gap-2 sm:gap-3">
                  {(userProfile.role === 'admin' || userProfile.role === 'master') && (
                    <>
                      <button
                        onClick={() => handleNavClick('student_dashboard')}
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-full transition-all cursor-pointer ${
                          currentView === 'student_dashboard'
                            ? 'text-blue-700 bg-blue-50/70 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800'
                            : 'text-slate-600 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-900'
                        }`}
                      >
                        <User className="w-4 h-4" />
                        {t('nav_student_view')}
                      </button>
                      <button
                        onClick={() => handleNavClick('master_dashboard')}
                        className="flex items-center gap-1.5 px-4 py-2 text-xs font-extrabold text-amber-400 bg-slate-900 hover:bg-black rounded-full shadow-md transition-all cursor-pointer border border-amber-500/30"
                      >
                        <ShieldAlert className="w-4 h-4 text-amber-400" />
                        {t('nav_master_dashboard')}
                      </button>
                    </>
                  )}

                  {userProfile.role === 'student' && (
                    <button
                      onClick={() => handleNavClick('student_dashboard')}
                      className="flex items-center gap-1.5 px-5 py-2.5 text-xs sm:text-sm font-black text-white bg-blue-700 hover:bg-blue-800 rounded-2xl shadow-md transition-all cursor-pointer"
                    >
                      <User className="w-4 h-4" />
                      <span>لوحة الطالب</span>
                    </button>
                  )}

                  <button
                    onClick={onLogout}
                    className="p-2 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 transition-colors rounded-full hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer"
                    title={t('nav_logout')}
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenAuth('login')}
                    className="px-4 py-2 border-2 border-blue-700 dark:border-blue-500 text-blue-700 dark:text-blue-300 rounded-2xl font-bold text-xs hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-all cursor-pointer"
                  >
                    تسجيل الدخول
                  </button>
                  <button
                    onClick={() => onOpenAuth('register')}
                    className="px-4 py-2 bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white rounded-2xl font-black text-xs shadow-md transition-all cursor-pointer"
                  >
                    دخول حساب جديد
                  </button>
                </div>
              )}
            </div>

            {/* Mobile header controls */}
            <div className="flex items-center gap-2 md:hidden">
              <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-2 pb-5 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => handleNavClick(item.key)}
                className={`block w-full text-start px-4 py-3 text-sm font-bold font-sans rounded-xl transition-colors ${
                  currentView === item.key
                    ? 'text-blue-700 bg-blue-50 dark:bg-blue-950/30 dark:text-amber-400 font-black'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900'
                }`}
              >
                {item.label}
              </button>
            ))}
            <hr className="border-slate-200 dark:border-slate-800 my-2" />
            {userProfile ? (
              <div className="space-y-2 pt-2">
                {(userProfile.role === 'admin' || userProfile.role === 'master') && (
                  <button
                    onClick={() => handleNavClick('master_dashboard')}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-amber-400 bg-slate-900 border border-amber-500/30 rounded-2xl cursor-pointer"
                  >
                    <ShieldAlert className="w-5 h-5 text-amber-400" />
                    <span>لوحة تحكم المستر</span>
                  </button>
                )}
                <button
                  onClick={() => handleNavClick('student_dashboard')}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-white bg-blue-700 rounded-2xl cursor-pointer"
                >
                  <User className="w-5 h-5" />
                  <span>لوحة الطالب</span>
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-rose-600 border border-rose-100 dark:border-rose-950 bg-rose-50/50 dark:bg-rose-950/20 rounded-2xl cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  تسجيل الخروج
                </button>
              </div>
            ) : (
              <div className="space-y-2.5 pt-1">
                <button
                  onClick={() => {
                    onOpenAuth('login');
                    setIsOpen(false);
                  }}
                  className="w-full py-2.5 text-center text-sm font-bold text-blue-700 dark:text-blue-300 border-2 border-blue-700 dark:border-blue-500 rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-all cursor-pointer"
                >
                  تسجيل الدخول
                </button>

                <button
                  onClick={() => {
                    onOpenAuth('register');
                    setIsOpen(false);
                  }}
                  className="w-full py-3 text-center text-sm font-black text-white bg-gradient-to-r from-blue-700 to-blue-800 rounded-2xl shadow-lg transition-all cursor-pointer"
                >
                  دخول حساب جديد
                </button>
              </div>
            )}
          </div>
        )}
      </nav>
    </>
  );
}

