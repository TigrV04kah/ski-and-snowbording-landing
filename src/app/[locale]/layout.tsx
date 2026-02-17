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
      <div className="flex min-h-screen flex-col">
        <SiteHeader locale={locale} />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 md:px-6">{children}</main>
        <SiteFooter locale={locale} />
      </div>
      <CookieBanner locale={locale} />
    </>
  );
}
