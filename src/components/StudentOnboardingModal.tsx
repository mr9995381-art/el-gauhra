import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { UserProfile, EducationalGrade, EducationSystem, EducationStage, EDUCATION_SYSTEM_LABELS, EDUCATION_STAGE_LABELS, GRADE_LABELS } from '../types';
import { GraduationCap, User, Phone, CheckCircle2, Sparkles, School, AlertCircle, BookOpen } from 'lucide-react';

interface StudentOnboardingModalProps {
  userProfile: UserProfile;
  onComplete: (updatedProfile: UserProfile) => void;
  addToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const StudentOnboardingModal: React.FC<StudentOnboardingModalProps> = ({
  userProfile,
  onComplete,
  addToast,
}) => {
  const [name, setName] = useState(userProfile.name !== 'طالب جديد' ? userProfile.name : '');
  const [phone, setPhone] = useState(userProfile.phone !== 'غير محدد' ? userProfile.phone : '');
  const [parentPhone, setParentPhone] = useState(userProfile.parentPhone || '');
  const [educationSystem, setEducationSystem] = useState<EducationSystem>((userProfile.educationSystem as EducationSystem) || 'general');
  const [educationStage, setEducationStage] = useState<EducationStage>((userProfile.educationStage as EducationStage) || 'secondary');
  const [grade, setGrade] = useState<EducationalGrade>(
    userProfile.grade || (educationStage === 'prep' ? 'prep_1' : 'secondary_1')
  );
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleStageChange = (stage: EducationStage) => {
    setEducationStage(stage);
    if (stage === 'prep') {
      if (!['prep_1', 'prep_2', 'prep_3'].includes(grade)) {
        setGrade('prep_1');
      }
    } else {
      if (!['secondary_1', 'secondary_2', 'secondary_3'].includes(grade)) {
        setGrade('secondary_1');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('يرجى إدخال اسم الطالب كاملاً');
      return;
    }
    if (!phone.trim() || phone.trim().length < 10) {
      setErrorMsg('يرجى إدخال رقم هاتف صحبح للطالب');
      return;
    }
    if (!parentPhone.trim() || parentPhone.trim().length < 10) {
      setErrorMsg('يرجى إدخال رقم هاتف صحبح لولي الأمر');
      return;
    }

    setSaving(true);
    try {
      const userRef = doc(db, 'users', userProfile.uid);
      const updatedFields = {
        name: name.trim(),
        phone: phone.trim(),
        parentPhone: parentPhone.trim(),
        educationSystem,
        educationStage,
        grade,
        isProfileComplete: true,
      };

      await updateDoc(userRef, updatedFields);

      const completeProfile: UserProfile = {
        ...userProfile,
        ...updatedFields,
      };

      addToast('تم استكمال بيانات حسابك بنجاح! أهلاً بك في المنصة 🎉', 'success');
      onComplete(completeProfile);
    } catch (err) {
      console.error('Error updating student profile:', err);
      setErrorMsg('حدث خطأ أثناء حفظ البيانات، يرجى المحاولة مرة أخرى.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md overflow-y-auto" dir="rtl">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 my-8 overflow-hidden">
        {/* Header decoration banner */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 p-6 sm:p-8 text-white relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-2xl">
              <GraduationCap className="w-8 h-8 text-amber-300" />
            </div>
            <div>
              <span className="px-3 py-1 bg-amber-400/20 text-amber-200 border border-amber-400/30 text-[11px] font-extrabold rounded-full inline-block mb-1">
                الخطوة الأولى والأهم 🚀
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">إكمال البيانات الشخصية والدراسية</h2>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed max-w-md">
            أهلاً بك! لتخصيص تجربتك التعليمية وعرض الكورسات والمذكرات الخاصة بصفك الدراسي بدقة، يرجى تحديد بياناتك أدناه.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {errorMsg && (
            <div className="p-4 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-2xl flex items-center gap-3 text-rose-700 dark:text-rose-300 text-xs font-bold">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Student Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              اسم الطالب الثلاثي أو الرباعي <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="أدخل اسمك الرباعي هنا..."
                className="w-full pl-4 pr-11 py-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:outline-none font-semibold"
              />
              <User className="w-5 h-5 text-slate-400 absolute right-3.5 top-3.5" />
            </div>
          </div>

          {/* Phone Numbers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                رقم هاتف الطالب <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01xxxxxxxxx"
                  className="w-full pl-4 pr-11 py-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:outline-none font-semibold text-left"
                  dir="ltr"
                />
                <Phone className="w-5 h-5 text-slate-400 absolute right-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                رقم هاتف ولي الأمر <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                  placeholder="01xxxxxxxxx"
                  className="w-full pl-4 pr-11 py-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:outline-none font-semibold text-left"
                  dir="ltr"
                />
                <Phone className="w-5 h-5 text-slate-400 absolute right-3.5 top-3.5" />
              </div>
            </div>
          </div>

          {/* Education System Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              نظام التعليم <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {(['general', 'azhar', 'languages', 'other'] as EducationSystem[]).map((sys) => (
                <button
                  type="button"
                  key={sys}
                  onClick={() => setEducationSystem(sys)}
                  className={`p-3 rounded-2xl border text-right transition-all flex items-center justify-between cursor-pointer ${
                    educationSystem === sys
                      ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-extrabold shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <span className="text-xs">{EDUCATION_SYSTEM_LABELS[sys]}</span>
                  {educationSystem === sys && <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* Education Stage Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              المرحلة الدراسية <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(['prep', 'secondary'] as EducationStage[]).map((stg) => (
                <button
                  type="button"
                  key={stg}
                  onClick={() => handleStageChange(stg)}
                  className={`p-3.5 rounded-2xl border text-center transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    educationStage === stg
                      ? 'border-blue-600 bg-blue-600 text-white font-extrabold shadow-md'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 font-semibold'
                  }`}
                >
                  <School className="w-4 h-4" />
                  <span className="text-xs sm:text-sm">{EDUCATION_STAGE_LABELS[stg]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Grade Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              الصف الدراسي المحدد <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {(educationStage === 'prep'
                ? (['prep_1', 'prep_2', 'prep_3'] as EducationalGrade[])
                : (['secondary_1', 'secondary_2', 'secondary_3'] as EducationalGrade[])
              ).map((g) => (
                <button
                  type="button"
                  key={g}
                  onClick={() => setGrade(g)}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    grade === g
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-black ring-2 ring-indigo-500/30'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 font-medium hover:border-slate-300'
                  }`}
                >
                  <span className="text-xs sm:text-sm block">{GRADE_LABELS[g]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={saving}
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-base rounded-2xl shadow-xl shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <span>جاري حفظ البيانات...</span>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
                  <span>حفظ البيانات ومتابعة إلى منصتي</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
