import { Sidebar } from '@/components/admin/Sidebar';
import { SidebarToggle } from '@/components/admin/SidebarToggle';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex bg-gray-50">
      
      {/* 1. Sidebar (Sticky on Desktop, Collapsible on Mobile) */}
      <Sidebar />
      
      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col">
        
        {/* Admin Header */}
        <header className="sticky top-0 z-30 w-full text-plain bg-white text-gray-700 shadow-sm border-b border-gray-100 dark:border-gray-800 h-16">
          <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 h-full flex justify-between items-center">
            
            {/* Mobile Menu Toggle & Brand */}
            <div className="flex items-center gap-4">
              <SidebarToggle />
              <h1 className="text-xl font-semibold text-brand-gold dark:text-brand-gold md:hidden">
                Admin Panel
              </h1>
            </div>

            {/* Actions (Theme Toggle, User Profile) */}
            <div className="flex items-center space-x-3">
              <Link href="/admin/settings" className="p-2 rounded-full bg-brand-green text-white dark:bg-brand-gold dark:text-gray-900 font-bold text-sm h-8 w-8 flex items-center justify-center">
                A
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}