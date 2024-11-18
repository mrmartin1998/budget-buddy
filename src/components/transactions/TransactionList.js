'use client';

import { useState, useEffect } from 'react';

const TransactionList = ({ transactions }) => {
  if (!transactions || transactions.length === 0) {
    return <p className="text-gray-500 text-center py-4">No transactions found</p>;
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <div 
          key={transaction._id}
          className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold">{transaction.category}</p>
              <p className="text-sm text-gray-500">
                {new Date(transaction.date).toLocaleDateString()}
              </p>
            </div>
            <p className={`font-bold ${
              transaction.type === 'income' 
                ? 'text-green-600' 
                : 'text-red-600'
            }`}>
              {transaction.type === 'income' ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionList;
