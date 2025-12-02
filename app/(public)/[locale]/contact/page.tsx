import ContactForm from './ContactForm';
import { Card, Container } from '@/components/ui';
import { getLocale } from '@/lib/locales';
import { LocaleParams } from '@/lib/types';
import { contactInfo } from '@/lib/constants';


export default async function ContactPage({ params }: { params: LocaleParams | Promise<LocaleParams> }) {
    const { locale } = await params;
    const dict = await getLocale(locale);
    const t = dict.contact;

    return (
        <Container className="py-16">
            <header className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-brand-gold dark:text-white mb-3">
                    {t.title}
                </h1>
                <p className="text-lg text-foreground/70">{t.subtitle}</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold mb-4">{t.directInfo}</h2>

                    {contactInfo.map((item, i) => {
                        const Icon = item.icon;
                        return (
                            <Card key={i} className="p-5 flex items-start space-x-4" as="a" href={item.link}>
                                <Icon className="h-6 w-6 text-brand-gold mt-1" />
                                <div>
                                    <span className="text-sm opacity-60">
                                        {t.info[item.labelKey]}
                                    </span>
                                    <p className="font-semibold">{item.value}</p>
                                </div>
                            </Card>
                        );
                    })}
                </div>

                <div className="lg:col-span-2">
                    <h2 className="text-2xl font-bold mb-4">{t.sendMessage}</h2>
                    <ContactForm dict={t.form} />
                </div>
            </div>
        </Container>
    );
}
