import { Metadata } from "next";
import { Locale } from "@/lib/types";
import { toLocalePath } from "@/lib/i18n";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mygudauri.example.com";

export function absoluteUrl(path: string): string {
  return new URL(path, siteUrl).toString();
}

export function buildMetadata({
  locale,
  title,
  description,
  path,
  noindex = false,
}: {
  locale: Locale;
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
}): Metadata {
  const canonicalPath = toLocalePath(locale, path);
  const ruPath = toLocalePath("ru", path);
  const enPath = toLocalePath("en", path);

  return {
    title,
    description,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: canonicalPath,
      languages: {
        ru: ruPath,
        en: enPath,
      },
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(canonicalPath),
      siteName: "My Gudauri",
      type: "website",
      locale: locale === "ru" ? "ru_RU" : "en_US",
    },
    robots: noindex
      ? {
          index: false,
          follow: true,
        }
      : undefined,
  };
}

export function hasFilterParams(searchParams: Record<string, string | string[] | undefined>): boolean {
  return Object.values(searchParams).some((value) => typeof value === "string" && value.length > 0);
}
