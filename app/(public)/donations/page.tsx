import { prisma } from '@/lib/db';
import { Card, Container } from '@/components/ui';
import { CampaignCard } from '@/components/public/CampaignCard';

export default async function DonationsPage() {
    const campaigns = await prisma.campaign.findMany({ where: { isComplete: false }, orderBy: { createdAt: 'desc' } });

    return (
        <Container className="py-12">
            <header className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-brand-green dark:text-white mb-3">Sponsor a Circle, Change a Life</h1>
                <p className="text-lg opacity-70">Choose an active campaign to make your Sadaqa Jariya.</p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {campaigns.map((c) => (
                    <CampaignCard campaign={c} key={c.id}/>
                ))}

                {campaigns.length === 0 && (
                    <Card className="p-10 text-center opacity-70 col-span-full">
                        No active campaigns at the moment.
                    </Card>
                )}
            </div>
        </Container>
    );

}