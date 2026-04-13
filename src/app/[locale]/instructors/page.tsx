import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { FaqRow } from "@/components/faq-row";
import { InstructorFilters } from "@/components/instructor-filters";
import { ViewTracker } from "@/components/view-tracker";
import { getFaqItems, getInstructors, getInstructorReviews, getSiteSettings } from "@/lib/cms";
import { filterInstructors, toStringRecord } from "@/lib/filters";
import { formatDiscipline, formatLevel, isLocale, toLocalePath } from "@/lib/i18n";
import { buildMetadata, hasFilterParams } from "@/lib/seo";
import { imageUrl } from "@/lib/sanity/image";
import { Instructor, Locale } from "@/lib/types";

/* ─── i18n copy ─────────────────────────────────────────── */

const copy = {
  ru: {
    subtitle: "Единый тариф для всех инструкторов",
    perHour: "/ч",
    calculateCta: "Рассчитать стоимость",
    filterDiscipline: "Направление",
    filterLevel: "Уровень",
    instructorsCount: (n: number) =>
      `${n} ${n === 1 ? "инструктор" : n < 5 ? "инструктора" : "инструкторов"}`,
    reviewLabel: "отзывов",
    trustEyebrow: "Почему My Gudauri",
    trustTitle: "Почему выбирают My Gudauri инструкторов",
    trust: [
      {
        icon: "/home/verified-professionals.png",
        title: "Проверенные профессионалы",
        desc: "Все инструкторы проходят проверку перед добавлением на платформу.",
      },
      {
        icon: "/home/transparent-pricing.png",
        title: "Прозрачное ценообразование",
        desc: "Единая официальная цена для всех. Без скрытых наценок.",
      },
      {
        icon: "/home/real-profiles.png",
        title: "Реальные профили",
        desc: "Фото, языки, отзывы, стиль обучения.",
      },
      {
        icon: "/home/flexible-scheduling.png",
        title: "Гибкое расписание",
        desc: "Распределяйте часы между днями так, как вам удобно.",
      },
    ],
    bookingEyebrow: "5 шагов до бронирования инструктора",
    bookingTitle: "Как работает бронирование",
    stepLabel: "Шаг",
    bookingSteps: [
      {
        title: "Выберите инструктора",
        desc: "Изучите профили, опыт, отзывы и языки. Найдите того, кто вам подходит и нажмите «Забронировать».",
      },
      {
        title: "Отправьте детали урока",
        desc: "Выберите удобные даты, количество часов, число участников и любые особые пожелания.",
      },
      {
        title: "Заявка получена",
        desc: "Вы увидите экран подтверждения с номером заявки. Можно не оставаться на странице — мы свяжемся.",
      },
      {
        title: "Согласование расписания",
        desc: "Менеджер свяжется через WhatsApp, чтобы уточнить доступность инструктора и финализировать детали.",
      },
      {
        title: "Безопасная оплата и подтверждение",
        desc: "Получите email с деталями заявки и защищённой ссылкой на оплату. После оплаты бронь подтверждена.",
      },
    ],
    faqEyebrow: "Часто задаваемые вопросы",
    faqTitle: "FAQ",
    noResults: "По выбранным фильтрам ничего не найдено.",
  },
  en: {
    subtitle: "Single rate for all instructors",
    perHour: "/h",
    calculateCta: "Calculate the cost",
    filterDiscipline: "Discipline",
    filterLevel: "Level",
    instructorsCount: (n: number) =>
      `${n} instructor${n !== 1 ? "s" : ""}`,
    reviewLabel: "reviews",
    trustEyebrow: "Why My Gudauri",
    trustTitle: "Why choose My Gudauri instructors",
    trust: [
      {
        icon: "/home/verified-professionals.png",
        title: "Verified professionals",
        desc: "All instructors are reviewed before joining the platform.",
      },
      {
        icon: "/home/transparent-pricing.png",
        title: "Transparent pricing",
        desc: "Same official rate for everyone. No hidden markups.",
      },
      {
        icon: "/home/real-profiles.png",
        title: "Real profiles",
        desc: "Photos, languages, reviews, teaching style.",
      },
      {
        icon: "/home/flexible-scheduling.png",
        title: "Flexible scheduling",
        desc: "Split your hours across days in a way that suits you.",
      },
    ],
    bookingEyebrow: "5 steps to book an instructor",
    bookingTitle: "How booking works",
    stepLabel: "Step",
    bookingSteps: [
      {
        title: "Choose your instructor",
        desc: "Browse profiles, experience, reviews and languages. Find the one who suits you and click Book now.",
      },
      {
        title: "Submit your lesson details",
        desc: "Choose your preferred dates, total lesson hours, number of participants and any special requests.",
      },
      {
        title: "Request received",
        desc: "You will see a confirmation screen with your booking number. There's no need to stay on the page — we take it from here.",
      },
      {
        title: "Schedule coordination",
        desc: "Our booking manager contacts you via WhatsApp to confirm the instructor's availability and finalize details.",
      },
      {
        title: "Secure payment and confirmation",
        desc: "You receive an email with your booking details and a secure payment link. Once paid, your booking is officially confirmed.",
      },
    ],
    faqEyebrow: "Frequently Asked Questions",
    faqTitle: "FAQ",
    noResults: "No instructors match the selected filters.",
  },
} as const;

/* ─── helpers ───────────────────────────────────────────── */

function renderRatingStars(rating: number) {
  const safe = Math.max(1, Math.round(rating || 5));
  return Array.from({ length: 5 }, (_, i) => (i < safe ? "★" : "☆")).join("");
}

function averageRating(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((s, v) => s + v, 0) / values.length;
}

function formatLanguagePill(value: string) {
  const n = value.toLowerCase();
  if (n === "ru") return "Ru";
  if (n === "en") return "En";
  if (n === "ka") return "Ge";
  if (n === "de") return "De";
  return n.slice(0, 2).replace(/^\w/, (c) => c.toUpperCase());
}

/* ─── sub-components ────────────────────────────────────── */

function InstructorCard({
  locale,
  instructor,
  reviewCount,
  reviewAverage,
  reviewLabel,
}: {
  locale: Locale;
  instructor: Instructor;
  reviewCount: number;
  reviewAverage: number;
  reviewLabel: string;
}) {
  const avg = reviewCount > 0 ? reviewAverage : 5;

  return (
    <Link
      href={toLocalePath(locale, `/instructors/${instructor.slug}`)}
      className="group block overflow-hidden rounded-3xl bg-[var(--bg-card)] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04),0_12px_32px_-20px_rgba(0,0,0,0.12)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_10px_-2px_rgba(0,0,0,0.05),0_18px_40px_-20px_rgba(0,0,0,0.18)]"
    >
      <div className="relative aspect-[1.05] overflow-hidden rounded-t-3xl">
        <Image
          src={imageUrl(instructor.coverImage, 600, 600)}
          alt={instructor.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 top-3 flex gap-1.5 px-3">
          {instructor.languages.slice(0, 2).map((lang) => (
            <span
              key={`${instructor.slug}-${lang}`}
              className="rounded-full bg-white/95 px-2.5 py-1 text-[0.7rem] font-medium text-[var(--ink)] shadow-sm"
            >
              {formatLanguagePill(lang)}
            </span>
          ))}
        </div>
        <div className="absolute inset-x-0 bottom-3 flex flex-wrap gap-1.5 px-3">
          {instructor.discipline.slice(0, 2).map((d) => (
            <span
              key={`${instructor.slug}-${d}`}
              className="rounded-full bg-white/95 px-2.5 py-1 text-[0.7rem] font-medium text-[var(--ink)] shadow-sm"
            >
              {formatDiscipline(locale, d)}
            </span>
          ))}
        </div>
      </div>
      <div className="space-y-1 p-4">
        <h3 className="font-sans text-[1.15rem] leading-tight tracking-[-0.02em] text-[var(--ink)]">
          {instructor.name}
        </h3>
        <div className="flex items-center gap-1.5 text-xs text-[var(--ink-muted)]">
          <span className="text-[0.85rem] tracking-[0.06em] text-[var(--accent)]">
            {renderRatingStars(avg)}
          </span>
          <span className="font-medium text-[var(--ink)]">{avg.toFixed(1)}</span>
          <span>·</span>
          <span>
            {reviewCount} {reviewLabel}
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ─── metadata ──────────────────────────────────────────── */

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const [{ locale: rawLocale }, query] = await Promise.all([params, searchParams]);
  const locale = isLocale(rawLocale) ? rawLocale : "ru";
  return buildMetadata({
    locale,
    title: locale === "ru" ? "Инструкторы в Гудаури" : "Instructors in Gudauri",
    description:
      locale === "ru"
        ? "Лыжи и сноуборд: индивидуальные и групповые занятия в Гудаури."
        : "Ski and snowboard lessons in Gudauri: private and group formats.",
    path: "/instructors",
    noindex: hasFilterParams(query),
  });
}

/* ─── page ──────────────────────────────────────────────── */

export default async function InstructorsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ locale: rawLocale }, rawFilters] = await Promise.all([params, searchParams]);
  const locale = isLocale(rawLocale) ? rawLocale : "ru";
  const pageCopy = copy[locale];

  const [instructors, settings, faqItems] = await Promise.all([
    getInstructors(locale),
    getSiteSettings(locale),
    getFaqItems(locale),
  ]);

  const filters = toStringRecord(rawFilters);
  const filtered = filterInstructors(instructors, filters);

  const reviewStats = await Promise.all(
    filtered.map(async (inst) => {
      const reviews = await getInstructorReviews(locale, inst.slug);
      return {
        slug: inst.slug,
        count: reviews.length,
        average: averageRating(reviews.map((r) => r.rating)),
      };
    }),
  );
  const reviewMap = new Map(reviewStats.map((s) => [s.slug, s]));

  const hourlyRate = settings.hourlyRate ?? 45;

  return (
    <div className="pb-20 md:pb-24">
      <ViewTracker event="view_catalog" params={{ type: "instructors", locale }} />

      {/* TITLE */}
      <section className="pt-10 text-center md:pt-14">
        <h1
          style={{
            fontSize: "clamp(2.5rem, 7vw, 6rem)",
            lineHeight: 0.92,
            letterSpacing: "-0.04em",
            fontWeight: 400,
          }}
          className="font-sans text-[var(--ink)]"
        >
          INSTRUCTORS
        </h1>
      </section>

      {/* PRICING BANNER */}
      <section className="mt-8 overflow-hidden rounded-2xl bg-[var(--ink)] px-6 py-5 text-white md:flex md:items-center md:justify-between md:px-8">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/30 text-sm">
            i
          </span>
          <div>
            <p className="text-base font-medium">
              {pageCopy.subtitle}
              <span className="ml-3 inline-block rounded-lg bg-white/15 px-3 py-1 text-lg font-semibold">
                ${hourlyRate}
                <span className="text-sm font-normal opacity-70">{pageCopy.perHour}</span>
              </span>
            </p>
            <p className="mt-0.5 text-xs text-white/60">
              {locale === "ru"
                ? "Чем больше часов, тем дешевле урок"
                : "The more hours you take, the cheaper it gets"}
            </p>
          </div>
        </div>
        <button
          type="button"
          className="mt-4 rounded-xl border border-white/30 px-5 py-2 text-sm font-medium transition hover:bg-white/10 md:mt-0"
        >
          {pageCopy.calculateCta}
        </button>
      </section>

      {/* FILTERS + COUNT */}
      <section className="mt-8">
        <InstructorFilters
          filters={[
            {
              key: "discipline",
              label: pageCopy.filterDiscipline,
              options: [
                { value: "ski", label: formatDiscipline(locale, "ski") },
                { value: "snowboard", label: formatDiscipline(locale, "snowboard") },
              ],
            },
            {
              key: "level",
              label: pageCopy.filterLevel,
              options: [
                { value: "beginner", label: formatLevel(locale, "beginner") },
                { value: "intermediate", label: formatLevel(locale, "intermediate") },
                { value: "advanced", label: formatLevel(locale, "advanced") },
              ],
            },
          ]}
          countLabel={pageCopy.instructorsCount(filtered.length)}
        />
      </section>

      {/* INSTRUCTOR GRID */}
      <section className="mt-6">
        {filtered.length === 0 ? (
          <p className="rounded-2xl border border-[var(--line)] bg-white p-6 text-sm text-[var(--ink-muted)]">
            {pageCopy.noResults}
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {filtered.map((inst) => {
              const stats = reviewMap.get(inst.slug);
              return (
                <InstructorCard
                  key={inst.id}
                  locale={locale}
                  instructor={inst}
                  reviewCount={stats?.count ?? 0}
                  reviewAverage={stats?.average ?? 0}
                  reviewLabel={pageCopy.reviewLabel}
                />
              );
            })}
          </div>
        )}
      </section>

      {/* WHY CHOOSE */}
      <section className="mt-20 space-y-8 md:mt-24">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink-muted)]">
            {pageCopy.trustEyebrow}
          </p>
          <h2
            style={{
              fontSize: "clamp(1.8rem, 4vw, 3rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
            }}
            className="font-sans text-[var(--ink)]"
          >
            {pageCopy.trustTitle}
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {pageCopy.trust.map((item) => (
            <div
              key={item.title}
              className="space-y-3 rounded-3xl bg-[var(--bg-soft)] p-6"
            >
              <Image
                src={item.icon}
                alt={item.title}
                width={39}
                height={39}
                className="h-[39px] w-[39px]"
              />
              <h3 className="text-lg font-semibold text-[var(--ink)]">{item.title}</h3>
              <p className="text-sm leading-relaxed text-[var(--ink-muted)]">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW BOOKING WORKS */}
      <section className="mt-20 space-y-8 md:mt-24">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink-muted)]">
            {pageCopy.bookingEyebrow}
          </p>
          <h2
            style={{
              fontSize: "clamp(1.8rem, 4vw, 3rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
            }}
            className="font-sans text-[var(--ink)]"
          >
            {pageCopy.bookingTitle}
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {pageCopy.bookingSteps.map((step, i) => (
            <div
              key={step.title}
              className="space-y-4 rounded-3xl border border-[var(--line)] bg-white p-6"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent)] px-3 py-1 text-xs font-semibold text-white">
                  <span>{i + 1}</span>
                  <span className="opacity-80">{pageCopy.stepLabel}</span>
                </span>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[var(--ink)]">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--ink-muted)]">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-20 grid gap-10 md:mt-24 xl:grid-cols-[0.6fr_1.4fr]">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink-muted)]">
            {pageCopy.faqEyebrow}
          </p>
          <h2 className="font-sans text-[4rem] leading-[0.94] tracking-[-0.06em] text-[var(--ink)] md:text-[5.5rem]">
            {pageCopy.faqTitle}
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
