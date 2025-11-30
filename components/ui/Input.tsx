import React from 'react';

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input 
      {...props}
      className="w-full bg-brand-white border  focus:border-brand-green border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none text-plain dark:text-gray-800 font-medium placeholder-gray-400"
    />
  );
}