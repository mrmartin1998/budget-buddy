'use client';
import { useState, useEffect } from 'react';
import { useToast } from '@/contexts/ToastContext';
import ListSkeleton from '@/components/common/skeletons/ListSkeleton';

export default function RecentTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    fetchRecentTransactions();
  }, []);

  const fetchRecentTransactions = async () => {
    setIsLoading(true);
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
      addToast('Failed to load recent transactions', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg ">
      <div className="p-4">
        {isLoading ? (
          <ListSkeleton rows={5} />
        ) : (
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
            {transactions.length === 0 && (
              <p className="text-gray-500 text-center py-4">No recent transactions</p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}