import Link from "next/link";
import { t, toLocalePath } from "@/lib/i18n";
import { Locale } from "@/lib/types";
import { LanguageSwitcher } from "@/components/language-switcher";

export function SiteHeader({ locale }: { locale: Locale }) {
  const copy = t(locale);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[var(--bg-soft)]/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <Link href={toLocalePath(locale, "/")} className="font-serif text-xl tracking-tight text-[var(--ink)]">
          My Gudauri
        </Link>
        <nav className="hidden items-center gap-5 text-sm text-[var(--ink-muted)] md:flex">
          <Link href={toLocalePath(locale, "/")}>{copy.nav.home}</Link>
          <Link href={toLocalePath(locale, "/instructors")}>{copy.nav.instructors}</Link>
          <Link href={toLocalePath(locale, "/services")}>{copy.nav.services}</Link>
          <Link href={toLocalePath(locale, "/articles")}>{copy.nav.articles}</Link>
        </nav>
        <LanguageSwitcher locale={locale} />
      </div>
    </header>
  );
}
