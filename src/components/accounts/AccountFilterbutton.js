'use client';

import { useAccounts } from '@/contexts/AccountContext';

export default function AccountFilter({ selectedAccounts, onAccountToggle }) {
  const { accounts } = useAccounts();

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {accounts.map((account) => (
        <button
          key={account._id}
          onClick={() => onAccountToggle(account._id)}
          className={`
            px-4 py-2 rounded-lg transition-colors flex items-center gap-2
            ${selectedAccounts.includes(account._id)
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }
          `}
        >
          <div className={`w-2 h-2 rounded-full ${
            account.type === 'cash' ? 'bg-green-500' : 'bg-blue-500'
          }`} />
          <span className="font-medium">{account.name}</span>
          <span className={`text-sm ${
            selectedAccounts.includes(account._id) ? 'text-white' : 'text-gray-500'
          }`}>
            ${account.balance.toFixed(2)}
          </span>
        </button>
      ))}
    </div>
  );
}