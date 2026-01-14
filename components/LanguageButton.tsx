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
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/80 hover:bg-white border border-slate-200 shadow-sm transition-all text-sm font-medium text-slate-700"
      title={t('language')}
    >
      <span className="text-base">{language === 'de' ? '🇩🇪' : '🇬🇧'}</span>
      <span>{language === 'de' ? 'DE' : 'EN'}</span>
    </button>
  );
}
