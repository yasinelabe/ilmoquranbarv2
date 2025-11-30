import { LayoutDashboard } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-extrabold text-brand-green dark:text-brand-gold flex items-center">
        <LayoutDashboard size={32} className="mr-3" /> Dashboard Overview
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric Card 1 */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Students</p>
          <p className="text-3xl font-bold mt-1">1,245</p>
        </div>
        {/* Metric Card 2 */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Mosques</p>
          <p className="text-3xl font-bold mt-1">48</p>
        </div>
        {/* Metric Card 3 */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Monthly Donations</p>
          <p className="text-3xl font-bold mt-1 text-brand-gold">$15,800</p>
        </div>
      </div>

      <div className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Welcome to the Admin Portal</h2>
        <p className="text-gray-600 dark:text-gray-400">
          This dashboard provides a snapshot of the key organizational metrics. Use the sidebar to navigate to Structure, People, or Finance management areas.
        </p>
      </div>
    </div>
  );
}