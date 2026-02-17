import Image from "next/image";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleRichContent } from "@/components/article-rich-content";
import { ContactLinks } from "@/components/contact-links";
import { EntityCard } from "@/components/entity-card";
import { JsonLd } from "@/components/json-ld";
import { LeadForm } from "@/components/lead-form";
import { ViewTracker } from "@/components/view-tracker";
import { getServiceBySlug, getServices } from "@/lib/cms";
import { isLocale, t } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { imageUrl } from "@/lib/sanity/image";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const [ru, en] = await Promise.all([getServices("ru"), getServices("en")]);
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
  const service = await getServiceBySlug(locale, slug);

  if (!service) {
    return buildMetadata({ locale, title: "Not found", description: "", path: "/services" });
  }

  return buildMetadata({
    locale,
    title: `${service.name} — My Gudauri`,
    description: service.shortDescription,
    path: `/services/${slug}`,
  });
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : "ru";
  const copy = t(locale);

  const service = await getServiceBySlug(locale, slug);

  if (!service) {
    notFound();
  }

  const similar = (await getServices(locale))
    .filter((item) => item.slug !== service.slug && item.serviceType === service.serviceType)
    .slice(0, 3);

  const normalizedShortDescription = service.shortDescription.trim();
  const normalizedFullDescription = service.fullDescription.trim();
  const showFullDescription =
    normalizedFullDescription.length > 0 &&
    normalizedFullDescription !== normalizedShortDescription;

  return (
    <div className="space-y-8 pb-12">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: service.name,
          description: service.shortDescription,
          areaServed: "Gudauri, Georgia",
          provider: {
            "@type": "Organization",
            name: "My Gudauri partners",
          },
        }}
      />
      <ViewTracker event="view_profile" params={{ type: "service", locale, slug: service.slug }} />
      <section className="grid gap-6 rounded-3xl border border-[var(--line)] bg-white p-5 md:grid-cols-[1.3fr_1fr] md:p-8">
        <div className="space-y-4">
          <div className="relative h-72 overflow-hidden rounded-2xl md:h-96">
            <Image src={imageUrl(service.coverImage, 1200, 900)} alt={service.name} fill className="object-cover" />
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-[var(--ink-muted)]">
            <span className="rounded-full bg-[var(--bg-soft)] px-2 py-1">{service.serviceType}</span>
            {service.season ? <span className="rounded-full bg-[var(--bg-soft)] px-2 py-1">{service.season}</span> : null}
            {service.duration ? (
              <span className="rounded-full bg-[var(--bg-soft)] px-2 py-1">{service.duration}</span>
            ) : null}
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="font-serif text-4xl leading-none">{service.name}</h1>
          <ArticleRichContent content={service.shortDescriptionRich ?? service.shortDescription} />
          {showFullDescription ? (
            <ArticleRichContent content={service.fullDescriptionRich ?? service.fullDescription} />
          ) : null}
          <p className="text-sm font-semibold text-[var(--ink)]">
            {copy.labels.updatedAt}: {new Date(service.updatedAt).toLocaleDateString()}
          </p>
          {typeof service.priceFrom === "number" ? (
            <p className="text-lg font-semibold">
              {copy.fromPrice}: {service.priceFrom} GEL
            </p>
          ) : null}
          <ContactLinks locale={locale} contacts={service.contacts} />
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4 rounded-3xl border border-[var(--line)] bg-white p-6">
          <h2 className="font-serif text-3xl">{copy.labels.conditions}</h2>
          {service.included || service.includedRich ? (
            <div className="space-y-2 rounded-2xl bg-[var(--bg-soft)] p-4">
              <p className="text-sm font-semibold text-[var(--ink)]">{copy.labels.included}</p>
              <ArticleRichContent content={service.includedRich ?? service.included ?? ""} />
            </div>
          ) : null}
          {service.conditions || service.conditionsRich ? (
            <div className="space-y-2 rounded-2xl bg-[var(--bg-soft)] p-4">
              <p className="text-sm font-semibold text-[var(--ink)]">{copy.labels.conditions}</p>
              <ArticleRichContent content={service.conditionsRich ?? service.conditions ?? ""} />
            </div>
          ) : null}
        </div>
        <LeadForm locale={locale} inquiryType="service" entitySlug={service.slug} />
      </section>

      {similar.length > 0 ? (
        <section className="space-y-4">
          <h2 className="font-serif text-3xl">{copy.labels.similar}</h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {similar.map((item) => (
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
          </div>
        </section>
      ) : null}
    </div>
  );
}
