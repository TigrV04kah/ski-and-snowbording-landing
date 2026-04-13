import Link from "next/link";
import { Locale } from "@/lib/types";
import { t, toLocalePath } from "@/lib/i18n";
import { CONTACT_LINKS, CONTACT_PHONE_DISPLAY } from "@/lib/contact-config";

function TelegramIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 2 11 13" />
      <path d="M22 2 15 22l-4-9-9-4z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export function SiteFooter({ locale }: { locale: Locale }) {
  const copy = t(locale);
  const phoneLabel = locale === "ru" ? "Phone number" : "Phone number";
  const emailLabel = "Email";
  const addressLabel = "Adress";
  const sectionsLabel = "Sections";
  const aboutText =
    locale === "ru"
      ? "Независимая платформа, которая соединяет гостей курорта с проверенными локальными инструкторами и активностями в Гудаури."
      : "Independent platform connecting guests with verified local instructors and activities in Gudauri.";

  return (
    <footer id="support" className="mt-auto bg-[var(--bg-soft)]">
      <div className="mx-auto w-full max-w-6xl px-4 py-14 md:px-6 md:py-16">
        {/* Top row: logo on the left, brand description on the right */}
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <p className="inline-flex items-baseline font-sans text-[1.9rem] leading-none tracking-[-0.04em]">
            <span className="text-[var(--ink-muted)]">My </span>
            <span className="text-[var(--ink)]">Gudauri</span>
          </p>

          <p className="max-w-xs text-sm leading-6 text-[var(--ink-muted)] md:text-right">
            {aboutText}
          </p>
        </div>

        {/* Middle row: contact | primary nav | sections (2 columns) */}
        <div className="mt-12 grid gap-12 md:mt-16 md:grid-cols-[1.3fr_1fr_1.4fr]">
          {/* Contact block */}
          <div className="space-y-6 text-sm">
            <div>
              <p className="mb-1 text-xs text-[var(--ink-muted)]">{phoneLabel}</p>
              <a href={CONTACT_LINKS.phone} className="text-base text-[var(--ink)]">
                {CONTACT_PHONE_DISPLAY}
              </a>
            </div>
            <div>
              <p className="mb-1 text-xs text-[var(--ink-muted)]">{emailLabel}</p>
              <a
                href="mailto:Mygudauri@gmail.com"
                className="text-base text-[var(--ink)]"
              >
                Mygudauri@gmail.com
              </a>
            </div>
            <div>
              <p className="mb-1 text-xs text-[var(--ink-muted)]">{addressLabel}</p>
              <p className="text-base text-[var(--ink)]">Gudauri, Georgia</p>
            </div>
          </div>

          {/* Primary nav */}
          <nav className="flex flex-col gap-5 text-base font-semibold text-[var(--ink)]">
            <Link href={toLocalePath(locale, "/articles")} className="hover:opacity-70">
              {copy.nav.articles}
            </Link>
            <Link
              href={toLocalePath(locale, "/") + "#about-gudauri"}
              className="hover:opacity-70"
            >
              {copy.nav.about}
            </Link>
            <Link
              href={toLocalePath(locale, "/") + "#support"}
              className="hover:opacity-70"
            >
              {copy.nav.support}
            </Link>
          </nav>

          {/* Sections: 2-column nested grid, row-by-row */}
          <div>
            <p className="mb-5 text-xs text-[var(--ink-muted)]">{sectionsLabel}</p>
            <div className="grid grid-cols-2 gap-x-10 gap-y-5 text-base font-semibold text-[var(--ink)]">
              <Link
                href={toLocalePath(locale, "/instructors")}
                className="hover:opacity-70"
              >
                Instructors
              </Link>
              <Link
                href={toLocalePath(locale, "/services")}
                className="hover:opacity-70"
              >
                Services
              </Link>
              <Link
                href={toLocalePath(locale, "/categories/places")}
                className="hover:opacity-70"
              >
                Places
              </Link>
              <Link
                href={toLocalePath(locale, "/categories/tours")}
                className="hover:opacity-70"
              >
                Activity
              </Link>
              <Link
                href={toLocalePath(locale, "/categories/transfer")}
                className="hover:opacity-70"
              >
                Transfer
              </Link>
              <Link
                href={toLocalePath(locale, "/categories/rental")}
                className="hover:opacity-70"
              >
                Rent
              </Link>
            </div>
          </div>
        </div>

        {/* Dotted divider + bottom row */}
        <div className="mt-14 flex flex-col gap-5 border-t border-dashed border-[var(--ink-muted)]/50 pt-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-sm text-[var(--ink-muted)]">
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
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--ink)] text-white transition hover:bg-black"
            >
              <TelegramIcon />
            </a>
            <a
              href="https://instagram.com/mygudauri"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Instagram"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--ink)] text-white transition hover:bg-black"
            >
              <InstagramIcon />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
