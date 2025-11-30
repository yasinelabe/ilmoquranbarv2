'use client'

import {  useFormStatus } from 'react-dom';
import { useEffect , useActionState} from 'react';
import toast from 'react-hot-toast'; // Import the toaster
import { processDonation } from '@/app/actions/donate'; 
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

// Shared component for form submission button
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Sending Request...' : 'Donate Now via WaafiPay'}
    </Button>
  );
}

export default function DonationForm({ campaignId }: { campaignId: number }) {
  // Use a unique key for the Server Action state: 'donationState'
  const [state, formAction] = useActionState(processDonation, null);

  // Effect to handle feedback using the global toaster
  useEffect(() => {
    if (state?.message) {
      if (state.success) {
        toast.success(state.message);
      } else {
        toast.error(state.message);
      }
    }
  }, [state]);

  return (
    <div className="p-8 rounded-3xl surface-contrast border"  style={{ borderColor: "rgb(var(--border-color))" }}>
      <h3 className="text-2xl font-bold text-brand-green dark:text-brand-gold mb-5 border-b pb-3">Sponsor This Campaign</h3>
      
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="campaignId" value={campaignId} />
        
        {/* Amount Input */}
        <div>
          <label className="block text-sm font-bold text-plain dark:text-gray-100 mb-1 ml-1">Amount (USD)</label>
          <Input 
            type="number" 
            name="amount" 
            placeholder="e.g. 10.00" 
            step="0.01" 
            min="1"
            required 
            className="dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-sm font-bold text-plain dark:text-gray-100 mb-1 ml-1">Full Name</label>
          <Input 
            type="text" 
            name="fullname" 
            placeholder="Your Name (for receipt)" 
            required 
            className="dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm font-bold text-plain dark:text-gray-100 mb-1 ml-1">Waafi Phone Number</label>
          <Input 
            type="tel" 
            name="phone" 
            placeholder="2526..." 
            required 
            pattern="^2526[0-9]{7,8}$" // Simple pattern enforcement
            className="dark:bg-gray-700 dark:text-white"
          />
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 ml-1">
            We will send the payment request directly to this number via WaafiPay.
          </p>
        </div>

        <div className="pt-4">
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}