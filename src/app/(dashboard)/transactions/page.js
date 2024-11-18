'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TransactionForm from '@/components/transactions/TransactionForm';
import TransactionList from '@/components/transactions/TransactionList';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const res = await fetch('/api/transactions', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Failed to fetch transactions');
        }

        setTransactions(data.transactions);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchTransactions();
  }, [router]);

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
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to add transaction');
      }

      setSuccess('Transaction added successfully!');
      setTransactions((prev) => [...prev, data.transaction]);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Transactions</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Add Transaction</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {success && <p className="text-green-500 mb-4">{success}</p>}
          <TransactionForm onSubmit={handleAddTransaction} />
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Transaction List</h2>
          <TransactionList transactions={transactions} />
        </div>
      </div>
    </div>
  );
}
