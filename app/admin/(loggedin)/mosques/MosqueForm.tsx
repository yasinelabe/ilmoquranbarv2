'use client'

import { useEffect, useRef,useActionState } from 'react';
import toast from 'react-hot-toast';
import { saveMosqueAction } from '@/app/actions/mosque';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useFormStatus } from 'react-dom';
import { Loader2 } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-brand-gold hover:bg-brand-gold/90 text-white font-bold transition-colors">
      {pending ? <><Loader2 className="animate-spin mr-2 h-4 w-4" /> Saving Mosque...</> : 'Save Mosque'}
    </Button>
  );
}

interface MosqueFormProps {
  initialData?: any;
  districts: any[]; // Districts include Region and Country data
}

export default function MosqueForm({ initialData, districts }: MosqueFormProps) {
  const [state, formAction] = useActionState(saveMosqueAction, undefined);
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
        {isEdit ? `Edit Mosque: ${initialData.name}` : 'Create New Mosque'}
      </h1>
      
      <form ref={formRef} action={formAction} className="bg-white text-gray-700 dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 space-y-5">
        
        {isEdit && <input type="hidden" name="id" value={initialData.id} />}

        {/* Mosque Name */}
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Mosque Name</label>
          <Input 
            name="name" 
            defaultValue={initialData?.name || ''} 
            required 
            placeholder="Al-Aqsa Mosque"
          />
          {state?.errors?.name && <p className="text-red-500 text-xs mt-1">{state.errors.name[0]}</p>}
        </div>

        {/* Imam Name (Optional) */}
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Imam / Caretaker Name (Optional)</label>
          <Input 
            name="imam" 
            defaultValue={initialData?.imam || ''} 
            placeholder="Sheikh Mohammed"
          />
          {state?.errors?.imam && <p className="text-red-500 text-xs mt-1">{state.errors.imam[0]}</p>}
        </div>

        {/* District Select (Required link to Location Hierarchy) */}
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
            Select District (Location)
          </label>
          <select 
            name="districtId"
            defaultValue={initialData?.districtId || ''} 
            required
            className="w-full bg-brand-white dark:bg-gray-700 dark:text-white border-2 border-transparent focus:border-brand-gold rounded-xl px-4 py-3 outline-none"
          >
            <option value="">-- Select District --</option>
            {districts.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.region.name}, {d.region.country.name})
              </option>
            ))}
          </select>
          {state?.errors?.districtId && <p className="text-red-500 text-xs mt-1">{state.errors.districtId[0]}</p>}
        </div>

        <div className="pt-4">
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}