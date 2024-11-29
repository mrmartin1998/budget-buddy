'use client';

import { useState } from 'react';
import { useAccounts } from '@/contexts/AccountContext';
import { useToast } from '@/contexts/ToastContext';
import AccountCard from './AccountCard';

export default function AccountManager({ selectedAccounts = [], onAccountToggle }) {
  const { accounts, addAccount, updateAccount, deleteAccount } = useAccounts();
  const { addToast } = useToast();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAccount, setNewAccount] = useState({
    name: '',
    type: 'cash',
    balance: '',
  });
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!newAccount.name || !newAccount.balance) {
        addToast('Please fill in all required fields', 'error');
        return;
      }

      await addAccount({
        ...newAccount,
        balance: parseFloat(newAccount.balance)
      });

      setNewAccount({ name: '', type: 'cash', balance: '' });
      setShowAddForm(false);
      addToast('Account added successfully', 'success');
    } catch (error) {
      console.error('Error adding account:', error);
      addToast(error.message || 'Failed to add account', 'error');
    }
  };

  const handleDelete = async (accountId) => {
    if (window.confirm('Are you sure you want to delete this account? This action cannot be undone.')) {
      setIsDeleting(true);
      try {
        await deleteAccount(accountId);
        addToast('Account deleted successfully', 'success');
      } catch (error) {
        console.error('Error deleting account:', error);
        addToast('Failed to delete account', 'error');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleUpdate = async (accountId, updatedData) => {
    try {
      await updateAccount(accountId, updatedData);
      addToast('Account updated successfully', 'success');
    } catch (error) {
      console.error('Error updating account:', error);
      addToast('Failed to update account', 'error');
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
          <AccountCard
            key={account._id}
            account={account}
            onDelete={handleDelete}
            isDeleting={isDeleting}
            isSelectable={true}
            isSelected={selectedAccounts.includes(account._id)}
            onClick={() => onAccountToggle(account._id)}
          />
        ))}
      </div>
    </div>
  );
}
