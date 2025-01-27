'use client';
import { useState, useEffect } from 'react';
import { useToast } from '@/contexts/ToastContext';
import EditBudgetModal from './EditBudgetModal';
import DeleteBudgetModal from './DeleteBudgetModal';
import { formatPeriodLabel } from '@/lib/utils/budgetPeriodUtils';

export default function BudgetProgress() {
  const { addToast } = useToast();
  const [budgets, setBudgets] = useState([]);
  const [editingBudget, setEditingBudget] = useState(null);
  const [deletingBudget, setDeletingBudget] = useState(null);

  const fetchBudgets = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching budgets with token:', token ? 'present' : 'missing');
      
      const response = await fetch('/api/budgets/progress', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch budgets');
      }

      const data = await response.json();
      console.log('Received budgets:', data);
      setBudgets(data.budgets || []);
    } catch (error) {
      console.error('Fetch budgets error:', error);
      addToast(error.message || 'Failed to load budgets', 'error');
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
      {Array.isArray(budgets) && budgets.map((budget) => {
        const percentage = (budget.spent / budget.limit) * 100;
        return (
          <div key={budget._id} className="bg-white p-4 rounded-lg shadow border">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium text-gray-900">{budget.category}</h3>
                <p className="text-sm text-gray-500">
                  ${Math.abs(budget.spent).toFixed(2)} of ${budget.limit.toFixed(2)} {formatPeriodLabel(budget.period)}
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
                  style={{ width: `${Math.min(100, percentage)}%` }}
                  className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                    percentage > 90
                      ? 'bg-red-500'
                      : percentage > 70
                      ? 'bg-yellow-400'
                      : 'bg-green-500'
                  }`}
                />
              </div>
            </div>
          </div>
        );
      })}

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