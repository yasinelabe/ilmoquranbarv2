import TemplateTable from '@/components/admin/TemplateTable';
import { InfoIcon } from 'lucide-react';
import { getTemplates } from '@/app/actions/email-templates';
import CreateTemplateDialog from '@/components/admin/CreateTemplateDialog';

export default async function EmailTemplatesPage() {
  const templates = await getTemplates();

  return (
    <div className="space-y-6 p-8 text-gray-800">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">✉️ Email Templates Management</h1>
        <CreateTemplateDialog />
      </div>

      <hr />

      {/* Simple Alert component replacement */}
      <div className="border  bg-blue-50 p-4 rounded-lg flex items-start space-x-3">
        <InfoIcon className="h-5 w-5 text-brand-green mt-1" />
        <div>
          <h3 className="font-semibold text-lg text-brand-green">Dynamic Placeholders</h3>
          <p className="text-sm text-brand-green">
            Use placeholders like **[[SPONSOR_NAME]]**, **[[CAMPAIGN_NAME]]**, **[[STUDENT_NAME]]**, **[[CIRCLE_NAME]]**, and **[[STUDENTS_LIST]]** in the subject and body. These will be automatically replaced when sending emails from the Sponsor Report page.
          </p>
        </div>
      </div>
      
      {/* Simple Card replacement */}
      <div className="border border-gray-200 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Existing Templates ({templates.length})</h2>
        <TemplateTable templates={templates} />
      </div>
    </div>
  );
}