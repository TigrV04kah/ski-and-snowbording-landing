"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { imageUrl } from "@/lib/sanity/image";
import { toLocalePath } from "@/lib/i18n";
import { Locale } from "@/lib/types";

const copy = {
  ru: {
    lessonHours: "Часов занятий",
    people: "Кол-во людей",
    startBooking: "Начать бронирование",
    hoursNote: "Часы можно разбить по дням",
    datesNote: "Даты и слоты выберете на следующем шаге",
    perLesson: "/урок",
    reviews: "отзывов",
    total: "Итого",
  },
  en: {
    lessonHours: "Total lesson hours",
    people: "Number of people",
    startBooking: "Start booking",
    hoursNote: "Hours can be split across days",
    datesNote: "Dates and slots chosen on the next step",
    perLesson: "/lesson",
    reviews: "reviews",
    total: "Total",
  },
} as const;

function renderStars(rating: number) {
  const safe = Math.max(1, Math.round(rating || 5));
  return Array.from({ length: 5 }, (_, i) => (i < safe ? "★" : "☆")).join("");
}

export function BookingCard({
  locale,
  instructorSlug,
  instructorName,
  instructorImage,
  rating,
  reviewCount,
  pricePerHour,
}: {
  locale: Locale;
  instructorSlug: string;
  instructorName: string;
  instructorImage: unknown;
  rating: number;
  reviewCount: number;
  pricePerHour: number;
}) {
  const [hours, setHours] = useState(2);
  const [people, setPeople] = useState(1);
  const c = copy[locale];
  const totalPrice = hours * people * pricePerHour;

  return (
    <div className="space-y-4 rounded-3xl border border-[var(--line)] bg-white p-5">
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
        <div>
          <p className="text-sm font-medium text-[var(--ink)]">{instructorName}</p>
          <p className="text-xs text-[var(--ink-muted)]">
            {renderStars(rating)} {rating.toFixed(1)} · {reviewCount} {c.reviews}
          </p>
        </div>
      </div>

      <div style={{ fontSize: "1.8rem", fontWeight: 600, letterSpacing: "-0.02em" }}>
        <span className="text-[var(--accent)]">${pricePerHour}</span>
        <span className="text-sm font-normal text-[var(--ink-muted)]">{c.perLesson}</span>
      </div>

      {/* Hours selector */}
      <div className="rounded-xl border border-[var(--line)] px-4 py-3">
        <p className="text-[0.7rem] text-[var(--ink-muted)]">{c.lessonHours}</p>
        <div className="mt-1 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setHours(Math.max(1, hours - 1))}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--line)] text-sm text-[var(--ink)] transition hover:bg-[var(--bg-soft)]"
          >
            −
          </button>
          <span className="text-sm font-semibold text-[var(--ink)]">{hours}</span>
          <button
            type="button"
            onClick={() => setHours(Math.min(40, hours + 1))}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--line)] text-sm text-[var(--ink)] transition hover:bg-[var(--bg-soft)]"
          >
            +
          </button>
        </div>
      </div>

      {/* People selector */}
      <div className="rounded-xl border border-[var(--line)] px-4 py-3">
        <p className="text-[0.7rem] text-[var(--ink-muted)]">{c.people}</p>
        <div className="mt-1 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setPeople(Math.max(1, people - 1))}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--line)] text-sm text-[var(--ink)] transition hover:bg-[var(--bg-soft)]"
          >
            −
          </button>
          <span className="text-sm font-semibold text-[var(--ink)]">{people}</span>
          <button
            type="button"
            onClick={() => setPeople(Math.min(10, people + 1))}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--line)] text-sm text-[var(--ink)] transition hover:bg-[var(--bg-soft)]"
          >
            +
          </button>
        </div>
      </div>

      {/* Total */}
      <div className="flex items-baseline justify-between border-t border-[var(--line)] pt-3">
        <span className="text-sm text-[var(--ink-muted)]">{c.total}</span>
        <span className="text-xl font-semibold text-[var(--ink)]">${totalPrice}</span>
      </div>

      {/* CTA */}
      <Link
        href={toLocalePath(locale, `/booking/${instructorSlug}`)}
        className="block w-full rounded-2xl bg-[var(--accent)] py-3.5 text-center text-sm font-semibold text-white transition hover:brightness-110"
      >
        {c.startBooking}
      </Link>

      <p className="text-center text-[0.65rem] leading-relaxed text-[var(--ink-muted)]">
        {c.hoursNote}
        <br />
        {c.datesNote}
      </p>
    </div>
  );
}
