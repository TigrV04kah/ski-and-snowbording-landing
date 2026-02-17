import Link from "next/link";
import { Locale } from "@/lib/types";
import { t, toLocalePath } from "@/lib/i18n";
import { CONTACT_LINKS, CONTACT_PHONE_DISPLAY } from "@/lib/contact-config";

export function SiteFooter({ locale }: { locale: Locale }) {
  const copy = t(locale);

  return (
    <footer id="support" className="mt-auto border-t border-[var(--line)] bg-white/80">
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
            <a href={CONTACT_LINKS.telegram} target="_blank" rel="noreferrer noopener">
              Telegram
            </a>
            <a href={CONTACT_LINKS.whatsapp} target="_blank" rel="noreferrer noopener">
              WhatsApp
            </a>
            <a href={CONTACT_LINKS.phone}>{CONTACT_PHONE_DISPLAY}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
