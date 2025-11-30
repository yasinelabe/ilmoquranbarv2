'use client'

import { Menu } from 'lucide-react';

export function SidebarToggle() {
  const toggleSidebar = () => {
    // Calls the function exposed in the Sidebar component
    if (typeof window !== 'undefined' && (window as any).toggleAdminSidebar) {
      (window as any).toggleAdminSidebar();
    }
  };

  return (
    <button 
      onClick={toggleSidebar}
      className="md:hidden p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label="Open sidebar menu"
    >
      <Menu size={24} />
    </button>
  );
}