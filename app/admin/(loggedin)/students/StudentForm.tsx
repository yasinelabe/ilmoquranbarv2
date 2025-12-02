'use client'

import {  useFormStatus } from 'react-dom';
import { useActionState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Loader2 } from 'lucide-react';
import { saveStudentAction } from '@/app/actions/student';

// Utility for form button state
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-brand-green hover:bg-brand-green/90 text-white font-bold transition-colors">
      {pending ? <><Loader2 className="animate-spin mr-2 h-4 w-4" /> Saving Student...</> : 'Save Student'}
    </Button>
  );
}

interface StudentFormProps {
  initialData?: any;
  quranCircles: any[];
  parents: any[];
}

export default function StudentForm({ initialData, quranCircles, parents }: StudentFormProps) {
  const [state, formAction] = useActionState(saveStudentAction, undefined);
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
        {isEdit ? `Edit Student: ${initialData.fullname}` : 'Enroll New Student'}
      </h1>
      
      <form ref={formRef} action={formAction} className="bg-white text-gray-700 dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 space-y-5">
        
        {isEdit && <input type="hidden" name="id" value={initialData.id} />}

        {/* Full Name */}
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
          <Input 
            name="fullname" 
            defaultValue={initialData?.fullname || ''} 
            required 
            placeholder="Aisha bint Ahmed"
          />
          {state?.errors?.fullname && <p className="text-red-500 text-xs mt-1">{state.errors.fullname[0]}</p>}
        </div>

        {/* Age */}
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Age (4-20)</label>
          <Input 
            name="age" 
            type="number"
            defaultValue={initialData?.age || 10} 
            required 
          />
          {state?.errors?.age && <p className="text-red-500 text-xs mt-1">{state.errors.age[0]}</p>}
        </div>

        {/* Sex Select */}
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Sex</label>
          <select 
            name="sex"
            defaultValue={initialData?.sex || ''} 
            required
            className="w-full bg-white text-gray-700 dark:bg-gray-700 dark:text-white border-2 border-transparent focus:border-brand-gold rounded-xl px-4 py-3 outline-none"
          >
            <option value="">-- Select Sex --</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {state?.errors?.sex && <p className="text-red-500 text-xs mt-1">{state.errors.sex[0]}</p>}
        </div>

        {/* Quran Circle Select */}
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
            Assign Quran Circle
          </label>
          <select 
            name="quranCircleId"
            defaultValue={initialData?.quranCircleId || ''} 
            required
            className="w-full bg-white text-gray-700 dark:bg-gray-700 dark:text-white border-2 border-transparent focus:border-brand-gold rounded-xl px-4 py-3 outline-none"
          >
            <option value="">-- Select Quran Circle --</option>
            {quranCircles.map((circle) => (
              <option key={circle.id} value={circle.id}>
                {circle.name} (Mosque: {circle.mosque.name}) - {circle.students.length} / {circle.capacity}
              </option>
            ))}
          </select>
          {state?.errors?.quranCircleId && <p className="text-red-500 text-xs mt-1">{state.errors.quranCircleId[0]}</p>}
        </div>
        
        {/* Parent Select */}
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
            Assign Parent (Optional)
          </label>
          <select 
            name="parentId"
            defaultValue={initialData?.parentId || ''} 
            className="w-full bg-white text-gray-700 dark:bg-gray-700 dark:text-white border-2 border-transparent focus:border-brand-gold rounded-xl px-4 py-3 outline-none"
          >
            <option value="">-- No Parent Assigned --</option>
            {parents.map((parent) => (
              <option key={parent.id} value={parent.id}>
                {parent.fullname} (Phone: {parent.phone})
              </option>
            ))}
          </select>
          {state?.errors?.parentId && <p className="text-red-500 text-xs mt-1">{state.errors.parentId[0]}</p>}
        </div>

        <div className="pt-4">
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}