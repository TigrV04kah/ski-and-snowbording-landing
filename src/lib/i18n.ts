import { Discipline, Locale, SkillLevel, locales } from "@/lib/types";

export const defaultLocale: Locale = "ru";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function normalizeLocale(value: string): Locale {
  return isLocale(value) ? value : defaultLocale;
}

export function stripLocalePrefix(pathname: string): string {
  if (pathname === "/en") {
    return "/";
  }

  if (pathname.startsWith("/en/")) {
    return pathname.slice(3);
  }

  if (pathname === "/ru") {
    return "/";
  }

  if (pathname.startsWith("/ru/")) {
    return pathname.slice(3);
  }

  return pathname;
}

export function toLocalePath(locale: Locale, pathname: string): string {
  const cleanPath = stripLocalePrefix(pathname) || "/";

  if (locale === "ru") {
    return cleanPath;
  }

  return cleanPath === "/" ? "/en" : `/en${cleanPath}`;
}

const disciplineLabels: Record<Locale, Record<Discipline, string>> = {
  ru: {
    ski: "Лыжи",
    snowboard: "Сноуборд",
  },
  en: {
    ski: "Ski",
    snowboard: "Snowboard",
  },
};

export function formatDiscipline(locale: Locale, value: Discipline | string): string {
  if (value === "ski" || value === "snowboard") {
    return disciplineLabels[locale][value];
  }

  return value;
}

const levelLabels: Record<Locale, Record<SkillLevel, string>> = {
  ru: {
    beginner: "Новичок",
    intermediate: "Средний",
    advanced: "Продвинутый",
  },
  en: {
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
  },
};

export function formatLevel(locale: Locale, value: SkillLevel | string): string {
  if (value === "beginner" || value === "intermediate" || value === "advanced") {
    return levelLabels[locale][value];
  }

  return value;
}

export const labels = {
  ru: {
    nav: {
      home: "Главная",
      instructors: "Инструкторы",
      services: "Услуги",
      articles: "Статьи",
      partners: "Партнерам",
    },
    heroTitle: "My Gudauri — услуги и активности на курорте",
    heroSubtitle:
      "Инструкторы, сервисы и полезные материалы по Гудаури в одном месте.",
    heroButtons: {
      instructors: "Найти инструктора",
      services: "Найти услугу",
      articles: "Полезные статьи",
    },
    sections: {
      categories: "Категории",
      popular: "Популярные предложения",
      howItWorks: "Как это работает",
      about: "О Гудаури",
      partner: "Предоставляете услуги в Гудаури?",
      articles: "Полезные материалы",
      instructors: "Инструкторы в Гудаури",
      services: "Услуги в Гудаури",
    },
    howItWorksSteps: [
      "Выберите инструктора или услугу",
      "Сравните условия и формат",
      "Оставьте заявку",
      "Свяжитесь напрямую и договоритесь",
    ],
    aboutText:
      "Гудаури — главный зимний курорт Грузии с длинным сезоном, хорошей инфраструктурой и маршрутами для разных уровней подготовки.",
    partnerText: "Добавьте свое предложение и получайте клиентов.",
    partnerButton: "Стать партнером",
    filtersTitle: "Фильтры",
    clearFilters: "Сбросить",
    applyFilters: "Применить",
    noResults: "По выбранным фильтрам ничего не найдено.",
    fromPrice: "Цена от",
    contactLabel: "Связаться",
    leaveRequest: "Оставить заявку",
    requestSent: "Заявка отправлена. Мы скоро свяжемся.",
    requestError: "Не удалось отправить заявку. Попробуйте еще раз.",
    consentText:
      "Я согласен с обработкой персональных данных и политикой конфиденциальности.",
    legal: {
      privacy: "Политика конфиденциальности",
      cookies: "Cookie policy",
    },
    footerNote:
      "My Gudauri — каталог инструкторов и сервисов. Онлайн-оплата на сайте не осуществляется.",
    labels: {
      discipline: "Направление",
      level: "Уровень",
      format: "Формат",
      language: "Язык",
      maxPrice: "Макс. цена",
      serviceType: "Тип услуги",
      season: "Сезон",
      included: "Включено",
      notIncluded: "Не включено",
      conditions: "Условия",
      reviews: "Отзывы",
      noReviews: "Пока нет отзывов",
      previousReview: "Назад",
      nextReview: "Вперед",
      verified: "Проверенный отзыв",
      similar: "Похожие предложения",
      updatedAt: "Обновлено",
      readMore: "Читать",
      viewProfile: "Смотреть профиль",
      viewDetails: "Смотреть детали",
      allInstructors: "Все инструкторы",
      allServices: "Все услуги",
    },
    leadForm: {
      name: "Имя",
      contact: "Телефон или @username",
      message: "Комментарий",
      send: "Отправить заявку",
    },
    cookie: {
      text: "Мы используем cookies для аналитики и улучшения сервиса.",
      accept: "Принять",
      decline: "Отклонить",
    },
  },
  en: {
    nav: {
      home: "Home",
      instructors: "Instructors",
      services: "Services",
      articles: "Articles",
      partners: "Partners",
    },
    heroTitle: "My Gudauri — services and activities at the resort",
    heroSubtitle:
      "Instructors, service providers, and practical guides for Gudauri in one place.",
    heroButtons: {
      instructors: "Find an instructor",
      services: "Find a service",
      articles: "Read guides",
    },
    sections: {
      categories: "Categories",
      popular: "Popular listings",
      howItWorks: "How it works",
      about: "About Gudauri",
      partner: "Do you provide services in Gudauri?",
      articles: "Guides and tips",
      instructors: "Instructors in Gudauri",
      services: "Services in Gudauri",
    },
    howItWorksSteps: [
      "Pick a service or instructor",
      "Review details and conditions",
      "Submit your request",
      "Connect directly and arrange details",
    ],
    aboutText:
      "Gudauri is Georgia's main winter resort with a long season, reliable infrastructure, and terrain for all levels.",
    partnerText: "Add your listing and start receiving client requests.",
    partnerButton: "Become a partner",
    filtersTitle: "Filters",
    clearFilters: "Reset",
    applyFilters: "Apply",
    noResults: "No listings match selected filters.",
    fromPrice: "Price from",
    contactLabel: "Contact",
    leaveRequest: "Request form",
    requestSent: "Request sent. We will contact you soon.",
    requestError: "Could not send request. Please try again.",
    consentText:
      "I agree with personal data processing and the privacy policy.",
    legal: {
      privacy: "Privacy policy",
      cookies: "Cookie policy",
    },
    footerNote:
      "My Gudauri is a listings directory. Online payment is not available on the site.",
    labels: {
      discipline: "Discipline",
      level: "Level",
      format: "Format",
      language: "Language",
      maxPrice: "Max price",
      serviceType: "Service type",
      season: "Season",
      included: "Included",
      notIncluded: "Not included",
      conditions: "Conditions",
      reviews: "Reviews",
      noReviews: "No reviews yet",
      previousReview: "Previous",
      nextReview: "Next",
      verified: "Verified review",
      similar: "Similar listings",
      updatedAt: "Updated",
      readMore: "Read",
      viewProfile: "View profile",
      viewDetails: "View details",
      allInstructors: "All instructors",
      allServices: "All services",
    },
    leadForm: {
      name: "Name",
      contact: "Phone or @username",
      message: "Message",
      send: "Send request",
    },
    cookie: {
      text: "We use cookies for analytics and service improvement.",
      accept: "Accept",
      decline: "Decline",
    },
  },
} as const;

export function t(locale: Locale) {
  return labels[locale];
}
