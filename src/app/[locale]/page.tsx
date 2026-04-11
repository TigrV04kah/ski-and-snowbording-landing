import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { getCategoryPages, getHomeData, getInstructorReviews } from "@/lib/cms";
import { formatDiscipline, isLocale, toLocalePath } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { imageUrl } from "@/lib/sanity/image";
import { CategoryKind, CategoryPage, Instructor, Locale } from "@/lib/types";

interface HomeCategoryCard {
  key: string;
  title: string;
  description: string;
  href: string;
  tags: string[];
  className: string;
  imageSrc: string;
  imageAlt: string;
  imageWrapperClassName: string;
  imageClassName: string;
}

interface FaqEntry {
  question: string;
  answer: string;
}

// Bento layout — approximate positions matching the Figma design.
// 12-column grid, rows are fluid. Heights follow the content of each cell.
const cardLayouts: Record<CategoryKind, string> = {
  instructors: "xl:col-span-4 xl:row-span-2",
  tours: "xl:col-span-4",
  rental: "xl:col-span-4",
  places: "xl:col-span-5",
  services: "xl:col-span-3 xl:row-span-2",
  transfer: "xl:col-span-5",
  "real-estate": "xl:col-span-4",
};

const categoryVisuals: Record<
  CategoryKind,
  Pick<HomeCategoryCard, "imageSrc" | "imageAlt" | "imageWrapperClassName" | "imageClassName">
> = {
  instructors: {
    imageSrc: "/home/instructors.png",
    imageAlt: "Snowboard instructor on a slope",
    imageWrapperClassName: "bottom-0 right-2 h-[78%] w-[50%]",
    imageClassName: "object-contain object-bottom",
  },
  tours: {
    imageSrc: "/home/tours.png",
    imageAlt: "Backcountry skiers in Gudauri",
    imageWrapperClassName: "bottom-0 right-0 h-[64%] w-[58%]",
    imageClassName: "object-contain object-right-bottom",
  },
  rental: {
    imageSrc: "/home/rental.png",
    imageAlt: "Rental gear",
    imageWrapperClassName: "right-2 top-2 h-[84%] w-[48%]",
    imageClassName: "object-contain object-right",
  },
  places: {
    imageSrc: "/home/places.png",
    imageAlt: "Mountain chalet in Gudauri",
    imageWrapperClassName: "bottom-2 right-2 h-[72%] w-[52%]",
    imageClassName: "object-contain object-right-bottom",
  },
  services: {
    imageSrc: "/home/services.png",
    imageAlt: "Photographer shooting on the slopes",
    imageWrapperClassName: "bottom-0 right-0 h-[82%] w-[70%]",
    imageClassName: "object-contain object-right-bottom",
  },
  transfer: {
    imageSrc: "/home/transfer.png",
    imageAlt: "Transfer van",
    imageWrapperClassName: "bottom-0 right-0 h-[72%] w-[62%]",
    imageClassName: "object-contain object-right-bottom",
  },
  "real-estate": {
    imageSrc: "/home/places.png",
    imageAlt: "Apartment with a mountain view",
    imageWrapperClassName: "bottom-0 right-0 h-[70%] w-[54%]",
    imageClassName: "object-contain object-right-bottom",
  },
};

const fallbackCategoryContent: Record<
  Locale,
  Array<Pick<CategoryPage, "slug" | "kind" | "title" | "description" | "tags">>
> = {
  ru: [
    {
      slug: "instructors",
      kind: "instructors",
      title: "Instructors",
      description: "Проверенные лыжные и сноуборд инструкторы под твой уровень.",
      tags: ["ski", "snowboard"],
    },
    {
      slug: "tours",
      kind: "tours",
      title: "Tours",
      description: "Фрирайд, маршруты и сопровождение по Гудаури.",
      tags: ["Freeride", "Ski tour"],
    },
    {
      slug: "rental",
      kind: "rental",
      title: "Rental",
      description: "Прокат досок, лыж и защиты.",
      tags: ["ski", "snowboard"],
    },
    {
      slug: "places",
      kind: "places",
      title: "Places",
      description: "Места для еды и красивых остановок после катания.",
      tags: ["Bars", "Restaurants"],
    },
    {
      slug: "services",
      kind: "services",
      title: "Services",
      description: "Фото, видео и семейные сервисы на курорте.",
      tags: ["Nannies", "Foto", "Video"],
    },
    {
      slug: "transfer",
      kind: "transfer",
      title: "Transfer",
      description: "Трансферы в Гудаури и обратно.",
      tags: ["Batumi - Gudauri", "Tbilisi - Gudauri"],
    },
    {
      slug: "real-estate",
      kind: "real-estate",
      title: "Real estate",
      description: "Апартаменты и шале рядом со склонами.",
      tags: ["Apartments"],
    },
  ],
  en: [
    {
      slug: "instructors",
      kind: "instructors",
      title: "Instructors",
      description: "Verified ski and snowboard coaches matched to your level.",
      tags: ["ski", "snowboard"],
    },
    {
      slug: "tours",
      kind: "tours",
      title: "Tours",
      description: "Freeride guiding and curated mountain routes.",
      tags: ["Freeride", "Ski tour"],
    },
    {
      slug: "rental",
      kind: "rental",
      title: "Rental",
      description: "Rent boards, skis and protection.",
      tags: ["ski", "snowboard"],
    },
    {
      slug: "places",
      kind: "places",
      title: "Places",
      description: "The best spots for food and après-ski downtime.",
      tags: ["Bars", "Restaurants"],
    },
    {
      slug: "services",
      kind: "services",
      title: "Services",
      description: "Photo, video and family services on the resort.",
      tags: ["Nannies", "Photo", "Video"],
    },
    {
      slug: "transfer",
      kind: "transfer",
      title: "Transfer",
      description: "Comfortable transport to and from Gudauri.",
      tags: ["Batumi - Gudauri", "Tbilisi - Gudauri"],
    },
    {
      slug: "real-estate",
      kind: "real-estate",
      title: "Real estate",
      description: "Apartments and chalets close to the slopes.",
      tags: ["Apartments"],
    },
  ],
};

const sectionCopy = {
  ru: {
    hotDeal: "HOT DEAL",
    heroSubtitle: "All Gudauri services, one easy search",
    trustEyebrow: "Trust us",
    trustTitle: "Find an instructor for yourself",
    trustCardLead: "Study",
    trustCardLeadStrong: "the tool",
    trustCardMiddle: "ask for",
    trustCardMiddleStrong: "reviews",
    trustCardTail: "and choose the",
    trustCardTailStrong: "best one for yourself",
    trustButton: "Show all instructors",
    faqEyebrow: "Frequently Asked Questions",
    faqTitle: "FAQ",
    reviewLabel: "отзывов",
    faq: [
      {
        question: "Is the price different for each instructor?",
        answer:
          "Итоговая цена может различаться по опыту, формату и длительности, но на платформе удобно сравнить предложения без лишних переписок.",
      },
      {
        question: "Is the price different for each instructor?",
        answer:
          "Часы можно взять одним длинным днём или разбить на несколько коротких сессий под ваш темп и погоду.",
      },
      {
        question: "How are lesson hours distributed across days?",
        answer:
          "Часы можно распределять по дням — вы согласовываете расписание напрямую с инструктором.",
      },
      {
        question: "How does the booking process work?",
        answer:
          "Вы оставляете заявку на сайте, после чего связываетесь с инструктором или сервисом напрямую.",
      },
      {
        question: "When do I receive the instructor's contact details?",
        answer:
          "Сразу после выбора профиля можно отправить запрос, контакты уже в карточке инструктора.",
      },
    ] satisfies FaqEntry[],
  },
  en: {
    hotDeal: "HOT DEAL",
    heroSubtitle: "All Gudauri services, one easy search",
    trustEyebrow: "Trust us",
    trustTitle: "Find an instructor for yourself",
    trustCardLead: "Study",
    trustCardLeadStrong: "the tool",
    trustCardMiddle: "ask for",
    trustCardMiddleStrong: "reviews",
    trustCardTail: "and choose the",
    trustCardTailStrong: "best one for yourself",
    trustButton: "Show all instructors",
    faqEyebrow: "Frequently Asked Questions",
    faqTitle: "FAQ",
    reviewLabel: "reviews",
    faq: [
      {
        question: "Is the price different for each instructor?",
        answer:
          "Pricing can vary depending on experience, lesson format, and session length, but the platform makes it easy to compare options.",
      },
      {
        question: "Is the price different for each instructor?",
        answer:
          "You can book one longer day or split your lessons into several shorter sessions depending on your pace and weather.",
      },
      {
        question: "How are lesson hours distributed across days?",
        answer:
          "Hours can be split across days — you arrange the schedule directly with the instructor.",
      },
      {
        question: "How does the booking process work?",
        answer:
          "Submit a request on the site, then coordinate directly with the instructor to confirm timing and details.",
      },
      {
        question: "When do I receive the instructor's contact details?",
        answer:
          "As soon as you pick a profile you can send a request — contacts are already listed in the card.",
      },
    ] satisfies FaqEntry[],
  },
} as const;

function formatHeroDate() {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date());
}

function buildCategoryCards(locale: Locale, categoryPages: CategoryPage[]): HomeCategoryCard[] {
  const source =
    categoryPages.length > 0
      ? categoryPages
      : fallbackCategoryContent[locale].map((item, index) => ({
          id: `fallback-${item.slug}`,
          slug: item.slug,
          kind: item.kind,
          title: item.title,
          description: item.description,
          tags: item.tags,
          updatedAt: `2026-02-${String(10 + index).padStart(2, "0")}`,
          isPublished: true,
        }));

  return source.map((item) => ({
    key: item.id,
    title: item.title,
    description: item.description,
    href: toLocalePath(locale, `/categories/${item.slug}`),
    tags: item.tags,
    className: cardLayouts[item.kind],
    ...categoryVisuals[item.kind],
  }));
}

function averageRating(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function renderRatingStars(rating: number) {
  const safeRating = Math.max(1, Math.round(rating || 5));
  return Array.from({ length: 5 }, (_, index) => (index < safeRating ? "★" : "☆")).join("");
}

function formatLanguagePill(value: string) {
  const normalized = value.toLowerCase();

  if (normalized === "ru") {
    return "Ru";
  }
  if (normalized === "en") {
    return "En";
  }
  if (normalized === "ka") {
    return "Ge";
  }
  if (normalized === "de") {
    return "De";
  }

  return normalized.slice(0, 2).replace(/^\w/, (char) => char.toUpperCase());
}

function CategoryCard({ card }: { card: HomeCategoryCard }) {
  return (
    <Link
      href={card.href}
      className={`group relative min-h-[220px] overflow-hidden rounded-3xl bg-[var(--bg-card)] px-5 py-5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04),0_12px_32px_-20px_rgba(0,0,0,0.12)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_10px_-2px_rgba(0,0,0,0.05),0_18px_40px_-20px_rgba(0,0,0,0.18)] md:px-6 md:py-6 ${card.className}`}
    >
      <div className={`pointer-events-none absolute ${card.imageWrapperClassName}`}>
        <Image
          src={card.imageSrc}
          alt={card.imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className={card.imageClassName}
        />
      </div>

      <div className="relative z-10 flex h-full max-w-[58%] flex-col gap-2">
        <h2 className="font-sans text-[2rem] leading-[0.96] tracking-[-0.04em] text-[var(--ink)] md:text-[2.4rem]">
          {card.title}
        </h2>
        <p className="text-sm leading-5 text-[var(--ink-muted)] md:text-[0.95rem]">
          {card.description}
        </p>

        <div className="mt-auto flex flex-wrap gap-2 pt-4">
          {card.tags.map((tag) => (
            <span
              key={`${card.key}-${tag}`}
              className="rounded-full bg-[var(--line)] px-3 py-1 text-xs text-[var(--ink-muted)]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

function HomeInstructorCard({
  locale,
  instructor,
  reviewCount,
  reviewAverage,
}: {
  locale: Locale;
  instructor: Instructor;
  reviewCount: number;
  reviewAverage: number;
}) {
  const safeAverage = reviewCount > 0 ? reviewAverage : 5;
  const copy = sectionCopy[locale];

  return (
    <Link
      href={toLocalePath(locale, `/instructors/${instructor.slug}`)}
      className="group block overflow-hidden rounded-3xl bg-[var(--bg-card)] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04),0_12px_32px_-20px_rgba(0,0,0,0.12)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_10px_-2px_rgba(0,0,0,0.05),0_18px_40px_-20px_rgba(0,0,0,0.18)]"
    >
      <div className="relative aspect-[1.05] overflow-hidden rounded-t-3xl">
        <Image
          src={imageUrl(instructor.coverImage, 900, 900)}
          alt={instructor.name}
          fill
          sizes="(max-width: 768px) 100vw, 25vw"
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
          {instructor.discipline.slice(0, 2).map((item) => (
            <span
              key={`${instructor.slug}-${item}`}
              className="rounded-full bg-white/95 px-2.5 py-1 text-[0.7rem] font-medium text-[var(--ink)] shadow-sm"
            >
              {formatDiscipline(locale, item)}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-1 p-4">
        <h3 className="font-sans text-[1.25rem] leading-tight tracking-[-0.02em] text-[var(--ink)]">
          {instructor.name}
        </h3>

        <div className="flex items-center gap-1.5 text-xs text-[var(--ink-muted)]">
          <span className="text-[0.85rem] tracking-[0.08em] text-[var(--accent)]">
            {renderRatingStars(safeAverage)}
          </span>
          <span className="font-medium text-[var(--ink)]">{safeAverage.toFixed(1)}</span>
          <span>·</span>
          <span>
            {reviewCount} {copy.reviewLabel}
          </span>
        </div>
      </div>
    </Link>
  );
}

function FaqItem({ item, defaultOpen = false }: { item: FaqEntry; defaultOpen?: boolean }) {
  return (
    <details
      open={defaultOpen}
      className="group rounded-2xl bg-[var(--bg-soft)] px-5 py-4 transition"
    >
      <summary className="flex cursor-pointer list-none items-center gap-4">
        <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-[1.5px] border-[var(--accent)] text-[var(--accent)]">
          <span className="text-base leading-none transition-transform group-open:rotate-45">
            +
          </span>
        </span>
        <span className="text-[0.95rem] leading-snug text-[var(--ink)] md:text-base">
          {item.question}
        </span>
      </summary>
      <p className="mt-3 pl-10 text-sm leading-6 text-[var(--ink-muted)]">{item.answer}</p>
    </details>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : "ru";
  const home = await getHomeData(locale);

  return buildMetadata({
    locale,
    title: home.settings.seoTitleDefault,
    description: home.settings.seoDescriptionDefault,
    path: "/",
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : "ru";
  const homeCopy = sectionCopy[locale];

  const [home, categoryPages] = await Promise.all([getHomeData(locale), getCategoryPages(locale)]);
  const cards = buildCategoryCards(locale, categoryPages);

  const featuredInstructors = home.featuredInstructors.slice(0, 3);
  const reviewStats = await Promise.all(
    featuredInstructors.map(async (instructor) => {
      const reviews = await getInstructorReviews(locale, instructor.slug);
      return {
        slug: instructor.slug,
        count: reviews.length,
        average: averageRating(reviews.map((item) => item.rating)),
      };
    }),
  );
  const reviewMap = new Map(reviewStats.map((item) => [item.slug, item]));

  return (
    <div className="space-y-20 pb-20 md:space-y-24 md:pb-24">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "My Gudauri",
          url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://mygudauri.example.com",
          inLanguage: locale,
        }}
      />

      {/* HERO */}
      <section className="-mx-4 md:-mx-6">
        <div className="relative overflow-hidden pt-[30px]">
          {/* Gondola — absolutely positioned top-left, floating behind the title */}
          <Image
            src="/home/gondola.png"
            alt="Gudauri cable car"
            width={832}
            height={536}
            priority
            className="pointer-events-none absolute left-0 top-0 z-20 h-auto w-[48%] max-w-[540px] select-none"
          />

          {/* Hero text block */}
          <div className="relative z-10 flex w-full flex-col items-center text-center">
            <span
              style={{
                fontSize: "11px",
                letterSpacing: "0.08em",
                fontWeight: 500,
              }}
              className="rounded-full bg-[var(--accent)] px-3 py-1 text-white"
            >
              {formatHeroDate()}
            </span>

            <h1
              style={{
                fontSize: "clamp(1.56rem, 5.64vw, 6.36rem)",
                lineHeight: 0.88,
                letterSpacing: "-0.04em",
                fontWeight: 400,
                margin: "0.5rem 0 0 0",
                whiteSpace: "nowrap",
              }}
              className="font-sans text-[var(--ink)]"
            >
              MY GUDAURI
            </h1>

            <p
              style={{ fontSize: "18px", marginTop: "0.75rem" }}
              className="text-[var(--ink)]"
            >
              {homeCopy.heroSubtitle}
            </p>
          </div>

          {/* Mountains — panoramic strip at the bottom of the hero */}
          <Image
            src="/home/mountains.png"
            alt="Gudauri mountains"
            width={1468}
            height={325}
            priority
            className="relative z-10 -mt-8 block h-auto w-full select-none"
          />
        </div>
      </section>

      {/* CATEGORIES BENTO */}
      <section
        id="sections"
        className="-mx-4 scroll-mt-28 rounded-3xl bg-[var(--bg-soft)] px-4 py-5 md:-mx-6 md:px-6 md:py-7"
      >
        <div className="grid gap-4 md:grid-cols-2 xl:auto-rows-[220px] xl:grid-cols-12">
          {cards.map((card) => (
            <CategoryCard key={card.key} card={card} />
          ))}
        </div>
      </section>

      {/* FIND AN INSTRUCTOR */}
      <section className="space-y-8">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink-muted)]">
            {homeCopy.trustEyebrow}
          </p>
          <h2 className="max-w-4xl font-sans text-[3rem] leading-[0.94] tracking-[-0.05em] text-[var(--ink)] md:text-[4rem]">
            {homeCopy.trustTitle}
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_1fr]">
          <div className="flex min-h-[22rem] flex-col justify-between rounded-3xl bg-[var(--bg-soft)] p-6">
            <p className="max-w-[16ch] text-base leading-[1.4] text-[var(--ink)] md:text-[1.05rem]">
              {homeCopy.trustCardLead}{" "}
              <span className="font-semibold">{homeCopy.trustCardLeadStrong}</span>,{" "}
              {homeCopy.trustCardMiddle}{" "}
              <span className="font-semibold">{homeCopy.trustCardMiddleStrong}</span>{" "}
              {homeCopy.trustCardTail}{" "}
              <span className="font-semibold">{homeCopy.trustCardTailStrong}</span>!
            </p>

            <Link
              href={toLocalePath(locale, "/instructors")}
              className="mt-6 inline-flex items-center justify-center rounded-full border border-[var(--accent)] px-5 py-2.5 text-sm text-[var(--ink)] transition hover:bg-[var(--accent)] hover:text-white"
            >
              {homeCopy.trustButton} →
            </Link>
          </div>

          {featuredInstructors.map((instructor) => {
            const stats = reviewMap.get(instructor.slug);

            return (
              <HomeInstructorCard
                key={instructor.id}
                locale={locale}
                instructor={instructor}
                reviewCount={stats?.count ?? 0}
                reviewAverage={stats?.average ?? 0}
              />
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <section className="grid gap-10 xl:grid-cols-[0.6fr_1.4fr]">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink-muted)]">
            {homeCopy.faqEyebrow}
          </p>
          <h2 className="font-sans text-[4rem] leading-[0.94] tracking-[-0.06em] text-[var(--ink)] md:text-[5.5rem]">
            {homeCopy.faqTitle}
          </h2>
        </div>

        <div className="space-y-3">
          {homeCopy.faq.map((item, index) => (
            <FaqItem key={`${item.question}-${index}`} item={item} defaultOpen={index === 0} />
          ))}
        </div>
      </section>
    </div>
  );
}
