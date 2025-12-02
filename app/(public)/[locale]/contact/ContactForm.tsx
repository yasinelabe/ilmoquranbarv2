'use client';


import { useFormStatus } from 'react-dom';
import { useActionState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { submitContactForm } from '@/app/actions/contact';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui';


export default function ContactForm({ dict }: { dict: any }) {
    const [state, formAction] = useActionState(submitContactForm, undefined);
    const formRef = useRef<HTMLFormElement>(null);
    const { pending } = useFormStatus();

    useEffect(() => {
        if (state?.message) {
            state.success ? toast.success(state.message) : toast.error(state.message);
            if (state.success) formRef.current?.reset();
        }
    }, [state]);

    return (
        <Card className="p-8 space-y-6" as="form" ref={formRef} action={formAction}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold mb-1">
                        {dict.fullName}
                    </label>
                    <Input
                        name="fullname"
                        required
                        placeholder={dict.placeholders.name}
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold mb-1">
                        {dict.email}
                    </label>
                    <Input
                        name="email"
                        type="email"
                        required
                        placeholder={dict.placeholders.email}
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold mb-1">
                    {dict.subject}
                </label>
                <Input
                    name="subject"
                    required
                    placeholder={dict.placeholders.subject}
                />
            </div>

            <div>
                <label className="block text-sm font-semibold mb-1">
                    {dict.message}
                </label>
                <textarea
                    name="message"
                    rows={5}
                    required
                    placeholder={dict.placeholders.message}
                    className="w-full rounded-xl bg-background border focus:border-brand-green px-4 py-3 outline-none"
                    style={{borderColor:'rgb(var(--border-color))'}}
                />
            </div>

            <Button type="submit" disabled={pending}>{pending ? dict.sending : dict.send}</Button>;
        </Card>
    );
}
