'use client';

import { useAccounts } from '@/contexts/AccountContext';

export default function AccountFilter({ selectedAccounts, onAccountToggle }) {
  const { accounts } = useAccounts();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {accounts.map((account) => (
        <button
          key={account._id}
          onClick={() => onAccountToggle(account._id)}
          className={`
            text-left
            ${selectedAccounts.includes(account._id)
              ? 'ring-2 ring-blue-500 ring-offset-2'
              : ''
            }
            ${account.type === 'cash' 
              ? 'border-l-4 border-green-500' 
              : 'border-l-4 border-blue-500'
            }
            bg-white rounded-lg shadow-md p-4 sm:p-6 transition-all
            hover:shadow-lg
          `}
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-medium text-gray-900">{account.name}</h3>
          </div>
          <p className="text-sm text-gray-500 capitalize mb-2">{account.type}</p>
          <p className="text-2xl font-bold text-gray-900">
            ${parseFloat(account.balance).toFixed(2)}
          </p>
        </button>
      ))}
    </div>
  );
}