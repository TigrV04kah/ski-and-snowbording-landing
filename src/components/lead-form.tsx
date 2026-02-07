"use client";

import { FormEvent, useState } from "react";
import { Locale } from "@/lib/types";
import { t } from "@/lib/i18n";
import { trackEvent } from "@/lib/tracking";

export function LeadForm({
  locale,
  inquiryType,
  entitySlug,
}: {
  locale: Locale;
  inquiryType: "instructor" | "service";
  entitySlug: string;
}) {
  const copy = t(locale);
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    setPending(true);
    setStatus("idle");

    try {
      const payload = {
        name: String(formData.get("name") ?? ""),
        contact: String(formData.get("contact") ?? ""),
        inquiryType,
        entitySlug,
        message: String(formData.get("message") ?? ""),
        locale,
        consent: formData.get("consent") === "on",
        hp_field: String(formData.get("hp_field") ?? ""),
      };

      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Lead request failed");
      }

      setStatus("ok");
      form.reset();
      trackEvent("submit_lead", { inquiryType, locale });
    } catch {
      setStatus("error");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-3xl border border-[var(--line)] bg-white p-5">
      <h3 className="font-serif text-2xl text-[var(--ink)]">{copy.leaveRequest}</h3>
      <input
        name="name"
        required
        placeholder={copy.leadForm.name}
        className="h-11 w-full rounded-xl border border-[var(--line)] px-3 outline-none focus:border-[var(--accent)]"
      />
      <input
        name="contact"
        required
        placeholder={copy.leadForm.contact}
        className="h-11 w-full rounded-xl border border-[var(--line)] px-3 outline-none focus:border-[var(--accent)]"
      />
      <textarea
        name="message"
        rows={4}
        placeholder={copy.leadForm.message}
        className="w-full rounded-xl border border-[var(--line)] px-3 py-2 outline-none focus:border-[var(--accent)]"
      />
      <input name="hp_field" tabIndex={-1} autoComplete="off" className="hidden" />
      <label className="flex items-start gap-2 text-xs text-[var(--ink-muted)]">
        <input name="consent" type="checkbox" required className="mt-1" />
        {copy.consentText}
      </label>
      <button
        disabled={pending}
        type="submit"
        className="h-11 rounded-full bg-[var(--ink)] px-5 text-sm font-medium text-white disabled:opacity-60"
      >
        {pending ? "..." : copy.leadForm.send}
      </button>
      {status === "ok" ? <p className="text-sm text-green-700">{copy.requestSent}</p> : null}
      {status === "error" ? <p className="text-sm text-red-700">{copy.requestError}</p> : null}
    </form>
  );
}
