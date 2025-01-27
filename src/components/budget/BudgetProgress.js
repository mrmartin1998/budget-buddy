'use client';
import { useState, useEffect } from 'react';
import { useToast } from '@/contexts/ToastContext';
import EditBudgetModal from './EditBudgetModal';
import DeleteBudgetModal from './DeleteBudgetModal';

export default function BudgetProgress() {
  const { addToast } = useToast();
  const [budgets, setBudgets] = useState([]);
  const [editingBudget, setEditingBudget] = useState(null);
  const [deletingBudget, setDeletingBudget] = useState(null);

  const fetchBudgets = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/budgets/progress', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch budgets');
      }

      const data = await response.json();
      setBudgets(data.budgets || []);
    } catch (error) {
      console.error('Fetch budgets error:', error);
      addToast('Failed to load budgets', 'error');
      setBudgets([]);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleEditClick = (budget) => {
    setEditingBudget(budget);
  };

  const handleUpdateBudget = async (updatedBudget) => {
    setBudgets(prev => 
      prev.map(b => b._id === updatedBudget._id ? updatedBudget : b)
    );
    await fetchBudgets();
  };

  const handleDeleteClick = (budget) => {
    setDeletingBudget(budget);
  };

  const handleDeleteBudget = async (deletedBudgetId) => {
    setBudgets(prev => prev.filter(b => b._id !== deletedBudgetId));
    await fetchBudgets();
  };

  return (
    <div className="space-y-4">
      {Array.isArray(budgets) && budgets.map((budget) => (
        <div key={budget._id} className="bg-white p-4 rounded-lg shadow border">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-medium text-gray-900">{budget.category}</h3>
              <p className="text-sm text-gray-500">
                ${Math.abs(budget.spent).toFixed(2)} of ${budget.limit.toFixed(2)}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEditClick(budget)}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteClick(budget)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
          
          <div className="relative pt-1">
            <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
              <div
                style={{ width: `${Math.min(100, (budget.spent / budget.limit) * 100)}%` }}
                className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                  budget.spent > budget.limit ? 'bg-red-500' : 'bg-blue-500'
                }`}
              />
            </div>
          </div>
        </div>
      ))}

      {editingBudget && (
        <EditBudgetModal
          budget={editingBudget}
          onClose={() => setEditingBudget(null)}
          onUpdate={handleUpdateBudget}
        />
      )}

      {deletingBudget && (
        <DeleteBudgetModal
          budget={deletingBudget}
          onClose={() => setDeletingBudget(null)}
          onDelete={handleDeleteBudget}
        />
      )}

      {(!budgets || budgets.length === 0) && (
        <p className="text-gray-500 text-center py-4">No budgets set yet.</p>
      )}
    </div>
  );
}