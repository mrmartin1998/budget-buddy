'use client';
import { useState, useEffect } from 'react';
import { formatDate } from '@/lib/utils/dateFormatter';

export default function RecentTransactions() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchRecentTransactions();
  }, []);

  const fetchRecentTransactions = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/transactions/recent', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setTransactions(data.transactions);
    } catch (error) {
      console.error('Error fetching recent transactions:', error);
    }
  };

  return (
    <div className="overflow-hidden">
      <div className="flow-root">
        <ul className="-my-4 divide-y divide-gray-200">
          {transactions.map((transaction) => (
            <li key={transaction._id} className="py-4">
              <div className="flex items-center space-x-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {transaction.category}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDate(transaction.date)}
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