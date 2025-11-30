'use client'


import React from 'react'
import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'


export function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)


    React.useEffect(() => setMounted(true), [])


    if (!mounted) return <div className="w-9 h-9 rounded-full bg-surface-contrast animate-pulse" />


    return (
        <button
            aria-label="Toggle theme"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-full hover:bg-surface-contrast transition-colors"
        >
            {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-brand-gold" />
            ) : (
                <Moon className="h-5 w-5 text-brand-green" />
            )}
        </button>
    )
}