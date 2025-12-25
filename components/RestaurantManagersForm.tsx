'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Error from './Error';

interface RestaurantManagersFormProps {
  restaurant: {
    _id: string;
    owner: { name: string; email: string };
    managers?: Array<{ _id: string; name: string; email: string; role: string }>;
  };
  availableManagers: Array<{ _id: string; name: string; email: string; role: string }>;
}

export default function RestaurantManagersForm({
  restaurant,
  availableManagers,
}: RestaurantManagersFormProps) {
  const router = useRouter();
  const [selectedManagers, setSelectedManagers] = useState<string[]>(
    restaurant.managers?.map((m: any) => m._id.toString()) || []
  );
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleToggleManager = (managerId: string) => {
    setSelectedManagers((prev) =>
      prev.includes(managerId)
        ? prev.filter((id) => id !== managerId)
        : [...prev, managerId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch(`/api/restaurants/${restaurant._id}/managers`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ managers: selectedManagers }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to update managers');
        return;
      }

      setSuccess('Managers updated successfully');
      router.refresh();
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
      {error && <Error message={error} />}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative mb-4">
          {success}
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Current Managers
        </h2>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div>
              <span className="font-medium">{restaurant.owner.name}</span>
              <span className="text-sm text-gray-500 ml-2">
                ({restaurant.owner.email}) - Owner
              </span>
            </div>
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
              Owner
            </span>
          </div>
          {restaurant.managers?.map((manager: any) => (
            <div
              key={manager._id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded"
            >
              <div>
                <span className="font-medium">{manager.name}</span>
                <span className="text-sm text-gray-500 ml-2">
                  ({manager.email})
                </span>
              </div>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                Manager
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Assign Managers
        </h2>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {availableManagers.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No managers available. Create manager users first.
            </p>
          ) : (
            availableManagers.map((manager) => (
              <label
                key={manager._id}
                className="flex items-center p-3 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedManagers.includes(manager._id)}
                  onChange={() => handleToggleManager(manager._id)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="ml-3 flex-1">
                  <span className="font-medium">{manager.name}</span>
                  <span className="text-sm text-gray-500 ml-2">
                    ({manager.email})
                  </span>
                </div>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                  {manager.role}
                </span>
              </label>
            ))
          )}
        </div>
      </div>

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
          {loading ? 'Updating...' : 'Update Managers'}
        </button>
      </div>
    </form>
  );
}

