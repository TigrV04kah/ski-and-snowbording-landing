import Link from "next/link";
import { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getHomeData } from "@/lib/cms";
import { isLocale, t, toLocalePath } from "@/lib/i18n";
import { EntityCard } from "@/components/entity-card";
import { ArticleCard } from "@/components/article-card";
import { JsonLd } from "@/components/json-ld";

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

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : "ru";
  const copy = t(locale);
  const home = await getHomeData(locale);

  const popular = [...home.featuredInstructors, ...home.featuredServices].slice(0, 6);

  return (
    <div className="space-y-14 pb-12 md:space-y-16">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "My Gudauri",
          url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://mygudauri.example.com",
          inLanguage: locale,
        }}
      />
      <section className="relative overflow-hidden rounded-[2rem] border border-[var(--line)] bg-gradient-to-br from-white via-[var(--bg-soft)] to-[var(--bg-accent)] p-8 md:p-12">
        <div className="absolute -top-28 right-[-5rem] h-72 w-72 rounded-full bg-[var(--accent)]/15 blur-3xl" />
        <div className="relative z-10 max-w-3xl space-y-6">
          <p className="inline-flex rounded-full border border-[var(--line)] bg-white/70 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[var(--ink-muted)]">
            Gudauri, Georgia
          </p>
          <h1 className="font-serif text-4xl leading-[1.05] tracking-tight text-[var(--ink)] md:text-6xl">
            {copy.heroTitle}
          </h1>
          <p className="max-w-2xl text-base text-[var(--ink-muted)] md:text-lg">{copy.heroSubtitle}</p>
          <div className="flex flex-wrap gap-2">
            <Link
              href={toLocalePath(locale, "/instructors")}
              className="rounded-full bg-[var(--ink)] px-5 py-2.5 text-sm font-semibold !text-white"
            >
              {copy.heroButtons.instructors}
            </Link>
            <Link
              href={toLocalePath(locale, "/services")}
              className="rounded-full border border-[var(--line)] bg-white px-5 py-2.5 text-sm font-semibold"
            >
              {copy.heroButtons.services}
            </Link>
            <Link
              href={toLocalePath(locale, "/articles")}
              className="rounded-full border border-[var(--line)] bg-white px-5 py-2.5 text-sm font-semibold"
            >
              {copy.heroButtons.articles}
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-3xl">{copy.sections.categories}</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Link
            href={toLocalePath(locale, "/instructors")}
            className="rounded-3xl border border-[var(--line)] bg-white p-6 text-lg font-semibold"
          >
            {copy.nav.instructors}
          </Link>
          <Link
            href={toLocalePath(locale, "/services")}
            className="rounded-3xl border border-[var(--line)] bg-white p-6 text-lg font-semibold"
          >
            {copy.nav.services}
          </Link>
          <Link
            href={toLocalePath(locale, "/articles")}
            className="rounded-3xl border border-[var(--line)] bg-white p-6 text-lg font-semibold"
          >
            {copy.nav.articles}
          </Link>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-3xl">{copy.sections.popular}</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {popular.map((item) => (
            <EntityCard
              key={item.id}
              locale={locale}
              href={"discipline" in item ? `/instructors/${item.slug}` : `/services/${item.slug}`}
              name={item.name}
              description={item.shortDescription}
              image={item.coverImage}
              tags={"discipline" in item ? [item.discipline, ...item.level] : [item.serviceType, item.season ?? ""]}
              priceFrom={item.priceFrom}
              isInstructor={"discipline" in item}
            />
          ))}
        </div>
      </section>

      <section className="grid gap-6 rounded-3xl border border-[var(--line)] bg-white p-6 md:grid-cols-2">
        <div>
          <h2 className="font-serif text-3xl">{copy.sections.howItWorks}</h2>
          <ol className="mt-4 space-y-2 text-sm text-[var(--ink-muted)]">
            {copy.howItWorksSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
        <div className="space-y-4">
          <h2 className="font-serif text-3xl">{copy.sections.about}</h2>
          <p className="text-sm text-[var(--ink-muted)]">{copy.aboutText}</p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-3xl">{copy.sections.articles}</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {home.latestArticles.map((article) => (
            <ArticleCard key={article.id} locale={locale} article={article} />
          ))}
        </div>
      </section>
    </div>
  );
}
