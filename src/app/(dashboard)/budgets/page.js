'use client';
import { useState } from 'react';
import BudgetForm from '@/components/budget/BudgetForm';
import BudgetProgress from '@/components/budget/BudgetProgress';
import CategoryBreakdown from '@/components/dashboard/CategoryBreakdown';

export default function BudgetsPage() {
  const [showForm, setShowForm] = useState(false);

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleBudgetCreated = () => {
    setShowForm(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Budget Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Set New Budget
        </button>
      </div>

      {showForm && (
        <BudgetForm 
          onClose={handleCloseForm} 
          onBudgetCreated={handleBudgetCreated}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Budget Progress</h2>
          <BudgetProgress />
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Category Breakdown</h2>
          <CategoryBreakdown />
        </div>
      </div>
    </div>
  );
}