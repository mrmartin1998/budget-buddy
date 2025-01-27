'use client';
import { useToast } from '@/contexts/ToastContext';

export default function DeleteBudgetModal({ budget, onClose, onDelete }) {
  const { addToast } = useToast();

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/budgets/${budget._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to delete budget');
      }

      onDelete(budget._id);
      addToast('Budget deleted successfully', 'success');
      onClose();
    } catch (error) {
      addToast(error.message || 'Failed to delete budget', 'error');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Delete Budget</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-600">
            Are you sure you want to delete the budget for <span className="font-medium">{budget.category}</span>? 
            This action cannot be undone.
          </p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
} 