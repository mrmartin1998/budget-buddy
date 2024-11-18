'use client';

const Button = ({ children, onClick, type = 'button', className = '', disabled = false }) => {
  const baseClasses = 'px-4 py-2 rounded font-medium focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variantClasses = 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed';
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
