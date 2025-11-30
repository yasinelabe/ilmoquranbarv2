import { DollarSign, BarChart3, TrendingUp, Handshake } from 'lucide-react';

export default function DonationsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-brand-green dark:text-white flex items-center">
        <DollarSign size={28} className="mr-3 text-brand-gold" /> Finance & Donations Management
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        Manage campaigns, track transactions, and view overall sponsorship performance based on the <code className="font-mono text-sm bg-gray-100 dark:bg-gray-700 p-1 rounded">Campaign</code>, <code className="font-mono text-sm bg-gray-100 dark:bg-gray-700 p-1 rounded">Sponsor</code>, and <code className="font-mono text-sm bg-gray-100 dark:bg-gray-700 p-1 rounded">Transaction</code> models.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 flex items-center space-x-4">
            <div className="text-brand-gold bg-brand-gold/10 p-3 rounded-full">
                <TrendingUp size={24} />
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Campaigns</p>
                <p className="text-2xl font-bold">12</p>
            </div>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 flex items-center space-x-4">
            <div className="text-brand-green bg-brand-green/10 p-3 rounded-full">
                <Handshake size={24} />
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Sponsors</p>
                <p className="text-2xl font-bold">450</p>
            </div>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 flex items-center space-x-4">
            <div className="text-blue-500 bg-blue-500/10 p-3 rounded-full">
                <BarChart3 size={24} />
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">YTD Collected</p>
                <p className="text-2xl font-bold">$185,000</p>
            </div>
        </div>
      </div>
      
      <div className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-bold mb-4 text-brand-green dark:text-brand-gold">Financial Reporting</h2>
        <p className="text-gray-600 dark:text-gray-400">
            Dedicated sections for managing active and completed campaigns, viewing transaction logs, and generating financial reports will be implemented here.
        </p>
      </div>
    </div>
  );
}