'use client';

import { useState } from 'react';
import { useAccounts } from '@/contexts/AccountContext';
import { useToast } from '@/contexts/ToastContext';
import AccountCard from './AccountCard';
import { ACCOUNT_COLORS } from '@/lib/constants/colors';

export default function AccountManager({ selectedAccounts = [], onAccountToggle }) {
  const { accounts, addAccount, updateAccount, deleteAccount } = useAccounts();
  const { addToast } = useToast();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAccount, setNewAccount] = useState({
    name: '',
    type: 'cash',
    balance: '',
    color: '#3B82F6',
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

      setNewAccount({ name: '', type: 'cash', balance: '', color: '#3B82F6' });
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

  const handleCancel = () => {
    setNewAccount({ name: '', type: 'cash', balance: '', color: '#3B82F6' });
    setShowAddForm(false);
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
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-md mb-6 space-y-4 relative">
          <button
            type="button"
            onClick={handleCancel}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          >
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

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
              Account Color
            </label>
            <div className="grid grid-cols-4 gap-2">
              {ACCOUNT_COLORS.map((color) => (
                <div
                  key={color.id}
                  className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-50
                    ${newAccount.color === color.value ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => setNewAccount({ ...newAccount, color: color.value })}
                >
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: color.value }}
                  />
                  <span className="text-sm">{color.label}</span>
                </div>
              ))}
            </div>
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
