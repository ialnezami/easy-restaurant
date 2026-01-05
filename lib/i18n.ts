import { cookies } from 'next/headers';
import connectDB from './mongodb';
import Settings from '@/models/Settings';

// Re-export supportedLanguages for server components that need it
export { supportedLanguages } from './i18n-constants';

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


