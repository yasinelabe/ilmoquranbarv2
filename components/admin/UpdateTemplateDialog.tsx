'use client';
import React, { useState } from 'react';
import { Pencil } from 'lucide-react';
import TemplateForm from './TemplateForm';
import SimpleModal from '@/components/admin/SimpleModal'; // Custom modal component
import { EmailTemplate } from '@/prisma/generated/client';
import { updateTemplate } from '@/app/actions/email-templates';

interface UpdateTemplateDialogProps {
  template: EmailTemplate;
}

export default function UpdateTemplateDialog({ template }: UpdateTemplateDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Bind the template ID to the update action
  const handleSubmit = (data: any) => updateTemplate(template.id, data);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 text-blue-600 hover:text-blue-800"
        title="Edit"
      >
        <Pencil className="h-4 w-4" />
      </button>

      {isOpen && (
        <SimpleModal title={`Edit Template: ${template.name}`} onClose={() => setIsOpen(false)}>
          <TemplateForm 
            initialData={template}
            onSubmit={handleSubmit}
            onClose={() => setIsOpen(false)}
            buttonText="Save Changes"
          />
        </SimpleModal>
      )}
    </>
  );
}