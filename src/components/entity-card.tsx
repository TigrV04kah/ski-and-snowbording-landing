import Image from "next/image";
import Link from "next/link";
import { Locale } from "@/lib/types";
import { t, toLocalePath } from "@/lib/i18n";
import { imageUrl } from "@/lib/sanity/image";

interface EntityCardProps {
  locale: Locale;
  href: string;
  name: string;
  description: string;
  image?: unknown;
  tags?: string[];
  priceFrom?: number;
  isInstructor?: boolean;
}

export function EntityCard({
  locale,
  href,
  name,
  description,
  image,
  tags,
  priceFrom,
  isInstructor = false,
}: EntityCardProps) {
  const copy = t(locale);

  return (
    <article className="group overflow-hidden rounded-3xl border border-[var(--line)] bg-white shadow-[0_14px_40px_-30px_rgba(20,33,61,0.45)]">
      <div className="relative h-52 w-full overflow-hidden">
        <Image
          src={imageUrl(image, 900, 600)}
          alt={name}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="space-y-3 p-5">
        <div className="flex flex-wrap gap-2 text-xs text-[var(--ink-muted)]">
          {tags?.slice(0, 3).map((tag) => (
            <span key={tag} className="rounded-full bg-[var(--bg-soft)] px-2 py-1">
              {tag}
            </span>
          ))}
        </div>
        <h3 className="font-serif text-2xl leading-none text-[var(--ink)]">{name}</h3>
        <p className="line-clamp-3 text-sm text-[var(--ink-muted)]">{description}</p>
        <div className="flex items-center justify-between gap-3 pt-1">
          {typeof priceFrom === "number" ? (
            <p className="text-sm font-semibold text-[var(--ink)]">
              {copy.fromPrice}: {priceFrom} GEL
            </p>
          ) : (
            <span />
          )}
          <Link
            href={toLocalePath(locale, href)}
            className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm text-white transition hover:opacity-90"
          >
            {isInstructor ? copy.labels.viewProfile : copy.labels.viewDetails}
          </Link>
        </div>
      </div>
    </article>
  );
}
