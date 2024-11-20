'use client';

import { useState, useEffect } from 'react';
import { useAccounts } from '@/contexts/AccountContext';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/lib/constants/categories';

export default function TransactionForm({ onSubmit }) {
  const { accounts } = useAccounts();
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    description: '',
    category: '',
    accountId: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (accounts.length > 0 && !formData.accountId) {
      setFormData(prev => ({
        ...prev,
        accountId: accounts[0]._id.toString(),
        category: 'Select a category'
      }));
    }
  }, [accounts]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (!formData.accountId) {
        throw new Error('Please select an account');
      }

      if (!formData.category) {
        throw new Error('Please select a category');
      }

      if (!formData.amount || parseFloat(formData.amount) <= 0) {
        throw new Error('Please enter a valid amount');
      }

      const selectedAccount = accounts.find(acc => acc._id.toString() === formData.accountId);
      
      if (!selectedAccount) {
        throw new Error('Selected account not found');
      }

      await onSubmit({
        ...formData,
        amount: parseFloat(formData.amount),
        accountId: selectedAccount._id.toString()
      });

      // Reset form
      setFormData({
        type: 'expense',
        amount: '',
        description: '',
        category: 'Food',
        accountId: accounts[0]?._id.toString() || '',
        date: new Date().toISOString().split('T')[0]
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const categories = formData.type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Account</label>
        <select
          value={formData.accountId}
          onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        >
          {accounts.map((account) => (
            <option key={account._id} value={account._id}>
              {account.name} (${account.balance.toFixed(2)})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
        <input
          type="number"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
          step="0.01"
          min="0"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <input
          type="text"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Add Transaction
      </button>
    </form>
  );
}
