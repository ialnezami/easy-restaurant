'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';

export default function DeleteRestaurantButton({
  restaurantId,
}: {
  restaurantId: string;
}) {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/restaurants/${restaurantId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        alert('Failed to delete restaurant');
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      alert('An error occurred while deleting the restaurant');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsDialogOpen(true)}
        className="text-red-600 hover:text-red-700 text-sm"
        disabled={loading}
      >
        Delete
      </button>
      <DeleteConfirmDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Restaurant"
        message="Are you sure you want to delete this restaurant? This action cannot be undone."
      />
    </>
  );
}

