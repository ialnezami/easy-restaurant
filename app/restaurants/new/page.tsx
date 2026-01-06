'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Error from '@/components/Error';
import ImageUpload from '@/components/ImageUpload';
import ImageGallery from '@/components/ImageGallery';
import ColorPicker from '@/components/ColorPicker';
import { useTranslations } from '@/lib/use-translations';

export default function NewRestaurantPage() {
  const router = useRouter();
  const { t } = useTranslations();
  const [formData, setFormData] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
    phone: '',
    email: '',
    website: '',
    coverImage: '',
    images: [] as string[],
    primaryColor: '#3B82F6',
    secondaryColor: '#1E40AF',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/restaurants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          addresses: [
            {
              street: formData.street,
              city: formData.city,
              state: formData.state,
              zipCode: formData.zipCode,
              country: formData.country,
            },
          ],
          contactInfo: {
            phone: formData.phone,
            email: formData.email,
            website: formData.website,
          },
          coverImage: formData.coverImage || null,
          images: formData.images,
          primaryColor: formData.primaryColor,
          secondaryColor: formData.secondaryColor,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || t('restaurant', 'failedToCreate'));
        return;
      }

      router.push(`/restaurants/${data.restaurant._id}`);
    } catch (err) {
      setError(t('restaurant', 'unexpectedError'));
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            {t('restaurant', 'create')}
          </h1>

        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
          {error && <Error message={error} />}

          <div className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                {t('restaurant', 'name')} *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1.5 block w-full px-4 py-2.5 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-sm bg-white text-gray-900 transition-all duration-200"
              />
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {t('restaurant', 'address')}
              </h3>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="street"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {t('restaurant', 'streetAddress')} *
                  </label>
                  <input
                    type="text"
                    id="street"
                    name="street"
                    required
                    value={formData.street}
                    onChange={handleChange}
                    className="mt-1.5 block w-full px-4 py-2.5 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-sm bg-white text-gray-900 transition-all duration-200"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium text-gray-700"
                    >
                      {t('restaurant', 'city')} *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      className="mt-1.5 block w-full px-4 py-2.5 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-sm bg-white text-gray-900 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="state"
                      className="block text-sm font-medium text-gray-700"
                    >
                      {t('restaurant', 'state')}
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="mt-1.5 block w-full px-4 py-2.5 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-sm bg-white text-gray-900 transition-all duration-200"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="zipCode"
                      className="block text-sm font-medium text-gray-700"
                    >
                      {t('restaurant', 'zipCode')}
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      className="mt-1.5 block w-full px-4 py-2.5 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-sm bg-white text-gray-900 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="country"
                      className="block text-sm font-medium text-gray-700"
                    >
                      {t('restaurant', 'country')} *
                    </label>
                    <select
                      id="country"
                      name="country"
                      required
                      value={formData.country}
                      onChange={handleChange}
                      className="mt-1.5 block w-full px-4 py-2.5 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-sm bg-white text-gray-900 transition-all duration-200"
                    >
                      <option value="USA">USA</option>
                      <option value="Canada">Canada</option>
                      <option value="UK">UK</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {t('restaurant', 'brandColors')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ColorPicker
                  label={t('restaurant', 'primaryColor')}
                  value={formData.primaryColor}
                  onChange={(color) =>
                    setFormData({ ...formData, primaryColor: color })
                  }
                  defaultColor="#3B82F6"
                />
                <ColorPicker
                  label={t('restaurant', 'secondaryColor')}
                  value={formData.secondaryColor}
                  onChange={(color) =>
                    setFormData({ ...formData, secondaryColor: color })
                  }
                  defaultColor="#1E40AF"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                {t('restaurant', 'brandColorsDescription')}
              </p>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {t('restaurant', 'images')}
              </h3>
              <div className="space-y-6">
                <div>
                  <ImageUpload
                    value={formData.coverImage}
                    onChange={(url) =>
                      setFormData({ ...formData, coverImage: url })
                    }
                    label={t('restaurant', 'coverImage')}
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    {t('restaurant', 'coverImageDescription')}
                  </p>
                </div>
                <div>
                  <ImageGallery
                    images={formData.images}
                    onChange={(images) =>
                      setFormData({ ...formData, images })
                    }
                    label={t('restaurant', 'additionalImages')}
                    maxImages={10}
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    {t('restaurant', 'additionalImagesDescription')}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {t('restaurant', 'contactInformation')}
              </h3>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {t('restaurant', 'phone')}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-1.5 block w-full px-4 py-2.5 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-sm bg-white text-gray-900 transition-all duration-200"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {t('restaurant', 'email')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1.5 block w-full px-4 py-2.5 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-sm bg-white text-gray-900 transition-all duration-200"
                  />
                </div>
                <div>
                  <label
                    htmlFor="website"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {t('restaurant', 'website')}
                  </label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="mt-1.5 block w-full px-4 py-2.5 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-sm bg-white text-gray-900 transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t mt-6">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-5 py-2.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                {t('common', 'cancel')}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {loading ? t('restaurant', 'creating') : t('restaurant', 'createRestaurant')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}



