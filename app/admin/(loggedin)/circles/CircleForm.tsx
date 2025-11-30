'use client'

import { useFormStatus } from 'react-dom';
import { useEffect, useRef, useActionState } from 'react';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Loader2 } from 'lucide-react';
import { saveQuranCircleAction } from '@/app/actions/circle';

// Utility for form button state
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-brand-green hover:bg-brand-green/90 text-white font-bold transition-colors">
      {pending ? <><Loader2 className="animate-spin mr-2 h-4 w-4" /> Saving Circle...</> : 'Save Quran Circle'}
    </Button>
  );
}

interface Mosque {
  id: number;
  name: string;
  // Assuming Mosque has a link to its District and Region for context
  district: {
    region: { name: string }
  }
}

interface CircleFormProps {
  initialData?: any;
  mosques: Mosque[];
}

export default function CircleForm({ initialData, mosques }: CircleFormProps) {
  const [state, formAction] = useActionState(saveQuranCircleAction, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.message) {
      if (state.success) {
        toast.success(state.message);
        if (!initialData) formRef.current?.reset();
      } else {
        toast.error(state.message);
      }
    }
  }, [state, initialData]);

  const isEdit = !!initialData;

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        {isEdit ? `Edit Circle: ${initialData.name}` : 'Create New Quran Circle'}
      </h1>

      <form ref={formRef} action={formAction} className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 space-y-5">

        {isEdit && <input type="hidden" name="id" value={initialData.id} />}

        {/* Name */}
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Circle Name</label>
          <Input
            name="name"
            defaultValue={initialData?.name || ''}
            required
            placeholder="Hifdh Group A"
          />
          {state?.errors?.name && <p className="text-red-500 text-xs mt-1">{state.errors.name[0]}</p>}
        </div>

        {/* Capacity */}
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Max Capacity (Students)</label>
          <Input
            name="capacity"
            type="number"
            defaultValue={initialData?.capacity || 25}
            required
          />
          {state?.errors?.capacity && <p className="text-red-500 text-xs mt-1">{state.errors.capacity[0]}</p>}
        </div>

        {/* Mosque Select */}
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
            Assign to Mosque
          </label>
          <select
            name="mosqueId"
            defaultValue={initialData?.mosqueId || ''}
            required
            className="w-full bg-white dark:bg-gray-700 dark:text-white border-2 border-transparent focus:border-brand-gold rounded-xl px-4 py-3 outline-none"
          >
            <option value="">-- Select Mosque --</option>
            {mosques.map((mosque) => (
              <option key={mosque.id} value={mosque.id}>
                {mosque.name} ({mosque.district.region.name})
              </option>
            ))}
          </select>
          {state?.errors?.mosqueId && <p className="text-red-500 text-xs mt-1">{state.errors.mosqueId[0]}</p>}
        </div>

        <div className="pt-4">
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}