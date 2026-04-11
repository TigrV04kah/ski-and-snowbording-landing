import Link from "next/link";
import { Locale } from "@/lib/types";
import { t, toLocalePath } from "@/lib/i18n";
import { CONTACT_LINKS, CONTACT_PHONE_DISPLAY } from "@/lib/contact-config";

export function SiteFooter({ locale }: { locale: Locale }) {
  const copy = t(locale);
  const aboutLabel = locale === "ru" ? "О платформе" : "About";
  const aboutText =
    locale === "ru"
      ? "Независимая платформа, которая соединяет гостей курорта с проверенными локальными инструкторами и активностями в Гудаури."
      : "Independent platform connecting guests with verified local instructors and activities in Gudauri.";

  return (
    <footer id="support" className="mt-auto bg-[var(--bg-soft)]">
      <div className="mx-auto w-full max-w-6xl px-4 py-14 md:px-6 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          {/* Brand + contacts */}
          <div className="space-y-6">
            <p className="inline-flex items-baseline gap-0.5 font-sans text-[1.9rem] leading-none tracking-[-0.06em] text-[var(--ink)]">
              <span className="text-[var(--ink-muted)]">my</span>
              <span>Gudauri</span>
            </p>

            <p className="max-w-xs text-sm leading-6 text-[var(--ink-muted)]">{aboutText}</p>

            <div className="space-y-1 text-sm text-[var(--ink)]">
              <a href={CONTACT_LINKS.phone} className="block">
                {CONTACT_PHONE_DISPLAY}
              </a>
              <a href="mailto:Mygudauri@gmail.com" className="block">
                Mygudauri@gmail.com
              </a>
              <p className="text-[var(--ink-muted)]">Gudauri, Georgia</p>
            </div>
          </div>

          {/* Platform links */}
          <div className="space-y-4 text-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink-muted)]">
              {aboutLabel}
            </p>
            <nav className="grid gap-2 text-[var(--ink)]">
              <Link href={toLocalePath(locale, "/articles")} className="hover:opacity-70">
                {copy.nav.articles}
              </Link>
              <Link href={toLocalePath(locale, "/") + "#about-gudauri"} className="hover:opacity-70">
                {copy.nav.about}
              </Link>
              <Link href={toLocalePath(locale, "/") + "#support"} className="hover:opacity-70">
                {copy.nav.support}
              </Link>
            </nav>
          </div>

          {/* Sections column 1 */}
          <div className="space-y-4 text-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink-muted)]">
              {locale === "ru" ? "Разделы" : "Sections"}
            </p>
            <nav className="grid gap-2 text-[var(--ink)]">
              <Link href={toLocalePath(locale, "/categories/instructors")} className="hover:opacity-70">
                Instructors
              </Link>
              <Link href={toLocalePath(locale, "/categories/tours")} className="hover:opacity-70">
                Tours
              </Link>
              <Link href={toLocalePath(locale, "/categories/rental")} className="hover:opacity-70">
                Rental
              </Link>
              <Link href={toLocalePath(locale, "/categories/places")} className="hover:opacity-70">
                Places
              </Link>
            </nav>
          </div>

          {/* Sections column 2 */}
          <div className="space-y-4 text-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-transparent select-none">
              —
            </p>
            <nav className="grid gap-2 pt-[1px] text-[var(--ink)]">
              <Link href={toLocalePath(locale, "/categories/services")} className="hover:opacity-70">
                Services
              </Link>
              <Link href={toLocalePath(locale, "/categories/transfer")} className="hover:opacity-70">
                Transfer
              </Link>
              <Link href={toLocalePath(locale, "/categories/real-estate")} className="hover:opacity-70">
                Real estate
              </Link>
            </nav>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-5 border-t border-[var(--line)] pt-6 text-sm text-[var(--ink-muted)] md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span>© 2026 MyGudauri, Inc.</span>
            <Link href={toLocalePath(locale, "/cookies")} className="hover:text-[var(--ink)]">
              {copy.legal.cookies}
            </Link>
            <Link href={toLocalePath(locale, "/privacy")} className="hover:text-[var(--ink)]">
              {copy.legal.privacy}
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={CONTACT_LINKS.telegram}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Telegram"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--ink)] text-xs font-semibold text-white transition hover:bg-black"
            >
              Tg
            </a>
            <a
              href="https://instagram.com/mygudauri"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--ink)] text-xs font-semibold text-[var(--ink)] transition hover:bg-[var(--ink)] hover:text-white"
            >
              Ig
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
