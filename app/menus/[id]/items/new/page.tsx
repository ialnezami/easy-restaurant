'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import Error from '@/components/Error';
import ImageUpload from '@/components/ImageUpload';
import { supportedLanguages } from '@/lib/i18n-constants';

export default function NewMenuItemPage() {
  const router = useRouter();
  const params = useParams();
  const menuId = params.id as string;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
  });
  const [translations, setTranslations] = useState<{
    [lang: string]: {
      name: string;
      description: string;
      category: string;
    };
  }>({});
  const [availableLanguages, setAvailableLanguages] = useState<string[]>(['en']);
  const [showTranslations, setShowTranslations] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch available languages
    fetch('/api/languages')
      .then((res) => res.json())
      .then((data) => {
        if (data.availableLanguages) {
          setAvailableLanguages(data.availableLanguages);
        }
      })
      .catch((err) => console.error('Error fetching languages:', err));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleTranslationChange = (
    lang: string,
    field: 'name' | 'description' | 'category',
    value: string
  ) => {
    setTranslations({
      ...translations,
      [lang]: {
        ...translations[lang],
        [field]: value,
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.price) {
      setError('Name and price are required');
      return;
    }

    const price = parseFloat(formData.price);
    if (isNaN(price) || price < 0) {
      setError('Please enter a valid price');
      return;
    }

    setLoading(true);

    try {
      // Prepare translations object (only include languages with at least one field filled)
      const translationsToSend: {
        name?: { [lang: string]: string };
        description?: { [lang: string]: string };
        category?: { [lang: string]: string };
      } = {};

      availableLanguages.forEach((lang) => {
        if (lang === 'en') return; // Skip English as it's the default

        const langTranslations = translations[lang];
        if (langTranslations) {
          if (langTranslations.name?.trim()) {
            if (!translationsToSend.name) translationsToSend.name = {};
            translationsToSend.name[lang] = langTranslations.name.trim();
          }
          if (langTranslations.description?.trim()) {
            if (!translationsToSend.description) translationsToSend.description = {};
            translationsToSend.description[lang] = langTranslations.description.trim();
          }
          if (langTranslations.category?.trim()) {
            if (!translationsToSend.category) translationsToSend.category = {};
            translationsToSend.category[lang] = langTranslations.category.trim();
          }
        }
      });

      const requestBody: any = {
        name: formData.name,
        description: formData.description || null,
        price: price,
        category: formData.category || null,
        image: formData.image || null,
      };

      // Only include translations if there are any
      if (Object.keys(translationsToSend).length > 0) {
        requestBody.translations = translationsToSend;
      }

      const response = await fetch(`/api/menus/${menuId}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to create menu item');
        return;
      }

      router.push(`/menus/${menuId}`);
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Add Menu Item
        </h1>

        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
          {error && <Error message={error} />}

          <div className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Item Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-white text-gray-900"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-white text-gray-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700"
                >
                  Price ($) *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  step="0.01"
                  min="0"
                  required
                  value={formData.price}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-white text-gray-900"
                />
              </div>
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700"
                >
                  Category
                </label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g., Appetizers, Main Course"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-white text-gray-900"
                />
              </div>
            </div>

            <div>
              <ImageUpload
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
                label="Cover Image (optional)"
              />
              {formData.image && (
                <p className="mt-1 text-sm text-gray-500">
                  Cover image uploaded successfully. You can change it before submitting.
                </p>
              )}
            </div>

            {/* Translations Section */}
            {availableLanguages.length > 1 && (
              <div className="pt-6 border-t">
                <button
                  type="button"
                  onClick={() => setShowTranslations(!showTranslations)}
                  className="flex items-center justify-between w-full text-left mb-4"
                >
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Translations (Optional)
                    </h3>
                    <p className="text-sm text-gray-500">
                      Add translations for other languages
                    </p>
                  </div>
                  <svg
                    className={`w-5 h-5 transform transition-transform ${
                      showTranslations ? 'rotate-180' : ''
                    }`}
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

                {showTranslations && (
                  <div className="space-y-6 bg-gray-50 p-4 rounded-lg">
                    {availableLanguages
                      .filter((lang) => lang !== 'en')
                      .map((lang) => {
                        const langInfo = supportedLanguages.find(
                          (l) => l.code === lang
                        );
                        const langTranslations = translations[lang] || {
                          name: '',
                          description: '',
                          category: '',
                        };

                        return (
                          <div
                            key={lang}
                            className="bg-white p-4 rounded-lg border border-gray-200"
                          >
                            <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center gap-2">
                              <span>{langInfo?.flag}</span>
                              <span>{langInfo?.name || lang.toUpperCase()}</span>
                            </h4>

                            <div className="space-y-4">
                              <div>
                                <label
                                  htmlFor={`translation-${lang}-name`}
                                  className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                  Name
                                </label>
                                <input
                                  type="text"
                                  id={`translation-${lang}-name`}
                                  value={langTranslations.name}
                                  onChange={(e) =>
                                    handleTranslationChange(
                                      lang,
                                      'name',
                                      e.target.value
                                    )
                                  }
                                  placeholder={`Translation for "${formData.name}"`}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                                />
                              </div>

                              <div>
                                <label
                                  htmlFor={`translation-${lang}-description`}
                                  className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                  Description
                                </label>
                                <textarea
                                  id={`translation-${lang}-description`}
                                  rows={2}
                                  value={langTranslations.description}
                                  onChange={(e) =>
                                    handleTranslationChange(
                                      lang,
                                      'description',
                                      e.target.value
                                    )
                                  }
                                  placeholder={
                                    formData.description
                                      ? `Translation for "${formData.description}"`
                                      : 'Description translation (optional)'
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                                />
                              </div>

                              {formData.category && (
                                <div>
                                  <label
                                    htmlFor={`translation-${lang}-category`}
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                  >
                                    Category
                                  </label>
                                  <input
                                    type="text"
                                    id={`translation-${lang}-category`}
                                    value={langTranslations.category}
                                    onChange={(e) =>
                                      handleTranslationChange(
                                        lang,
                                        'category',
                                        e.target.value
                                      )
                                    }
                                    placeholder={`Translation for "${formData.category}"`}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Item'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}


