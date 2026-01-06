'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from '@/lib/use-translations';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';

export default function DeleteRestaurantButton({
  restaurantId,
}: {
  restaurantId: string;
}) {
  const router = useRouter();
  const { t } = useTranslations();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/restaurants/${restaurantId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.error || t('restaurant', 'failedToDeleteRestaurant'));
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      alert(t('common', 'unexpectedError'));
    } finally {
      setLoading(false);
      setIsDialogOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsDialogOpen(true)}
        className="px-3 py-1.5 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={loading}
      >
        {loading ? t('common', 'deleting') : t('common', 'delete')}
      </button>
      <DeleteConfirmDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleDelete}
        translationKey={{
          title: 'restaurant.deleteRestaurant',
          message: 'restaurant.deleteRestaurantConfirm',
        }}
      />
    </>
  );
}

