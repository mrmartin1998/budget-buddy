'use client';

export default function AccountCard({ 
  account, 
  onDelete, 
  isSelectable = false, 
  isSelected = false, 
  onClick = null,
  isDeleting = false 
}) {
  const baseClasses = `
    bg-white rounded-lg shadow-md p-4 sm:p-6
    ${account.type === 'cash' ? 'border-l-4 border-green-500' : 'border-l-4 border-blue-500'}
    ${isSelectable ? 'cursor-pointer hover:shadow-lg transition-all' : ''}
    ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
  `;

  const cardContent = (
    <>
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-medium text-gray-900">{account.name}</h3>
        {!account.isDefault && !isSelectable && onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(account._id);
            }}
            disabled={isDeleting}
            className="flex items-center gap-1 px-2 py-1 text-sm text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4" 
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
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        )}
      </div>
      <p className="text-sm text-gray-500 capitalize mb-2 text-left">{account.type}</p>
      <p className="text-2xl font-bold text-gray-900 text-left">
        ${parseFloat(account.balance).toFixed(2)}
      </p>
    </>
  );

  return isSelectable ? (
    <div className={baseClasses} onClick={onClick}>
      {cardContent}
    </div>
  ) : (
    <div className={baseClasses}>
      {cardContent}
    </div>
  );
}
