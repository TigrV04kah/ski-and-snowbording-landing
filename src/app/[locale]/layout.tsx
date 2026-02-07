import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { CookieBanner } from "@/components/cookie-banner";
import { isLocale } from "@/lib/i18n";

export function generateStaticParams() {
  return [{ locale: "ru" }, { locale: "en" }];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return (
    <>
      <SiteHeader locale={locale} />
      <main className="mx-auto w-full max-w-6xl px-4 pt-8 md:px-6 md:pt-10">{children}</main>
      <SiteFooter locale={locale} />
      <CookieBanner locale={locale} />
    </>
  );
}
