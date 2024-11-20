'use client';

import { useState } from 'react';
import { useAccounts } from '@/contexts/AccountContext';

export default function AccountManager() {
  const { accounts, addAccount, updateAccount, deleteAccount } = useAccounts();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAccount, setNewAccount] = useState({
    name: '',
    type: 'cash',
    balance: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await addAccount({
        ...newAccount,
        balance: parseFloat(newAccount.balance)
      });
      setNewAccount({ name: '', type: 'cash', balance: '' });
      setShowAddForm(false);
    } catch (err) {
      setError(err.message || 'Failed to add account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Accounts</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          {showAddForm ? 'Cancel' : 'Add Account'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="mb-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Name
            </label>
            <input
              type="text"
              value={newAccount.name}
              onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Type
            </label>
            <select
              value={newAccount.type}
              onChange={(e) => setNewAccount({ ...newAccount, type: e.target.value })}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="cash">Cash</option>
              <option value="checking">Checking</option>
              <option value="savings">Savings</option>
              <option value="credit">Credit Card</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Initial Balance
            </label>
            <input
              type="number"
              step="0.01"
              value={newAccount.balance}
              onChange={(e) => setNewAccount({ ...newAccount, balance: e.target.value })}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Add Account
          </button>
        </form>
      )}

      <div className="space-y-4">
        {accounts.map((account) => (
          <div
            key={account.id}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div>
              <h3 className="font-medium">{account.name}</h3>
              <p className="text-sm text-gray-500 capitalize">{account.type}</p>
            </div>
            <div className="text-right">
              <p className="font-medium">${account.balance.toFixed(2)}</p>
              {!account.isDefault && (
                <button
                  onClick={() => deleteAccount(account.id)}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
