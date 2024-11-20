'use client';
import { useState, useEffect } from 'react';
import { useAccounts } from '@/contexts/AccountContext';

export default function StatsOverview() {
  const { accounts, getTotalBalance } = useAccounts();
  const [stats, setStats] = useState({
    totalBalance: 0,
    totalIncome: 0,
    totalExpenses: 0
  });

  useEffect(() => {
    const totalBalance = getTotalBalance();
    const totalIncome = accounts.reduce((total, account) => 
      total + (parseFloat(account.totalIncome) || 0), 0);
    const totalExpenses = accounts.reduce((total, account) => 
      total + (parseFloat(account.totalExpenses) || 0), 0);
    
    setStats({
      totalBalance: parseFloat(totalBalance),
      totalIncome: parseFloat(totalIncome),
      totalExpenses: parseFloat(totalExpenses)
    });
  }, [accounts, getTotalBalance]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h3 className="text-lg font-medium text-gray-500">Total Balance</h3>
        <p className="text-2xl sm:text-3xl font-bold text-gray-900">
          ${stats.totalBalance.toFixed(2)}
        </p>
      </div>
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h3 className="text-lg font-medium text-gray-500">Total Income</h3>
        <p className="text-2xl sm:text-3xl font-bold text-green-600">
          ${stats.totalIncome.toFixed(2)}
        </p>
      </div>
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h3 className="text-lg font-medium text-gray-500">Total Expenses</h3>
        <p className="text-2xl sm:text-3xl font-bold text-red-600">
          ${stats.totalExpenses.toFixed(2)}
        </p>
      </div>
    </div>
  );
}