import Logo from '@/components/public/Logo';
import { Card, Container } from '@/components/ui';
import { getLocale } from '@/lib/locales';
import { Target, Lightbulb, Building } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image'
import AboutImage from '../../../../public/students2.jpg'

export default async function AboutPage({ params }: { params: { locale: 'en' | 'so' | 'ar' } | Promise<{ locale: 'en' | 'so' | 'ar' }> }) {

    const { locale } = await params;
    const dict = await getLocale(locale);
    const t = dict.about;


    const features = [
        { icon: Target, title: t.pillars.reachTitle, description: t.pillars.reachDesc },
        { icon: Building, title: t.pillars.mosqueTitle, description: t.pillars.mosqueDesc },
        { icon: Lightbulb, title: t.pillars.sponsorTitle, description: t.pillars.sponsorDesc },
    ];

    return (
        <Container className="py-16">

            {/* Header */}
            <header className="text-center mb-16">
                <Logo isFooter={false} className="mx-auto  text-brand-gold mb-4" aria-label={t.missionIconAlt} />
                <h1 className="text-5xl font-extrabold text-brand-gold dark:text-white mb-4">
                    {t.title}
                </h1>
                <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
                    {t.subtitle}
                </p>
            </header>

            {/* Commitment Section */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
                <Card className="p-8 space-y-4">
                    <h2 className="text-3xl font-bold">{t.commitmentTitle}</h2>
                    <p className="leading-relaxed">{t.commitmentDesc1}</p>
                    <p className="text-brand-gold dark:text-brand-gold font-semibold leading-relaxed">
                        {t.commitmentDesc2}
                    </p>
                </Card>

                <div className="relative h-72 w-full rounded-xl bg-background/30 flex items-center justify-center text-foreground/40">
                    <Image src={AboutImage} alt={'About image'}/>
                </div>
            </section>

            {/* Features */}
            <section className="mb-20">
                <h2 className="text-4xl font-extrabold text-center mb-10">
                    {t.pillarsTitle}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <Card key={index} className="p-6 space-y-3">
                                <Icon className="h-10 w-10 text-brand-gold dark:text-brand-gold" />
                                <h3 className="text-xl font-bold">{item.title}</h3>
                                <p className="text-sm opacity-70">{item.description}</p>
                            </Card>
                        );
                    })}
                </div>
            </section>

            {/* CTA */}
            <section className="bg-brand-green dark:bg-brand-gold text-white  p-12 rounded-2xl text-center">
                <h2 className="text-3xl font-extrabold mb-3">{t.ctaTitle}</h2>
                <p className="opacity-90 mb-6">{t.ctaSubtitle}</p>

                <Link
                    href="/donations"
                    className="inline-block bg-brand-gold  text-white dark:text-brand-gold text-lg px-8 py-3 rounded-xl font-bold"
                >
                    {t.ctaButton}
                </Link>
            </section>

        </Container>
    );
}
