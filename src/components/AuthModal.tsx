import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
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

  const handleGoogleSignIn = async () => {
    setLoading(true);
    addToast('جاري تسجيل الدخول باستخدام Google...', 'info');

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const uid = user.uid;

      // Check if profile exists in Firestore
      const userDocRef = doc(db, 'users', uid);
      const userDocSnap = await getDoc(userDocRef);

      const deviceSessionId = Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
      localStorage.setItem('device_session_id', deviceSessionId);
      if (localStorage.getItem('fallback_user_uid') === 'fallback_master_admin_account') {
        localStorage.removeItem('fallback_user_uid');
      }

      let profile: UserProfile;

      if (userDocSnap.exists()) {
        const existingData = userDocSnap.data() as UserProfile;
        // Keep existing role if present, otherwise default to 'student'
        const role: 'student' | 'admin' | 'master' = existingData.role || 'student';
        const photoURL = user.photoURL || existingData.photoURL || '';

        const updates: Record<string, any> = {
          deviceSessionId,
          role,
          photoURL,
        };

        // Ensure no undefined values are sent to updateDoc
        Object.keys(updates).forEach((key) => {
          if (updates[key] === undefined) {
            delete updates[key];
          }
        });

        await updateDoc(userDocRef, updates);

        profile = {
          ...existingData,
          role,
          deviceSessionId,
          photoURL,
        };
      } else {
        // New Google Sign-In user is strictly a student
        const role: 'student' = 'student';
        profile = {
          uid,
          name: user.displayName || 'طالب جديد',
          email: user.email || '',
          phone: user.phoneNumber || 'غير محدد',
          parentPhone: '',
          grade: 'secondary_3',
          role,
          photoURL: user.photoURL || '',
          subscriptionExpiresAt: null,
          subscriptionStatus: 'none',
          activeCodeUsed: null,
          deviceSessionId,
          createdAt: new Date().toISOString(),
        };

        const setPayload: Record<string, any> = { ...profile };
        Object.keys(setPayload).forEach((key) => {
          if (setPayload[key] === undefined) {
            delete setPayload[key];
          }
        });

        await setDoc(userDocRef, setPayload);
      }

      onSuccess(profile);
      addToast(`تم تسجيل الدخول بنجاح! مرحباً بك ${profile.name}`, 'success');
      onClose();
    } catch (err: any) {
      console.error('Google Auth Error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        addToast('تم إلغاء عملية تسجيل الدخول بواسطة Google.', 'info');
      } else if (err.code === 'auth/network-request-failed') {
        addToast('حدث خطأ في الاتصال بالشبكة. يرجى التأكد من اتصال الإنترنت.', 'error');
      } else if (err.code === 'auth/popup-blocked') {
        addToast('تم حظر النافذة المنبثقة من قبل المتصفح. يرجى السماح بالنوافذ المنبثقة.', 'error');
      } else if (err.code === 'auth/operation-not-allowed' || err.code === 'auth/admin-restricted-operation' || err.code === 'auth/configuration-not-found') {
        addToast('تنويه: خيار Google Sign-In يحتاج إلى تفعيل في لوحة تحكم Firebase (Authentication -> Sign-in method -> Google).', 'error');
      } else if (err.code === 'auth/unauthorized-domain') {
        addToast('هذا النطاق يحتاج لإضافته في قائمة Authorized Domains بـ Firebase Console (Authentication -> Settings).', 'error');
      } else {
        addToast(`خطأ في تسجيل الدخول بـ Google (${err.message || err.code || 'خطأ غير معروف'})`, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

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
      const cleanEmail = cleanIdentifier.includes('@') ? cleanIdentifier : `${cleanIdentifier}@student.mester`;
      const rawInput = email.trim();

      if (isLogin) {
        // Login
        try {
          // Try standard Firebase Auth
          let userCred = null;
          try {
            userCred = await signInWithEmailAndPassword(auth, cleanEmail, password);
          } catch (e) {
            // Ignore email auth error and fall through to Firestore lookup
          }

          if (userCred) {
            const uid = userCred.user.uid;
            
            // Fetch profile
            const userDoc = await getDoc(doc(db, 'users', uid));
            if (userDoc.exists()) {
              const profile = userDoc.data() as UserProfile;
              
              const role: 'student' | 'admin' | 'master' = profile.role || (profile.email === 'oa958792@gmail.com' ? 'admin' : 'student');

              // Generate unique session ID for this device
              const deviceSessionId = Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
              localStorage.setItem('device_session_id', deviceSessionId);
              if (localStorage.getItem('fallback_user_uid') === 'fallback_master_admin_account') {
                localStorage.removeItem('fallback_user_uid');
              }

              // Update Firestore safely
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

          // 1. Check by email / student email
          const qEmail = query(usersRef, where('email', '==', cleanEmail));
          const snapEmail = await getDocs(qEmail);
          snapEmail.forEach((docSnap) => {
            const data = docSnap.data();
            if (data.fallbackPassword === password || !data.fallbackPassword) {
              matchedProfile = { uid: docSnap.id, ...data } as unknown as UserProfile;
            }
          });

          // 2. Check by raw email input if different
          if (!matchedProfile && cleanIdentifier.includes('@')) {
            const qRawEmail = query(usersRef, where('email', '==', cleanIdentifier));
            const snapRawEmail = await getDocs(qRawEmail);
            snapRawEmail.forEach((docSnap) => {
              const data = docSnap.data();
              if (data.fallbackPassword === password || !data.fallbackPassword) {
                matchedProfile = { uid: docSnap.id, ...data } as unknown as UserProfile;
              }
            });
          }

          // 3. Check by UID / Student ID
          if (!matchedProfile) {
            const userDocByUid = await getDoc(doc(db, 'users', rawInput));
            if (userDocByUid.exists()) {
              const data = userDocByUid.data();
              if (data.fallbackPassword === password || !data.fallbackPassword) {
                matchedProfile = { uid: userDocByUid.id, ...data } as unknown as UserProfile;
              }
            }
          }

          // 4. Check by Phone
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
            const role: 'student' | 'admin' | 'master' = (matchedProfile as UserProfile).role || ((matchedProfile as UserProfile).email === 'oa958792@gmail.com' ? 'admin' : 'student');

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
          
          // Check if role should be Admin (based on special email for password registration)
          let role: 'student' | 'admin' | 'master' = 'student';
          if (cleanEmail === 'oa958792@gmail.com') {
            role = 'admin';
          }

          const deviceSessionId = Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
          localStorage.setItem('device_session_id', deviceSessionId);

          const newProfile: UserProfile = {
            uid,
            name: name.trim(),
            email: cleanEmail,
            phone: phone.trim(),
            parentPhone: parentPhone.trim() || '',
            grade: grade || 'secondary_3',
            role,
            subscriptionStatus: role !== 'student' ? 'approved' : 'none',
            subscriptionExpiresAt: role !== 'student' ? '2099-12-31T23:59:59.000Z' : null,
            activeCodeUsed: null,
            deviceSessionId,
            createdAt: new Date().toISOString(),
          };

          const setPayload: Record<string, any> = { ...newProfile };
          Object.keys(setPayload).forEach((key) => {
            if (setPayload[key] === undefined) {
              delete setPayload[key];
            }
          });

          await setDoc(doc(db, 'users', uid), setPayload);
          onSuccess(newProfile);
          
          if (role !== 'student') {
            addToast('تم إنشاء حساب إدارة المنصة بنجاح!', 'success');
          } else {
            addToast(`مرحباً بك ${name.trim()} في منصة مستر عبدالله سيد!`, 'success');
          }
          onClose();
        } catch (authErr: any) {
          // Fallback registration if auth/operation-not-allowed, auth/configuration-not-found, or auth/admin-restricted-operation
          if (
            authErr.code === 'auth/operation-not-allowed' ||
            authErr.code === 'auth/configuration-not-found' ||
            authErr.code === 'auth/admin-restricted-operation'
          ) {
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
            
            let role: 'student' | 'admin' | 'master' = 'student';
            if (cleanEmail === 'oa958792@gmail.com') {
              role = 'admin';
            }

            const deviceSessionId = Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
            localStorage.setItem('device_session_id', deviceSessionId);
            localStorage.setItem('fallback_user_uid', fallbackUid);

            const newProfile: UserProfile & { fallbackPassword?: string } = {
              uid: fallbackUid,
              name: name.trim(),
              email: cleanEmail,
              phone: phone.trim(),
              parentPhone: parentPhone.trim() || '',
              grade: grade || 'secondary_3',
              role,
              subscriptionStatus: role !== 'student' ? 'approved' : 'none',
              subscriptionExpiresAt: role !== 'student' ? '2099-12-31T23:59:59.000Z' : null,
              activeCodeUsed: null,
              deviceSessionId,
              createdAt: new Date().toISOString(),
              fallbackPassword: password
            };

            const setPayload: Record<string, any> = { ...newProfile };
            Object.keys(setPayload).forEach((key) => {
              if (setPayload[key] === undefined) {
                delete setPayload[key];
              }
            });

            await setDoc(doc(db, 'users', fallbackUid), setPayload);
            onSuccess(newProfile);

            if (role !== 'student') {
              addToast('تم إنشاء حساب إدارة المنصة بنجاح!', 'success');
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
          {/* Google Sign-In Button */}
          {!forgotPassword && (
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-2.5 px-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl border border-slate-300 dark:border-slate-600 shadow-sm hover:shadow transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
              >
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>المتابعة باستخدام Google</span>
              </button>

              <div className="relative flex items-center justify-center my-3">
                <div className="border-t border-slate-200 dark:border-slate-700 w-full"></div>
                <span className="bg-white dark:bg-slate-900 px-3 text-xs text-slate-400 dark:text-slate-500 font-medium shrink-0">
                  أو بالبريد الإلكتروني / كود الطالب
                </span>
                <div className="border-t border-slate-200 dark:border-slate-700 w-full"></div>
              </div>
            </div>
          )}
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
