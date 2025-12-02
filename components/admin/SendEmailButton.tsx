'use client';

import { useState } from 'react';
import { EmailTemplate, Sponsor } from '../../prisma/generated/client';
import { Loader2 } from 'lucide-react';
import { getCampaignSponsors } from '@/app/actions/campaign';
import toast from 'react-hot-toast';

// Infer the complex type of campaignData from the server action
type CampaignData = Awaited<ReturnType<typeof getCampaignSponsors>>;

interface SendEmailButtonProps {
    campaignId: number;
    campaignData: CampaignData;
    template: EmailTemplate;
    sponsors: Pick<Sponsor, 'id' | 'fullname' | 'email'>[];
    sendingContent: { subject: string; body: string };
}

export default function SendEmailButton({
    campaignId,
    template,
    sponsors,
    sendingContent
}: SendEmailButtonProps) {
    const [isLoading, setIsLoading] = useState(false);


    const handleSendEmails = async () => {
        if (sponsors.length === 0) {
            toast.error("No sponsors found for this campaign.")
            return;
        }

        // Validate content before sending
        if (!sendingContent.subject || !sendingContent.body) {
            toast.error("Email subject and body cannot be empty.");
            return;
        }

        if (!confirm(`Send this email to ${sponsors.length} sponsors? This action cannot be undone.`)) {
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/emails', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    campaignId,
                    subject: sendingContent.subject,
                    body: sendingContent.body,
                    baseTemplateId: template.id
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to send bulk emails.');
            }

            toast.success(`Email sending complete: ${data.message}`);
        } catch (error) {
            console.error('Email sending failed:', error);
            toast.error(
                error instanceof Error ? error.message : "An unknown error occurred."
            );
        } finally {
            setIsLoading(false);
        }
    };

    const hasSponsors = sponsors.length > 0;

    return (
        <button
            onClick={handleSendEmails}
            disabled={isLoading || !hasSponsors}
            className={`w-full flex items-center justify-center px-4 py-2 rounded-md text-white 
        ${hasSponsors && !isLoading ? 'bg-brand-green' : 'bg-gray-400 cursor-not-allowed'}
      `}
        >
            {isLoading ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending {sponsors.length} Emails...
                </>
            ) : (
                `Send Bulk Email to ${sponsors.length} Sponsors`
            )}
        </button>
    );
}
