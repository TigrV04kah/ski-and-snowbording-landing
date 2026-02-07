import { Article, HomeData, Instructor, Locale, Review, Service, SiteSettings } from "@/lib/types";

const settingsByLocale: Record<Locale, SiteSettings> = {
  ru: {
    siteName: "My Gudauri",
    tagline: "Каталог услуг и инструкторов в Гудаури",
    description:
      "Проверенные инструкторы и сервисы в Гудаури: занятия, аренда снаряжения, фото-сопровождение и другие услуги.",
    partnerCtaEmail: "partners@mygudauri.com",
    contactPhone: "+995599123456",
    contactTelegram: "https://t.me/mygudauri",
    contactWhatsapp: "https://wa.me/995599123456",
    seoTitleDefault: "My Gudauri — инструкторы и услуги в Гудаури",
    seoDescriptionDefault:
      "Найдите инструктора по лыжам и сноуборду, а также локальные сервисы в Гудаури.",
    socialLinks: [
      { label: "Telegram", url: "https://t.me/mygudauri" },
      { label: "Instagram", url: "https://instagram.com/mygudauri" },
    ],
  },
  en: {
    siteName: "My Gudauri",
    tagline: "Directory of instructors and services in Gudauri",
    description:
      "Verified ski and snowboard instructors plus trusted local services in Gudauri.",
    partnerCtaEmail: "partners@mygudauri.com",
    contactPhone: "+995599123456",
    contactTelegram: "https://t.me/mygudauri",
    contactWhatsapp: "https://wa.me/995599123456",
    seoTitleDefault: "My Gudauri — instructors and services in Gudauri",
    seoDescriptionDefault:
      "Find ski and snowboard instructors and book local services in Gudauri.",
    socialLinks: [
      { label: "Telegram", url: "https://t.me/mygudauri" },
      { label: "Instagram", url: "https://instagram.com/mygudauri" },
    ],
  },
};

const instructorsRu: Instructor[] = [
  {
    id: "inst-1",
    slug: "nika-beridze",
    name: "Ника Беридзе",
    coverImage:
      "https://images.unsplash.com/photo-1517420879524-86d64ac2f339?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1200&q=80",
    ],
    shortDescription: "Индивидуальные занятия по сноуборду для новичков и middle.",
    fullDescription:
      "Сертифицированный инструктор с 8-летним опытом. Специализация: постановка техники, первые спуски, уверенность на красных трассах.",
    included: "Разминка, план занятия, видеоразбор техники.",
    notIncluded: "Ски-пасс и аренда снаряжения.",
    conditions: "Отмена за 24 часа без штрафа.",
    contacts: {
      whatsapp: "https://wa.me/995555010101",
      telegram: "https://t.me/nika_guide",
      phone: "+995555010101",
    },
    discipline: "snowboard",
    level: ["beginner", "intermediate"],
    format: ["individual", "group"],
    languages: ["ru", "en", "ka"],
    experienceYears: 8,
    priceFrom: 180,
    isFeatured: true,
    isPublished: true,
    updatedAt: "2026-01-28",
  },
  {
    id: "inst-2",
    slug: "mariam-gelashvili",
    name: "Мариам Гелашвили",
    coverImage:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
    gallery: [],
    shortDescription: "Лыжи для детей и взрослых, мягкий вход в технику.",
    fullDescription:
      "Работает с семьями и новичками. Помогает быстро убрать страх скорости и освоить безопасный контроль.",
    included: "Разбор ошибок, упражнения на баланс.",
    notIncluded: "Подъемники, страховка.",
    conditions: "Группы от 2 до 5 человек.",
    contacts: {
      whatsapp: "https://wa.me/995555020202",
      phone: "+995555020202",
    },
    discipline: "ski",
    level: ["beginner", "intermediate"],
    format: ["individual", "group"],
    languages: ["ru", "en"],
    experienceYears: 6,
    priceFrom: 170,
    isFeatured: true,
    isPublished: true,
    updatedAt: "2026-01-30",
  },
  {
    id: "inst-3",
    slug: "giorgi-kakabadze",
    name: "Гиорги Какабадзе",
    coverImage:
      "https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "Фрирайд-гид и продвинутые техники катания на лыжах.",
    fullDescription:
      "Инструктор для уверенных райдеров. Работает с техникой карвинга и подготовкой к внетрассовому катанию.",
    included: "План маршрута, брифинг по безопасности.",
    notIncluded: "Лавинное оборудование.",
    conditions: "Требуется уверенное катание.",
    contacts: {
      telegram: "https://t.me/giorgi_ski",
      phone: "+995555030303",
    },
    discipline: "ski",
    level: ["advanced"],
    format: ["individual", "group"],
    languages: ["ru", "en", "de"],
    experienceYears: 12,
    priceFrom: 260,
    isFeatured: false,
    isPublished: true,
    updatedAt: "2026-02-01",
  },
  {
    id: "inst-4",
    slug: "ana-tsiklauri",
    name: "Ана Циклаури",
    coverImage:
      "https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "Сноуборд для девушек и подростков, индивидуальные тренировки.",
    fullDescription:
      "Помогает поставить стабильную стойку и развить уверенность на склоне. Большой фокус на технике без травм.",
    included: "Видеоанализ, домашние упражнения.",
    notIncluded: "Экипировка.",
    conditions: "Минимальная длительность 2 часа.",
    contacts: {
      whatsapp: "https://wa.me/995555040404",
      telegram: "https://t.me/ana_board",
    },
    discipline: "snowboard",
    level: ["beginner", "intermediate"],
    format: ["individual"],
    languages: ["ru", "en"],
    experienceYears: 5,
    priceFrom: 190,
    isFeatured: false,
    isPublished: true,
    updatedAt: "2026-01-25",
  },
  {
    id: "inst-5",
    slug: "luka-metreveli",
    name: "Лука Метревели",
    coverImage:
      "https://images.unsplash.com/photo-1517594422361-5eeb8ae275a9?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "Групповые занятия на лыжах для начинающих.",
    fullDescription:
      "Оптимальный вариант для тех, кто хочет начать в группе и снизить стоимость первого обучения.",
    included: "Программа для групп, базовый инструктаж.",
    notIncluded: "Ски-пасс.",
    conditions: "Цена за человека в группе от 3 человек.",
    contacts: {
      phone: "+995555050505",
    },
    discipline: "ski",
    level: ["beginner"],
    format: ["group"],
    languages: ["ru", "en"],
    experienceYears: 4,
    isFeatured: true,
    isPublished: true,
    updatedAt: "2026-02-03",
  },
];

const instructorsEn: Instructor[] = instructorsRu.map((item) => ({
  ...item,
  shortDescription:
    item.slug === "nika-beridze"
      ? "Individual snowboard coaching for beginners and intermediate riders."
      : item.slug === "mariam-gelashvili"
        ? "Ski coaching for kids and adults with a smooth learning curve."
        : item.slug === "giorgi-kakabadze"
          ? "Freeride guide and advanced ski technique coaching."
          : item.slug === "ana-tsiklauri"
            ? "Snowboard coaching for women and teens, private sessions."
            : "Group ski lessons for beginner riders.",
  fullDescription:
    item.slug === "nika-beridze"
      ? "Certified instructor with 8 years of experience focused on fundamentals, first descents, and confidence on red runs."
      : item.slug === "mariam-gelashvili"
        ? "Works with families and beginners, helping students gain confidence and control in a safe way."
        : item.slug === "giorgi-kakabadze"
          ? "For confident riders improving carving and preparing for off-piste terrain."
          : item.slug === "ana-tsiklauri"
            ? "Builds stable stance and safe progression with strong focus on injury-free technique."
            : "A practical format for beginner groups who want a lower entry price.",
  included:
    item.slug === "giorgi-kakabadze"
      ? "Route planning and safety briefing."
      : "Warmup, plan, and technical feedback.",
  notIncluded: "Lift pass and rental gear.",
  conditions: "Free cancellation up to 24 hours before lesson.",
}));

const servicesRu: Service[] = [
  {
    id: "srv-1",
    slug: "gear-rental-pro",
    name: "Прокат снаряжения Pro",
    coverImage:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "Сноуборд и лыжи: подбор по уровню и условиям склона.",
    fullDescription:
      "Прокат с быстрой примеркой и заменой в течение дня. Доступны комплекты для новичков и продвинутых.",
    included: "Ботинки, крепления, базовая настройка.",
    conditions: "Залог по документу.",
    contacts: {
      whatsapp: "https://wa.me/995555060606",
      phone: "+995555060606",
    },
    serviceType: "rental",
    duration: "1 day",
    season: "winter",
    priceFrom: 60,
    isFeatured: true,
    isPublished: true,
    updatedAt: "2026-01-29",
  },
  {
    id: "srv-2",
    slug: "airport-transfer-gudauri",
    name: "Трансфер Тбилиси — Гудаури",
    coverImage:
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "Комфортный трансфер из аэропорта и обратно.",
    fullDescription:
      "Индивидуальные и минивэн трансферы с опытными водителями, знающими горную дорогу в зимний сезон.",
    included: "Ожидание в аэропорту, помощь с багажом.",
    conditions: "Подтверждение за 12 часов.",
    contacts: {
      telegram: "https://t.me/gudauri_transfer",
      phone: "+995555070707",
    },
    serviceType: "transfer",
    duration: "3-4 hours",
    season: "all-year",
    priceFrom: 220,
    isFeatured: true,
    isPublished: true,
    updatedAt: "2026-02-02",
  },
  {
    id: "srv-3",
    slug: "mountain-photo-session",
    name: "Фото-сопровождение на склоне",
    coverImage:
      "https://images.unsplash.com/photo-1488153074946-0d3b7f74f233?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "Динамичные фото и короткие рилсы во время катания.",
    fullDescription:
      "Съемка в движении, портреты на видовых точках, готовый пакет фото в течение 24 часов.",
    included: "30 обработанных фото + 1 короткий ролик.",
    conditions: "Работаем только при безопасной погоде.",
    contacts: {
      whatsapp: "https://wa.me/995555080808",
      telegram: "https://t.me/gudauri_shot",
    },
    serviceType: "photo",
    duration: "2 hours",
    season: "winter",
    priceFrom: 150,
    isFeatured: false,
    isPublished: true,
    updatedAt: "2026-01-27",
  },
];

const servicesEn: Service[] = servicesRu.map((item) => ({
  ...item,
  name:
    item.slug === "gear-rental-pro"
      ? "Pro gear rental"
      : item.slug === "airport-transfer-gudauri"
        ? "Tbilisi Airport transfer"
        : "Mountain photo session",
  shortDescription:
    item.slug === "gear-rental-pro"
      ? "Ski and snowboard gear fitted to your level and current conditions."
      : item.slug === "airport-transfer-gudauri"
        ? "Comfort transfer between Tbilisi and Gudauri."
        : "Action photos and short reels while you ride.",
  fullDescription:
    item.slug === "gear-rental-pro"
      ? "Fast fitting and same-day replacement options for beginner and advanced gear sets."
      : item.slug === "airport-transfer-gudauri"
        ? "Private and minivan transfers with drivers experienced on mountain winter roads."
        : "Motion shots, portraits, and edited media delivered within 24 hours.",
  included:
    item.slug === "mountain-photo-session"
      ? "30 edited photos plus one short reel."
      : "Core service package based on selected option.",
  conditions: "Advance confirmation required.",
}));

const articlesRu: Article[] = [
  {
    id: "art-1",
    slug: "kak-vybrat-instruktora-v-gudauri",
    title: "Как выбрать инструктора в Гудаури",
    excerpt:
      "Критерии, которые реально влияют на прогресс: опыт, формат занятий, язык и подход.",
    content:
      "### Что проверить перед бронированием\n\n1. Опыт работы с вашим уровнем.\n2. Формат урока и длительность.\n3. Реальные каналы связи и скорость ответа.\n\n### Практический совет\n\nБерите короткое вводное занятие и оцените стиль объяснения.",
    coverImage:
      "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1200&q=80",
    category: "guides",
    seoTitle: "Как выбрать инструктора в Гудаури — практическое руководство",
    seoDescription:
      "Чек-лист выбора инструктора по лыжам и сноуборду в Гудаури.",
    publishedAt: "2026-01-20",
    updatedAt: "2026-01-20",
    isPublished: true,
  },
  {
    id: "art-2",
    slug: "kogda-luchshe-ekhat-v-gudauri",
    title: "Когда лучше ехать в Гудаури",
    excerpt: "Разбираем сезон, погоду и загрузку трасс по месяцам.",
    content:
      "Лучшие месяцы для стабильного снега обычно с января по март.\n\nВыбирайте даты с учетом загруженности выходных и праздников.",
    coverImage:
      "https://images.unsplash.com/photo-1487180144351-b8472da7d491?auto=format&fit=crop&w=1200&q=80",
    category: "season",
    seoTitle: "Когда ехать в Гудаури: сезон и советы",
    seoDescription: "Сезонность и практические советы для поездки в Гудаури.",
    publishedAt: "2026-01-24",
    updatedAt: "2026-01-24",
    isPublished: true,
  },
  {
    id: "art-3",
    slug: "sovety-dlya-novichkov-na-sklone",
    title: "Советы для новичков на склоне",
    excerpt: "Минимум ошибок в первый день: экипировка, разминка и режим нагрузки.",
    content:
      "Перед первым спуском проверьте крепления и ботинки.\n\nНе пропускайте разминку и не планируйте длинные сессии в первый день.",
    coverImage:
      "https://images.unsplash.com/photo-1548777123-e216912df7d8?auto=format&fit=crop&w=1200&q=80",
    category: "beginners",
    seoTitle: "Советы новичкам в Гудаури",
    seoDescription: "Что важно знать новичку перед первым днем на курорте.",
    publishedAt: "2026-01-31",
    updatedAt: "2026-01-31",
    isPublished: true,
  },
];

const articlesEn: Article[] = articlesRu.map((item) => ({
  ...item,
  title:
    item.slug === "kak-vybrat-instruktora-v-gudauri"
      ? "How to choose an instructor in Gudauri"
      : item.slug === "kogda-luchshe-ekhat-v-gudauri"
        ? "Best time to go to Gudauri"
        : "Tips for first-time riders",
  excerpt:
    item.slug === "kak-vybrat-instruktora-v-gudauri"
      ? "The factors that actually affect progress: experience, format, language, and teaching style."
      : item.slug === "kogda-luchshe-ekhat-v-gudauri"
        ? "A practical overview of seasonality, weather, and slope load by month."
        : "Avoid common first-day mistakes with gear, warm-up, and pacing.",
  content:
    item.slug === "kak-vybrat-instruktora-v-gudauri"
      ? "### What to verify before booking\n\n1. Experience with your level.\n2. Session format and duration.\n3. Response speed in direct channels."
      : item.slug === "kogda-luchshe-ekhat-v-gudauri"
        ? "January to March usually delivers the most stable snow. Consider weekends and holiday load when planning dates."
        : "Check bindings and boots before your first run. Keep the first day short and focus on consistency.",
  seoTitle:
    item.slug === "kak-vybrat-instruktora-v-gudauri"
      ? "How to choose a ski or snowboard instructor in Gudauri"
      : item.slug === "kogda-luchshe-ekhat-v-gudauri"
        ? "When to visit Gudauri: season guide"
        : "Gudauri beginner tips",
  seoDescription:
    item.slug === "kak-vybrat-instruktora-v-gudauri"
      ? "A practical checklist for selecting an instructor in Gudauri."
      : item.slug === "kogda-luchshe-ekhat-v-gudauri"
        ? "Seasonality and travel planning advice for Gudauri."
        : "What first-time riders should know before day one.",
}));

const reviewsRu: Review[] = [
  {
    id: "rev-1",
    instructorSlug: "nika-beridze",
    author: "Екатерина",
    rating: 5,
    text: "Очень спокойно объясняет технику. За 2 занятия перестала бояться скорости.",
    date: "2026-01-26",
    verified: true,
  },
  {
    id: "rev-2",
    instructorSlug: "nika-beridze",
    author: "Илья",
    rating: 5,
    text: "Понравился структурный подход и видеоразбор после занятия.",
    date: "2026-02-01",
    verified: true,
  },
  {
    id: "rev-3",
    instructorSlug: "mariam-gelashvili",
    author: "Анна",
    rating: 5,
    text: "Ребенку было комфортно, уже в первый день поехал увереннее.",
    date: "2026-01-29",
    verified: true,
  },
  {
    id: "rev-4",
    instructorSlug: "giorgi-kakabadze",
    author: "Влад",
    rating: 4,
    text: "Сильный технический тренер, много полезных правок по карвингу.",
    date: "2026-02-02",
    verified: true,
  },
  {
    id: "rev-5",
    instructorSlug: "ana-tsiklauri",
    author: "Мария",
    rating: 5,
    text: "Уроки максимально понятные, чувствуется забота о безопасности.",
    date: "2026-01-31",
    verified: true,
  },
];

const reviewsEn: Review[] = reviewsRu.map((item) => ({
  ...item,
  text:
    item.id === "rev-1"
      ? "Very calm teaching style. I stopped being afraid of speed after two sessions."
      : item.id === "rev-2"
        ? "I liked the structured method and post-session video feedback."
        : item.id === "rev-3"
          ? "My kid felt comfortable and became much more confident on day one."
          : item.id === "rev-4"
            ? "Strong technical coach with very useful carving corrections."
            : "Clear explanations and strong safety focus throughout the session.",
}));

function byLocale<T>(locale: Locale, ru: T, en: T): T {
  return locale === "en" ? en : ru;
}

export function getMockInstructors(locale: Locale): Instructor[] {
  return byLocale(locale, instructorsRu, instructorsEn);
}

export function getMockServices(locale: Locale): Service[] {
  return byLocale(locale, servicesRu, servicesEn);
}

export function getMockArticles(locale: Locale): Article[] {
  return byLocale(locale, articlesRu, articlesEn);
}

export function getMockSettings(locale: Locale): SiteSettings {
  return settingsByLocale[locale];
}

export function getMockInstructorReviews(locale: Locale, slug: string): Review[] {
  const data = byLocale(locale, reviewsRu, reviewsEn);
  return data
    .filter((item) => item.instructorSlug === slug)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getMockHomeData(locale: Locale): HomeData {
  const instructors = getMockInstructors(locale).filter((item) => item.isFeatured);
  const services = getMockServices(locale).filter((item) => item.isFeatured);
  const articles = getMockArticles(locale)
    .slice()
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, 3);

  return {
    featuredInstructors: instructors,
    featuredServices: services,
    latestArticles: articles,
    settings: getMockSettings(locale),
  };
}
