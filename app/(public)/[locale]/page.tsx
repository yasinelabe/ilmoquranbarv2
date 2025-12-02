import { prisma } from '@/lib/db'
import { Container } from '@/components/ui'
import CampaignSection from '@/components/public/CampaignSection'
import FaqSection from '@/components/public/Faq'
import { getLocale } from '@/lib/locales'
import HeroSection from '@/components/public/HeroSection'
import { LocaleParams } from '@/lib/types'

export default async function LandingPage({ params }: { params: LocaleParams | Promise<LocaleParams> }) {
  const { locale } = await params;
  const dict = await getLocale(locale);
  const campaigns = JSON.parse(JSON.stringify(await prisma.campaign.findMany({
    where: { isComplete: false },
    take: 3,
    orderBy: { collectedAmount: 'desc' }
  })))


  return (
    <div className="bg-plain text-plain min-h-screen">
   
      <Container className="py-8">
        <HeroSection dict={dict}/>
        <CampaignSection activeCampaigns={campaigns} dict={dict} locale={locale} />
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