'use client';
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import TemplateForm from './TemplateForm';
import SimpleModal from '@/components/admin/SimpleModal'; // Custom modal component
import { createTemplate } from '@/app/actions/email-templates';

export default function CreateTemplateDialog() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-green "
      >
        <Plus className="mr-2 h-4 w-4" />
        Add New Template
      </button>

      {isOpen && (
        <SimpleModal title="Create New Email Template" onClose={() => setIsOpen(false)}>
          <TemplateForm 
            onSubmit={createTemplate}
            onClose={() => setIsOpen(false)}
            buttonText="Create Template"
          />
        </SimpleModal>
      )}
    </>
  );
}