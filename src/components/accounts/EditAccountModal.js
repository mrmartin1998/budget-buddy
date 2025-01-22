'use client';
import { useState } from 'react';
import { useAccounts } from '@/contexts/AccountContext';
import { useToast } from '@/contexts/ToastContext';
import { ACCOUNT_COLORS } from '@/lib/constants/colors';

export default function EditAccountModal({ account, onClose }) {
  const { updateAccount } = useAccounts();
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: account.name,
    type: account.type,
    color: account.color || '#3B82F6',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateAccount(account._id, formData);
      addToast('Account updated successfully', 'success');
      onClose();
    } catch (error) {
      addToast(error.message || 'Failed to update account', 'error');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Edit Account</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
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
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="cash">Cash</option>
              <option value="bank">Bank Account</option>
              <option value="credit">Credit Card</option>
              <option value="savings">Savings Account</option>
              <option value="investment">Investment Account</option>
              <option value="crypto">Cryptocurrency</option>
              <option value="loan">Loan</option>
              <option value="other">Other</option>
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
                    ${formData.color === color.value ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => setFormData({ ...formData, color: color.value })}
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

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 