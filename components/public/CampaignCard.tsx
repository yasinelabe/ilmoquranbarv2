import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import { GraduationCap } from 'lucide-react'
import { Card } from '../ui/index'


export function CampaignCard({ campaign }: { campaign: any }) {
    const collected = Number(campaign.collectedAmount || 0)
    const target = Number(campaign.targetAmount || 1)
    const progress = Math.min((collected / target) * 100, 100)


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
                    <GraduationCap size={72} className="text-brand-green dark:text-brand-gold" />
                )}
            </div>


            <h3 className="text-xl font-extrabold text-brand-green dark:text-brand-gold  mb-2 line-clamp-2">{campaign.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">{campaign.description}</p>


            <div className="w-full rounded-full h-2 mb-2 bg-surface-contrast overflow-hidden border" style={{ borderColor: "rgb(var(--border-color))" }}>
                <div style={{ width: `${progress}%`, backgroundColor: 'rgb(var(--brand-gold))' }} />
            </div>


            <div className="flex justify-between text-sm font-bold">
                <span className="text-plain dark:text-gray-100">${collected.toLocaleString()}</span>
                <span className="text-brand-green dark:text-brand-gold">${target.toLocaleString()} Goal</span>
            </div>


            <Link href={`/donations/${campaign.id}`} className="mt-4 block">
                <button className="w-full rounded-xl py-3 bg-brand-green text-white font-bold">Sponsor Now</button>
            </Link>
        </Card>
    )
}