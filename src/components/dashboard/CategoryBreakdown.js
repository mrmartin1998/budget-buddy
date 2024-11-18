'use client';
import { useState, useEffect } from 'react';

export default function CategoryBreakdown() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategoryBreakdown();
  }, []);

  const fetchCategoryBreakdown = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/transactions/categories', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setCategories(data.categories);
    } catch (error) {
      console.error('Error fetching category breakdown:', error);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Spending by Category</h3>
      {categories.map((category) => (
        <div key={category.name} className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-600">
              {category.name}
            </span>
            <span className="text-sm font-medium text-gray-900">
              ${category.total}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${category.percentage}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}