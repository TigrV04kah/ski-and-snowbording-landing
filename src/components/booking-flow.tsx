"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { imageUrl } from "@/lib/sanity/image";
import { toLocalePath } from "@/lib/i18n";
import { Locale } from "@/lib/types";

/* ─── i18n ──────────────────────────────────────────────── */

const copy = {
  ru: {
    title: (name: string) => `Забронировать урок с ${name}`,
    step1: "Детали урока",
    step2: "Контактные данные",
    step3: "Проверка и отправка",
    hours: "Кол-во часов",
    people: "Кол-во людей",
    hoursNote: "Часы можно разбить по несколько дней",
    next: "Далее",
    back: "Назад",
    name: "Имя",
    phone: "Телефон",
    email: "Email",
    messenger: "Предпочтительный мессенджер",
    comment: "Комментарий (необязательно)",
    consent: "Я согласен с обработкой персональных данных",
    summary: "Сводка",
    instructor: "Инструктор",
    totalPrice: "Итого",
    perHour: "/ч",
    sendRequest: "Отправить заявку",
    sending: "Отправка…",
    successTitle: "Заявка отправлена!",
    successDesc: "Менеджер свяжется с вами для подтверждения. Оплата происходит после согласования.",
    requestId: "Номер заявки",
    copyId: "Скопировать",
    backToInstructors: "Вернуться к инструкторам",
    backToHome: "На главную",
    errorSend: "Не удалось отправить заявку. Попробуйте ещё раз.",
    required: "Обязательное поле",
  },
  en: {
    title: (name: string) => `Book a lesson with ${name}`,
    step1: "Lesson details",
    step2: "Contact details",
    step3: "Review and submit",
    hours: "Number of hours",
    people: "Number of people",
    hoursNote: "Hours can be split across multiple days",
    next: "Next",
    back: "Back",
    name: "Name",
    phone: "Phone",
    email: "Email",
    messenger: "Preferred messenger",
    comment: "Comment (optional)",
    consent: "I agree to the processing of personal data",
    summary: "Summary",
    instructor: "Instructor",
    totalPrice: "Total",
    perHour: "/h",
    sendRequest: "Send a request",
    sending: "Sending…",
    successTitle: "Request sent!",
    successDesc: "A manager will contact you to confirm. Payment is collected after confirmation.",
    requestId: "Request ID",
    copyId: "Copy",
    backToInstructors: "Back to instructors",
    backToHome: "Home",
    errorSend: "Failed to send request. Please try again.",
    required: "Required field",
  },
} as const;

/* ─── types ─────────────────────────────────────────────── */

interface BookingState {
  hours: number;
  people: number;
  name: string;
  phone: string;
  email: string;
  messenger: string;
  comment: string;
  consent: boolean;
}

function generateRequestId(): string {
  const num = Math.floor(10000 + Math.random() * 90000);
  return `MG-${num}`;
}

/* ─── step components ───────────────────────────────────── */

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex gap-2">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`h-1.5 flex-1 rounded-full transition ${
            i <= current ? "bg-[var(--accent)]" : "bg-[var(--line)]"
          }`}
        />
      ))}
    </div>
  );
}

/* ─── main component ────────────────────────────────────── */

export function BookingFlow({
  locale,
  instructorSlug,
  instructorName,
  instructorImage,
  pricePerHour,
}: {
  locale: Locale;
  instructorSlug: string;
  instructorName: string;
  instructorImage: unknown;
  pricePerHour: number;
}) {
  const c = copy[locale];
  const [step, setStep] = useState(0);
  const [state, setState] = useState<BookingState>({
    hours: 2,
    people: 1,
    name: "",
    phone: "",
    email: "",
    messenger: "",
    comment: "",
    consent: false,
  });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [requestId, setRequestId] = useState("");

  const totalPrice = state.hours * state.people * pricePerHour;

  const update = <K extends keyof BookingState>(key: K, value: BookingState[K]) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  const canProceedStep1 = state.hours >= 1 && state.people >= 1;
  const canProceedStep2 =
    state.name.trim().length >= 2 &&
    state.phone.trim().length >= 4 &&
    state.email.includes("@") &&
    state.consent;

  async function handleSubmit() {
    setSending(true);
    setError("");
    const id = generateRequestId();

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: id,
          instructorSlug,
          hours: state.hours,
          people: state.people,
          totalPrice,
          clientName: state.name.trim(),
          phone: state.phone.trim(),
          email: state.email.trim(),
          messenger: state.messenger,
          comment: state.comment.trim(),
          locale,
          consent: true,
        }),
      });

      if (!res.ok) throw new Error("API error");

      setRequestId(id);
      setStep(3);
    } catch {
      setError(c.errorSend);
    } finally {
      setSending(false);
    }
  }

  // ─── SUCCESS SCREEN ─────────────────────────────────────
  if (step === 3 && requestId) {
    return (
      <div className="mx-auto max-w-lg space-y-8 pt-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
          ✓
        </div>
        <h1 className="text-2xl font-semibold text-[var(--ink)]">{c.successTitle}</h1>
        <p className="text-sm leading-relaxed text-[var(--ink-muted)]">{c.successDesc}</p>

        <div className="rounded-2xl bg-[var(--bg-soft)] p-6">
          <p className="text-xs text-[var(--ink-muted)]">{c.requestId}</p>
          <p className="mt-1 font-mono text-2xl font-bold text-[var(--ink)]">{requestId}</p>
          <button
            type="button"
            onClick={() => navigator.clipboard?.writeText(requestId)}
            className="mt-2 text-xs text-[var(--accent)] hover:underline"
          >
            {c.copyId}
          </button>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href={toLocalePath(locale, "/instructors")}
            className="rounded-2xl border border-[var(--line)] px-6 py-3 text-sm text-[var(--ink)] transition hover:bg-[var(--bg-soft)]"
          >
            {c.backToInstructors}
          </Link>
          <Link
            href={toLocalePath(locale, "/")}
            className="rounded-2xl bg-[var(--ink)] px-6 py-3 text-sm text-white transition hover:bg-black"
          >
            {c.backToHome}
          </Link>
        </div>
      </div>
    );
  }

  // ─── FORM ───────────────────────────────────────────────
  return (
    <div className="grid gap-8 pt-6 lg:grid-cols-[1fr_340px]">
      {/* LEFT: Steps */}
      <div className="space-y-8">
        <h1 className="text-2xl font-semibold text-[var(--ink)] md:text-3xl">
          {c.title(instructorName)}
        </h1>

        <StepIndicator current={step} total={3} />

        {/* STEP 1: Lesson details */}
        {step === 0 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-[var(--ink)]">{c.step1}</h2>

            <div className="rounded-2xl border border-[var(--line)] p-5">
              <label className="text-sm text-[var(--ink-muted)]">{c.hours}</label>
              <div className="mt-2 flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => update("hours", Math.max(1, state.hours - 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--line)] text-lg transition hover:bg-[var(--bg-soft)]"
                >
                  −
                </button>
                <span className="w-8 text-center text-xl font-semibold text-[var(--ink)]">
                  {state.hours}
                </span>
                <button
                  type="button"
                  onClick={() => update("hours", Math.min(40, state.hours + 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--line)] text-lg transition hover:bg-[var(--bg-soft)]"
                >
                  +
                </button>
              </div>
              <p className="mt-2 text-xs text-[var(--ink-muted)]">{c.hoursNote}</p>
            </div>

            <div className="rounded-2xl border border-[var(--line)] p-5">
              <label className="text-sm text-[var(--ink-muted)]">{c.people}</label>
              <div className="mt-2 flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => update("people", Math.max(1, state.people - 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--line)] text-lg transition hover:bg-[var(--bg-soft)]"
                >
                  −
                </button>
                <span className="w-8 text-center text-xl font-semibold text-[var(--ink)]">
                  {state.people}
                </span>
                <button
                  type="button"
                  onClick={() => update("people", Math.min(10, state.people + 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--line)] text-lg transition hover:bg-[var(--bg-soft)]"
                >
                  +
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStep(1)}
              disabled={!canProceedStep1}
              className="w-full rounded-2xl bg-[var(--accent)] py-3.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-50"
            >
              {c.next}
            </button>
          </div>
        )}

        {/* STEP 2: Contact details */}
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-[var(--ink)]">{c.step2}</h2>

            <input
              type="text"
              placeholder={c.name}
              value={state.name}
              onChange={(e) => update("name", e.target.value)}
              className="w-full rounded-xl border border-[var(--line)] px-4 py-3 text-sm text-[var(--ink)] outline-none transition focus:border-[var(--accent)]"
            />
            <input
              type="tel"
              placeholder={c.phone}
              value={state.phone}
              onChange={(e) => update("phone", e.target.value)}
              className="w-full rounded-xl border border-[var(--line)] px-4 py-3 text-sm text-[var(--ink)] outline-none transition focus:border-[var(--accent)]"
            />
            <input
              type="email"
              placeholder={c.email}
              value={state.email}
              onChange={(e) => update("email", e.target.value)}
              className="w-full rounded-xl border border-[var(--line)] px-4 py-3 text-sm text-[var(--ink)] outline-none transition focus:border-[var(--accent)]"
            />
            <select
              value={state.messenger}
              onChange={(e) => update("messenger", e.target.value)}
              className="w-full rounded-xl border border-[var(--line)] px-4 py-3 text-sm text-[var(--ink)] outline-none transition focus:border-[var(--accent)]"
            >
              <option value="">{c.messenger}</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="telegram">Telegram</option>
              <option value="viber">Viber</option>
            </select>
            <textarea
              placeholder={c.comment}
              value={state.comment}
              onChange={(e) => update("comment", e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-[var(--line)] px-4 py-3 text-sm text-[var(--ink)] outline-none transition focus:border-[var(--accent)]"
            />

            <label className="flex items-start gap-3 text-sm text-[var(--ink-muted)]">
              <input
                type="checkbox"
                checked={state.consent}
                onChange={(e) => update("consent", e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded accent-[var(--accent)]"
              />
              {c.consent}
            </label>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(0)}
                className="flex-1 rounded-2xl border border-[var(--line)] py-3.5 text-sm font-medium text-[var(--ink)] transition hover:bg-[var(--bg-soft)]"
              >
                {c.back}
              </button>
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!canProceedStep2}
                className="flex-1 rounded-2xl bg-[var(--accent)] py-3.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-50"
              >
                {c.next}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Review + Submit */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-[var(--ink)]">{c.step3}</h2>

            <div className="space-y-3 rounded-2xl bg-[var(--bg-soft)] p-5 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--ink-muted)]">{c.instructor}</span>
                <span className="font-medium text-[var(--ink)]">{instructorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--ink-muted)]">{c.hours}</span>
                <span className="font-medium text-[var(--ink)]">{state.hours}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--ink-muted)]">{c.people}</span>
                <span className="font-medium text-[var(--ink)]">{state.people}</span>
              </div>
              <div className="flex justify-between border-t border-[var(--line)] pt-3">
                <span className="text-[var(--ink-muted)]">{c.totalPrice}</span>
                <span className="text-lg font-semibold text-[var(--ink)]">${totalPrice}</span>
              </div>
            </div>

            <div className="space-y-2 rounded-2xl bg-[var(--bg-soft)] p-5 text-sm">
              <p className="text-[var(--ink)]">
                <span className="text-[var(--ink-muted)]">{c.name}: </span>
                {state.name}
              </p>
              <p className="text-[var(--ink)]">
                <span className="text-[var(--ink-muted)]">{c.phone}: </span>
                {state.phone}
              </p>
              <p className="text-[var(--ink)]">
                <span className="text-[var(--ink-muted)]">{c.email}: </span>
                {state.email}
              </p>
              {state.messenger && (
                <p className="text-[var(--ink)]">
                  <span className="text-[var(--ink-muted)]">{c.messenger}: </span>
                  {state.messenger}
                </p>
              )}
              {state.comment && (
                <p className="text-[var(--ink)]">
                  <span className="text-[var(--ink-muted)]">{c.comment}: </span>
                  {state.comment}
                </p>
              )}
            </div>

            {error && (
              <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 rounded-2xl border border-[var(--line)] py-3.5 text-sm font-medium text-[var(--ink)] transition hover:bg-[var(--bg-soft)]"
              >
                {c.back}
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={sending}
                className="flex-1 rounded-2xl bg-[var(--accent)] py-3.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-50"
              >
                {sending ? c.sending : c.sendRequest}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT: Summary card */}
      <div className="hidden lg:block">
        <div className="sticky top-24 space-y-4 rounded-3xl border border-[var(--line)] bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-full">
              <Image
                src={imageUrl(instructorImage, 80, 80)}
                alt={instructorName}
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>
            <p className="text-sm font-medium text-[var(--ink)]">{instructorName}</p>
          </div>

          <div className="space-y-2 border-t border-[var(--line)] pt-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--ink-muted)]">{c.hours}</span>
              <span className="text-[var(--ink)]">{state.hours}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--ink-muted)]">{c.people}</span>
              <span className="text-[var(--ink)]">{state.people}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--ink-muted)]">
                ${pricePerHour}
                {c.perHour} × {state.hours}h × {state.people}
              </span>
            </div>
          </div>

          <div className="flex items-baseline justify-between border-t border-[var(--line)] pt-3">
            <span className="text-sm text-[var(--ink-muted)]">{c.totalPrice}</span>
            <span className="text-xl font-semibold text-[var(--ink)]">${totalPrice}</span>
          </div>

          {state.name && (
            <div className="border-t border-[var(--line)] pt-3 text-xs text-[var(--ink-muted)]">
              <p>{state.name}</p>
              {state.phone && <p>{state.phone}</p>}
              {state.email && <p>{state.email}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
