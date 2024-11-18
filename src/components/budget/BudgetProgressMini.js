'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function BudgetProgressMini() {
  const [budgets, setBudgets] = useState([]);

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
      setBudgets(data.budgets);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Budget Overview</h3>
        <Link 
          href="/budgets"
          className="text-sm text-blue-500 hover:text-blue-600"
        >
          View All
        </Link>
      </div>
      
      {budgets.slice(0, 3).map((budget) => (
        <div key={budget._id} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">{budget.category}</span>
            <span className="text-gray-900">
              ${budget.spent.toFixed(2)} / ${budget.limit.toFixed(2)}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
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