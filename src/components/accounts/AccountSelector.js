'use client';

import { useState } from 'react';

export default function AccountSelector({ accounts, onAccountChange }) {
  const [selectedAccount, setSelectedAccount] = useState(accounts[0]?.id);

  const handleAccountChange = (e) => {
    setSelectedAccount(e.target.value);
    onAccountChange(e.target.value);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Account
      </label>
      <select
        value={selectedAccount}
        onChange={handleAccountChange}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      >
        {accounts.map((account) => (
          <option key={account.id} value={account.id}>
            {account.name} (${account.balance.toFixed(2)})
          </option>
        ))}
      </select>
    </div>
  );
}