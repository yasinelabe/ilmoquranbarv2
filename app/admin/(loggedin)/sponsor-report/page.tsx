import CampaignSelector from '@/components/admin/CampaignSelector';
import { getCampaigns } from '@/app/actions/campaign';
import { getEmailTemplates } from '@/app/actions/campaign';

export default async function SponsorReportPage() {
  const campaigns = await getCampaigns();
  const templates = await getEmailTemplates();

  return (
    <div className="space-y-6 p-8">
      <h1 className="text-3xl font-bold text-gray-800">📧 Sponsor Email Reporting</h1>
      <p className="text-gray-600">
        Select a campaign to fetch its unique sponsors and send a personalized bulk email.
      </p>

      {/* Replacing Card */}
      <div className="border rounded-xl shadow-sm bg-gray-200/50 p-6">
        {/* Header */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Select Campaign</h2>
        </div>

        {/* Content */}
        <CampaignSelector campaigns={campaigns} templates={templates} />
      </div>
    </div>
  );
}
