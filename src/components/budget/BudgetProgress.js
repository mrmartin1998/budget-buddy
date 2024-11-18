'use client';
import { useState, useEffect } from 'react';

export default function BudgetProgress() {
  const [budgets, setBudgets] = useState({ expenses: [], income: [] });

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
      const data = await res.json();
      
      // Separate budgets by type
      const expenses = data.budgets.filter(b => b.type === 'expense');
      const income = data.budgets.filter(b => b.type === 'income');
      setBudgets({ expenses, income });
    } catch (error) {
      console.error('Error fetching budgets:', error);
    }
  };

  const renderBudgetSection = (items, title) => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      {items.map((budget) => (
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
                budget.type === 'expense'
                  ? budget.percentage > 90
                    ? 'bg-red-600'
                    : budget.percentage > 70
                    ? 'bg-yellow-400'
                    : 'bg-green-500'
                  : 'bg-blue-500'
              }`}
              style={{ width: `${Math.min(budget.percentage, 100)}%` }}
            />
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-gray-500">
              {budget.percentage.toFixed(1)}% {budget.type === 'expense' ? 'used' : 'achieved'}
            </span>
            <span className="text-xs text-gray-500">
              ${Math.abs(budget.limit - budget.spent).toFixed(2)} {budget.type === 'expense' ? 'remaining' : 'to go'}
            </span>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-8">
      {renderBudgetSection(budgets.expenses, 'Expense Budgets')}
      {renderBudgetSection(budgets.income, 'Income Targets')}
    </div>
  );
}