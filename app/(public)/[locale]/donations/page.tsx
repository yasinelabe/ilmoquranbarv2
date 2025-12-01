import { prisma } from '@/lib/db';
import { Card, Container } from '@/components/ui';
import { CampaignCard } from '@/components/public/CampaignCard';
import { getLocale } from '@/lib/locales';



export default async function DonationsPage({ params }: { params: { locale: 'en' | 'so' | 'ar' } | Promise<{ locale: 'en' | 'so' | 'ar' }> }) {
    const { locale } = await params;
    const dict = await getLocale(locale);

    const campaigns = JSON.parse(JSON.stringify(await prisma.campaign.findMany({
        where: { isComplete: false },
        orderBy: { createdAt: "desc" }
    })))

    return (
        <Container className="py-12">
            <header className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-brand-gold dark:text-white mb-3">
                    {dict.donations.title}
                </h1>
                <p className="text-lg opacity-70">
                    {dict.donations.subtitle}
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {campaigns.map((c:any) => (
                    <CampaignCard campaign={c} key={c.id} dict={dict} locale={locale} />
                ))}

                {campaigns.length === 0 && (
                    <Card className="p-10 text-center opacity-70 col-span-full">
                        {dict.donations.noCampaigns}
                    </Card>
                )}
            </div>
        </Container>
    );
}
