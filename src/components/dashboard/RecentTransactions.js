'use client';
import { useState, useEffect } from 'react';
import { useToast } from '@/contexts/ToastContext';

export default function RecentTransactions() {
  const [transactions, setTransactions] = useState([]);
  const { addToast } = useToast();

  useEffect(() => {
    fetchRecentTransactions();
  }, []);

  const fetchRecentTransactions = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        addToast('Please login to view transactions', 'error');
        return;
      }

      const res = await fetch('/api/transactions/recent', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch recent transactions');
      }

      const data = await res.json();
      setTransactions(data.transactions);
    } catch (error) {
      console.error('Error fetching recent transactions:', error);
      addToast('Failed to load recent transactions', 'error');
    }
  };

  return (
    <div className="bg-white rounded-lg ">
      <div className="p-4">
        <ul className="space-y-3">
          {transactions.map((transaction) => (
            <li key={transaction._id} className="border-b pb-2 last:border-0">
              <div className="flex items-center space-x-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {transaction.category}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(transaction.date).toLocaleDateString()}
                  </p>
                </div>
                <div className={`text-sm font-semibold ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}${transaction.amount}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}