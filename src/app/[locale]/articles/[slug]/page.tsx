import Image from "next/image";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleRichContent } from "@/components/article-rich-content";
import { getArticleBySlug, getArticles } from "@/lib/cms";
import { isLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { imageUrl } from "@/lib/sanity/image";

export async function generateStaticParams() {
  const [ru, en] = await Promise.all([getArticles("ru"), getArticles("en")]);
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
  const article = await getArticleBySlug(locale, slug);

  if (!article) {
    return buildMetadata({ locale, title: "Not found", description: "", path: "/articles" });
  }

  return buildMetadata({
    locale,
    title: article.seoTitle ?? article.title,
    description: article.seoDescription ?? article.excerpt,
    path: `/articles/${slug}`,
  });
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : "ru";
  const article = await getArticleBySlug(locale, slug);

  if (!article) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-3xl space-y-6 pb-12">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-wide text-[var(--ink-muted)]">{article.category}</p>
        <h1 className="font-serif text-4xl leading-tight md:text-5xl">{article.title}</h1>
        <p className="text-sm text-[var(--ink-muted)]">{article.excerpt}</p>
      </div>

      <div className="relative h-72 overflow-hidden rounded-3xl md:h-96">
        <Image src={imageUrl(article.coverImage, 1300, 900)} alt={article.title} fill className="object-cover" />
      </div>

      <ArticleRichContent content={article.content} />
    </article>
  );
}
