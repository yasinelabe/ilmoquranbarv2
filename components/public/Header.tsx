'use client'

import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { ThemeToggle } from '../ui/ThemeToggler'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import WhiteLogo from '../../public/white_logo.png'
import GreenLogo from '../../public/green_logo.png'
import { useTheme } from 'next-themes'
const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Donations', href: '/donations' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
]

export function Header() {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  // Close on ESC
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [])

  return (
    <header className="sticky top-0 z-20 bg-plain/95 backdrop-blur-sm border-b border-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">

        <Link href="/" className="flex items-center gap-3 no-underline">
          {mounted && (
            <Image
              alt="logo"
              src={theme === "dark" ? GreenLogo : WhiteLogo}
              width={120}
              height={40}
              className="object-contain"
            />
          )}
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex gap-8 items-center">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="
                text-plain
                hover:text-brand-green
                dark:hover:text-brand-gold
                transition-colors
              "
            >
              {item.name}
            </Link>
          ))}

          <ThemeToggle />

          <Link href="/donations" className="ml-2">
            <button className="rounded-2xl px-4 py-2 font-bold bg-brand-gold text-white">
              Donate
            </button>
          </Link>
        </nav>

        {/* Mobile / Tablet */}
        <div className="lg:hidden flex items-center gap-3">
          <ThemeToggle />

          {/* Hamburger Button */}
          <button
            aria-label="Open navigation menu"
            onClick={() => setOpen(true)}
            className="p-2 rounded-xl hover:bg-muted/20 transition"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      <div
        className={`
    fixed inset-0 z-30
    ${open ? 'block' : 'hidden'}
  `}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />

        {/* Drawer */}
        <div
          ref={menuRef}
          className="
      absolute top-0 right-0 h-full w-72
      bg-plain shadow-xl border-l border-border
      transform transition-transform duration-300
    "
          style={{
            transform: open ? 'translateX(0)' : 'translateX(100%)',
          }}
        >
          <div className="flex items-center justify-between p-5 border-b border-border">
            <span className="text-lg font-bold">Menu</span>
            <button
              aria-label="Close navigation menu"
              onClick={() => setOpen(false)}
              className="p-2 rounded-xl hover:bg-muted/20 transition"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="flex flex-col p-6 gap-6 text-lg" style={{ backgroundColor: 'rgb(var(--surface))' }}>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-plain hover:text-brand-green dark:hover:text-brand-gold transition-colors
          "
              >
                {item.name}
              </Link>
            ))}

            <Link href="/donations" onClick={() => setOpen(false)}>
              <button className="rounded-2xl px-4 py-2 font-bold bg-brand-gold text-white w-full">
                Donate
              </button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}