'use client';

import DataTable from '@/components/admin/DataTable';
import { Trash2, CheckCircle } from 'lucide-react';
import UpdateTemplateDialog from './UpdateTemplateDialog';
import { deleteTemplate } from '@/app/actions/email-templates';
import { EmailTemplate } from '@/prisma/generated/client';
import toast from 'react-hot-toast';

interface TemplateTableProps {
    templates: EmailTemplate[];
}

export default function TemplateTable({ templates }: TemplateTableProps) {

    const handleDelete = async (id: number, name: string) => {
        if (!confirm(`Are you sure you want to delete the template: "${name}"?`)) return;

        const result = await deleteTemplate(id);
        if (result.success) {

            toast.success(result.message);
        }
        else {
            toast.error(result.message)
        }
    };

    const columns = [
        { key: 'name', label: 'Name' },
        { key: 'subject', label: 'Subject' },
        {
            key: 'isDefault',
            label: 'Default',
            render: (row: EmailTemplate) => (
                row.isDefault
                    ? <CheckCircle className="h-4 w-4 text-brand-green" />
                    : null
            )
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (row: EmailTemplate) => (
                <div className="flex justify-end space-x-2">
                    <UpdateTemplateDialog template={row} />
                    <button
                        className="p-2 text-red-600 hover:text-red-800" // Simple styling replacement for variant="destructive"
                        onClick={() => handleDelete(row.id, row.name)}
                        title="Delete"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            )
        },
    ];

    return (
        <DataTable
            columns={columns}
            data={templates}
            total={templates.length}
            page={1} // Assuming static page for simplicity, no server-side pagination needed here
            pageSize={templates.length}
        />
    );
}