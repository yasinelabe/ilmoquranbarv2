'use client'

import Link from 'next/link'
import Image from 'next/image'
import { GraduationCap } from 'lucide-react'
import { Card } from '../ui/index'


export function CampaignCard({ campaign, dict,locale }: { campaign: any, dict: any,locale:any }) {
    const collected = Number(campaign.collectedAmount || 0);
    const target = Number(campaign.targetAmount || 1);
    const progress = Math.min((collected / target) * 100, 100);

    return (
        <Card className="p-6">
            <div className="h-40 surface-contrast rounded-xl mb-4 flex items-center justify-center overflow-hidden">
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

            <h3 className="text-xl font-extrabold mb-2">{campaign.name}</h3>
            <p className="text-sm opacity-70 line-clamp-3 mb-4">{campaign.description}</p>

            {/* Progress */}
            <div className="w-full rounded-full h-2 bg-surface-contrast mb-2">
                <div style={{ width: `${progress}%`, backgroundColor: "rgb(var(--brand-gold))" }} />
            </div>

            <div className="flex justify-between text-sm font-bold">
                <span>$ {collected}</span>
                <span>
                    $ {target} {dict?.donations.goal}
                </span>
            </div>

            <Link href={`/${locale}/donations/${campaign.id}`} className="mt-4 block">
                <button className="w-full rounded-xl py-3 bg-brand-green text-white font-bold">
                    {dict?.donations.sponsorNow}
                </button>
            </Link>
        </Card>
    );
}
