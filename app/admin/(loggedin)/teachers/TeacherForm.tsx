'use client'

import { useFormStatus } from 'react-dom';
import { useActionState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { saveTeacherAction } from '@/app/actions/people';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Loader2 } from 'lucide-react';

// Utility for form button state
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-brand-green hover:bg-brand-green/90 text-white font-bold transition-colors">
      {pending ? <><Loader2 className="animate-spin mr-2 h-4 w-4" /> Saving Teacher...</> : 'Save Teacher'}
    </Button>
  );
}

interface TeacherFormProps {
  initialData?: any;
  quranCircles: any[]; // Now requires Quran Circles instead of Mosques
}

export default function TeacherForm({ initialData, quranCircles }: TeacherFormProps) {
  const [state, formAction] = useActionState(saveTeacherAction, undefined);
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
        {isEdit ? `Edit Teacher: ${initialData.fullname}` : 'Enroll New Teacher'}
      </h1>

      <form ref={formRef} action={formAction} className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 space-y-5">

        {isEdit && <input type="hidden" name="id" value={initialData.id} />}

        {/* Full Name */}
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
          <Input
            name="fullname"
            defaultValue={initialData?.fullname || ''}
            required
            placeholder="Mohamed Al-Hafiz"
          />
          {state?.errors?.fullname && <p className="text-red-500 text-xs mt-1">{state.errors.fullname[0]}</p>}
        </div>

        {/* Sex Select */}
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Sex</label>
          <select
            name="sex"
            defaultValue={initialData?.sex || ''}
            required
            className="w-full bg-white dark:bg-gray-700 dark:text-white border-2 border-transparent focus:border-brand-gold rounded-xl px-4 py-3 outline-none"
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
            className="w-full bg-white dark:bg-gray-700 dark:text-white border-2 border-transparent focus:border-brand-gold rounded-xl px-4 py-3 outline-none"
          >
            <option value="">-- Select Quran Circle --</option>
            {quranCircles.map((circle) => (
              <option key={circle.id} value={circle.id}>
                {circle.name} (Mosque: {circle.mosque.name}) - {circle.capacity} Capacity
              </option>
            ))}
          </select>
          {state?.errors?.quranCircleId && <p className="text-red-500 text-xs mt-1">{state.errors.quranCircleId[0]}</p>}
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Bio (Optional)</label>
          <textarea
            name="bio"
            rows={3}
            defaultValue={initialData?.bio || ''}
            placeholder="A short description of the teacher's background or qualifications."
            className="w-full bg-white dark:bg-gray-700 dark:text-white border-2 border-transparent focus:border-brand-gold rounded-xl px-4 py-3 outline-none resize-none"
          />
          {state?.errors?.bio && <p className="text-red-500 text-xs mt-1">{state.errors.bio[0]}</p>}
        </div>

        <div className="pt-4">
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}