import {
  articleBySlugQuery,
  articlesQuery,
  categoryPageBySlugQuery,
  categoryPagesQuery,
  faqItemsQuery,
  instructorBySlugQuery,
  instructorsQuery,
  reviewsByInstructorSlugQuery,
  serviceBySlugQuery,
  servicesQuery,
  siteSettingsQuery,
} from "@/lib/sanity/queries";
import { isSanityConfigured, sanityClient } from "@/lib/sanity/client";
import {
  getMockArticles,
  getMockCategoryPageBySlug,
  getMockCategoryPages,
  getMockHomeData,
  getMockInstructorReviews,
  getMockInstructors,
  getMockServices,
  getMockSettings,
} from "@/lib/mock-data";
import {
  Article,
  CategoryPage,
  FaqItem,
  HomeData,
  Instructor,
  Locale,
  Review,
  Service,
  SiteSettings,
} from "@/lib/types";

const SANITY_TAGS = {
  instructors: "instructors",
  services: "services",
  articles: "articles",
  categoryPages: "category-pages",
  reviews: "reviews",
  settings: "site-settings",
  faq: "faq-items",
};

const FALLBACK_FAQ: Record<Locale, FaqItem[]> = {
  ru: [
    {
      id: "fallback-ru-1",
      order: 1,
      question: "Цена зависит от конкретного инструктора?",
      answer:
        "Итоговая цена может различаться по опыту, формату и длительности, но на платформе удобно сравнить предложения без лишних переписок.",
    },
    {
      id: "fallback-ru-2",
      order: 2,
      question: "Как распределяются часы занятий по дням?",
      answer:
        "Часы можно распределять по дням — вы согласовываете расписание напрямую с инструктором.",
    },
    {
      id: "fallback-ru-3",
      order: 3,
      question: "Как происходит бронирование?",
      answer:
        "Вы оставляете заявку на сайте, после чего связываетесь с инструктором или сервисом напрямую.",
    },
    {
      id: "fallback-ru-4",
      order: 4,
      question: "Когда я получу контакты инструктора?",
      answer:
        "Сразу после выбора профиля можно отправить запрос, контакты уже в карточке инструктора.",
    },
  ],
  en: [
    {
      id: "fallback-en-1",
      order: 1,
      question: "Is the price different for each instructor?",
      answer:
        "Pricing can vary depending on experience, lesson format, and session length, but the platform makes it easy to compare options.",
    },
    {
      id: "fallback-en-2",
      order: 2,
      question: "How are lesson hours distributed across days?",
      answer:
        "Hours can be split across days — you arrange the schedule directly with the instructor.",
    },
    {
      id: "fallback-en-3",
      order: 3,
      question: "How does the booking process work?",
      answer:
        "Submit a request on the site, then coordinate directly with the instructor to confirm timing and details.",
    },
    {
      id: "fallback-en-4",
      order: 4,
      question: "When do I receive the instructor's contact details?",
      answer:
        "As soon as you pick a profile you can send a request — contacts are already listed in the card.",
    },
  ],
};

async function fetchFromSanity<T>(query: string, params: Record<string, unknown>, tags: string[]): Promise<T> {
  if (process.env.NODE_ENV !== "production") {
    return sanityClient.fetch<T>(query, params, { cache: "no-store" });
  }

  return sanityClient.fetch<T>(query, params, {
    next: {
      tags,
      revalidate: 120,
    },
  });
}

export async function getInstructors(locale: Locale): Promise<Instructor[]> {
  if (!isSanityConfigured) {
    return getMockInstructors(locale);
  }

  try {
    const data = await fetchFromSanity<Instructor[]>(
      instructorsQuery,
      { locale },
      [SANITY_TAGS.instructors],
    );

    return data ?? [];
  } catch {
    return getMockInstructors(locale);
  }
}

export async function getInstructorBySlug(locale: Locale, slug: string): Promise<Instructor | null> {
  if (!isSanityConfigured) {
    return getMockInstructors(locale).find((item) => item.slug === slug) ?? null;
  }

  try {
    const data = await fetchFromSanity<Instructor | null>(
      instructorBySlugQuery,
      { locale, slug },
      [SANITY_TAGS.instructors],
    );

    return data;
  } catch {
    return getMockInstructors(locale).find((item) => item.slug === slug) ?? null;
  }
}

export async function getServices(locale: Locale): Promise<Service[]> {
  if (!isSanityConfigured) {
    return getMockServices(locale);
  }

  try {
    const data = await fetchFromSanity<Service[]>(servicesQuery, { locale }, [SANITY_TAGS.services]);
    return data ?? [];
  } catch {
    return getMockServices(locale);
  }
}

export async function getServiceBySlug(locale: Locale, slug: string): Promise<Service | null> {
  if (!isSanityConfigured) {
    return getMockServices(locale).find((item) => item.slug === slug) ?? null;
  }

  try {
    const data = await fetchFromSanity<Service | null>(serviceBySlugQuery, { locale, slug }, [
      SANITY_TAGS.services,
    ]);
    return data;
  } catch {
    return getMockServices(locale).find((item) => item.slug === slug) ?? null;
  }
}

export async function getArticles(locale: Locale): Promise<Article[]> {
  if (!isSanityConfigured) {
    return getMockArticles(locale);
  }

  try {
    const data = await fetchFromSanity<Article[]>(articlesQuery, { locale }, [SANITY_TAGS.articles]);
    return data ?? [];
  } catch {
    return getMockArticles(locale);
  }
}

export async function getCategoryPages(locale: Locale): Promise<CategoryPage[]> {
  if (!isSanityConfigured) {
    return getMockCategoryPages(locale);
  }

  try {
    const data = await fetchFromSanity<CategoryPage[]>(categoryPagesQuery, { locale }, [SANITY_TAGS.categoryPages]);
    return data && data.length > 0 ? data : getMockCategoryPages(locale);
  } catch {
    return getMockCategoryPages(locale);
  }
}

export async function getCategoryPageBySlug(locale: Locale, slug: string): Promise<CategoryPage | null> {
  if (!isSanityConfigured) {
    return getMockCategoryPageBySlug(locale, slug);
  }

  try {
    const data = await fetchFromSanity<CategoryPage | null>(categoryPageBySlugQuery, { locale, slug }, [
      SANITY_TAGS.categoryPages,
    ]);
    return data ?? getMockCategoryPageBySlug(locale, slug);
  } catch {
    return getMockCategoryPageBySlug(locale, slug);
  }
}

export async function getArticleBySlug(locale: Locale, slug: string): Promise<Article | null> {
  if (!isSanityConfigured) {
    return getMockArticles(locale).find((item) => item.slug === slug) ?? null;
  }

  try {
    const data = await fetchFromSanity<Article | null>(articleBySlugQuery, { locale, slug }, [
      SANITY_TAGS.articles,
    ]);
    return data;
  } catch {
    return getMockArticles(locale).find((item) => item.slug === slug) ?? null;
  }
}

export async function getSiteSettings(locale: Locale): Promise<SiteSettings> {
  if (!isSanityConfigured) {
    return getMockSettings(locale);
  }

  try {
    const data = await fetchFromSanity<SiteSettings | null>(siteSettingsQuery, { locale }, [
      SANITY_TAGS.settings,
    ]);
    return data ?? getMockSettings(locale);
  } catch {
    return getMockSettings(locale);
  }
}

export async function getInstructorReviews(locale: Locale, slug: string): Promise<Review[]> {
  if (!isSanityConfigured) {
    return getMockInstructorReviews(locale, slug);
  }

  try {
    const data = await fetchFromSanity<Review[]>(
      reviewsByInstructorSlugQuery,
      { locale, slug },
      [SANITY_TAGS.reviews],
    );

    return data ?? [];
  } catch {
    return getMockInstructorReviews(locale, slug);
  }
}

export async function getFaqItems(locale: Locale): Promise<FaqItem[]> {
  if (!isSanityConfigured) {
    return FALLBACK_FAQ[locale];
  }

  try {
    const data = await fetchFromSanity<FaqItem[]>(
      faqItemsQuery,
      { locale },
      [SANITY_TAGS.faq],
    );

    return data && data.length > 0 ? data : FALLBACK_FAQ[locale];
  } catch {
    return FALLBACK_FAQ[locale];
  }
}

export async function getHomeData(locale: Locale): Promise<HomeData> {
  if (!isSanityConfigured) {
    return getMockHomeData(locale);
  }

  const [instructors, services, articles, settings] = await Promise.all([
    getInstructors(locale),
    getServices(locale),
    getArticles(locale),
    getSiteSettings(locale),
  ]);

  return {
    featuredInstructors: instructors.filter((item) => item.isFeatured).slice(0, 3),
    featuredServices: services.filter((item) => item.isFeatured).slice(0, 3),
    latestArticles: articles.slice(0, 3),
    settings,
  };
}
