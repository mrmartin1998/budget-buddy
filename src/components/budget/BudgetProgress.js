'use client';
import { useState, useEffect } from 'react';

export default function BudgetProgress() {
  const [budgets, setBudgets] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/budgets/progress', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!res.ok) {
        throw new Error('Failed to fetch budgets');
      }

      const data = await res.json();
      console.log('Fetched budget data:', data); // Debug log
      setBudgets(data.budgets || []);
    } catch (error) {
      console.error('Error fetching budgets:', error);
      setError(error.message);
    }
  };

  return (
    <div className="space-y-4">
      {error && <p className="text-red-500">{error}</p>}
      {budgets.map((budget) => (
        <div key={budget._id} className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-gray-700">{budget.category}</h3>
            <span className="text-sm text-gray-500">
              ${budget.spent.toFixed(2)} / ${budget.limit.toFixed(2)}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full ${
                budget.percentage > 90
                  ? 'bg-red-600'
                  : budget.percentage > 70
                  ? 'bg-yellow-400'
                  : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(budget.percentage, 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}