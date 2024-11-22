'use client'

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import TransactionForm from '@/components/transactions/TransactionForm';
import TransactionList from '@/components/transactions/TransactionList';
import AccountManager from '@/components/accounts/AccountManager';
import { useAccounts } from '@/contexts/AccountContext';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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

  const fetchTransactions = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      let url = '/api/transactions';
      if (selectedAccounts.length > 0) {
        const accountParams = selectedAccounts.join(',');
        url += `?accounts=${accountParams}`;
      }

      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response');
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch transactions');
      }

      setTransactions(data.transactions);
      setError('');
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setError('Failed to load transactions. Please try refreshing the page.');
      setTransactions([]);
    }
  }, [router, selectedAccounts]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleAddTransaction = async (formData) => {
    setError('');
    setSuccess('');

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

      setSuccess('Transaction added successfully!');
      setTransactions((prev) => [...prev, data.transaction]);
    } catch (error) {
      setError(error.message);
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Add Transaction</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {success && <p className="text-green-500 mb-4">{success}</p>}
          <TransactionForm onSubmit={handleAddTransaction} />
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Transaction List</h2>
          <TransactionList transactions={transactions} />
        </div>
      </div>
    </div>
  );
}
