import { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, onSnapshot, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { UserProfile, Announcement, GRADE_LABELS } from './types';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import AboutView from './components/AboutView';
import ContactView from './components/ContactView';
import FAQView from './components/FAQView';
import PrivacyView from './components/PrivacyView';
import TermsView from './components/TermsView';
import StudentDashboard from './components/StudentDashboard';
import MasterDashboard from './components/MasterDashboard';
import AuthModal from './components/AuthModal';
import MasterPasscodeModal from './components/MasterPasscodeModal';
import ToastContainer, { Toast } from './components/NotificationToast';
import { Bell, AlertTriangle, Phone, HelpCircle, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { seedInitialDataIfEmpty } from './lib/seeder';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [masterModalOpen, setMasterModalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Student specific announcements list
  const [activeAnnouncements, setActiveAnnouncements] = useState<Announcement[]>([]);

  // Add toast helper
  const addToast = (message: string, type: 'success' | 'error' | 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync theme on mount and seed initial data if empty
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = savedTheme === 'dark' || (!savedTheme && systemPrefersDark);
    setDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
    
    // Seed requested lesson for Prep 1
    seedInitialDataIfEmpty();

    // Check URL hash on initial load
    const hash = window.location.hash.replace('#', '');
    if (hash && ['home', 'courses', 'about', 'contact', 'faq', 'privacy', 'terms', 'student_dashboard', 'master_dashboard'].includes(hash)) {
      setCurrentView(hash);
    }

    const handleHashChange = () => {
      const newHash = window.location.hash.replace('#', '');
      if (newHash && ['home', 'courses', 'about', 'contact', 'faq', 'privacy', 'terms', 'student_dashboard', 'master_dashboard'].includes(newHash)) {
        setCurrentView(newHash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Listen for user auth state
  useEffect(() => {
    let unsubProfile: (() => void) | null = null;
    
    const fallbackUid = localStorage.getItem('fallback_user_uid');
    if (fallbackUid) {
      setLoadingAuth(true);
      const userDocRef = doc(db, 'users', fallbackUid);
      getDoc(userDocRef).then((userSnap) => {
        if (userSnap.exists()) {
          const profile = userSnap.data() as UserProfile;
          setUserProfile(profile);
          if (profile.role === 'student') {
            fetchStudentAnnouncements(profile.grade);
          }
          // Set up Snapshot Listener
          const unsub = onSnapshot(userDocRef, (snap) => {
            if (snap.exists()) {
              const updatedData = snap.data() as UserProfile;
              setUserProfile(updatedData);
            }
          });
          unsubProfile = () => unsub();
        }
        setLoadingAuth(false);
      }).catch((err) => {
        console.error(err);
        setLoadingAuth(false);
      });
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (localStorage.getItem('fallback_user_uid')) {
        // If we have a fallback active session, ignore Firebase standard Auth state
        return;
      }
      setLoadingAuth(true);
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userDocRef);

          if (userSnap.exists()) {
            const profile = userSnap.data() as UserProfile;
            setUserProfile(profile);

            // Fetch Announcements for student
            if (profile.role === 'student') {
              fetchStudentAnnouncements(profile.grade);
            }

            // Set up real-time session listener to prevent multiple devices sharing same account
            const unsubProfileInner = onSnapshot(userDocRef, (snap) => {
              if (snap.exists()) {
                const updatedData = snap.data() as UserProfile;
                const localSession = localStorage.getItem('device_session_id');

                if (
                  updatedData.deviceSessionId &&
                  localSession &&
                  updatedData.deviceSessionId !== localSession
                ) {
                  // Device session mismatch! Log them out instantly
                  signOut(auth);
                  setUserProfile(null);
                  setCurrentView('home');
                  addToast(
                    'تم تسجيل الدخول إلى حسابك من جهاز آخر. لا يمكن استخدام الحساب على أكثر من جهاز في نفس الوقت.',
                    'error'
                  );
                }
              }
            });

            unsubProfile = () => {
              unsubProfileInner();
            };
          } else {
            // No profile in firestore yet (could happen in edge cases, register will handle this)
            setUserProfile(null);
          }
        } catch (err) {
          console.error(err);
        }
      } else {
        if (!localStorage.getItem('fallback_user_uid')) {
          setUserProfile(null);
          setActiveAnnouncements([]);
        }
      }
      setLoadingAuth(false);
    });

    return () => {
      unsubscribe();
      if (unsubProfile) unsubProfile();
    };
  }, []);

  // RBAC route protection effect: Force redirect students away from master/admin paths
  useEffect(() => {
    if (!loadingAuth && userProfile) {
      if (userProfile.role === 'student') {
        const hash = window.location.hash.replace('#', '').toLowerCase();
        if (currentView === 'master_dashboard' || hash.includes('master') || hash.includes('admin')) {
          setCurrentView('student_dashboard');
          window.location.hash = 'student_dashboard';
          addToast('تم توجيهك تلقائياً إلى لوحتك التعليمية.', 'info');
        }
      }
    }
  }, [userProfile, currentView, loadingAuth]);

  // Fetch announcements for specific grade
  const fetchStudentAnnouncements = async (grade: string) => {
    try {
      const q = query(
        collection(db, 'announcements'),
        where('grade', 'in', ['all', grade]),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);
      const list: Announcement[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as Announcement);
      });
      setActiveAnnouncements(list);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem('fallback_user_uid');
      await signOut(auth);
      setUserProfile(null);
      setCurrentView('home');
      addToast('تم تسجيل الخروج بنجاح. رافقتك السلامة!', 'success');
    } catch (err) {
      console.error(err);
      addToast('فشل تسجيل الخروج.', 'error');
    }
  };

  // Safe navigation wrapper that checks if page is private
  const navigateTo = (view: string) => {
    if (view === 'master_dashboard' || view === 'admin') {
      if (userProfile && userProfile.role === 'student') {
        addToast('عذراً، هذا القسم خاص بإدارة المنصة ولا يمكن للطلاب الوصول إليه.', 'error');
        setCurrentView('student_dashboard');
        window.location.hash = 'student_dashboard';
        return;
      }
      if (!userProfile || userProfile.role !== 'master') {
        setMasterModalOpen(true);
        return;
      }
    }
    if (view === 'student_dashboard') {
      if (!userProfile) {
        addToast('يرجى تسجيل الدخول أولاً للوصول إلى هذه الصفحة.', 'info');
        setAuthModalOpen(true);
        return;
      }
    }
    setCurrentView(view);
    window.location.hash = view;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-200`}>
      {/* Upper Announcement Bar / Alert for students */}
      {userProfile && userProfile.role === 'student' && activeAnnouncements.length > 0 && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs sm:text-sm font-sans flex items-center justify-between gap-4 font-bold border-b border-amber-600/20" dir="rtl">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-slate-950 animate-bounce" />
            <span>إعلان هام: {activeAnnouncements[0].title} - {activeAnnouncements[0].content}</span>
          </div>
          <span className="text-[10px] opacity-75">
            {new Date(activeAnnouncements[0].createdAt).toLocaleDateString('ar-EG')}
          </span>
        </div>
      )}

      {/* Main Header / Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={navigateTo}
        userProfile={userProfile}
        onLogout={handleLogout}
        onOpenAuth={() => setAuthModalOpen(true)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenMasterAccess={() => setMasterModalOpen(true)}
      />

      {/* Main Content Stage */}
      <main className="flex-grow">
        {loadingAuth ? (
          <div className="flex flex-col justify-center items-center h-[500px] text-center px-4" dir="rtl">
            <div className="relative mb-6">
              <div className="w-16 h-16 bg-blue-700 text-white rounded-2xl flex items-center justify-center text-2xl font-black shadow-xl animate-pulse">
                AS
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-600"></span>
              </span>
            </div>
            <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 mb-2">منصة مستر عبدالله سيد التعليمية</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              جاري التحقق من بيانات الحساب وتجهيز تجربة التعلم التفاعلية...
            </p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {currentView === 'home' && (
                <HomeView
                  userProfile={userProfile}
                  onOpenAuth={() => setAuthModalOpen(true)}
                  setCurrentView={navigateTo}
                  onOpenMasterAccess={() => setMasterModalOpen(true)}
                />
              )}
              {currentView === 'about' && <AboutView />}
              {currentView === 'courses' && (
                userProfile ? (
                  userProfile.role === 'master' ? (
                    <MasterDashboard userProfile={userProfile} addToast={addToast} />
                  ) : (
                    <StudentDashboard
                      userProfile={userProfile}
                      setUserProfile={setUserProfile}
                      addToast={addToast}
                    />
                  )
                ) : (
                  /* Preview home view course cards, if clicked it pops login */
                  <div className="py-16 text-center max-w-4xl mx-auto px-4" dir="rtl">
                    <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-4">كورس تدريس اللغة الإنجليزية</h1>
                    <p className="text-slate-500 dark:text-slate-400 mb-8">يرجى تسجيل الدخول أو الاشتراك لتصفح الكورسات المتاحة لصفك الدراسي والبدء في مشاهدة الشروحات التفاعلية.</p>
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => setAuthModalOpen(true)}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-all cursor-pointer"
                      >
                        سجل دخولك الآن للتصفح
                      </button>
                    </div>
                  </div>
                )
              )}
              {currentView === 'faq' && <FAQView />}
              {currentView === 'contact' && <ContactView addToast={addToast} />}
              {currentView === 'privacy' && <PrivacyView />}
              {currentView === 'terms' && <TermsView />}
              {currentView === 'student_dashboard' && userProfile && (
                <StudentDashboard
                  userProfile={userProfile}
                  setUserProfile={setUserProfile}
                  addToast={addToast}
                />
              )}
              {currentView === 'master_dashboard' && (
                userProfile && userProfile.role === 'master' ? (
                  <MasterDashboard userProfile={userProfile} addToast={addToast} />
                ) : (
                  <div className="py-20 text-center max-w-lg mx-auto px-4" dir="rtl">
                    <div className="w-16 h-16 bg-amber-100 dark:bg-amber-950/50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Lock className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 mb-2">لوحة تحكم مستر عبدالله سيد</h2>
                    <p className="text-slate-500 text-sm mb-6">يرجى إدخال رمز القفل الخاص بالإدارة لمتابعة الدخول وإدارة المنصة.</p>
                    <button
                      onClick={() => setMasterModalOpen(true)}
                      className="px-6 py-3 bg-slate-900 hover:bg-black text-amber-400 font-extrabold rounded-full shadow-lg transition-all cursor-pointer"
                    >
                      إدخال كلمة المرور (2026)
                    </button>
                  </div>
                )
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      {/* Floating support bubble in the corner */}
      <div className="fixed bottom-20 left-4 z-30" dir="rtl">
        <a
          href="https://wa.me/201102140676"
          target="_blank"
          referrerPolicy="no-referrer"
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-full shadow-lg transition-all"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          <span>تواصل واتساب</span>
        </a>
      </div>

      {/* Footer component */}
      <Footer setCurrentView={navigateTo} />

      {/* Custom Auth modal */}
      <AnimatePresence>
        {authModalOpen && (
          <AuthModal
            isOpen={authModalOpen}
            onClose={() => setAuthModalOpen(false)}
            onSuccess={(profile) => {
              setUserProfile(profile);
              if (profile.role === 'master') {
                setCurrentView('master_dashboard');
              } else {
                setCurrentView('student_dashboard');
              }
            }}
            addToast={addToast}
          />
        )}
      </AnimatePresence>

      {/* Master Passcode Modal */}
      <AnimatePresence>
        {masterModalOpen && (
          <MasterPasscodeModal
            isOpen={masterModalOpen}
            onClose={() => setMasterModalOpen(false)}
            userProfile={userProfile}
            onSuccess={(updatedProfile) => {
              if (updatedProfile) {
                setUserProfile(updatedProfile);
              }
              setCurrentView('master_dashboard');
            }}
            addToast={addToast}
          />
        )}
      </AnimatePresence>

      {/* Toast Alert Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
