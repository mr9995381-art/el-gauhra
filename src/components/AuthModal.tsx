import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { EducationalGrade, GRADE_LABELS, UserProfile } from '../types';
import { Mail, Lock, User, Phone, BookOpen, AlertTriangle, X } from 'lucide-react';
import { motion } from 'motion/react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (profile: UserProfile) => void;
  addToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess, addToast }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [forgotPassword, setForgotPassword] = useState(false);
  
  // Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [grade, setGrade] = useState<EducationalGrade>('secondary_3');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (forgotPassword) {
        // Password Reset
        if (!email) {
          addToast('يرجى إدخال البريد الإلكتروني أولاً', 'error');
          setLoading(false);
          return;
        }
        try {
          await sendPasswordResetEmail(auth, email);
          addToast('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني', 'success');
          setForgotPassword(false);
        } catch (resetErr: any) {
          if (resetErr.code === 'auth/operation-not-allowed') {
            addToast('خدمة استعادة كلمة المرور عبر البريد غير مفعّلة حالياً في النظام.', 'info');
          } else {
            addToast('تعذر إرسال رابط إعادة التعيين. يرجى التأكد من البريد الإلكتروني.', 'error');
          }
        }
        setLoading(false);
        return;
      }

      const cleanIdentifier = email.trim().toLowerCase();
      const cleanEmail = cleanIdentifier;
      const rawInput = email.trim();

      if (isLogin) {
        // Login
        try {
          // If input looks like an email, try standard Firebase Auth
          let userCred = null;
          if (cleanIdentifier.includes('@')) {
            try {
              userCred = await signInWithEmailAndPassword(auth, cleanIdentifier, password);
            } catch (e) {
              // Ignore email auth error and fall through to Firestore lookup
            }
          }

          if (userCred) {
            const uid = userCred.user.uid;
            
            // Fetch profile
            const userDoc = await getDoc(doc(db, 'users', uid));
            if (userDoc.exists()) {
              const profile = userDoc.data() as UserProfile;
              
              // Ensure student role if not the main teacher account
              let role = profile.role;
              if (profile.email !== 'oa958792@gmail.com' && role === 'master') {
                role = 'student';
                await updateDoc(doc(db, 'users', uid), { role: 'student' });
              }

              // Generate unique session ID for this device
              const deviceSessionId = Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
              localStorage.setItem('device_session_id', deviceSessionId);
              if (localStorage.getItem('fallback_user_uid') === 'fallback_master_admin_account') {
                localStorage.removeItem('fallback_user_uid');
              }

              // Update Firestore
              await updateDoc(doc(db, 'users', uid), { deviceSessionId, role });
              
              const updatedProfile = { ...profile, role, deviceSessionId };
              onSuccess(updatedProfile);
              addToast(`مرحباً بك مجدداً، ${profile.name}!`, 'success');
              onClose();
              return;
            }
          }

          // Search Firestore by Email, UID (Student ID), or Phone
          const usersRef = collection(db, 'users');
          let matchedProfile: UserProfile | null = null;

          // 1. Check by email
          if (cleanIdentifier.includes('@')) {
            const qEmail = query(usersRef, where('email', '==', cleanIdentifier));
            const snapEmail = await getDocs(qEmail);
            snapEmail.forEach((docSnap) => {
              const data = docSnap.data();
              if (data.fallbackPassword === password || !data.fallbackPassword) {
                matchedProfile = { uid: docSnap.id, ...data } as unknown as UserProfile;
              }
            });
          }

          // 2. Check by UID / Student ID
          if (!matchedProfile) {
            const userDocByUid = await getDoc(doc(db, 'users', rawInput));
            if (userDocByUid.exists()) {
              const data = userDocByUid.data();
              if (data.fallbackPassword === password || !data.fallbackPassword) {
                matchedProfile = { uid: userDocByUid.id, ...data } as unknown as UserProfile;
              }
            }
          }

          // 3. Check by Phone
          if (!matchedProfile) {
            const qPhone = query(usersRef, where('phone', '==', rawInput));
            const snapPhone = await getDocs(qPhone);
            snapPhone.forEach((docSnap) => {
              const data = docSnap.data();
              if (data.fallbackPassword === password || !data.fallbackPassword) {
                matchedProfile = { uid: docSnap.id, ...data } as unknown as UserProfile;
              }
            });
          }

          if (matchedProfile) {
            let role = (matchedProfile as UserProfile).role;
            if ((matchedProfile as UserProfile).email !== 'oa958792@gmail.com' && role === 'master') {
              role = 'student';
            }

            const deviceSessionId = Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
            localStorage.setItem('device_session_id', deviceSessionId);
            localStorage.setItem('fallback_user_uid', (matchedProfile as UserProfile).uid);

            await updateDoc(doc(db, 'users', (matchedProfile as UserProfile).uid), { deviceSessionId, role });
            
            const updatedProfile = { ...matchedProfile, role, deviceSessionId } as UserProfile;
            onSuccess(updatedProfile);
            addToast(`مرحباً بك مجدداً، ${updatedProfile.name}!`, 'success');
            onClose();
            return;
          }

          addToast('بيانات الدخول (الكود أو البريد الإلكتروني أو كلمة المرور) غير صحيحة.', 'error');
          setLoading(false);
          return;
        } catch (authErr: any) {
          addToast('حدث خطأ أثناء تسجيل الدخول. يرجى التأكد من البيانات والمحاولة مجدداً.', 'error');
          setLoading(false);
          return;
        }
      } else {
        // Registration
        if (!name.trim()) {
          addToast('يرجى إدخال الاسم بالكامل', 'error');
          setLoading(false);
          return;
        }
        if (!phone.trim()) {
          addToast('يرجى إدخال رقم الهاتف', 'error');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          addToast('يجب أن تتكون كلمة المرور من 6 أحرف أو أرقام على الأقل', 'error');
          setLoading(false);
          return;
        }

        try {
          const userCred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
          const uid = userCred.user.uid;
          
          // Check if role should be Master (based on special email)
          let role: 'student' | 'master' = 'student';
          if (cleanEmail === 'oa958792@gmail.com') {
            role = 'master';
          }

          const deviceSessionId = Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
          localStorage.setItem('device_session_id', deviceSessionId);

          const newProfile: UserProfile = {
            uid,
            name: name.trim(),
            email: cleanEmail,
            phone: phone.trim(),
            parentPhone: parentPhone.trim(),
            grade,
            role,
            subscriptionStatus: role === 'master' ? 'approved' : 'none',
            subscriptionExpiresAt: role === 'master' ? '2099-12-31T23:59:59.000Z' : null,
            activeCodeUsed: null,
            deviceSessionId,
            createdAt: new Date().toISOString(),
          };

          await setDoc(doc(db, 'users', uid), newProfile);
          onSuccess(newProfile);
          
          if (role === 'master') {
            addToast('تم إنشاء حساب مستر عبدالله سيد بنجاح!', 'success');
          } else {
            addToast(`مرحباً بك ${name.trim()} في منصة مستر عبدالله سيد!`, 'success');
          }
          onClose();
        } catch (authErr: any) {
          // Fallback registration if auth/operation-not-allowed
          if (authErr.code === 'auth/operation-not-allowed') {
            // Check if email already registered in our users table
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('email', '==', cleanEmail));
            const querySnap = await getDocs(q);

            if (!querySnap.empty) {
              addToast('هذا البريد الإلكتروني مسجل بالفعل. يرجى تسجيل الدخول.', 'error');
              setLoading(false);
              return;
            }

            const fallbackUid = 'fallback_' + Math.random().toString(36).substring(2, 15);
            
            let role: 'student' | 'master' = 'student';
            if (cleanEmail === 'oa958792@gmail.com') {
              role = 'master';
            }

            const deviceSessionId = Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
            localStorage.setItem('device_session_id', deviceSessionId);
            localStorage.setItem('fallback_user_uid', fallbackUid);

            const newProfile: UserProfile & { fallbackPassword?: string } = {
              uid: fallbackUid,
              name: name.trim(),
              email: cleanEmail,
              phone: phone.trim(),
              parentPhone: parentPhone.trim(),
              grade,
              role,
              subscriptionStatus: role === 'master' ? 'approved' : 'none',
              subscriptionExpiresAt: role === 'master' ? '2099-12-31T23:59:59.000Z' : null,
              activeCodeUsed: null,
              deviceSessionId,
              createdAt: new Date().toISOString(),
              fallbackPassword: password
            };

            await setDoc(doc(db, 'users', fallbackUid), newProfile);
            onSuccess(newProfile);

            if (role === 'master') {
              addToast('تم إنشاء حساب مستر عبدالله سيد بنجاح!', 'success');
            } else {
              addToast(`مرحباً بك ${name.trim()} في منصة مستر عبدالله سيد!`, 'success');
            }
            onClose();
            return;
          }
          throw authErr;
        }
      }
    } catch (err: any) {
      if (err?.code !== 'auth/operation-not-allowed') {
        console.error(err);
      }
      let errorMsg = 'حدث خطأ ما، يرجى المحاولة مرة أخرى.';
      if (err.code === 'auth/email-already-in-use') {
        errorMsg = 'هذا البريد الإلكتروني مستخدم بالفعل.';
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        errorMsg = 'كلمة المرور غير صحيحة أو الحساب غير موجود.';
      } else if (err.code === 'auth/user-not-found') {
        errorMsg = 'لا يوجد مستخدم مسجل بهذا البريد الإلكتروني.';
      } else if (err.code === 'auth/weak-password') {
        errorMsg = 'كلمة المرور ضعيفة جداً، يجب أن تكون 6 أحرف على الأقل.';
      } else if (err.code === 'auth/operation-not-allowed') {
        errorMsg = 'تم تسجيل الدخول عبر نمط الحفظ الآمن.';
      }
      addToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" dir="rtl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-blue-600 text-white">
          <h2 className="text-xl font-bold font-sans">
            {forgotPassword ? 'استعادة كلمة المرور' : isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleAuth} className="p-6 space-y-4">
          {forgotPassword ? (
            <div className="space-y-4">
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                أدخل بريدك الإلكتروني المسجل وسنقوم بإرسال رابط لإعادة تعيين كلمة المرور الخاصة بك فوراً.
              </p>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">البريد الإلكتروني</label>
                <div className="relative">
                  <Mail className="absolute right-3 top-2.5 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pr-10 pl-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-100 text-right outline-none"
                    placeholder="example@mail.com"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Full Name (Registration only) */}
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">الاسم بالكامل (ثنائي أو ثلاثي)</label>
                  <div className="relative">
                    <User className="absolute right-3 top-2.5 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pr-10 pl-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-100 text-right outline-none"
                      placeholder="أحمد محمد"
                    />
                  </div>
                </div>
              )}

              {/* Email / Student ID / Phone */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {isLogin ? 'كود الطالب / البريد الإلكتروني / رقم الهاتف' : 'البريد الإلكتروني'}
                </label>
                <div className="relative">
                  <Mail className="absolute right-3 top-2.5 w-5 h-5 text-slate-400" />
                  <input
                    type={isLogin ? 'text' : 'email'}
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pr-10 pl-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-100 text-right outline-none"
                    placeholder={isLogin ? 'أدخل كود الطالب أو البريد أو الهاتف...' : 'example@mail.com'}
                  />
                </div>
              </div>

              {/* Phone (Registration only) */}
              {!isLogin && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">رقم هاتف الطالب</label>
                    <div className="relative">
                      <Phone className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pr-9 pl-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-100 text-left outline-none text-xs"
                        placeholder="01100000000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">رقم هاتف ولي الأمر</label>
                    <div className="relative">
                      <Phone className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
                      <input
                        type="tel"
                        value={parentPhone}
                        onChange={(e) => setParentPhone(e.target.value)}
                        className="w-full pr-9 pl-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-100 text-left outline-none text-xs"
                        placeholder="01000000000"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Grade select (Registration only) */}
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">الصف الدراسي</label>
                  <div className="relative">
                    <BookOpen className="absolute right-3 top-2.5 w-5 h-5 text-slate-400" />
                    <select
                      value={grade}
                      onChange={(e) => setGrade(e.target.value as EducationalGrade)}
                      className="w-full pr-10 pl-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-100 outline-none text-right appearance-none"
                    >
                      {Object.entries(GRADE_LABELS).map(([val, label]) => (
                        <option key={val} value={val}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">كلمة المرور</label>
                  {isLogin && (
                    <button
                      type="button"
                      onClick={() => setForgotPassword(true)}
                      className="text-xs text-blue-600 hover:underline hover:text-blue-500"
                    >
                      نسيت كلمة المرور؟
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute right-3 top-2.5 w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pr-10 pl-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-100 outline-none text-right"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : forgotPassword ? (
              'أرسل رابط الاستعادة'
            ) : isLogin ? (
              'تسجيل الدخول'
            ) : (
              'إنشاء الحساب'
            )}
          </button>
        </form>

        {/* Footer info switcher */}
        <div className="p-6 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800 text-center text-sm text-slate-500 dark:text-slate-400">
          {forgotPassword ? (
            <button onClick={() => setForgotPassword(false)} className="text-blue-600 font-semibold hover:underline">
              العودة لتسجيل الدخول
            </button>
          ) : isLogin ? (
            <p>
              ليس لديك حساب؟{' '}
              <button onClick={() => setIsLogin(false)} className="text-blue-600 font-semibold hover:underline">
                أنشئ حساباً جديداً الآن
              </button>
            </p>
          ) : (
            <p>
              لديك حساب بالفعل؟{' '}
              <button onClick={() => setIsLogin(true)} className="text-blue-600 font-semibold hover:underline">
                سجل دخولك من هنا
              </button>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
