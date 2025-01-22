'use client';
import { useState } from 'react';
import EditAccountModal from './EditAccountModal';

export default function AccountCard({ 
  account, 
  onDelete, 
  isDeleting,
  isSelectable = false,
  isSelected = false,
  onClick
}) {
  const [showEditModal, setShowEditModal] = useState(false);

  const handleEditClick = (e) => {
    e.stopPropagation(); // Prevent card selection when clicking gear
    setShowEditModal(true);
  };

  return (
    <>
      <div 
        onClick={isSelectable ? onClick : undefined}
        className={`relative bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow border-2 
          ${isSelectable ? 'cursor-pointer' : ''} 
          ${isSelected ? 'border-blue-500' : 'border-transparent'}
          ${account.type === 'cash' ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-blue-500'}`}
      >
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-medium text-gray-900">{account.name}</h3>
          <div className="flex gap-2">
            {/* Gear Icon */}
            <button
              onClick={handleEditClick}
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
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
            
            {/* Delete Button */}
            {!account.isDefault && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(account._id);
                }}
                disabled={isDeleting}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        <p className="text-sm text-gray-500 capitalize mb-2">{account.type}</p>
        <p className="text-2xl font-bold text-gray-900">
          ${parseFloat(account.balance).toFixed(2)}
        </p>
      </div>

      {showEditModal && (
        <EditAccountModal
          account={account}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </>
  );
}
