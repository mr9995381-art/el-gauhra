import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, translations, TranslationKey } from './i18n';
import { EducationalGrade, GRADE_LABELS, EDUCATION_SYSTEM_LABELS, EDUCATION_STAGE_LABELS } from '../types';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: TranslationKey, fallback?: string) => string;
  isRtl: boolean;
  getGradeLabel: (grade: EducationalGrade) => string;
  getEducationSystemLabel: (sys?: string) => string;
  getEducationStageLabel: (stage?: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'ar',
  setLang: () => {},
  t: (key) => key,
  isRtl: true,
  getGradeLabel: (g) => GRADE_LABELS[g] || g,
  getEducationSystemLabel: (s) => s || '',
  getEducationStageLabel: (s) => s || '',
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('lang');
    return (saved === 'en' || saved === 'ar') ? saved : 'ar';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('lang', newLang);
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === 'en' ? 'ltr' : 'rtl';
  };

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'en' ? 'ltr' : 'rtl';
  }, [lang]);

  const t = (key: TranslationKey, fallback?: string): string => {
    const dict = translations[lang] || translations.ar;
    return dict[key] || fallback || translations.ar[key] || key;
  };

  const isRtl = lang === 'ar';

  const getGradeLabel = (grade: EducationalGrade): string => {
    if (lang === 'en') {
      const enGrades: Record<EducationalGrade, string> = {
        prep_1: 'Prep Grade 1',
        prep_2: 'Prep Grade 2',
        prep_3: 'Prep Grade 3',
        secondary_1: 'Sec Grade 1',
        secondary_2: 'Sec Grade 2',
        secondary_3: 'Sec Grade 3',
      };
      return enGrades[grade] || GRADE_LABELS[grade] || grade;
    }
    return GRADE_LABELS[grade] || grade;
  };

  const getEducationSystemLabel = (sys?: string): string => {
    if (!sys) return '';
    if (lang === 'en') {
      const enSystems: Record<string, string> = {
        general: 'General Education',
        azhar: 'Al-Azhar Education',
        languages: 'Language Schools',
        other: 'Other Systems',
      };
      return enSystems[sys] || EDUCATION_SYSTEM_LABELS[sys as keyof typeof EDUCATION_SYSTEM_LABELS] || sys;
    }
    return EDUCATION_SYSTEM_LABELS[sys as keyof typeof EDUCATION_SYSTEM_LABELS] || sys;
  };

  const getEducationStageLabel = (stage?: string): string => {
    if (!stage) return '';
    if (lang === 'en') {
      const enStages: Record<string, string> = {
        prep: 'Preparatory Stage',
        secondary: 'Secondary Stage',
      };
      return enStages[stage] || EDUCATION_STAGE_LABELS[stage as keyof typeof EDUCATION_STAGE_LABELS] || stage;
    }
    return EDUCATION_STAGE_LABELS[stage as keyof typeof EDUCATION_STAGE_LABELS] || stage;
  };

  return (
    <LanguageContext.Provider
      value={{
        lang,
        setLang,
        t,
        isRtl,
        getGradeLabel,
        getEducationSystemLabel,
        getEducationStageLabel,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
