'use client';

import { useTranslation } from '../lib/useTranslation';

export default function LanguageButton() {
  const { language, setLanguage, t } = useTranslation();

  const toggleLanguage = () => {
    setLanguage(language === 'de' ? 'en' : 'de');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1 sm:gap-2 px-2 py-1 sm:px-3 sm:py-1.5 rounded-md sm:rounded-lg bg-white/80 hover:bg-white border border-slate-200 shadow-sm transition-all text-xs sm:text-sm font-medium text-slate-700"
      title={t('language')}
    >
      <span className="text-sm sm:text-base">{language === 'de' ? '🇩🇪' : '🇬🇧'}</span>
      <span className="hidden sm:inline">{language === 'de' ? 'DE' : 'EN'}</span>
    </button>
  );
}
