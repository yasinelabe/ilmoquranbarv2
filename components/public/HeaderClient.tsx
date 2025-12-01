"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { ThemeToggle } from "@/components/ui/ThemeToggler";
import LanguageSwitcher from "./LanguageSwitcher";

export default function HeaderClient({ locale, navItems, dict }: any) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const languages = ["en", "so", "ar"];
  const nextLang = languages[(languages.indexOf(locale) + 1) % languages.length];

  // Click outside to close
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Escape to close
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <>
      {/* Mobile top-right controls */}
      <div className="lg:hidden flex items-center gap-3">
        <LanguageSwitcher nextLang={nextLang} href={`/${nextLang}`} />

        <ThemeToggle />

        <button
          aria-label="Open navigation menu"
          onClick={() => setOpen(true)}
          className="p-2 rounded-xl hover:bg-surface-contrast transition"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="fixed inset-0 z-30">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Drawer */}
          <div
            ref={menuRef}
            className="
          absolute top-0 right-0 bottom-0
         min-h-screen w-72 
          bg-surface 
            text-white
          border-l border-border
          shadow-xl
          transform transition-transform duration-300 translate-x-0 bg-black/70 
        "
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-5 border-b border-border bg-surface dark:bg-surface-contrast">
              <span className="text-lg font-bold">{dict.nav.menu}</span>
              <button
                aria-label="Close navigation menu"
                onClick={() => setOpen(false)}
                className="p-2 rounded-xl hover:bg-surface-contrast dark:hover:bg-background transition"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex flex-col p-6 gap-6 text-lg bottom-0">
              {navItems.map((item: any) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="
                text-white
                hover:text-brand-gold dark:hover:text-brand-gold 
                transition-colors
              "
                >
                  {item.name}
                </Link>
              ))}

              {/* Donate Button */}
              <Link href={`/${locale}/donations`} onClick={() => setOpen(false)}>
                <button className="rounded-2xl px-4 py-2 font-bold bg-brand-gold text-white w-full hover:opacity-90 transition">
                  {dict.nav.donate}
                </button>
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>

  );
}
