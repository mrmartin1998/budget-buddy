'use client';

import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';

const TransactionForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    amount: '',
    type: '',
    category: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      amount: '',
      type: '',
      category: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          type="number"
          value={formData.amount}
          onChange={handleChange}
          placeholder="Amount"
          name="amount"
          required
        />
      </div>

      <div>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="">Select Type</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      <div>
        <Input
          type="text"
          value={formData.category}
          onChange={handleChange}
          placeholder="Category"
          name="category"
          required
        />
      </div>

      <div>
        <Input
          type="date"
          value={formData.date}
          onChange={handleChange}
          name="date"
          required
        />
      </div>

      <Button type="submit">
        Add Transaction
      </Button>
    </form>
  );
};

export default TransactionForm;
