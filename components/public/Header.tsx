import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggler";
import { getLocale } from "@/lib/locales";
import HeaderClient from "./HeaderClient";
import Logo from "./Logo";
import LanguageSwitcher from "./LanguageSwitcher";

export default async function Header({ locale }: { locale: "en" | "so" | "ar" }) {
  const dict = await getLocale(locale);
  const languages = ["en", "so", "ar"];
  const nextLang = languages[(languages.indexOf(locale) + 1) % languages.length];


  const navItems = [
    { name: dict.nav.home, href: `/${locale}` },
    { name: dict.nav.donations, href: `/${locale}/donations` },
    { name: dict.nav.about, href: `/${locale}/about` },
    { name: dict.nav.contact, href: `/${locale}/contact` },
  ];

  return (
    <header className="sticky top-0 z-20 bg-plain/95 backdrop-blur-sm border-b border-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">

        <Link href={`/${locale}`} className="flex items-center gap-3 no-underline">
          <Logo isFooter={false} />
        </Link>

        <nav className="hidden lg:flex gap-8 items-center">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-plain hover:text-brand-gold dark:hover:text-brand-gold transition-colors"
            >
              {item.name}
            </Link>
          ))}

          <LanguageSwitcher nextLang={nextLang} href={`/${nextLang}`} />

          <ThemeToggle />

          {/* Donate button */}
          <Link href={`/${locale}/donations`} className="ml-2">
            <button className="rounded-2xl px-4 py-2 font-bold bg-brand-gold text-white">
              {dict.nav.donate}
            </button>
          </Link>
        </nav>

        <HeaderClient locale={locale} navItems={navItems} dict={dict} />
      </div>
    </header>
  );
}
