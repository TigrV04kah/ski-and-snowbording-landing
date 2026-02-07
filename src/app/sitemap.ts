import { MetadataRoute } from "next";
import { getArticles, getInstructors, getServices } from "@/lib/cms";
import { toLocalePath } from "@/lib/i18n";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mygudauri.example.com";
  const staticPaths = ["/", "/instructors", "/services", "/articles", "/privacy", "/cookies"];

  const [instructors, services, articles] = await Promise.all([
    getInstructors("ru"),
    getServices("ru"),
    getArticles("ru"),
  ]);

  const dynamicPaths = [
    ...instructors.map((item) => `/instructors/${item.slug}`),
    ...services.map((item) => `/services/${item.slug}`),
    ...articles.map((item) => `/articles/${item.slug}`),
  ];

  const allPaths = [...staticPaths, ...dynamicPaths];
  const now = new Date();

  return allPaths.flatMap((path) =>
    ["ru", "en"].map((locale) => ({
      url: `${baseUrl}${toLocalePath(locale as "ru" | "en", path)}`,
      lastModified: now,
      changeFrequency: path === "/" ? "daily" : "weekly",
      priority: path === "/" ? 1 : 0.7,
    })),
  );
}
