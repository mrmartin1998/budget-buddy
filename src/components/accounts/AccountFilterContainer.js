'use client';

import { useState } from 'react';
import AccountFilter from './AccountFilter';

export default function AccountFilterContainer({ children, showFilter = true }) {
  const [selectedAccounts, setSelectedAccounts] = useState([]);

  const handleAccountToggle = (accountId) => {
    setSelectedAccounts(prev => {
      if (prev.includes(accountId)) {
        return prev.filter(id => id !== accountId);
      }
      return [...prev, accountId];
    });
  };

  return (
    <div>
      {showFilter && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Filter by Accounts</h3>
          <AccountFilter
            selectedAccounts={selectedAccounts}
            onAccountToggle={handleAccountToggle}
          />
        </div>
      )}
      {children({ selectedAccounts })}
    </div>
  );
}