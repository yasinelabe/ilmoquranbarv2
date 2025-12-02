'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { Campaign, EmailTemplate } from '../../prisma/generated/client';
import SponsorList from './SponsorList';
import SendEmailButton from './SendEmailButton';
import { getCampaignSponsors } from '@/app/actions/campaign';
import EmailTemplateEditor from './EmailTemplateEditor';

interface CampaignSelectorProps {
    campaigns: Pick<Campaign, 'id' | 'name' | 'type'>[];
    templates: EmailTemplate[];
}

export default function CampaignSelector({ campaigns, templates }: CampaignSelectorProps) {
    const [selectedCampaignId, setSelectedCampaignId] = useState<number | undefined>();
    const [campaignData, setCampaignData] = useState<Awaited<ReturnType<typeof getCampaignSponsors>> | null>(null);
    const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | undefined>(
        templates.find((t) => t.isDefault)
    );
    const [editableContent, setEditableContent] = useState({ subject: selectedTemplate?.subject || '', body: selectedTemplate?.body || '' });

    const [isPending, startTransition] = useTransition();

    // EFFECT UPDATE: Update editableContent when selectedTemplate changes
    useEffect(() => {
        if (selectedTemplate) {
            setEditableContent({
                subject: selectedTemplate.subject,
                body: selectedTemplate.body,
            });
        } else {
            setEditableContent({ subject: '', body: '' });
        }
    }, [selectedTemplate]);

    // Fetch campaign sponsors
    useEffect(() => {
        if (selectedCampaignId) {
            startTransition(async () => {
                const data = await getCampaignSponsors(selectedCampaignId);
                setCampaignData(data);
            });
        } else {
            setCampaignData(null);
        }
    }, [selectedCampaignId]);

    const sponsors = campaignData?.transactions.map((t) => t.sponsor) || [];

    return (
        <div className="space-y-6">

            {/* Campaign Selector */}
            <select
                onChange={(e) => setSelectedCampaignId(Number(e.target.value))}
                className="w-full md:w-[300px] px-4 py-2 border rounded-xl bg-white dark:bg-gray-800 
                   text-gray-900 dark:text-white border-gray-300 dark:border-gray-700 shadow-sm"
                defaultValue=""
            >
                <option value="" disabled>
                    Select a Campaign
                </option>
                {campaigns.map((c) => (
                    <option key={c.id} value={c.id}>
                        {c.name} ({c.type === 'STUDENT_SPONSORSHIP' ? 'Student' : 'Circle'})
                    </option>
                ))}
            </select>

            {/* Loading Indicator */}
            {isPending && <p className="text-brand-green">Loading sponsor data...</p>}

            {/* Loaded Data */}
            {campaignData && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Column 1: Sponsor List */}
                    <SponsorList sponsors={sponsors} campaignName={campaignData.name} />

                    {/* Column 2 & 3: Email Editor & Actions */}
                    <div className="lg:col-span-2 space-y-4">

                        <EmailTemplateEditor
                            templates={templates}
                            selectedTemplate={selectedTemplate}
                            setSelectedTemplate={setSelectedTemplate}
                            campaignType={campaignData.type}
                            editableContent={editableContent}
                            setEditableContent={setEditableContent}
                        />

                        {selectedTemplate && (
                            <SendEmailButton
                                campaignId={selectedCampaignId!}
                                campaignData={campaignData}
                                template={selectedTemplate}
                                sendingContent={editableContent}
                                sponsors={sponsors}
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
