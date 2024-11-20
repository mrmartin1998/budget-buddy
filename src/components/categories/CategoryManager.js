'use client';

import { useState } from 'react';

export default function CategoryManager({ categories, onCategoryAdd }) {
  const [newCategory, setNewCategory] = useState('');
  const [categoryType, setCategoryType] = useState('expense');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    onCategoryAdd({
      name: newCategory,
      type: categoryType,
      isCustom: true
    });

    setNewCategory('');
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Add Custom Category</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category Name
          </label>
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter category name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category Type
          </label>
          <select
            value={categoryType}
            onChange={(e) => setCategoryType(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Add Category
        </button>
      </form>
    </div>
  );
}