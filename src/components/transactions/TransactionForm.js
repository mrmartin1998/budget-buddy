'use client';

import { useState, useEffect } from 'react';
import { useAccounts } from '@/contexts/AccountContext';
import { useToast } from '@/contexts/ToastContext';

export default function TransactionForm({ onSubmit, initialData = null, isEditing = false }) {
  const { accounts } = useAccounts();
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    accountId: '',
    description: ''
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (initialData && isEditing) {
      setFormData({
        type: initialData.type,
        amount: Math.abs(initialData.amount).toString(),
        category: initialData.category,
        date: new Date(initialData.date).toISOString().split('T')[0],
        accountId: initialData.accountId?._id || initialData.accountId,
        description: initialData.description || ''
      });
    }
  }, [initialData, isEditing]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/categories', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setCategories(data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.category || !formData.accountId) {
      addToast('Please fill in all required fields', 'error');
      return;
    }

    try {
      await onSubmit(formData);
      
      if (!isEditing) {
        setFormData({
          type: 'expense',
          amount: '',
          category: '',
          description: '',
          date: new Date().toISOString().split('T')[0],
          accountId: ''
        });
      }
      
      addToast(
        isEditing ? 'Transaction updated successfully' : 'Transaction added successfully',
        'success'
      );
    } catch (error) {
      console.error('Transaction form error:', error);
      addToast(
        error.message || 'Failed to process transaction',
        'error'
      );
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">Amount</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            step="0.01"
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Account</label>
        <select
          name="accountId"
          value={formData.accountId}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        >
          <option value="">Select an account</option>
          {accounts.map((account) => (
            <option key={account._id} value={account._id}>
              {account.name} (${(account.balance || 0).toFixed(2)})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        >
          <option value="">Select a category</option>
          {categories
            .filter(cat => cat.type === formData.type)
            .map(cat => (
              <option 
                key={cat._id} 
                value={cat.name}
                className="flex items-center py-2 px-4"
              >
                {cat.name}
              </option>
            ))
          }
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Date</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows="2"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        {isEditing ? 'Update Transaction' : 'Add Transaction'}
      </button>
    </form>
  );
}
