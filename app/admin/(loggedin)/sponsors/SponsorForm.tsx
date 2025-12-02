'use client'

import { useFormStatus } from 'react-dom';
import { useActionState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Loader2 } from 'lucide-react';
import { saveSponsorAction } from '@/app/actions/sponsors';

// Utility for form button state
function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full bg-brand-green hover:bg-brand-green/90 text-white font-bold transition-colors">
            {pending ? <><Loader2 className="animate-spin mr-2 h-4 w-4" /> Saving sponsor...</> : 'Save sponsor'}
        </Button>
    );
}

interface sponsorFormProps {
    initialData?: any;
}

export default function sponsorForm({ initialData}: sponsorFormProps) {
    const [state, formAction] = useActionState(saveSponsorAction, undefined);
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
                {isEdit ? `Edit sponsor: ${initialData.fullname}` : 'Add New sponsor'}
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
                        placeholder="Full name here"
                    />
                    {state?.errors?.fullname && <p className="text-red-500 text-xs mt-1">{state.errors.fullname[0]}</p>}
                </div>
                {/* Email */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                    <Input
                        name="email"
                        defaultValue={initialData?.email || ''}
                        required
                        placeholder="Email here"
                    />
                    {state?.errors?.fullname && <p className="text-red-500 text-xs mt-1">{state.errors.fullname[0]}</p>}
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                    <Input
                        name="phone"
                        defaultValue={initialData?.phone || ''}
                        required
                        placeholder="Phone number here"
                    />
                    {state?.errors?.fullname && <p className="text-red-500 text-xs mt-1">{state.errors.fullname[0]}</p>}
                </div>

                <div className="pt-4">
                    <SubmitButton />
                </div>
            </form>
        </div>
    );
}