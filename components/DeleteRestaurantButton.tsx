'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface DeleteRestaurantButtonProps {
  restaurantId: string;
}

export default function DeleteRestaurantButton({
  restaurantId,
}: DeleteRestaurantButtonProps) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/restaurants/${restaurantId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.error || 'Failed to delete restaurant');
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      alert('An unexpected error occurred');
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600">Are you sure?</span>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-red-600 hover:text-red-700 text-sm font-medium disabled:opacity-50"
        >
          {loading ? 'Deleting...' : 'Yes, delete'}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          className="text-gray-600 hover:text-gray-700 text-sm"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="text-red-600 hover:text-red-700 text-sm"
    >
      Delete
    </button>
  );
}

