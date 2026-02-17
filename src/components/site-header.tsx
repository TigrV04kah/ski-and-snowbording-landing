"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { t, toLocalePath } from "@/lib/i18n";
import { Locale } from "@/lib/types";
import { LanguageSwitcher } from "@/components/language-switcher";

interface HeaderSectionLink {
  slug: string;
  title: string;
}

export function SiteHeader({
  locale,
  sectionLinks,
}: {
  locale: Locale;
  sectionLinks: HeaderSectionLink[];
}) {
  const pathname = usePathname() ?? "";
  const copy = t(locale);
  const homePath = toLocalePath(locale, "/");
  const isHome = pathname === "/ru" || pathname === "/en" || pathname === "/";
  const aboutHref = `${homePath}#about-gudauri`;
  const supportHref = `${homePath}#support`;
  const [isSectionsOpen, setIsSectionsOpen] = useState(false);
  const sectionsMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isSectionsOpen) {
      return;
    }

    const onPointerDown = (event: MouseEvent) => {
      if (!sectionsMenuRef.current) {
        return;
      }

      if (!sectionsMenuRef.current.contains(event.target as Node)) {
        setIsSectionsOpen(false);
      }
    };

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsSectionsOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onEscape);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onEscape);
    };
  }, [isSectionsOpen]);

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
          <div className="relative" ref={sectionsMenuRef}>
            <button
              type="button"
              onClick={() => setIsSectionsOpen((current) => !current)}
              className="inline-flex items-center gap-1 hover:opacity-70"
              aria-haspopup="menu"
              aria-expanded={isSectionsOpen}
              aria-controls="sections-menu"
            >
              <span>{copy.nav.sections}</span>
              <span
                className={`text-xs align-middle transition-transform ${
                  isSectionsOpen ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </button>

            {isSectionsOpen ? (
              <div
                id="sections-menu"
                className="absolute left-0 top-full z-50 mt-2 min-w-64 overflow-hidden rounded-2xl border border-[var(--line)] bg-white p-2 shadow-[0_18px_45px_-22px_rgba(0,0,0,0.35)]"
                role="menu"
              >
                {sectionLinks.map((item) => {
                  const href = toLocalePath(locale, `/categories/${item.slug}`);
                  const isActive = pathname === href;

                  return (
                    <Link
                      key={item.slug}
                      href={href}
                      role="menuitem"
                      className={`block rounded-xl px-3 py-2 text-sm transition ${
                        isActive
                          ? "bg-[var(--ink)] text-white"
                          : "text-[var(--ink)] hover:bg-[var(--bg-soft)]"
                      }`}
                      onClick={() => setIsSectionsOpen(false)}
                    >
                      {item.title}
                    </Link>
                  );
                })}
              </div>
            ) : null}
          </div>

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
