import React, { useState } from 'react';
import { doc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { UserProfile } from '../types';
import { Lock, X, ShieldAlert, KeyRound } from 'lucide-react';
import { motion } from 'motion/react';

interface MasterPasscodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile | null;
  onSuccess: (profile?: UserProfile) => void;
  addToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export default function MasterPasscodeModal({
  isOpen,
  onClose,
  userProfile,
  onSuccess,
  addToast,
}: MasterPasscodeModalProps) {
  const [passcode, setPasscode] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const trimmed = passcode.trim();
    // Support multiple master codes for developer/user convenience
    const isCorrect = trimmed === '2026' || trimmed === 'MASTER_2026' || trimmed === 'MASTER_ADMIN_2026';

    if (!isCorrect) {
      addToast('رمز المرور المدخل غير صحيح! يرجى المحاولة مرة أخرى.', 'error');
      setLoading(false);
      return;
    }

    try {
      if (!userProfile) {
        // Automatic master admin login for guest
        const masterUid = 'fallback_master_admin_account';
        const masterProfile: UserProfile = {
          uid: masterUid,
          name: 'مستر عبدالله سيد',
          email: 'oa958792@gmail.com',
          phone: '+201102140676',
          grade: 'secondary_3',
          role: 'admin',
          subscriptionExpiresAt: '2099-12-31T23:59:59.000Z',
          subscriptionStatus: 'approved',
          activeCodeUsed: null,
          deviceSessionId: null,
          createdAt: new Date().toISOString()
        };
        localStorage.setItem('fallback_user_uid', masterUid);
        await setDoc(doc(db, 'users', masterUid), masterProfile, { merge: true });
        addToast('تم التحقق وتسجيل دخولك بصفة المسؤول بنجاح! 🎉', 'success');
        onSuccess(masterProfile);
        onClose();
        return;
      }

      // Update Firestore role to admin
      const userRef = doc(db, 'users', userProfile.uid);
      await updateDoc(userRef, { role: 'admin' });
      
      const masterProfile: UserProfile = { ...userProfile, role: 'admin' };
      
      addToast('تم التحقق وتفعيل صلاحيات المسؤول بنجاح! 🎉', 'success');
      onSuccess(masterProfile);
      onClose();
    } catch (err) {
      console.error('Error activating master role:', err);
      addToast('حدث خطأ أثناء ترقية الحساب، يرجى إعادة المحاولة.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" dir="rtl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden text-right"
      >
        {/* Decorative background accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600"></div>

        {/* Header */}
        <div className="p-6 pb-4 flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>لوحة الإدارة والمستر</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              خاص بالمعلم ومساعدي الإدارة لرفع الحصص والمذكرات.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 pt-2 space-y-4">
          <div className="p-4 bg-blue-50/50 dark:bg-blue-950/20 rounded-2xl border border-blue-100/30 dark:border-blue-900/30">
            <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed font-semibold">
              ⚠️ إذا كنت مستر عبدالله سيد أو أحد المشرفين، يرجى كتابة كلمة المرور المخصصة لك لتفعيل صلاحيات الإدارة ورفع الفيديوهات والمذكرات.
            </p>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1.5">
              كلمة مرور الإدارة المخصصة:
            </label>
            <div className="relative">
              <KeyRound className="absolute right-3 top-2.5 w-5 h-5 text-slate-400" />
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="أدخل كلمة مرور المستر..."
                className="w-full pr-10 pl-4 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-100 outline-none text-right placeholder:text-slate-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>تأكيد وتفعيل الصلاحيات</span>
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
