'use client'

export default function Badge({ dict }: { dict: any }) {
    return (
        < div className="inline-flex items-center px-4 py-1.5 rounded-full text-brand-gold  font-semibold text-sm" >
            {dict.hero.badge}
        </ div>
    )
}
