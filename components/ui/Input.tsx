import React from 'react';

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props} style={{ borderColor: "rgb(var(--border-color))" }}
      className="w-full  border  focus:border-brand-green  px-4 py-3 outline-none text-plain font-medium"
    />
  );
}