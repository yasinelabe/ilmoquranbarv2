'use client'

import { useEffect, useRef, useMemo,useActionState } from 'react';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useFormStatus } from 'react-dom';
import { Loader2 } from 'lucide-react';
import { saveCountryAction, saveDistrictAction, saveRegionAction } from '@/app/actions/locations';

// Utility for form button state
function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-brand-green hover:bg-brand-green/90 text-white font-bold transition-colors">
      {pending ? <><Loader2 className="animate-spin mr-2 h-4 w-4" /> Saving {label}...</> : `Save ${label}`}
    </Button>
  );
}

// Define Props for the component
interface LocationFormProps {
  type: 'country' | 'region' | 'district';
  initialData?: any;
  countries?: any[];
  regions?: any[]; // Regions will include their parent country for context
}

export default function LocationForm({ type, initialData, countries = [], regions = [] }: LocationFormProps) {
  
  const actionMap = useMemo(() => ({
    country: saveCountryAction,
    region: saveRegionAction,
    district: saveDistrictAction,
  }), []);

  const action = actionMap[type] as (prevState: any, formData: FormData) => Promise<any>;
  
  const [state, formAction] = useActionState(action, undefined);
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
  const titleMap = { country: 'Country', region: 'Region', district: 'District' };
  const entityTitle = titleMap[type];

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        {isEdit ? `Edit ${entityTitle}` : `Create New ${entityTitle}`}
      </h1>
      
      <form ref={formRef} action={formAction} className="bg-white text-gray-700 dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 space-y-5">
        
        {isEdit && <input type="hidden" name="id" value={initialData.id} />}

        {/* --- Dynamic Parent Selectors --- */}

        {/* Select Country (for Region) */}
        {type === 'region' && (
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Select Country</label>
            <select 
              name="countryId"
              defaultValue={initialData?.countryId || ''} 
              required
              className="w-full bg-brand-white dark:bg-gray-700 dark:text-white border-2 border-transparent focus:border-brand-gold rounded-xl px-4 py-3 outline-none"
            >
              <option value="">-- Select Country --</option>
              {countries.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {state?.errors?.countryId && <p className="text-red-500 text-xs mt-1">{state.errors.countryId[0]}</p>}
          </div>
        )}

        {/* Select Region (for District) */}
        {type === 'district' && (
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Select Region</label>
            <select 
              name="regionId"
              defaultValue={initialData?.regionId || ''} 
              required
              className="w-full bg-brand-white dark:bg-gray-700 dark:text-white border-2 border-transparent focus:border-brand-gold rounded-xl px-4 py-3 outline-none"
            >
              <option value="">-- Select Region --</option>
              {regions.map((r) => (
                <option key={r.id} value={r.id}>{r.name} ({r.country.name})</option>
              ))}
            </select>
            {state?.errors?.regionId && <p className="text-red-500 text-xs mt-1">{state.errors.regionId[0]}</p>}
          </div>
        )}

        {/* --- Entity Name Input --- */}
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{entityTitle} Name</label>
          <Input 
            name="name" 
            defaultValue={initialData?.name || ''} 
            required 
            placeholder={`Enter ${entityTitle} Name`}
            className='text-white'
          />
          {state?.errors?.name && <p className="text-red-500 text-xs mt-1">{state.errors.name[0]}</p>}
        </div>

        <div className="pt-4">
          <SubmitButton label={entityTitle} />
        </div>
      </form>
    </div>
  );
}