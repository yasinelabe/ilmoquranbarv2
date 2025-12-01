import { prisma } from '@/lib/db'
import Link from 'next/link'
import Image from 'next/image'
import { Container } from '@/components/ui'
import CampaignSection from '@/components/public/CampaignSection'
import Hero from '../../../public/hero2.png'
import FaqSection from '@/components/public/Faq'
import { getLocale } from '@/lib/locales'
import Badge from '@/components/public/Badge'

export default async function LandingPage({ params }: { params: { locale: 'en' | 'so' | 'ar' } | Promise<{ locale: 'en' | 'so' | 'ar' }> }) {
  const { locale } = await params;
  const dict = await getLocale(locale);
  const campaignsRaw = await prisma.campaign.findMany({
    where: { isComplete: false },
    take: 3,
    orderBy: { collectedAmount: 'desc' }
  });

  // Convert Decimal → number
  const activeCampaigns = campaignsRaw.map(c => ({
    ...c,
    targetAmount: Number(c.targetAmount),
    collectedAmount: Number(c.collectedAmount),
  }));

  return (
    <div className="bg-plain text-plain min-h-screen">
      <section className="py-8 md:py-16">
        <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center gap-8 px-4">

          {/* LEFT TEXT CONTENT */}
          <div className="md:w-1/2 space-y-6 animate-fadeIn">

            <Badge dict={dict} />

            {/* Heading */}
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              {dict.hero.title}
              {/* Give the <span className='text-brand-gold dark:text-brand-gold'>Gift of Qur'an</span><br />and Change a Life Forever */}
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
                src={Hero}
                alt="Hero image"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

        </div>
      </section>
      <Container className="py-8">

        <CampaignSection activeCampaigns={activeCampaigns} dict={dict} locale={locale} />

      </Container>
      <section className="py-16 md:py-24 px-4 w-full bg-brand-green">
        <Container>
          <div
            className="
        max-w-xl mx-auto 
        rounded-2xl 
        p-8 md:p-10 
        text-white 
        shadow-lg 
        bg-white/5 
        backdrop-blur-md
        border border-white/10
      "
          >
            <h2 className="text-3xl font-extrabold text-center mb-3">
              {dict.community.title}
            </h2>

            <p className="text-center text-white/80 mb-8 text-lg text-balance">
              {dict.community.description}
            </p>

            {/* Form */}
            <form className="flex flex-col gap-3 sm:flex-row sm:items-stretch sm:gap-0">
              <input
                type="email"
                placeholder={dict.community.emailPlaceholder}
                className="
    w-full 
    p-4 
    rounded-xl
    sm:ltr:rounded-l-xl sm:ltr:rounded-r-none
    sm:rtl:rounded-r-xl sm:rtl:rounded-l-none
    bg-white/90 text-black 
    placeholder-black/50
    outline-none
  "
              />

              <button
                type="submit"
                className="
    w-full sm:w-auto
    px-6 py-4
    rounded-xl
    sm:ltr:rounded-r-xl sm:ltr:rounded-l-none
    sm:rtl:rounded-l-xl sm:rtl:rounded-r-none
    font-bold 
    bg-brand-gold 
    text-white 
    whitespace-nowrap
  "
              >
                {dict.community.subscribe}
              </button>


            </form>

          </div>
        </Container>
      </section>

      <FaqSection dict={dict} />

    </div>
  )
}