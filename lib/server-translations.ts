import { cookies } from 'next/headers';
import { getLanguage } from './i18n';
import { t, TranslationKey } from './translations';

export async function getServerTranslations() {
  const lang = await getLanguage();
  
  return {
    lang,
    t: (section: TranslationKey, key: string) => t(lang, section, key),
  };
}

