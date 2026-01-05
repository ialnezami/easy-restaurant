'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from '@/lib/use-translations';
import Error from '@/components/Error';

export default function TrackOrderPage() {
  const router = useRouter();
  const { t } = useTranslations();
  const [orderNumber, setOrderNumber] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!orderNumber.trim()) {
      setError('Please enter an order number');
      return;
    }

    router.push(`/orders/${orderNumber.trim()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('order', 'trackOrder')}
          </h1>
          <p className="text-gray-600">
            {t('order', 'enterOrderNumber')}
          </p>
        </div>

        {error && <Error message={error} />}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="orderNumber"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t('order', 'orderNumber')}
            </label>
            <input
              type="text"
              id="orderNumber"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="e.g., 20240101-001"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-lg"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700"
          >
            {t('order', 'trackOrder')}
          </button>
        </form>
      </div>
    </div>
  );
}

