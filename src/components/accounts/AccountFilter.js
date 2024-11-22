'use client';

import { useAccounts } from '@/contexts/AccountContext';
import AccountCard from './AccountCard';

export default function AccountFilter({ selectedAccounts, onAccountToggle }) {
  const { accounts } = useAccounts();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {accounts.map((account) => (
        <AccountCard
          key={account._id}
          account={account}
          isSelectable={true}
          isSelected={selectedAccounts.includes(account._id)}
          onClick={() => onAccountToggle(account._id)}
        />
      ))}
    </div>
  );
}