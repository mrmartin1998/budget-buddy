'use client';
import { useState } from 'react';
import { useAlerts } from '@/components/providers/AlertProvider';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/lib/constants/categories';

export default function BudgetForm({ onClose }) {
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState('');
  const { addAlert } = useAlerts();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/budgets/set', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          type,
          category, 
          limit: Number(limit) 
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to set budget');
      }

      addAlert({
        type: 'success',
        message: 'Budget set successfully!',
      });
      
      setCategory('');
      setLimit('');
    } catch (error) {
      addAlert({
        type: 'error',
        message: error.message,
      });
    }
  };

  const handleCancel = () => {
    setType('expense');
    setCategory('');
    setLimit('');
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Type</label>
          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setCategory(''); // Reset category when type changes
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="">Select a category</option>
            {(type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          {type === 'expense' ? 'Monthly Spending Limit' : 'Monthly Income Target'}
        </label>
        <input
          type="number"
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
          min="0"
          step="0.01"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
      >
        Set {type === 'expense' ? 'Budget' : 'Income Target'}
      </button>
    </form>
  );
}