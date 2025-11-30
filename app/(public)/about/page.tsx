import { Card, Container } from '@/components/ui';
import { Zap, Heart, Target, Lightbulb, Building } from 'lucide-react';
import Link from 'next/link';
const features = [
    { icon: Target, title: 'Reaching 10,000 Children', description: 'Our goal is to ensure free Quranic education reaches every young learner who needs it.' },
    { icon: Building, title: 'In Every Mosque', description: 'We aim to establish one free Quran circle in every participating local mosque.' },
    { icon: Lightbulb, title: 'Teacher Sponsorship', description: 'Sponsorship covers salaries and resources for dedicated Mu’allims and administrators.' },
];


export default function AboutPage() {
    return (
        <Container className="py-16">
            <header className="text-center mb-16">
                <Zap className="mx-auto h-12 w-12 text-brand-gold mb-4" />
                <h1 className="text-5xl font-extrabold text-brand-green dark:text-white mb-4">
                    Our Mission: Quran for Every Child
                </h1>
                <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
                    IlmoQuranbar is a sponsorship-driven educational project dedicated to making Quranic knowledge accessible and free.
                </p>
            </header>


            <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
                <Card className="p-8 space-y-4">
                    <h2 className="text-3xl font-bold">Our Commitment to Free Education</h2>
                    <p className="leading-relaxed">
                        We remove the financial barriers that prevent children from accessing Quranic education by establishing *free Quran circles* in mosques.
                    </p>
                    <p className="text-brand-green dark:text-brand-gold font-semibold leading-relaxed">
                        This initiative is a Sadqa Jariya—your sponsorship continues benefitting long after it’s given.
                    </p>
                </Card>


                <div className="relative h-72 w-full rounded-xl bg-background/30 flex items-center justify-center text-foreground/40">
                    Image Placeholder
                </div>
            </section>


            <section className="mb-20">
                <h2 className="text-4xl font-extrabold text-center mb-10">The Three Pillars of IlmoQuranbar</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <Card key={index} className="p-6 space-y-3">
                                <Icon className="h-10 w-10 text-brand-green dark:text-brand-gold" />
                                <h3 className="text-xl font-bold">{item.title}</h3>
                                <p className="text-sm opacity-70">{item.description}</p>
                            </Card>
                        );
                    })}
                </div>
            </section>


            <section className="bg-brand-green dark:bg-brand-gold text-white dark:text-black p-12 rounded-2xl text-center">
                <h2 className="text-3xl font-extrabold mb-3">Ready to Make an Impact?</h2>
                <p className="opacity-90 mb-6">Your sponsorship gives a child lifelong access to the Qur'an.</p>
                <Link
                    href="/donations"
                    className="inline-block bg-brand-gold dark:bg-black text-white dark:text-brand-gold text-lg px-8 py-3 rounded-xl font-bold"
                >
                    See Active Campaigns
                </Link>
            </section>
        </Container>
    );
}