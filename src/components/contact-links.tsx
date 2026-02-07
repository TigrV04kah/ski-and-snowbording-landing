"use client";

import { ContactLinks as ContactLinksType, Locale } from "@/lib/types";
import { t } from "@/lib/i18n";
import { trackEvent } from "@/lib/tracking";

function ContactButton({
  href,
  label,
  event,
}: {
  href: string;
  label: string;
  event: string;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer noopener" : undefined}
      className="rounded-full border border-[var(--line)] bg-white px-4 py-2 text-sm font-medium text-[var(--ink)] transition hover:border-[var(--accent)] hover:bg-[var(--bg-soft)]"
      onClick={() => trackEvent("click_contact", { channel: event })}
    >
      {label}
    </a>
  );
}

export function ContactLinks({ locale, contacts }: { locale: Locale; contacts: ContactLinksType }) {
  const copy = t(locale);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {contacts.whatsapp ? (
        <ContactButton href={contacts.whatsapp} label={`${copy.contactLabel}: WhatsApp`} event="whatsapp" />
      ) : null}
      {contacts.telegram ? (
        <ContactButton href={contacts.telegram} label={`${copy.contactLabel}: Telegram`} event="telegram" />
      ) : null}
      {contacts.phone ? (
        <ContactButton href={`tel:${contacts.phone}`} label={`${copy.contactLabel}: ${contacts.phone}`} event="phone" />
      ) : null}
    </div>
  );
}
