import { Footer } from "@/components/public/Footer";
import Header from "@/components/public/Header";

export default async function PublicLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: 'en' | 'so' | 'ar' };
}) {

  const locale = (await params).locale;
  const isArabic = locale === "ar";

  return (
    <div
      className="flex flex-col min-h-screen"
      dir={isArabic ? "rtl" : "ltr"}
      lang={locale}
    >
      <Header locale={locale} />
      <main className="grow">{children}</main>
      <Footer locale={locale} />
    </div>
  );
}
