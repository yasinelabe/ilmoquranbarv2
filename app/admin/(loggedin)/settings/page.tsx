import { Settings, ToolCase } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-brand-green dark:text-white flex items-center">
        <Settings size={28} className="mr-3 text-gray-400" /> System Settings
      </h1>
      
      <div className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-bold mb-4 text-brand-green dark:text-brand-gold">General Configuration</h2>
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>This is the placeholder for managing global application settings, such as system name, default capacities, and email configuration.</p>
            <div className="flex items-center space-x-2">
                <ToolCase size={18} className="text-gray-500" />
                <span>Configuration features will be added here.</span>
            </div>
        </div>
      </div>
    </div>
  );
}