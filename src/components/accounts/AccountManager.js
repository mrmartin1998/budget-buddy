'use client';

import { useState } from 'react';
import { useAccounts } from '@/contexts/AccountContext';

export default function AccountManager() {
  const { accounts, addAccount, deleteAccount } = useAccounts();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAccount, setNewAccount] = useState({
    name: '',
    type: 'cash',
    balance: '',
  });
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    addAccount(newAccount);
    setShowAddForm(false);
    setNewAccount({ name: '', type: 'cash', balance: '' });
  };

  const handleDelete = async (accountId) => {
    if (window.confirm('Are you sure you want to delete this account? This action cannot be undone.')) {
      setIsDeleting(true);
      try {
        await deleteAccount(accountId);
      } catch (error) {
        console.error('Error deleting account:', error);
        alert(error.message || 'Failed to delete account. Please try again.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">Accounts</h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 text-sm"
          >
            + Add Account
          </button>
        </div>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-md mb-6 space-y-4">
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
              <option value="bank">Bank Account</option>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {accounts.map((account) => (
          <div
            key={account._id}
            className={`bg-white rounded-lg shadow-md p-4 sm:p-6 ${
              account.type === 'cash' ? 'border-l-4 border-green-500' : 'border-l-4 border-blue-500'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-medium text-gray-900">{account.name}</h3>
              {!account.isDefault && (
                <button
                  onClick={() => handleDelete(account._id)}
                  disabled={isDeleting}
                  className="flex items-center gap-1 px-2 py-1 text-sm text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                    />
                  </svg>
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              )}
            </div>
            <p className="text-sm text-gray-500 capitalize mb-2">{account.type}</p>
            <p className="text-2xl font-bold text-gray-900">
              ${parseFloat(account.balance).toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
