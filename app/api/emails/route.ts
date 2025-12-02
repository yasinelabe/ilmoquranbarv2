import { NextResponse } from 'next/server';
import { parseEmailBody, sendSingleEmail, DynamicData } from '@/lib/email';
import { prisma } from '@/lib/db';
import { getCampaignSponsors } from '@/app/actions/campaign';

export async function POST(req: Request) {
    try {
        const { campaignId, subject, body, baseTemplateId } = await req.json() as {
            campaignId: number,
            subject: string,
            body: string,
            baseTemplateId: number
        };

        if (!campaignId || !subject || !body) {
            return NextResponse.json({ message: 'Missing campaign ID, subject, or body content.' }, { status: 400 });
        }

        // 1. Fetch the campaign and sponsor data again (for safety)
        const campaignData = await getCampaignSponsors(campaignId);
  
        if (!campaignData) {
            return NextResponse.json({ message: 'Campaign not found' }, { status: 404 });
        }

        const sponsors = campaignData.transactions.map(t => t.sponsor);
        let successCount = 0;
        let failedCount = 0;

        // 2. Loop through each unique sponsor
        for (const sponsor of sponsors) {
            if (!sponsor.email) {
                // Log skip and continue
                continue;
            }

            const dynamicData: DynamicData = {
                sponsor,
                campaign: { name: campaignData.name, type: campaignData.type },
                circle: campaignData.quranCircle
                    ? {
                        name: campaignData.quranCircle.name,
                        students: campaignData.quranCircle.students
                    }
                    : undefined,
                student: campaignData.student ?? undefined,
            };

            const emailBody = parseEmailBody(body, dynamicData);

            // 3. Send the email
            const result = await sendSingleEmail(sponsor.email, subject, emailBody);

            // 4. Log the transaction
            const logStatus = result.success ? 'SUCCESS' : 'FAILED';
            if (result.success) {
                successCount++;
            } else {
                failedCount++;
            }

            await prisma.emailLog.create({
                data: {
                    campaignId: campaignId,
                    sponsorId: sponsor.id,
                    templateId: baseTemplateId,
                    status: logStatus,
                    errorDetail: result.success ? null : result.errorDetail,
                },
            });
        }

        return NextResponse.json({
            message: `Bulk email process completed. ${successCount} successful, ${failedCount} failed.`,
            successCount,
            failedCount,
        }, { status: 200 });

    } catch (error) {
        console.error('Bulk email error:', error);
        return NextResponse.json({ message: 'An internal error occurred during bulk email sending.' }, { status: 500 });
    }
}
