'use client';

import { useState } from 'react';

const TransactionList = ({ transactions }) => {
  const [isLoading, setIsLoading] = useState(false);

  const sortedTransactions = transactions?.sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  ) || [];

  if (isLoading) {
    return <p className="text-gray-500 text-center py-4">Loading transactions...</p>;
  }

  if (!transactions || transactions.length === 0) {
    return <p className="text-gray-500 text-center py-4">No transactions found</p>;
  }

  return (
    <div className="space-y-4">
      {sortedTransactions.map((transaction) => (
        <div 
          key={transaction._id}
          className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  transaction.account?.type === 'cash' ? 'bg-green-500' : 'bg-blue-500'
                }`} />
                <p className="font-semibold">{transaction.category}</p>
              </div>
              <div className="space-y-1 mt-1">
                {transaction.description && (
                  <p className="text-sm text-gray-600">
                    {transaction.description}
                  </p>
                )}
                <p className="text-sm text-gray-500">
                  {new Date(transaction.date).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-bold ${
                transaction.type === 'income' 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                {transaction.type === 'income' ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
              </p>
              <p className="text-sm text-gray-500">
                {transaction.account?.name || 'Unknown Account'}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionList;