export const locales = ["ru", "en"] as const;

export type Locale = (typeof locales)[number];

export type InquiryType = "instructor" | "service";

export type Discipline = "ski" | "snowboard";
export type SkillLevel = "beginner" | "intermediate" | "advanced";
export type LessonFormat = "individual" | "group";

export interface ContactLinks {
  whatsapp?: string;
  telegram?: string;
  phone?: string;
}

export interface BaseEntity {
  id: string;
  slug: string;
  name: string;
  coverImage?: unknown;
  gallery?: unknown[];
  shortDescription: string;
  fullDescription: string;
  included?: string;
  notIncluded?: string;
  conditions?: string;
  contacts: ContactLinks;
  isFeatured?: boolean;
  isPublished?: boolean;
  updatedAt: string;
}

export interface Instructor extends BaseEntity {
  discipline: Discipline[];
  level: SkillLevel[];
  format: LessonFormat[];
  languages: string[];
  experienceYears: number;
  priceFrom?: number;
}

export interface Service extends BaseEntity {
  serviceType: string;
  duration?: string;
  season?: string;
  priceFrom?: number;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string | Array<{ _type: string; [key: string]: unknown }>;
  coverImage?: unknown;
  category: string;
  seoTitle?: string;
  seoDescription?: string;
  publishedAt: string;
  updatedAt: string;
  isPublished?: boolean;
}

export interface Review {
  id: string;
  instructorSlug: string;
  author: string;
  rating: number;
  text: string;
  date: string;
  verified?: boolean;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  description: string;
  partnerCtaEmail: string;
  contactPhone?: string;
  contactTelegram?: string;
  contactWhatsapp?: string;
  seoTitleDefault: string;
  seoDescriptionDefault: string;
  socialLinks: { label: string; url: string }[];
}

export interface HomeData {
  featuredInstructors: Instructor[];
  featuredServices: Service[];
  latestArticles: Article[];
  settings: SiteSettings;
}

export interface LeadPayload {
  name: string;
  contact: string;
  inquiryType: InquiryType;
  entitySlug?: string;
  message?: string;
  locale: Locale;
  consent: boolean;
  hp_field?: string;
}
