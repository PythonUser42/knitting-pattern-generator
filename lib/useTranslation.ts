'use client';

import { useStore } from './store';
import { t, TranslationKey, Language } from './translations';

export function useTranslation() {
  const language = useStore((state) => state.language);
  const setLanguage = useStore((state) => state.setLanguage);

  const translate = (key: TranslationKey): string => {
    return t(key, language);
  };

  return {
    t: translate,
    language,
    setLanguage,
  };
}
