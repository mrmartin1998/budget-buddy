'use client';
import { useState } from 'react';

export default function AmountRangeFilter({ onAmountChange }) {
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');

  const handleFilter = () => {
    onAmountChange({
      min: minAmount ? parseFloat(minAmount) : null,
      max: maxAmount ? parseFloat(maxAmount) : null
    });
  };

  const handleReset = () => {
    setMinAmount('');
    setMaxAmount('');
    onAmountChange({ min: null, max: null });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">Amount Range</h3>
        {(minAmount || maxAmount) && (
          <button
            onClick={handleReset}
            className="text-sm text-blue-500 hover:text-blue-600"
          >
            Reset
          </button>
        )}
      </div>
      <div className="space-y-2">
        <div className="flex gap-2">
          <div className="flex-1">
            <input
              type="number"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
              placeholder="Min"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
              min="0"
              step="0.01"
            />
          </div>
          <div className="flex items-center">
            <span className="text-gray-500">-</span>
          </div>
          <div className="flex-1">
            <input
              type="number"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
              placeholder="Max"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
              min="0"
              step="0.01"
            />
          </div>
        </div>
        <button
          onClick={handleFilter}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
        >
          Filter
        </button>
      </div>
    </div>
  );
}