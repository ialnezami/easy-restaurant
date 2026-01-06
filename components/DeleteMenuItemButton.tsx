'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from '@/lib/use-translations';

interface DeleteMenuItemButtonProps {
  menuId: string;
  itemId: string;
}

export default function DeleteMenuItemButton({
  menuId,
  itemId,
}: DeleteMenuItemButtonProps) {
  const router = useRouter();
  const { t } = useTranslations();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm(t('menu', 'deleteItemConfirm'))) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/menus/${menuId}/items/${itemId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.error || t('menu', 'failedToDeleteItem'));
        return;
      }

      router.refresh();
    } catch (err) {
      alert(t('common', 'unexpectedError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="px-3 py-1.5 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? t('common', 'deleting') : t('common', 'delete')}
    </button>
  );
}


