'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import StatsOverview from '@/components/dashboard/StatsOverview';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import CategoryBreakdown from '@/components/dashboard/CategoryBreakdown';
import BudgetProgress from '@/components/budget/BudgetProgress';
import BudgetProgressMini from '@/components/budget/BudgetProgressMini';
import AccountManager from '@/components/accounts/AccountManager';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Dashboard</h1>
      
      <StatsOverview />
      
      <div className="mt-8 mb-8">
        <AccountManager />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="space-y-6">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Budget Progress</h2>
            <BudgetProgress />
          </div>
          
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
            <RecentTransactions />
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Spending by Category</h2>
            <CategoryBreakdown />
          </div>
        </div>
      </div>
    </div>
  );
}