import React from 'react';

// Odoo-style: Flat, distinct, no shadow, rounded
export function Button({ children, disabled, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button 
      {...props}
      disabled={disabled}
      className={`
        w-full py-3 px-6 rounded-xl font-bold text-lg transition-all
        ${disabled ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-brand-green text-white hover:bg-brand-dark active:translate-y-1'}
      `}
    >
      {children}
    </button>
  );
}