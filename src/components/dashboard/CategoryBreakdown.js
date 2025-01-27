'use client';
import { useState, useEffect } from 'react';
import { useToast } from '@/contexts/ToastContext';

export default function CategoryBreakdown() {
  const [categories, setCategories] = useState([]);
  const { addToast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/transactions/categories', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const data = await response.json();
      console.log('Received categories:', data);
      
      if (data.categories && Array.isArray(data.categories)) {
        // Sort categories by total amount in descending order
        const sortedCategories = data.categories.sort((a, b) => b.total - a.total);
        setCategories(sortedCategories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      addToast('Failed to load categories', 'error');
    }
  };

  // Calculate the maximum total for proper bar scaling
  const maxTotal = Math.max(...categories.map(cat => cat.total), 0);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold mb-4">Spending by Category</h2>
      {categories.map((cat) => (
        <div key={cat.category} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-700">{cat.category}</span>
            <span className="text-gray-900">${cat.total.toFixed(2)}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{
                width: `${(cat.total / maxTotal) * 100}%`
              }}
            />
          </div>
        </div>
      ))}
      {categories.length === 0 && (
        <p className="text-gray-500 text-center py-4">No transaction data available</p>
      )}
    </div>
  );
}