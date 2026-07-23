import { useState } from 'react';
import { Menu, X, LogOut, User, ShieldAlert, BookOpen, Lock } from 'lucide-react';
import { UserProfile } from '../types';
import ThemeToggle from './ThemeToggle';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  userProfile: UserProfile | null;
  onLogout: () => void;
  onOpenAuth: () => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  onOpenMasterAccess?: () => void;
}

export default function Navbar({
  currentView,
  setCurrentView,
  userProfile,
  onLogout,
  onOpenAuth,
  darkMode,
  setDarkMode,
  onOpenMasterAccess,
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { key: 'home', label: 'الرئيسية' },
    { key: 'about', label: 'من نحن' },
    { key: 'courses', label: 'الكورسات' },
    { key: 'faq', label: 'الأسئلة الشائعة' },
    { key: 'contact', label: 'تواصل معنا' },
  ];

  const handleNavClick = (view: string) => {
    setCurrentView(view);
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-850 shadow-sm" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-3 cursor-pointer" onClick={() => handleNavClick('home')}>
            <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md shadow-blue-200 dark:shadow-none">
              AS
            </div>
            <span className="text-xl sm:text-2xl font-black text-blue-900 dark:text-blue-400 tracking-tight font-sans">
              مستر عبدالله سيد
            </span>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => handleNavClick(item.key)}
                className={`px-3 py-2 text-sm font-bold font-sans rounded-lg transition-colors cursor-pointer ${
                  currentView === item.key
                    ? 'text-blue-700 bg-blue-50/70 dark:bg-blue-950/40 dark:text-blue-400'
                    : 'text-slate-600 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />

            {/* Stealth Master Access Icon Button (Blends into header background) */}
            <button
              onClick={() => {
                if (userProfile?.role === 'admin' || userProfile?.role === 'master') {
                  handleNavClick('master_dashboard');
                } else if (onOpenMasterAccess) {
                  onOpenMasterAccess();
                }
              }}
              className="p-2 text-slate-300 dark:text-slate-700 hover:text-amber-500 dark:hover:text-amber-400 transition-colors rounded-xl cursor-pointer opacity-50 hover:opacity-100"
              title="دخول مستر عبدالله سيد (خاص بالإدارة)"
              aria-label="Master Access"
            >
              <ShieldAlert className="w-4.5 h-4.5" />
            </button>

            {/* Master Access Button for guests */}
            {!userProfile && (
              <button
                onClick={() => {
                  if (onOpenMasterAccess) onOpenMasterAccess();
                }}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-black text-amber-400 font-extrabold rounded-full text-xs border border-amber-500/40 shadow transition-all flex items-center gap-1.5 cursor-pointer"
                title="دخول مستر عبدالله سيد"
              >
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>دخول المستر</span>
              </button>
            )}

            {userProfile ? (
              <div className="flex items-center gap-3">
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
                      معاينة الطالب
                    </button>
                    <button
                      onClick={() => handleNavClick('master_dashboard')}
                      className="flex items-center gap-1.5 px-5 py-2 text-xs font-extrabold text-amber-400 bg-slate-900 hover:bg-black rounded-full shadow-md transition-all cursor-pointer border border-amber-500/30"
                    >
                      <ShieldAlert className="w-4 h-4 text-amber-400" />
                      لوحة المستر
                    </button>
                  </>
                )}

                {userProfile.role === 'student' && (
                  <button
                    onClick={() => handleNavClick('student_dashboard')}
                    className="flex items-center gap-1.5 px-6 py-2 text-sm font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-full shadow-lg shadow-blue-200/50 dark:shadow-none transition-all cursor-pointer"
                  >
                    <User className="w-4 h-4" />
                    لوحتي التعليمية
                  </button>
                )}

                <button
                  onClick={onLogout}
                  className="p-2 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 transition-colors rounded-full hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer"
                  title="تسجيل الخروج"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenAuth}
                  className="px-6 py-2 border-2 border-blue-700 text-blue-700 dark:border-blue-500 dark:text-blue-400 rounded-full font-bold text-xs hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-all cursor-pointer"
                >
                  دخول
                </button>
                <button
                  onClick={onOpenAuth}
                  className="px-6 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-full font-bold text-xs shadow-lg shadow-blue-200/50 dark:shadow-none transition-all cursor-pointer"
                >
                  ابدأ الآن
                </button>
              </div>
            )}
          </div>

          {/* Mobile header controls */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Stealth Master Access Icon for Mobile Header Bar */}
            <button
              onClick={() => {
                if (userProfile?.role === 'master') {
                  handleNavClick('master_dashboard');
                } else if (onOpenMasterAccess) {
                  onOpenMasterAccess();
                }
              }}
              className="p-2 text-slate-300 dark:text-slate-700 hover:text-amber-500 dark:hover:text-amber-400 transition-colors rounded-xl cursor-pointer opacity-40 hover:opacity-100"
              title="دخول مستر عبدالله سيد (خاص)"
              aria-label="Master Access Mobile"
            >
              <ShieldAlert className="w-4 h-4" />
            </button>

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
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-2 pb-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => handleNavClick(item.key)}
              className={`block w-full text-right px-4 py-2.5 text-base font-bold font-sans rounded-xl transition-colors ${
                currentView === item.key
                  ? 'text-blue-700 bg-blue-50 dark:bg-blue-950/30 dark:text-blue-400'
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
                  onClick={() => handleNavClick('student_dashboard')}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-base font-bold text-blue-700 border border-blue-100 dark:border-blue-950 bg-blue-50/50 dark:bg-blue-950/20 rounded-full"
                >
                  <User className="w-5 h-5" />
                  بوابة الطالب (عرض كطالب)
                </button>
              )}
              <button
                onClick={() => handleNavClick((userProfile.role === 'admin' || userProfile.role === 'master') ? 'master_dashboard' : 'student_dashboard')}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-base font-bold text-white bg-blue-700 rounded-full"
              >
                {(userProfile.role === 'admin' || userProfile.role === 'master') ? <ShieldAlert className="w-5 h-5" /> : <User className="w-5 h-5" />}
                {(userProfile.role === 'admin' || userProfile.role === 'master') ? 'لوحة تحكم المستر' : 'لوحتي التعليمية'}
              </button>
              {/* Removed master gate button from mobile menu */}
              <button
                onClick={() => {
                  onLogout();
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-base font-bold text-rose-600 border border-rose-100 dark:border-rose-950 bg-rose-50/50 dark:bg-rose-950/20 rounded-full"
              >
                <LogOut className="w-5 h-5" />
                تسجيل الخروج
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <button
                onClick={() => {
                  onOpenAuth();
                  setIsOpen(false);
                }}
                className="w-full py-2.5 text-center text-base font-bold text-white bg-blue-700 rounded-full shadow-lg shadow-blue-200/50 dark:shadow-none cursor-pointer"
              >
                تسجيل الدخول / الاشتراك
              </button>

              <button
                onClick={() => {
                  if (onOpenMasterAccess) onOpenMasterAccess();
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-between px-4 py-2 text-xs font-bold text-slate-400 dark:text-slate-600 hover:text-amber-500 transition-colors rounded-xl border border-dashed border-slate-200 dark:border-slate-800 cursor-pointer"
              >
                <span>دخول مستر عبدالله (رمز الدخول)</span>
                <ShieldAlert className="w-4 h-4 text-amber-500/70" />
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
