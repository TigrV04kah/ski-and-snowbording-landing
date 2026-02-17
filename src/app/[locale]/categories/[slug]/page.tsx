import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/article-card";
import { ArticleRichContent } from "@/components/article-rich-content";
import { EntityCard } from "@/components/entity-card";
import { ViewTracker } from "@/components/view-tracker";
import {
  getArticles,
  getCategoryPageBySlug,
  getCategoryPages,
  getInstructors,
  getServices,
} from "@/lib/cms";
import { formatDiscipline, formatLevel, isLocale, t } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { CategoryKind } from "@/lib/types";

const serviceTypeByCategoryKind: Partial<Record<CategoryKind, string>> = {
  tours: "tour",
  rental: "rental",
  transfer: "transfer",
  "real-estate": "accommodation",
};

export async function generateStaticParams() {
  const [ru, en] = await Promise.all([getCategoryPages("ru"), getCategoryPages("en")]);
  const slugs = new Set([...ru.map((item) => item.slug), ...en.map((item) => item.slug)]);

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
  const category = await getCategoryPageBySlug(locale, slug);

  if (!category) {
    return buildMetadata({ locale, title: "Not found", description: "", path: "/" });
  }

  return buildMetadata({
    locale,
    title: `${category.title} — My Gudauri`,
    description: category.description,
    path: `/categories/${slug}`,
  });
}

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : "ru";
  const copy = t(locale);
  const category = await getCategoryPageBySlug(locale, slug);

  if (!category) {
    notFound();
  }

  const serviceType = serviceTypeByCategoryKind[category.kind];
  const [instructors, services, articles] = await Promise.all([
    category.kind === "instructors" ? getInstructors(locale) : Promise.resolve([]),
    category.kind === "places" ? Promise.resolve([]) : getServices(locale),
    category.kind === "places" ? getArticles(locale) : Promise.resolve([]),
  ]);

  const filteredServices =
    category.kind === "services" ? services : serviceType ? services.filter((item) => item.serviceType === serviceType) : [];

  return (
    <div className="space-y-8 pb-12">
      <ViewTracker event="view_catalog" params={{ type: `category:${category.kind}`, locale, slug }} />

      <section className="space-y-3">
        <h1 className="font-serif text-4xl md:text-5xl">{category.title}</h1>
        <p className="max-w-3xl text-sm text-[var(--ink-muted)]">{category.description}</p>
        {Array.isArray(category.tags) && category.tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {category.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-[var(--bg-soft)] px-3 py-1 text-xs text-[var(--ink-muted)]">
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </section>

      {category.content ? (
        <section className="rounded-3xl border border-[var(--line)] bg-white p-5 md:p-6">
          <ArticleRichContent content={category.content} />
        </section>
      ) : null}

      {category.kind === "instructors" ? (
        instructors.length > 0 ? (
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {instructors.map((item) => (
              <EntityCard
                key={item.id}
                locale={locale}
                href={`/instructors/${item.slug}`}
                name={item.name}
                description={item.shortDescription}
                image={item.coverImage}
                tags={[
                  ...item.discipline.map((value) => formatDiscipline(locale, value)),
                  ...item.level.map((value) => formatLevel(locale, value)),
                ]}
                priceFrom={item.priceFrom}
                isInstructor
              />
            ))}
          </section>
        ) : (
          <p className="rounded-2xl border border-[var(--line)] bg-white p-6 text-sm text-[var(--ink-muted)]">
            {copy.noResults}
          </p>
        )
      ) : null}

      {category.kind === "places" ? (
        articles.length > 0 ? (
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.id} locale={locale} article={article} />
            ))}
          </section>
        ) : (
          <p className="rounded-2xl border border-[var(--line)] bg-white p-6 text-sm text-[var(--ink-muted)]">
            {copy.noResults}
          </p>
        )
      ) : null}

      {category.kind !== "instructors" && category.kind !== "places" ? (
        filteredServices.length > 0 ? (
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredServices.map((item) => (
              <EntityCard
                key={item.id}
                locale={locale}
                href={`/services/${item.slug}`}
                name={item.name}
                description={item.shortDescription}
                image={item.coverImage}
                tags={[item.serviceType, item.season ?? ""]}
                priceFrom={item.priceFrom}
              />
            ))}
          </section>
        ) : (
          <p className="rounded-2xl border border-[var(--line)] bg-white p-6 text-sm text-[var(--ink-muted)]">
            {copy.noResults}
          </p>
        )
      ) : null}
    </div>
  );
}
