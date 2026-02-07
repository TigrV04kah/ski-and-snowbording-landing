"use client";

import { useMemo, useState } from "react";
import { Locale, Review } from "@/lib/types";
import { t } from "@/lib/i18n";

function formatReviewDate(value: string, locale: Locale) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(locale === "ru" ? "ru-RU" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function ReviewCarousel({ locale, reviews }: { locale: Locale; reviews: Review[] }) {
  const copy = t(locale);
  const [current, setCurrent] = useState(0);

  const safeReviews = useMemo(() => reviews.filter((item) => item.rating >= 1), [reviews]);

  if (safeReviews.length === 0) {
    return (
      <div className="space-y-4 rounded-3xl border border-[var(--line)] bg-white p-6">
        <h2 className="font-serif text-3xl">{copy.labels.reviews}</h2>
        <p className="text-sm text-[var(--ink-muted)]">{copy.labels.noReviews}</p>
      </div>
    );
  }

  const review = safeReviews[current];

  function previous() {
    setCurrent((prev) => (prev === 0 ? safeReviews.length - 1 : prev - 1));
  }

  function next() {
    setCurrent((prev) => (prev + 1) % safeReviews.length);
  }

  return (
    <div className="space-y-4 rounded-3xl border border-[var(--line)] bg-white p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-serif text-3xl">{copy.labels.reviews}</h2>
        <p className="text-xs text-[var(--ink-muted)]">
          {current + 1} / {safeReviews.length}
        </p>
      </div>

      <div className="space-y-3 rounded-2xl bg-[var(--bg-soft)] p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-[var(--ink)]">{review.author}</p>
          <p className="text-xs text-[var(--ink-muted)]">{formatReviewDate(review.date, locale)}</p>
        </div>

        <div className="text-base text-amber-500" aria-label={`rating-${review.rating}`}>
          {Array.from({ length: 5 }, (_, index) => (index < review.rating ? "★" : "☆")).join(" ")}
        </div>

        <p className="text-sm text-[var(--ink-muted)]">{review.text}</p>

        {review.verified ? (
          <p className="text-xs font-medium text-[var(--accent)]">{copy.labels.verified}</p>
        ) : null}
      </div>

      {safeReviews.length > 1 ? (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={previous}
            className="rounded-full border border-[var(--line)] px-4 py-2 text-sm"
          >
            {copy.labels.previousReview}
          </button>
          <button
            type="button"
            onClick={next}
            className="rounded-full border border-[var(--line)] px-4 py-2 text-sm"
          >
            {copy.labels.nextReview}
          </button>
        </div>
      ) : null}
    </div>
  );
}
