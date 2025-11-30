import { prisma } from '@/lib/db'
import Link from 'next/link'
import Image from 'next/image'
import { Container } from '@/components/ui'
import CampaignSection from '@/components/public/CampaignSection'
import Hero from '../../public/hero2.png'
import FaqSection from '@/components/public/Faq'

export default async function LandingPage() {
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

            {/* Badge */}
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-brand-green/10 text-brand-green font-semibold text-sm">
              Empower a Child with Qur’an
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Give the <span className="text-brand-green dark:text-brand-gold">Gift of Qur'an</span>
              <br />
              and Change a Life Forever
            </h1>

            {/* Description */}
            <p className="text-lg text-plain leading-relaxed">
              IlmoQuranbar establishes free Quran circles in mosques — sponsoring teachers
              and providing the tools needed to reach thousands of children.
            </p>

            {/* CTA Buttons */}
            <div className="flex gap-4 pt-3">
              <Link href="/donations">
                <button className="px-8 py-3 rounded-xl font-bold bg-brand-gold text-white shadow-md hover:bg-brand-dark transition">
                  Sponsor a Student
                </button>
              </Link>

              <Link href="/about" className="hidden md:inline-block">
                <button className="px-6 py-3 text-plain rounded-xl font-semibold border border-gray-300 dark:border-gray-700    transition">
                  Learn More
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

        <CampaignSection activeCampaigns={activeCampaigns} />


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
              Join Our Community
            </h2>

            <p className="text-center text-white/80 mb-8 text-lg text-balance">
              Get updates on our progress, new Quran circles, and sponsorship opportunities.
            </p>

            {/* Form */}
            <form className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="email"
                placeholder="Enter your best email"
                className="
            w-full 
            p-4 
            rounded-xl 
            sm:rounded-l-xl sm:rounded-r-none 
            bg-white/90 text-black 
            placeholder-black/50
            outline-none border-none
          "
              />

              <button
                type="submit"
                className="
            w-full sm:w-auto
            px-6 py-4 
            rounded-xl
            sm:rounded-r-xl sm:rounded-l-none
            font-bold 
            bg-brand-gold 
            text-white 
            whitespace-nowrap
          "
              >
                Subscribe
              </button>
            </form>
          </div>
        </Container>
      </section>

      <FaqSection />

    </div>
  )
}