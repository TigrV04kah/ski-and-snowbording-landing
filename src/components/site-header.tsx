"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { t, toLocalePath } from "@/lib/i18n";
import { Locale } from "@/lib/types";
import { LanguageSwitcher } from "@/components/language-switcher";

export function SiteHeader({ locale }: { locale: Locale }) {
  const pathname = usePathname() ?? "";
  const copy = t(locale);
  const homePath = toLocalePath(locale, "/");
  const isHome = pathname === "/ru" || pathname === "/en" || pathname === "/";
  const sectionsHref = `${homePath}#sections`;
  const aboutHref = `${homePath}#about-gudauri`;
  const supportHref = `${homePath}#support`;

  return (
    <header
      className={
        isHome
          ? "absolute inset-x-0 top-0 z-50 bg-gradient-to-b from-white/85 via-white/45 to-transparent"
          : "sticky top-0 z-50 border-b border-black/10 bg-white/90 backdrop-blur"
      }
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link
          href={homePath}
          className="font-sans text-2xl font-black leading-[0.78] tracking-tight text-[#1e2023]"
        >
          <span className="block">My</span>
          <span className="block">Gudauri</span>
        </Link>
        <nav className="hidden items-center gap-7 text-base text-[#1e2023] lg:flex">
          <Link href={sectionsHref} className="hover:opacity-70">
            {copy.nav.sections} <span className="text-xs align-middle">▼</span>
          </Link>
          <Link href={toLocalePath(locale, "/articles")}>{copy.nav.articles}</Link>
          <Link href={aboutHref}>{copy.nav.about}</Link>
          <Link href={supportHref}>{copy.nav.support}</Link>
        </nav>
        <div className="flex items-center gap-2">
          <LanguageSwitcher locale={locale} />
          <Link
            href={supportHref}
            className="offer-service-btn hidden rounded-xl px-4 py-2 text-sm font-semibold transition-colors lg:inline-flex"
          >
            {copy.nav.offerService}
          </Link>
        </div>
      </div>
    </header>
  );
}
