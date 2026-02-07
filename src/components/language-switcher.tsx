"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Locale } from "@/lib/types";
import { toLocalePath } from "@/lib/i18n";

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const safePath = pathname || "/";

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-[var(--line)] bg-white/70 p-1 text-sm backdrop-blur">
      <Link
        href={toLocalePath("ru", safePath)}
        className={`rounded-full px-3 py-1 transition ${locale === "ru" ? "bg-[var(--ink)] !text-white" : "text-[var(--ink-muted)] hover:text-[var(--ink)]"}`}
      >
        RU
      </Link>
      <Link
        href={toLocalePath("en", safePath)}
        className={`rounded-full px-3 py-1 transition ${locale === "en" ? "bg-[var(--ink)] !text-white" : "text-[var(--ink-muted)] hover:text-[var(--ink)]"}`}
      >
        EN
      </Link>
    </div>
  );
}
