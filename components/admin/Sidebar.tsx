'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Users, Map, Home, DollarSign, BookOpen, UserCheck, Menu, X, Zap,
  Settings, Landmark, Circle, LayoutDashboard, Aperture, PartyPopper, ChessKing
} from 'lucide-react';
import { logoutAction } from '@/app/actions/auth';
import { Button } from '../ui';
import Logo from '../public/Logo';

// Define the main navigation items structure
const adminNavItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin/dashboard",
  },
  {
    title: "Structure Management",
    icon: Home,
    items: [
      { name: "Locations", icon: Map, href: "/admin/locations" },
      { name: "Mosques", icon: Landmark, href: "/admin/mosques" },
      { name: "Qur'anic Circles", icon: Circle, href: "/admin/circles" },
    ],
  },
  {
    title: "People Management",
    icon: Users,
    items: [
      { name: "Users", icon: UserCheck, href: "/admin/users" },
      { name: "Students", icon: BookOpen, href: "/admin/students" },
      { name: "Teachers", icon: Aperture, href: "/admin/teachers" },
      { name: "Sponsors", icon: ChessKing, href: "/admin/sponsors" },
    ],
  },
  {
    title: "Finance",
    icon: DollarSign,
    items: [
      { name: "Transactions", icon: DollarSign, href: "/admin/transactions" },
    ],
  },
  {
    title: "Campaigns",
    icon: PartyPopper,
    items: [
      { name: "Campaigns", icon: PartyPopper, href: "/admin/campaigns" },
    ],
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/admin/settings",
  },
];

// Reusable component for the Navigation Links
const NavLink = ({ href, icon: Icon, name }: { href: string, icon: React.ElementType, name: string }) => {
  const pathname = usePathname();
  const isActive = pathname === href || (pathname.startsWith(href) && href !== '/admin/dashboard');

  return (
    <Link
      href={href}
      className={`
        flex items-center p-3 rounded-xl transition-colors text-sm font-medium
        ${isActive
          ? 'bg-brand-green text-white dark:bg-brand-gold shadow-lg'
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'}
      `}
    >
      <Icon size={18} className="mr-3" />
      {name}
    </Link>
  );
};

export function Sidebar() {
  // State for mobile/collapsed visibility
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close sidebar when navigating on mobile
  React.useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const toggleSidebar = () => setIsOpen(!isOpen);

  // Expose toggle function globally for use in the Admin Header
  if (typeof window !== 'undefined') {
    (window as any).toggleAdminSidebar = toggleSidebar;
  }

  return (
    <>
      {/* 1. Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 md:hidden transition-opacity ${isOpen ? 'opacity-100 visible' : 'opacity-0 hidden'}`}
        onClick={toggleSidebar}
      />

      {/* 2. Main Sidebar Content */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-64 p-6 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800
          transition-transform duration-300 ease-in-out z-50 md:sticky md:top-0 md:translate-x-0
          ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
        `}
      >

        {/* Logo/Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/admin/dashboard" className="flex items-center text-xl font-extrabold text-brand-gold dark:text-brand-gold">
         <Logo isFooter={true} className='ml-8'/>
           <br/>
          </Link>
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 text-gray-500 hover:text-brand-gold dark:text-gray-400 dark:hover:text-brand-gold"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-3">
          {adminNavItems.map((section) => (
            <div key={section.title}>
              {section.href ? (
                // Single Item Link (e.g., Dashboard, Settings)
                <NavLink
                  href={section.href}
                  icon={section.icon}
                  name={section.title}
                />
              ) : (
                // Grouped Items (e.g., Structure, People)
                <>
                  <h3 className="text-xs uppercase font-bold text-gray-400 dark:text-gray-500 mb-3 ml-1 tracking-wider">
                    {section.title}
                  </h3>
                  <div className="space-y-1.5">
                    {section.items?.map((item) => (
                      <NavLink
                        key={item.href}
                        href={item.href}
                        icon={item.icon}
                        name={item.name}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </nav>
        {/* Footer / Logout */}
        <div className="absolute bottom-0 left-0 w-full px-6 pb-6 pt-4 bg-gradient-to-t from-gray-50/60 dark:from-gray-800/60 backdrop-blur-md border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <Button
              type="button"
              onClick={logoutAction}
              className="text-sm bg-red-500/10 text-red-700 dark:text-red-300 hover:bg-red-500/20 px-4 py-2 rounded-xl transition-all"
            >
              Sign Out
            </Button>
          </div>
        </div>


      </aside>
    </>
  );
}