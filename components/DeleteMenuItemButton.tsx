'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface DeleteMenuItemButtonProps {
  menuId: string;
  itemId: string;
}

export default function DeleteMenuItemButton({
  menuId,
  itemId,
}: DeleteMenuItemButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this menu item?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/menus/${menuId}/items/${itemId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.error || 'Failed to delete menu item');
        return;
      }

      router.refresh();
    } catch (err) {
      alert('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-red-600 hover:text-red-700 text-sm disabled:opacity-50"
    >
      {loading ? 'Deleting...' : 'Delete'}
    </button>
  );
}


