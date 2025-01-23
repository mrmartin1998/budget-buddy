'use client';
import { useState } from 'react';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/lib/constants/categories';

export default function CategoryFilter({ onCategoryChange }) {
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev => {
      const newSelection = prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category];
      
      onCategoryChange(newSelection);
      return newSelection;
    });
  };

  const handleReset = () => {
    setSelectedCategories([]);
    onCategoryChange([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">Categories</h3>
        {selectedCategories.length > 0 && (
          <button
            onClick={handleReset}
            className="text-sm text-blue-500 hover:text-blue-600"
          >
            Reset
          </button>
        )}
      </div>
      
      {/* Income Categories */}
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-gray-500">Income</h4>
        <div className="flex flex-wrap gap-2">
          {INCOME_CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryToggle(category)}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedCategories.includes(category)
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Expense Categories */}
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-gray-500">Expenses</h4>
        <div className="flex flex-wrap gap-2">
          {EXPENSE_CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryToggle(category)}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedCategories.includes(category)
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 