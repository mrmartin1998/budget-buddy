'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import CategoryBreakdown from '@/components/dashboard/CategoryBreakdown';
import BudgetProgressMini from '@/components/budget/BudgetProgressMini';
import AccountManager from '@/components/accounts/AccountManager';
import EnhancedCashFlow from '@/components/dashboard/EnhancedCashFlow';

export default function Dashboard() {
  const router = useRouter();
  const [selectedAccounts, setSelectedAccounts] = useState([]);

  const handleAccountToggle = (accountId) => {
    setSelectedAccounts(prev => {
      if (prev.includes(accountId)) {
        return prev.filter(id => id !== accountId);
      }
      return [...prev, accountId];
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
      </div>

      <div className="mb-8">
        <div className="p-4 sm:p-6 rounded-lg">
          <AccountManager 
            selectedAccounts={selectedAccounts}
            onAccountToggle={handleAccountToggle}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Cash Flow</h2>
          <EnhancedCashFlow selectedAccounts={selectedAccounts} />
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
          <RecentTransactions selectedAccounts={selectedAccounts} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Category Breakdown</h2>
          <CategoryBreakdown selectedAccounts={selectedAccounts} />
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Budget Progress</h2>
          <BudgetProgressMini selectedAccounts={selectedAccounts} />
        </div>
      </div>
    </div>
  );
}