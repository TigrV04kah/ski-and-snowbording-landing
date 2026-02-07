import Image from "next/image";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContactLinks } from "@/components/contact-links";
import { EntityCard } from "@/components/entity-card";
import { JsonLd } from "@/components/json-ld";
import { LeadForm } from "@/components/lead-form";
import { ReviewCarousel } from "@/components/review-carousel";
import { ViewTracker } from "@/components/view-tracker";
import { getInstructorBySlug, getInstructorReviews, getInstructors } from "@/lib/cms";
import { formatDiscipline, formatLevel, isLocale, t } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { imageUrl } from "@/lib/sanity/image";

export async function generateStaticParams() {
  const [ru, en] = await Promise.all([getInstructors("ru"), getInstructors("en")]);
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
  const instructor = await getInstructorBySlug(locale, slug);

  if (!instructor) {
    return buildMetadata({
      locale,
      title: "Not found",
      description: "",
      path: "/instructors",
    });
  }

  return buildMetadata({
    locale,
    title: `${instructor.name} — My Gudauri`,
    description: instructor.shortDescription,
    path: `/instructors/${slug}`,
  });
}

export default async function InstructorDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : "ru";
  const copy = t(locale);

  const [instructor, reviews] = await Promise.all([
    getInstructorBySlug(locale, slug),
    getInstructorReviews(locale, slug),
  ]);

  if (!instructor) {
    notFound();
  }

  const similar = (await getInstructors(locale))
    .filter((item) => item.slug !== instructor.slug)
    .filter((item) => item.discipline.some((value) => instructor.discipline.includes(value)))
    .slice(0, 3);

  return (
    <div className="space-y-8 pb-12">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: instructor.name,
          description: instructor.shortDescription,
          jobTitle: "Ski/Snowboard Instructor",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Gudauri",
            addressCountry: "GE",
          },
        }}
      />
      <ViewTracker
        event="view_profile"
        params={{ type: "instructor", locale, slug: instructor.slug }}
      />
      <section className="grid gap-6 rounded-3xl border border-[var(--line)] bg-white p-5 md:grid-cols-[1.3fr_1fr] md:p-8">
        <div className="space-y-4">
          <div className="relative h-72 overflow-hidden rounded-2xl md:h-96">
            <Image src={imageUrl(instructor.coverImage, 1200, 900)} alt={instructor.name} fill className="object-cover" />
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-[var(--ink-muted)]">
            {instructor.discipline.map((item) => (
              <span key={item} className="rounded-full bg-[var(--bg-soft)] px-2 py-1">
                {formatDiscipline(locale, item)}
              </span>
            ))}
            {instructor.level.map((level) => (
              <span key={level} className="rounded-full bg-[var(--bg-soft)] px-2 py-1">
                {formatLevel(locale, level)}
              </span>
            ))}
            {instructor.languages.map((lang) => (
              <span key={lang} className="rounded-full bg-[var(--bg-soft)] px-2 py-1">
                {lang.toUpperCase()}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="font-serif text-4xl leading-none">{instructor.name}</h1>
          <p className="text-sm text-[var(--ink-muted)]">{instructor.shortDescription}</p>
          <p className="text-sm text-[var(--ink-muted)]">{instructor.fullDescription}</p>
          <p className="text-sm font-semibold text-[var(--ink)]">
            {copy.labels.updatedAt}: {new Date(instructor.updatedAt).toLocaleDateString()}
          </p>
          {typeof instructor.priceFrom === "number" ? (
            <p className="text-lg font-semibold">
              {copy.fromPrice}: {instructor.priceFrom} GEL
            </p>
          ) : null}
          <ContactLinks locale={locale} contacts={instructor.contacts} />
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
        <ReviewCarousel locale={locale} reviews={reviews} />
        <LeadForm locale={locale} inquiryType="instructor" entitySlug={instructor.slug} />
      </section>

      {similar.length > 0 ? (
        <section className="space-y-4">
          <h2 className="font-serif text-3xl">{copy.labels.similar}</h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {similar.map((item) => (
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
          </div>
        </section>
      ) : null}
    </div>
  );
}
