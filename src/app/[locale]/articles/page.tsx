import { Metadata } from "next";
import { ArticleCard } from "@/components/article-card";
import { getArticles } from "@/lib/cms";
import { isLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : "ru";

  return buildMetadata({
    locale,
    title: locale === "ru" ? "Статьи о Гудаури" : "Gudauri guides",
    description:
      locale === "ru"
        ? "Практические материалы: как выбрать инструктора, когда ехать и как подготовиться к катанию."
        : "Practical guides: selecting instructors, planning your trip, and preparing for the slopes.",
    path: "/articles",
  });
}

export default async function ArticlesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : "ru";
  const articles = await getArticles(locale);

  return (
    <div className="space-y-6 pb-12">
      <section className="space-y-2">
        <h1 className="font-serif text-4xl md:text-5xl">{locale === "ru" ? "Статьи" : "Articles"}</h1>
        <p className="max-w-2xl text-sm text-[var(--ink-muted)]">
          {locale === "ru"
            ? "Короткие практические материалы для гостей Гудаури."
            : "Short practical reads for Gudauri visitors."}
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.id} locale={locale} article={article} />
        ))}
      </div>
    </div>
  );
}
