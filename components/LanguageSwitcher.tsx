'use client';

import { useState, useEffect } from 'react';
import { supportedLanguages } from '@/lib/i18n-constants';
import { useRouter } from 'next/navigation';

export default function LanguageSwitcher() {
  const router = useRouter();
  const [currentLang, setCurrentLang] = useState('en');
  const [availableLanguages, setAvailableLanguages] = useState<string[]>(['en']);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Get language from cookie
    const langCookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith('lang='))
      ?.split('=')[1] || 'en';
    
    setCurrentLang(langCookie);
    fetchAvailableLanguages();
  }, []);

  const fetchAvailableLanguages = async () => {
    try {
      const response = await fetch('/api/languages');
      if (response.ok) {
        const data = await response.json();
        setAvailableLanguages(data.availableLanguages || ['en']);
      }
    } catch (err) {
      console.error('Error fetching available languages:', err);
    }
  };

  const handleLanguageChange = async (langCode: string) => {
    // Set cookie
    document.cookie = `lang=${langCode}; path=/; max-age=31536000`; // 1 year
    setCurrentLang(langCode);
    setIsOpen(false);
    
    // Update direction for RTL languages
    const isRTL = langCode === 'ar';
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = langCode;
    
    router.refresh();
  };

  const currentLanguage = supportedLanguages.find((lang) => lang.code === currentLang) || supportedLanguages[0];
  const displayLanguages = supportedLanguages.filter((lang) => 
    availableLanguages.includes(lang.code)
  );

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-gray-900 rounded-md hover:bg-gray-100 transition-colors"
      >
        <span className="text-xl">{currentLanguage.flag}</span>
        <span className="hidden sm:inline text-sm font-medium">
          {currentLanguage.code.toUpperCase()}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 border border-gray-200">
            <div className="py-1">
              {displayLanguages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-100 transition-colors ${
                    currentLang === lang.code ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                  }`}
                >
                  <span className="text-xl">{lang.flag}</span>
                  <span className="flex-1 font-medium">{lang.name}</span>
                  {currentLang === lang.code && (
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}


