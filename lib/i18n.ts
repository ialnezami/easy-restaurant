import { cookies } from 'next/headers';
import connectDB from './mongodb';
import Settings from '@/models/Settings';

export const supportedLanguages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
];

export async function getLanguage(): Promise<string> {
  try {
    await connectDB();
    const settings = await Settings.getSettings();
    
    // Check cookie first
    const cookieStore = await cookies();
    const langCookie = cookieStore.get('lang');
    
    if (langCookie && settings.availableLanguages.includes(langCookie.value)) {
      return langCookie.value;
    }
    
    // Fall back to default language
    return settings.defaultLanguage || 'en';
  } catch (error) {
    console.error('Error getting language:', error);
    return 'en';
  }
}

export async function getAvailableLanguages(): Promise<string[]> {
  try {
    await connectDB();
    const settings = await Settings.getSettings();
    return settings.availableLanguages || ['en'];
  } catch (error) {
    console.error('Error getting available languages:', error);
    return ['en'];
  }
}

export async function getDefaultLanguage(): Promise<string> {
  try {
    await connectDB();
    const settings = await Settings.getSettings();
    return settings.defaultLanguage || 'en';
  } catch (error) {
    console.error('Error getting default language:', error);
    return 'en';
  }
}


