'use client';
import { useState } from 'react';
import BudgetForm from '@/components/budget/BudgetForm';
import BudgetProgress from '@/components/budget/BudgetProgress';
import CategoryBreakdown from '@/components/dashboard/CategoryBreakdown';

export default function BudgetsPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Budget Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          {showForm ? 'Close Form' : 'Set New Budget'}
        </button>
      </div>

      {showForm && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Set Budget</h2>
          <BudgetForm />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Budget Progress</h2>
            <BudgetProgress />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <CategoryBreakdown />
          </div>
        </div>
      </div>
    </div>
  );
}