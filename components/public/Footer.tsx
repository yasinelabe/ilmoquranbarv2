import Link from 'next/link';
import { Zap } from 'lucide-react';
import { getLocale } from '@/lib/locales';
import Logo from './Logo';

export async function Footer({
  locale,
}: {
  locale: 'en' | 'so' | 'ar';
}) {
  const dict = await getLocale(locale);
  const navItems = [
    { name: dict.nav.home, href: `/${locale}` },
    { name: dict.nav.donations, href: `/${locale}/donations` },
    { name: dict.nav.about, href: `/${locale}/about` },
    { name: dict.nav.contact, href: `/${locale}/contact` }
  ];

  return (
    <footer
      className="mt-16 pt-12 pb-8"
      style={{ backgroundColor: 'rgb(var(--brand-green))' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 pb-10 border-b border-white/10">

          {/* Brand */}
          <div>
            <Link
              href={`/${locale}`}
              className="flex items-center text-2xl font-extrabold mb-3 text-brand-gold no-underline"
            >
              <Logo isFooter={true} />
            </Link>
            <p className="text-sm text-white/90">
              {dict.footer.tagline}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="font-bold text-lg mb-3 text-brand-gold">
              {dict.footer.quickLinks}
            </h5>

            <ul className="space-y-2 text-white/90">
              <li><Link href={`/${locale}/about`}>{dict.nav.about}</Link></li>
              <li><Link href={`/${locale}/donations`}>{dict.footer.campaigns}</Link></li>
              <li><Link href={`/${locale}/contact`}>{dict.nav.contact}</Link></li>
              <li><Link href={`/${locale}/faq`}>{dict.footer.faq}</Link></li>
            </ul>
          </div>

          {/* Support / Navigation */}
          <div>
            <h5 className="font-bold text-lg mb-3 text-brand-gold">
              {dict.footer.moreLinks}
            </h5>

            <ul className="space-y-2 text-white/90">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h5 className="font-bold text-lg mb-3 text-brand-gold">
              {dict.footer.newsletterTitle}
            </h5>
            <p className="text-sm text-white/90 mb-3">
              {dict.footer.newsletterDesc}
            </p>

            <form className="flex flex-col sm:flex-row items-center w-full space-y-3 sm:space-y-0">
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
      outline-none border-none
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
        </div>

        <div className="mt-8 text-center text-sm text-white/60">
          © {new Date().getFullYear()} IlmoQuranbar. {dict.footer.rights}
        </div>
      </div>
    </footer>
  );
}
