'use client'


import React from 'react'
import { ThemeProvider } from './theme-provider'
import { Toaster } from 'react-hot-toast'


export function RootProvider({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        borderRadius: 12,
                        padding: '12px 16px',
                        background: 'rgba(0,0,0,0.8)',
                        color: 'white',
                    },
                    success: { style: { background: 'rgb(var(--brand-green))', color: 'white' } },
                    error: { style: { background: '#ef4444', color: 'white' } },
                }}
            />
            {children}
        </ThemeProvider>
    )
}