'use client';


import { useFormStatus } from 'react-dom';
import { useActionState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { submitContactForm } from '@/app/actions/contact';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui';


function SubmitButton() {
    const { pending } = useFormStatus();
    return <Button type="submit" disabled={pending}>{pending ? 'Sending...' : 'Send Message'}</Button>;
}


export default function ContactForm() {
    const [state, formAction] = useActionState(submitContactForm, undefined);
    const formRef = useRef<HTMLFormElement>(null);


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
                    <label className="block text-sm font-semibold mb-1">Full Name</label>
                    <Input name="fullname" required placeholder="Your Name" />
                </div>
                <div>
                    <label className="block text-sm font-semibold mb-1">Email</label>
                    <Input name="email" type="email" required placeholder="you@example.com" />
                </div>
            </div>


            <div>
                <label className="block text-sm font-semibold mb-1">Subject</label>
                <Input name="subject" required placeholder="Sponsorship Inquiry" />
            </div>


            <div>
                <label className="block text-sm font-semibold mb-1">Message</label>
                <textarea
                    name="message"
                    rows={5}
                    required
                    placeholder="Your message..."
                    className="w-full rounded-xl bg-background border border-transparent focus:border-brand-green px-4 py-3 outline-none"
                />
            </div>


            <SubmitButton />
        </Card>
    );
}