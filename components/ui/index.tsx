import React from 'react'


export type ButtonVariant = 'primary' | 'ghost' | 'gold';

export function Button({ children, variant = 'primary', ...props }: { children?: React.ReactNode; variant?: ButtonVariant } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
    const base = 'inline-flex items-center justify-center font-semibold rounded-2xl px-5 py-2.5 transition-colors'
    const styles: Record<ButtonVariant, string> = {
        primary: `${base} bg-brand-green text-white hover:bg-[rgba(8,89,54,0.9)]`,
        ghost: `${base} bg-transparent text-brand-green border border-transparent hover:bg-surface-contrast`,
        gold: `${base} bg-brand-gold text-white hover:bg-[rgba(219,164,55,0.9)]`,
    }


    return (
        <button className={styles[variant]} {...props}>
            {children}
        </button>
    )
}


export function Card({ children, className = '', ...props }: any) {
    const {
        action,
        variant,
        ...rest 
    } = props;

    return (
        <div
            className={`card surface p-6 rounded-2xl ${className}`}
            {...rest}
            style={{ backgroundColor: 'rgb(var(--surface))' }}
        >
            {children}
        </div>
    );
}

export function Input({ className = '', ...props }: any) {
    return (
        <input
            {...props}
            className={`w-full rounded-xl border-none p-3 outline-none placeholder:text-gray-400 focus-visible:ring-4 ${className}`}
            style={{ backgroundColor: 'rgb(var(--surface-contrast))' }}
        />
    )
}


export function Container({ children, className = '' }: any) {
    return <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>
}