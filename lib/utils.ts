import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

/**
 * Get translated menu item field, falling back to default if translation doesn't exist
 */
export function getTranslatedMenuItemField(
  item: {
    name: string;
    description?: string;
    category?: string;
    translations?: {
      name?: { [lang: string]: string } | Map<string, string>;
      description?: { [lang: string]: string } | Map<string, string>;
      category?: { [lang: string]: string } | Map<string, string>;
    };
  },
  field: 'name' | 'description' | 'category',
  lang: string
): string {
  // If no translations or language is English, return default
  if (!item.translations || lang === 'en') {
    return field === 'name' 
      ? item.name 
      : field === 'description' 
      ? item.description || '' 
      : item.category || '';
  }

  const translations = item.translations[field];
  if (!translations) {
    // Fall back to default field
    return field === 'name' 
      ? item.name 
      : field === 'description' 
      ? item.description || '' 
      : item.category || '';
  }

  // Handle both Map and plain object formats
  let translatedValue: string | undefined;
  if (translations instanceof Map) {
    translatedValue = translations.get(lang);
  } else {
    translatedValue = translations[lang];
  }

  // If translation exists, return it; otherwise fall back to default
  if (translatedValue) {
    return translatedValue;
  }

  // Fall back to default field
  return field === 'name' 
    ? item.name 
    : field === 'description' 
    ? item.description || '' 
    : item.category || '';
}



