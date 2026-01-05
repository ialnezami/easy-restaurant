'use client';

import { useState, useEffect } from 'react';
import { t, TranslationKey } from './translations';

export function useTranslations() {
  const [lang, setLang] = useState('en');

  useEffect(() => {
    // Get language from cookie
    const langCookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith('lang='))
      ?.split('=')[1] || 'en';
    
    setLang(langCookie);
  }, []);

  const translate = (section: TranslationKey, key: string): string => {
    return t(lang, section, key);
  };

  return { lang, t: translate };
}


