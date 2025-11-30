import { Mail, Phone, MapPin } from 'lucide-react';
import ContactForm from './ContactForm';
import { Card, Container } from '@/components/ui';


const contactInfo = [
    { icon: Phone, label: 'Phone', value: '+252 6XXXXXXX', link: 'tel:+2526XXXXXXX' },
    { icon: Mail, label: 'Email', value: 'info@ilmoquraanbar.com', link: 'mailto:info@ilmoquraanbar.com' },
    { icon: MapPin, label: 'Location', value: 'Hargeisa, Somaliland', link: '#' },
];


export default function ContactPage() {
    return (
        <Container className="py-16">
            <header className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-brand-green dark:text-white mb-3">Get in Touch</h1>
                <p className="text-lg text-foreground/70">We’re here to answer questions or discuss partnerships.</p>
            </header>


            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold mb-4">Direct Information</h2>
                    {contactInfo.map((item, i) => {
                        const Icon = item.icon;
                        return (
                            <Card key={i} className="p-5 flex items-start space-x-4" as="a" href={item.link}>
                                <Icon className="h-6 w-6 text-brand-gold mt-1" />
                                <div>
                                    <span className="text-sm opacity-60">{item.label}</span>
                                    <p className="font-semibold">{item.value}</p>
                                </div>
                            </Card>
                        );
                    })}
                </div>


                <div className="lg:col-span-2">
                    <h2 className="text-2xl font-bold mb-4">Send Us a Message</h2>
                    <ContactForm />
                </div>
            </div>
        </Container>
    );
}