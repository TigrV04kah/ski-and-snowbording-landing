"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { t, toLocalePath } from "@/lib/i18n";
import { Locale } from "@/lib/types";

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
  const aboutHref = `${homePath}#about-gudauri`;
  const supportHref = `${homePath}#support`;
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const categoriesMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isCategoriesOpen) {
      return;
    }

    const onPointerDown = (event: MouseEvent) => {
      if (!categoriesMenuRef.current) {
        return;
      }

      if (!categoriesMenuRef.current.contains(event.target as Node)) {
        setIsCategoriesOpen(false);
      }
    };

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsCategoriesOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onEscape);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onEscape);
    };
  }, [isCategoriesOpen]);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-5 md:px-6">
        <Link
          href={homePath}
          className="inline-flex items-baseline gap-0.5 font-sans text-[1.7rem] leading-none tracking-[-0.06em] text-[var(--ink)]"
        >
          <span className="text-[var(--ink-muted)]">my</span>
          <span>Gudauri</span>
        </Link>

        <nav className="hidden items-center gap-10 text-[0.95rem] text-[var(--ink)] lg:flex">
          <div
            className="relative"
            ref={categoriesMenuRef}
            onMouseEnter={() => setIsCategoriesOpen(true)}
            onMouseLeave={() => setIsCategoriesOpen(false)}
            onFocusCapture={() => setIsCategoriesOpen(true)}
            onBlurCapture={(event) => {
              const nextFocused = event.relatedTarget as Node | null;
              if (!event.currentTarget.contains(nextFocused)) {
                setIsCategoriesOpen(false);
              }
            }}
          >
            <button
              type="button"
              className="inline-flex items-center gap-1.5 transition hover:opacity-70"
              aria-haspopup="menu"
              aria-expanded={isCategoriesOpen}
              aria-controls="categories-menu"
            >
              <span>{copy.nav.sections}</span>
              <span
                className={`text-[0.6rem] transition-transform ${
                  isCategoriesOpen ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </button>

            {isCategoriesOpen ? (
              <div
                id="categories-menu"
                className="absolute left-1/2 top-full z-50 mt-3 min-w-72 -translate-x-1/2 overflow-hidden rounded-2xl border border-[var(--line)] bg-white p-2 shadow-[0_24px_55px_-28px_rgba(0,0,0,0.25)]"
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
                      className={`block rounded-xl px-4 py-2.5 text-sm transition ${
                        isActive
                          ? "bg-[var(--ink)] text-white"
                          : "text-[var(--ink)] hover:bg-[var(--bg-soft)]"
                      }`}
                      onClick={() => setIsCategoriesOpen(false)}
                    >
                      {item.title}
                    </Link>
                  );
                })}
              </div>
            ) : null}
          </div>

          <Link href={toLocalePath(locale, "/articles")} className="transition hover:opacity-70">
            {copy.nav.articles}
          </Link>
          <Link href={aboutHref} className="transition hover:opacity-70">
            {copy.nav.about}
          </Link>
          <Link href={supportHref} className="transition hover:opacity-70">
            {copy.nav.support}
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={supportHref}
            className="hidden rounded-full bg-[var(--ink)] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-black lg:inline-flex"
          >
            {copy.nav.offerService}
          </Link>
        </div>
      </div>
    </header>
  );
}
