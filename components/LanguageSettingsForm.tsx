'use client';

import { useState, useEffect } from 'react';
import { supportedLanguages } from '@/lib/i18n-constants';
import { useRouter } from 'next/navigation';

interface LanguageSettings {
  defaultLanguage: string;
  availableLanguages: string[];
}

export default function LanguageSettingsForm() {
  const router = useRouter();
  const [settings, setSettings] = useState<LanguageSettings>({
    defaultLanguage: 'en',
    availableLanguages: ['en'],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/languages');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDefaultLanguageChange = (lang: string) => {
    setSettings((prev) => ({
      ...prev,
      defaultLanguage: lang,
      // Ensure default language is in available languages
      availableLanguages: prev.availableLanguages.includes(lang)
        ? prev.availableLanguages
        : [...prev.availableLanguages, lang],
    }));
  };

  const handleAvailableLanguageToggle = (lang: string) => {
    setSettings((prev) => {
      const isAvailable = prev.availableLanguages.includes(lang);
      let newAvailable = isAvailable
        ? prev.availableLanguages.filter((l) => l !== lang)
        : [...prev.availableLanguages, lang];

      // If removing default language, set first available as default
      if (isAvailable && prev.defaultLanguage === lang && newAvailable.length > 0) {
        return {
          defaultLanguage: newAvailable[0],
          availableLanguages: newAvailable,
        };
      }

      return {
        ...prev,
        availableLanguages: newAvailable,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setSaving(true);

    try {
      const response = await fetch('/api/admin/languages', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to save settings');
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.refresh();
      }, 1500);
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center py-8">
          <div className="text-gray-500">Loading settings...</div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-800">Language settings saved successfully!</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Default Language */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Default Language
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {supportedLanguages.map((lang) => (
              <label
                key={lang.code}
                className={`relative flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                  settings.defaultLanguage === lang.code
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                } ${
                  !settings.availableLanguages.includes(lang.code)
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
              >
                <input
                  type="radio"
                  name="defaultLanguage"
                  value={lang.code}
                  checked={settings.defaultLanguage === lang.code}
                  onChange={() => handleDefaultLanguageChange(lang.code)}
                  disabled={!settings.availableLanguages.includes(lang.code)}
                  className="sr-only"
                />
                <div className="flex items-center space-x-2 w-full">
                  <span className="text-2xl">{lang.flag}</span>
                  <div>
                    <div className="font-medium text-sm text-gray-900">{lang.name}</div>
                    <div className="text-xs text-gray-500">{lang.code.toUpperCase()}</div>
                  </div>
                </div>
                {settings.defaultLanguage === lang.code && (
                  <div className="absolute top-1 right-1">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </label>
            ))}
          </div>
        </div>

        {/* Available Languages */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Available Languages
          </label>
          <p className="text-sm text-gray-500 mb-4">
            Select which languages users can choose from. The default language must be included.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {supportedLanguages.map((lang) => (
              <label
                key={lang.code}
                className={`relative flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                  settings.availableLanguages.includes(lang.code)
                    ? 'border-green-600 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                } ${
                  settings.defaultLanguage === lang.code
                    ? 'ring-2 ring-blue-500 ring-offset-2'
                    : ''
                }`}
              >
                <input
                  type="checkbox"
                  checked={settings.availableLanguages.includes(lang.code)}
                  onChange={() => handleAvailableLanguageToggle(lang.code)}
                  disabled={settings.defaultLanguage === lang.code}
                  className="sr-only"
                />
                <div className="flex items-center space-x-2 w-full">
                  <span className="text-2xl">{lang.flag}</span>
                  <div>
                    <div className="font-medium text-sm text-gray-900">{lang.name}</div>
                    <div className="text-xs text-gray-500">{lang.code.toUpperCase()}</div>
                  </div>
                </div>
                {settings.availableLanguages.includes(lang.code) && (
                  <div className="absolute top-1 right-1">
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
                {settings.defaultLanguage === lang.code && (
                  <div className="absolute bottom-1 right-1">
                    <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded">
                      Default
                    </span>
                  </div>
                )}
              </label>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-6 border-t">
          <button
            type="submit"
            disabled={saving || settings.availableLanguages.length === 0}
            className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </form>
  );
}


