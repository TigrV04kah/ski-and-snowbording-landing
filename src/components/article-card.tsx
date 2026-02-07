import Image from "next/image";
import Link from "next/link";
import { Article, Locale } from "@/lib/types";
import { imageUrl } from "@/lib/sanity/image";
import { t, toLocalePath } from "@/lib/i18n";

export function ArticleCard({ locale, article }: { locale: Locale; article: Article }) {
  const copy = t(locale);

  return (
    <article className="overflow-hidden rounded-3xl border border-[var(--line)] bg-white">
      <div className="relative h-44">
        <Image src={imageUrl(article.coverImage, 800, 500)} alt={article.title} fill className="object-cover" />
      </div>
      <div className="space-y-2 p-5">
        <p className="text-xs uppercase tracking-wide text-[var(--ink-muted)]">{article.category}</p>
        <h3 className="font-serif text-xl leading-tight text-[var(--ink)]">{article.title}</h3>
        <p className="line-clamp-3 text-sm text-[var(--ink-muted)]">{article.excerpt}</p>
        <Link href={toLocalePath(locale, `/articles/${article.slug}`)} className="text-sm font-semibold underline">
          {copy.labels.readMore}
        </Link>
      </div>
    </article>
  );
}
