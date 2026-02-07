import Link from "next/link";
import { Locale } from "@/lib/types";
import { t, toLocalePath } from "@/lib/i18n";

export function SiteFooter({ locale }: { locale: Locale }) {
  const copy = t(locale);

  return (
    <footer className="mt-20 border-t border-[var(--line)] bg-white/80">
      <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-10 md:grid-cols-3 md:px-6">
        <div>
          <p className="font-serif text-lg">My Gudauri</p>
          <p className="mt-2 text-sm text-[var(--ink-muted)]">{copy.footerNote}</p>
        </div>
        <div className="text-sm text-[var(--ink-muted)]">
          <p className="font-medium text-[var(--ink)]">Legal</p>
          <div className="mt-2 flex flex-col gap-1">
            <Link href={toLocalePath(locale, "/privacy")}>{copy.legal.privacy}</Link>
            <Link href={toLocalePath(locale, "/cookies")}>{copy.legal.cookies}</Link>
          </div>
        </div>
        <div className="text-sm text-[var(--ink-muted)]">
          <p className="font-medium text-[var(--ink)]">Contacts</p>
          <div className="mt-2 flex flex-col gap-1">
            <a href="https://t.me/mygudauri" target="_blank" rel="noreferrer noopener">
              Telegram
            </a>
            <a href="https://wa.me/995599123456" target="_blank" rel="noreferrer noopener">
              WhatsApp
            </a>
            <a href="tel:+995599123456">+995 599 123 456</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
