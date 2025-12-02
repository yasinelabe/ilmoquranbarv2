import Link from 'next/link'
import Image from 'next/image'
import Badge from './Badge'
import HeroImage from '../../public/hero2.png'
export default async function HeroSection({ dict }: { dict: any }) {
    return (
        <section className="py-8 md:py-16">
            <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center gap-8 px-4">

                {/* LEFT TEXT CONTENT */}
                <div className="md:w-1/2 space-y-6 animate-fadeIn">

                    <Badge dict={dict} />

                    {/* Heading */}
                    <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                        {dict.hero.title}
                    </h1>

                    {/* Description */}
                    <p className="text-lg text-plain leading-relaxed">
                        {dict.hero.subtitle}
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex gap-4 pt-3">
                        <Link href="/donations">
                            <button className="px-8 py-3 rounded-xl font-bold bg-brand-gold text-white shadow-md hover:bg-brand-dark transition">
                                {dict.hero.cta}
                            </button>
                        </Link>

                        <Link href="/about" className="hidden md:inline-block">
                            <button className="px-6 py-3 text-plain rounded-xl font-semibold border border-gray-300 dark:border-gray-700    transition">
                                {dict.hero.more}
                            </button>
                        </Link>
                    </div>
                </div>

                {/* RIGHT IMAGE */}
                <div className="hidden md:block md:w-1/2">
                    <div className="relative h-72 md:h-96 rounded-3xl overflow-hidden shadow-lg surface-contrast animate-fadeIn">
                        <Image
                            src={HeroImage}
                            alt="Hero image"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>

            </div>
        </section>
    )
}
