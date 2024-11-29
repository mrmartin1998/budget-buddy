'use client'

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import TransactionForm from '@/components/transactions/TransactionForm';
import AccountManager from '@/components/accounts/AccountManager';
import { useAccounts } from '@/contexts/AccountContext';
import DetailedCashFlow from '@/components/transactions/DetailedCashFlow';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const router = useRouter();
  const { handleTransaction } = useAccounts();

  const handleAccountToggle = (accountId) => {
    setSelectedAccounts(prev => {
      if (prev.includes(accountId)) {
        return prev.filter(id => id !== accountId);
      }
      return [...prev, accountId];
    });
  };

  const handleAddTransaction = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const res = await fetch('/api/transactions/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to add transaction');
      }

      handleTransaction(data.transaction);
      setTransactions((prev) => [...prev, data.transaction]);
    } catch (error) {
      throw error; // Let TransactionForm handle the error toast
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Transactions</h1>
      </div>

      <div className="mb-8">
        <div className="p-4 sm:p-6 rounded-lg">
          <AccountManager 
            selectedAccounts={selectedAccounts}
            onAccountToggle={handleAccountToggle}
          />
        </div>
      </div>

      <div className="mb-8">
        <DetailedCashFlow selectedAccounts={selectedAccounts} />
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Add Transaction</h2>
        <TransactionForm onSubmit={handleAddTransaction} />
      </div>
    </div>
  );
}
