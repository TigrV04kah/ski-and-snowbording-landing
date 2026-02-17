import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { imageUrl } from "@/lib/sanity/image";

type PortableContentBlock = { _type: string; [key: string]: unknown };
type ArticleContent = string | PortableContentBlock[];

const portableTextComponents: PortableTextComponents = {
  block: {
    h2: ({ children }) => <h2 className="mt-8 font-serif text-3xl text-[var(--ink)]">{children}</h2>,
    h3: ({ children }) => <h3 className="mt-6 font-serif text-2xl text-[var(--ink)]">{children}</h3>,
    h4: ({ children }) => <h4 className="mt-4 font-serif text-xl text-[var(--ink)]">{children}</h4>,
    normal: ({ children }) => <p className="leading-7 text-[var(--ink-muted)]">{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-4 border-[var(--line)] pl-4 italic text-[var(--ink-muted)]">{children}</blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="ml-6 list-disc space-y-2 text-[var(--ink-muted)]">{children}</ul>,
    number: ({ children }) => <ol className="ml-6 list-decimal space-y-2 text-[var(--ink-muted)]">{children}</ol>,
  },
  marks: {
    underline: ({ children }) => <span className="underline underline-offset-4">{children}</span>,
    "strike-through": ({ children }) => <span className="line-through">{children}</span>,
    code: ({ children }) => (
      <code className="rounded bg-[var(--bg-soft)] px-1.5 py-0.5 font-mono text-[0.95em] text-[var(--ink)]">
        {children}
      </code>
    ),
    link: ({ children, value }) => {
      const href = typeof (value as { href?: unknown } | undefined)?.href === "string"
        ? (value as { href: string }).href
        : "#";
      const isExternal = href.startsWith("http://") || href.startsWith("https://");
      const openInNewTab =
        typeof (value as { openInNewTab?: unknown } | undefined)?.openInNewTab === "boolean"
          ? Boolean((value as { openInNewTab: boolean }).openInNewTab)
          : isExternal;

      return (
        <a
          href={href}
          className="underline underline-offset-4"
          target={openInNewTab ? "_blank" : undefined}
          rel={openInNewTab ? "noreferrer noopener" : undefined}
        >
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }) => {
      const altText = (value as { alt?: unknown } | undefined)?.alt;
      const captionText = (value as { caption?: unknown } | undefined)?.caption;
      const alt = typeof altText === "string" ? altText : "";
      const caption = typeof captionText === "string" ? captionText : "";

      return (
        <figure className="my-6 overflow-hidden rounded-2xl border border-[var(--line)] bg-white">
          <Image
            src={imageUrl(value, 1400, 900)}
            alt={alt || "Article image"}
            width={1400}
            height={900}
            className="h-auto w-full object-cover"
          />
          {caption || alt ? (
            <figcaption className="px-4 py-3 text-sm text-[var(--ink-muted)]">{caption || alt}</figcaption>
          ) : null}
        </figure>
      );
    },
  },
};

export function ArticleRichContent({ content }: { content: ArticleContent }) {
  if (typeof content === "string") {
    return <div className="whitespace-pre-line leading-7 text-[var(--ink-muted)]">{content}</div>;
  }

  if (!Array.isArray(content) || content.length === 0) {
    return null;
  }

  const portableBlocks = content.filter((item): item is PortableContentBlock => {
    return typeof item === "object" && item !== null && typeof (item as { _type?: unknown })._type === "string";
  });

  if (portableBlocks.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <PortableText value={portableBlocks} components={portableTextComponents} />
    </div>
  );
}
