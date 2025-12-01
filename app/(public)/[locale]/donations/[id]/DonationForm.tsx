'use client'

import { useFormStatus } from 'react-dom';
import { useEffect, useActionState } from 'react';
import toast from 'react-hot-toast';
import { processDonation } from '@/app/actions/donate';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Image from 'next/image';

// Payment method type
type PaymentMethod = 'waafipay';

// Payment method configuration
const paymentMethods = {
  waafipay: {
    id: 'waafipay' as PaymentMethod,
    name: 'WaafiPay',
    logo: '/payments/waafipay.png',
  }
} as const;

// Shared component for form submission button
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Sending Request...' : `Donate Now`}
    </Button>
  );
}

export default function DonationForm({ campaignId, dict }: { campaignId: number, dict: any }) {
  const [state, formAction] = useActionState(processDonation, null);

  // Effect to handle feedback
  useEffect(() => {
    if (state?.message) {
      state.success ? toast.success(state.message) : toast.error(state.message);
    }
  }, [state]);

  return (
    <div className="p-8 rounded-3xl surface-contrast border" style={{ borderColor: "rgb(var(--border-color))" }}>
      <h3 className="text-2xl font-bold text-brand-gold dark:text-brand-gold mb-5 border-b pb-3">
        {dict.donations.sponsorNow}
      </h3>

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="campaignId" value={campaignId} />
        <input type="hidden" name="paymentMethod" value="waafipay" />

        {/* Amount Input */}
        <div>
          <label className="block text-sm font-bold text-plain dark:text-gray-100 mb-1 ml-1">
            {dict.donations.amount}
          </label>
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
          <label className="block text-sm font-bold text-plain dark:text-gray-100 mb-1 ml-1">
            {dict.donations.fullname}
          </label>
          <Input
            type="text"
            name="fullname"
            placeholder="Your Name (for receipt)"
            required
            className="dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Phone Number with Pre-filled Country Code */}
        <div>
          <label className="block text-sm font-bold text-plain dark:text-gray-100 mb-1 ml-1">
            {dict.donations.phone}
          </label>

          <div className="flex w-full">
            {/* Country Code Box */}
            <span
              className="
        inline-flex items-center px-4 
        border border-gray-300 dark:border-gray-600 
        rounded-l-lg 
        bg-gray-100 dark:bg-gray-700 
        text-gray-800 dark:text-gray-200 
        text-sm
      "
            >
              +252
            </span>

            {/* Phone Number Input */}
            <Input
              type="tel"
              name="phone"
              placeholder="6xxxxxx"
              required
              pattern="^[0-9]{8,9}$"
              className="
        border-l-0 
        dark:bg-gray-700 dark:text-white 
        flex-1
      "
            />
          </div>

          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 ml-1">
           {dict.donations.phone_note}
          </p>
        </div>


        {/* Payment Method Selection */}
        <div className="pt-2">
          <label className="block text-sm font-bold text-plain dark:text-gray-100 mb-3 ml-1">
              {dict.donations.paymentMethod}
          </label>

          <div className="space-y-2">

            {/* WaafiPay Option */}
            <div className="flex items-center p-3 border-2 border-brand-green dark:border-brand-gold rounded-lg 
                bg-green-50 dark:bg-green-900/20 cursor-pointer">

              {/* Logo */}
              <div className="flex items-center justify-center w-10 h-10 bg-white dark:bg-gray-700 rounded-full mr-3">
                <Image
                  src={paymentMethods.waafipay.logo}
                  alt="WaafiPay Logo"
                  width={32}
                  height={32}
                />
              </div>

              <div className="flex-1">
                <div className="font-semibold text-brand-gold dark:text-brand-gold">
                  {paymentMethods.waafipay.name}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {dict.donations.selectedMethod}
                </div>
              </div>

              {/* Selected indicator */}
              <div className="w-5 h-5 rounded-full border-2 border-brand-green dark:border-brand-gold flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-brand-green dark:bg-brand-gold"></div>
              </div>
            </div>

          </div>
        </div>

        <div className="pt-4">
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}
