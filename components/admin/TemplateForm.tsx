'use client';

import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { EmailTemplate } from '@/prisma/generated/client';
import toast from 'react-hot-toast';

type TemplateData = {
    name: string;
    subject: string;
    body: string;
    isDefault: boolean;
};

interface TemplateFormProps {
    initialData?: EmailTemplate | null;
    onSubmit: (data: TemplateData) => Promise<{ success: boolean; message: string }>;
    onClose: () => void;
    buttonText: string;
}

export default function TemplateForm({ initialData, onSubmit, onClose, buttonText }: TemplateFormProps) {
    const [data, setData] = useState<TemplateData>({
        name: initialData?.name || '',
        subject: initialData?.subject || '',
        body: initialData?.body || '',
        isDefault: initialData?.isDefault || false,
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simple validation
        if (!data.name || !data.subject || !data.body) {
            toast.error('All fields are required.')
            setIsLoading(false);
            return;
        }

        const result = await onSubmit(data);
        if (result.success) {

            toast.success(result.message);
        }
        else {
            toast.error(result.message)
        }

        if (result.success) {
            onClose();
        }
        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 text-gray-800/50">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-800/50">Template Name</label>
                <input
                    id="name"
                    name="name"
                    value={data.name}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black"
                />
            </div>

            <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-800/50">Subject</label>
                <input
                    id="subject"
                    name="subject"
                    value={data.subject}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black"
                />
            </div>

            <div>
                <label htmlFor="body" className="block text-sm font-medium text-gray-800/50">Body</label>
                <textarea
                    id="body"
                    name="body"
                    value={data.body}
                    onChange={handleChange}
                    rows={10}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black"
                />
            </div>

            <div className="flex items-center">
                <input
                    id="isDefault"
                    name="isDefault"
                    type="checkbox"
                    checked={data.isDefault}
                    onChange={handleChange}
                    className="h-4 w-4 text-brand-gold border-gray-300 rounded"
                />
                <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-900">
                    Set as Default Template (Unsets other defaults)
                </label>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-green  disabled:opacity-50"
                >
                    {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        buttonText
                    )}
                </button>
            </div>
        </form>
    );
}