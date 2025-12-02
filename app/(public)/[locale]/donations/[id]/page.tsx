import { prisma } from '@/lib/db';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { MapPin, User, GraduationCap } from 'lucide-react';
import DonationForm from './DonationForm';
import { getLocale } from '@/lib/locales';

export default async function CampaignDetailPage({ params }: { params: { locale: 'en' | 'so' | 'ar', id: string } }) {
    const { locale, id } = await params
    const dict = await getLocale(locale);
    const campaign = await prisma.campaign.findUnique({
        where: { id: Number(id) },
        include: {
            student: {
                include: {
                    quranCircle: {
                        include: {
                            mosque: {
                                include: {
                                    district: {
                                        include: {
                                            region: {
                                                include: {
                                                    country: true
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            quranCircle: {
                include: {
                    mosque: {
                        include: {
                            district: {
                                include: {
                                    region: {
                                        include: {
                                            country: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    });


    if (!campaign || campaign.isComplete) return notFound();

    const collected = Number(campaign.collectedAmount);
    const target = Number(campaign.targetAmount);
    const progress = Math.min((collected / target) * 100, 100);

    return (
        <div className=" py-10 px-4 transition-colors">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">

                {/* Left / Main Content */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Main Card */}
                    <div className="p-8 rounded-3xl surface-contrast border" style={{ borderColor: "rgb(var(--border-color))" }}>
                        {/* Title */}
                        <h1 className="text-4xl font-extrabold text-brand-gold dark:text-white mb-3">
                            {campaign.name}
                        </h1>

                        <p className="text-plain dark:text-gray-400 mb-6 text-lg">
                            {campaign.type === 'STUDENT_SPONSORSHIP'
                                ? dict.donations.title2
                                : dict.donations.title1}
                        </p>

                        <div className="w-full rounded-2xl surface-contrast mb-6 overflow-hidden flex items-center justify-center">
                            {campaign.image ? (
                                <div className="w-full rounded-2xl overflow-hidden">
                                    <Image
                                        src={campaign.image}
                                        alt={campaign.name}
                                        width={1200}
                                        height={675}
                                        className="object-cover w-full h-100"
                                    />
                                </div>


                            ) : (
                                <GraduationCap size={72} className="text-brand-gold dark:text-brand-gold" />
                            )}
                        </div>


                        {/* Progress */}
                        <div className="w-full border bg-surface-contrast rounded-full h-3 mb-3 overflow-hidden" style={{ borderColor: "rgb(var(--border-color))" }}>
                            <div
                                style={{ width: `${progress}%`, backgroundColor: 'rgb(var(--brand-gold))' }}
                                className="h-full rounded-full"
                            />
                        </div>

                        <div className="flex justify-between text-sm font-bold">
                            <span className="text-plain dark:text-gray-200">
                                ${collected.toLocaleString()}
                            </span>
                            <span className="text-brand-gold dark:text-brand-gold">
                                ${target.toLocaleString()} {dict.donations.goal}
                            </span>
                        </div>

                        {/* Description */}
                        <h2 className="text-2xl font-extrabold text-brand-gold dark:text-brand-gold mt-10 mb-4">
                           {dict.donations.campaignAbout}
                        </h2>

                        <p className="text-plain dark:text-gray-200 leading-relaxed">
                            {campaign.description}
                        </p>
                    </div>

                    {/* Student & Location Section */}
                    <div className="p-8 rounded-2xl surface-contrast border" style={{ borderColor: "rgb(var(--border-color))" }}>


                        {campaign.student && (
                            <>
                                <h3 className="text-xl font-extrabold text-brand-gold dark:text-brand-gold mb-4 flex items-center" >
                                    <User size={20} className="mr-2" /> {dict.donations.studentProfile}
                                </h3>

                                <div className="space-y-1 text-plain dark:text-gray-200 mb-6">
                                    <p>{dict.donations.name}: {campaign.student.fullname}</p>
                                    <p>{dict.donations.age}: {campaign.student.age}</p>
                                    <p>{dict.donations.circle}: {campaign.student.quranCircle?.name}</p>
                                    <p>{dict.donations.mosque}: {campaign.student.quranCircle.mosque?.name} , {campaign.student.quranCircle.mosque.district.name}, {campaign.student.quranCircle.mosque.district.region.name},{campaign.student.quranCircle.mosque.district.region.country.name}</p>
                                </div>
                            </>
                        )}

                        {campaign.quranCircle && (
                            <>
                                <h3 className="text-xl font-extrabold text-brand-gold dark:text-brand-gold mb-4 flex items-center ">
                                    <MapPin size={20} className="mr-2" /> {dict.donations.locationDetails}
                                </h3>

                                <ul className="space-y-2 text-plain dark:text-gray-200">
                                    <li>
                                        {dict.donations.mosque}:
                                        <span className="ml-1 font-semibold">
                                            {campaign.quranCircle.mosque.name}
                                        </span>
                                    </li>
                                    <li>
                                        {dict.donations.location}: {campaign.quranCircle.mosque.district.name},{" "}
                                        {campaign.quranCircle.mosque.district.region.name} (
                                        {campaign.quranCircle.mosque.district.region.country.name})
                                    </li>
                                </ul>
                            </>
                        )}

                    </div>

                </div>

                {/* Sticky Donation Form */}
                <div className="lg:col-span-1">
                    <div className="lg:sticky lg:top-24">
                        <DonationForm campaignId={campaign.id} dict={dict} />
                    </div>
                </div>

            </div>
        </div>
    );
}
