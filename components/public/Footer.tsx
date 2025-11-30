import Link from 'next/link'
import React from 'react'
import { Zap } from 'lucide-react'

export function Footer() {
  return (
    <footer
      className="mt-16 pt-12 pb-8"
      style={{ backgroundColor: 'rgb(var(--brand-green))' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 pb-10 border-b border-white/10">

          {/* Brand */}
          <div>
            <Link
              href="/"
              className="flex items-center text-2xl font-extrabold mb-3 text-brand-gold no-underline"
            >
              <Zap className="mr-2" /> IlmoQuranbar
            </Link>
            <p className="text-sm text-white/90">
              Teaching the Quran free of charge to more than 10,000 children.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="font-bold text-lg mb-3 text-brand-gold">Quick Links</h5>
            <ul className="space-y-2 text-white/90">
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/donations">Campaigns</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h5 className="font-bold text-lg mb-3 text-brand-gold">Support</h5>
            <ul className="space-y-2 text-white/90">
              <li><Link href="#">Privacy Policy</Link></li>
              <li><Link href="#">Terms of Service</Link></li>
              <li><Link href="/admin/login">Admin Login</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h5 className="font-bold text-lg mb-3 text-brand-gold">Newsletter</h5>
            <p className="text-sm text-white/90 mb-3">
              Stay updated with our progress.
            </p>

            {/* FIXED: mobile-safe responsive form */}
            <form className="w-full space-y-3 md:space-y-0 md:flex">
              <input
                type="email"
                placeholder="Your email"
                className="
                  w-full
                  p-3
                  rounded-xl
                  md:rounded-l-xl md:rounded-r-none
                  bg-white/10 text-white placeholder-white/60
                  border-none
                "
              />
              <button
                type="submit"
                className="
                  w-full md:w-auto
                  mt-2 md:mt-0
                  bg-brand-gold px-4 py-3
                  rounded-xl
                  md:rounded-r-xl md:rounded-l-none
                  font-bold
                "
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-white/60">
          &copy; {new Date().getFullYear()} IlmoQuranbar. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
