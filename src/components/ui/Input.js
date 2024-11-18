'use client';

const Input = ({ type = 'text', value, onChange, placeholder = '', className = '', required = false }) => {
  const baseClasses = 'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500';

  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={`${baseClasses} ${className}`}
    />
  );
};

export default Input;
