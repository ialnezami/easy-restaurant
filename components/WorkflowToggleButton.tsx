'use client';

import { useState } from 'react';

interface WorkflowToggleButtonProps {
  restaurantId: string;
  workflowEnabled: boolean;
}

export default function WorkflowToggleButton({
  restaurantId,
  workflowEnabled: initialWorkflowEnabled,
}: WorkflowToggleButtonProps) {
  const [workflowEnabled, setWorkflowEnabled] = useState(initialWorkflowEnabled);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/restaurants/${restaurantId}/workflow`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workflowEnabled: !workflowEnabled,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Failed to update workflow status');
        return;
      }

      setWorkflowEnabled(!workflowEnabled);
    } catch (error) {
      console.error('Error updating workflow:', error);
      alert('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        workflowEnabled ? 'bg-blue-600' : 'bg-gray-200'
      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      role="switch"
      aria-checked={workflowEnabled}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          workflowEnabled ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

