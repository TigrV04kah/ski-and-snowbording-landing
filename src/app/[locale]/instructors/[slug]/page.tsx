import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookingCard } from "@/components/booking-card";
import { FaqRow } from "@/components/faq-row";
import { JsonLd } from "@/components/json-ld";
import { ViewTracker } from "@/components/view-tracker";
import {
  getFaqItems,
  getInstructorBySlug,
  getInstructorReviews,
  getInstructors,
} from "@/lib/cms";
import { formatDiscipline, formatLevel, isLocale, toLocalePath } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { imageUrl } from "@/lib/sanity/image";
import { Locale, Review } from "@/lib/types";
import { ArticleRichContent } from "@/components/article-rich-content";

/* ─── i18n copy ─────────────────────────────────────────── */

const pageCopy = {
  ru: {
    back: "← Назад",
    roleLabel: "инструктор",
    reviews: "отзывов",
    specLabel: "Специализация",
    langLabel: "Язык",
    expLabel: "Опыт",
    certLabel: "Сертификат",
    certValue: "Проверенный инструктор",
    yearsShort: (n: number) => `${n}+ лет`,
    aboutTitle: "About",
    reviewsTitle: (avg: string, count: number) => `★ ${avg} · ${count} отзывов`,
    mediaTitle: "Media",
    mediaFilters: ["Все", "Отзывы", "Видео"],
    faqEyebrow: "Часто задаваемые вопросы",
    faqTitle: "FAQ",
    bookingTitle: "Забронировать",
    lessonHours: "Часов занятий",
    people: "Кол-во людей",
    startBooking: "Начать бронирование",
    hoursNote: "Часы можно разбить по дням",
    datesNote: "Даты и слоты выберете на следующем шаге",
    perLesson: "/урок",
  },
  en: {
    back: "← Back",
    roleLabel: "instructor",
    reviews: "reviews",
    specLabel: "Specialization",
    langLabel: "Language",
    expLabel: "Experience",
    certLabel: "Certificate",
    certValue: "Verified instructor",
    yearsShort: (n: number) => `${n}+ years`,
    aboutTitle: "About",
    reviewsTitle: (avg: string, count: number) => `★ ${avg} · ${count} reviews`,
    mediaTitle: "Media",
    mediaFilters: ["All", "Reviews", "Video"],
    faqEyebrow: "Frequently Asked Questions",
    faqTitle: "FAQ",
    bookingTitle: "Book a lesson",
    lessonHours: "Total lesson hours",
    people: "Number of people",
    startBooking: "Start booking",
    hoursNote: "Hours can be split across days",
    datesNote: "Dates and slots chosen on the next step",
    perLesson: "/lesson",
  },
} as const;

/* ─── helpers ───────────────────────────────────────────── */

function renderStars(rating: number) {
  const safe = Math.max(1, Math.round(rating || 5));
  return Array.from({ length: 5 }, (_, i) => (i < safe ? "★" : "☆")).join("");
}

function avgRating(reviews: Review[]): number {
  if (reviews.length === 0) return 5;
  return reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
}

/* ─── static params + metadata ──────────────────────────── */

export async function generateStaticParams() {
  const [ru, en] = await Promise.all([getInstructors("ru"), getInstructors("en")]);
  const slugs = new Set([...ru.map((i) => i.slug), ...en.map((i) => i.slug)]);
  return ["ru", "en"].flatMap((locale) =>
    Array.from(slugs).map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : "ru";
  const instructor = await getInstructorBySlug(locale, slug);
  if (!instructor) {
    return buildMetadata({ locale, title: "Not found", description: "", path: "/instructors" });
  }
  return buildMetadata({
    locale,
    title: `${instructor.name} — My Gudauri`,
    description: instructor.shortDescription,
    path: `/instructors/${slug}`,
  });
}

/* ─── page ──────────────────────────────────────────────── */

export default async function InstructorProfilePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "ru";
  const c = pageCopy[locale];

  const [instructor, reviews, faqItems] = await Promise.all([
    getInstructorBySlug(locale, slug),
    getInstructorReviews(locale, slug),
    getFaqItems(locale),
  ]);

  if (!instructor) notFound();

  const avg = avgRating(reviews);
  const price = instructor.priceFrom ?? 45;
  const gallery = (instructor.gallery ?? []) as unknown[];

  return (
    <div className="pb-20 md:pb-24">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: instructor.name,
          description: instructor.shortDescription,
          jobTitle: "Ski/Snowboard Instructor",
          address: { "@type": "PostalAddress", addressLocality: "Gudauri", addressCountry: "GE" },
        }}
      />
      <ViewTracker
        event="view_profile"
        params={{ type: "instructor", locale, slug: instructor.slug }}
      />

      {/* ROW 1: Name (left) + Photo 515×515 (right) */}
      <section className="pt-6">
        <div className="grid gap-8 lg:grid-cols-[1fr_515px]">
          <div className="flex flex-col">
            <Link
              href={toLocalePath(locale, "/instructors")}
              className="inline-flex w-fit items-center rounded-full border border-[var(--line)] px-4 py-1.5 text-sm text-[var(--ink-muted)] transition hover:border-[var(--ink)] hover:text-[var(--ink)]"
            >
              {c.back}
            </Link>

            <div className="mt-6 flex flex-wrap gap-2">
              {instructor.discipline.map((d) => (
                <span
                  key={d}
                  className="rounded-full bg-[var(--bg-soft)] px-3 py-1 text-xs font-medium text-[var(--ink)]"
                >
                  {formatDiscipline(locale, d)}
                </span>
              ))}
              <span className="rounded-full bg-[var(--bg-soft)] px-3 py-1 text-xs text-[var(--ink-muted)]">
                {c.roleLabel}
              </span>
            </div>

            <h1
              style={{
                fontSize: "clamp(2.5rem, 7vw, 5.5rem)",
                lineHeight: 0.92,
                letterSpacing: "-0.04em",
                fontWeight: 400,
                marginTop: "0.75rem",
              }}
              className="font-sans uppercase text-[var(--ink)]"
            >
              {instructor.name}
            </h1>

            <div className="mt-3 flex items-center gap-2 text-sm text-[var(--ink-muted)]">
              <span className="text-base tracking-[0.06em] text-[var(--accent)]">
                {renderStars(avg)}
              </span>
              <span className="font-medium text-[var(--ink)]">{avg.toFixed(1)}</span>
              <span>·</span>
              <span>
                {reviews.length} {c.reviews}
              </span>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 border-y border-[var(--line)] py-5 md:grid-cols-4">
              <div>
                <p className="text-xs text-[var(--ink-muted)]">{c.specLabel}</p>
                <p className="mt-1 text-sm font-medium text-[var(--ink)]">
                  {instructor.discipline.map((d) => formatDiscipline(locale, d)).join(", ")}
                </p>
              </div>
              <div>
                <p className="text-xs text-[var(--ink-muted)]">{c.langLabel}</p>
                <p className="mt-1 text-sm font-medium text-[var(--ink)]">
                  {instructor.languages.map((l) => l.toUpperCase()).join(", ")}
                </p>
              </div>
              <div>
                <p className="text-xs text-[var(--ink-muted)]">{c.expLabel}</p>
                <p className="mt-1 text-sm font-medium text-[var(--ink)]">
                  {c.yearsShort(instructor.experienceYears)}
                </p>
              </div>
              <div>
                <p className="text-xs text-[var(--ink-muted)]">{c.certLabel}</p>
                <p className="mt-1 text-sm font-medium text-[var(--ink)]">{c.certValue}</p>
              </div>
            </div>
          </div>

          <div className="relative aspect-square w-full max-w-[515px] overflow-hidden rounded-3xl">
            <Image
              src={imageUrl(instructor.coverImage, 1030, 1030)}
              alt={instructor.name}
              fill
              priority
              sizes="515px"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* ROW 2: Content 70% (left) + Sticky booking card 30% (right) */}
      <div className="mt-12 gap-8 lg:grid lg:grid-cols-[7fr_3fr]">
        {/* LEFT COLUMN */}
        <div className="space-y-16">
          {/* About */}
          <section>
            <h2 className="text-xl font-semibold text-[var(--ink)]">{c.aboutTitle}</h2>
            <div className="mt-4 text-[0.95rem] leading-7 text-[var(--ink-muted)]">
              <ArticleRichContent
                content={instructor.fullDescriptionRich ?? instructor.fullDescription}
              />
            </div>
          </section>

          {/* Expertise Tags */}
          <section>
            <div className="flex flex-wrap gap-2">
              {instructor.level.map((lvl) => (
                <span
                  key={lvl}
                  className="rounded-full border border-[var(--line)] px-4 py-2 text-sm text-[var(--ink)]"
                >
                  {formatLevel(locale, lvl)}
                </span>
              ))}
              {instructor.format.map((f) => (
                <span
                  key={f}
                  className="rounded-full border border-[var(--line)] px-4 py-2 text-sm text-[var(--ink)]"
                >
                  {f === "individual"
                    ? locale === "ru"
                      ? "Индивидуальные"
                      : "Individual"
                    : locale === "ru"
                      ? "Групповые"
                      : "Group"}
                </span>
              ))}
            </div>
          </section>

          {/* Reviews */}
          {reviews.length > 0 && (
            <section className="space-y-6">
              <h2 className="text-xl font-semibold text-[var(--ink)]">
                {c.reviewsTitle(avg.toFixed(1), reviews.length)}
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {reviews.slice(0, 6).map((review) => (
                  <div
                    key={review.id}
                    className="rounded-2xl bg-[var(--bg-soft)] p-5 text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--ink)] text-xs font-semibold text-white">
                        {review.author.charAt(0)}
                      </span>
                      <div>
                        <p className="font-medium text-[var(--ink)]">{review.author}</p>
                        <p className="text-xs text-[var(--ink-muted)]">
                          {new Date(review.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p className="mt-3 leading-relaxed text-[var(--ink-muted)]">
                      {review.text}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>

        {/* RIGHT COLUMN: Sticky booking card */}
        <div className="mt-10 lg:mt-0">
          <div className="sticky top-24">
            <BookingCard
              locale={locale}
              instructorSlug={instructor.slug}
              instructorName={instructor.name}
              instructorImage={instructor.coverImage}
              rating={avg}
              reviewCount={reviews.length}
              pricePerHour={price}
            />
          </div>
        </div>
      </div>

      {/* ROW 3: Media gallery (full width) */}
      <section className="mt-16 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[var(--ink)]">{c.mediaTitle}</h2>
          <div className="flex gap-2">
            {c.mediaFilters.map((filter, i) => (
              <span
                key={filter}
                className={`rounded-full px-3 py-1 text-xs ${
                  i === 0
                    ? "bg-[var(--ink)] text-white"
                    : "border border-[var(--line)] text-[var(--ink-muted)]"
                }`}
              >
                {filter}
              </span>
            ))}
          </div>
        </div>

        {gallery.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {(gallery as { asset?: unknown }[]).map((img, i) => (
              <div
                key={`gallery-${i}`}
                className="relative aspect-square overflow-hidden rounded-2xl"
              >
                <Image
                  src={imageUrl(img, 400, 400)}
                  alt={`${instructor.name} photo ${i + 1}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }, (_, i) => (
              <div
                key={`placeholder-${i}`}
                className="aspect-square rounded-2xl bg-[var(--bg-soft)]"
              />
            ))}
          </div>
        )}
      </section>

      {/* FAQ */}
      <section className="mt-20 grid gap-10 md:mt-24 xl:grid-cols-[0.6fr_1.4fr]">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink-muted)]">
            {c.faqEyebrow}
          </p>
          <h2 className="font-sans text-[4rem] leading-[0.94] tracking-[-0.06em] text-[var(--ink)] md:text-[5.5rem]">
            {c.faqTitle}
          </h2>
        </div>
        <div className="space-y-3">
          {faqItems.map((item, index) => (
            <FaqRow key={item.id} item={item} defaultOpen={index === 0} />
          ))}
        </div>
      </section>
    </div>
  );
}
