import { Metadata } from "next";
import { EntityCard } from "@/components/entity-card";
import { FilterPanel } from "@/components/filter-panel";
import { ViewTracker } from "@/components/view-tracker";
import { getInstructors } from "@/lib/cms";
import { filterInstructors, toStringRecord } from "@/lib/filters";
import { formatDiscipline, formatLevel, isLocale, t } from "@/lib/i18n";
import { buildMetadata, hasFilterParams } from "@/lib/seo";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const [{ locale: rawLocale }, query] = await Promise.all([params, searchParams]);
  const locale = isLocale(rawLocale) ? rawLocale : "ru";

  return buildMetadata({
    locale,
    title: locale === "ru" ? "Инструкторы в Гудаури" : "Instructors in Gudauri",
    description:
      locale === "ru"
        ? "Лыжи и сноуборд: индивидуальные и групповые занятия в Гудаури."
        : "Ski and snowboard lessons in Gudauri: private and group formats.",
    path: "/instructors",
    noindex: hasFilterParams(query),
  });
}

export default async function InstructorsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ locale: rawLocale }, rawFilters] = await Promise.all([params, searchParams]);
  const locale = isLocale(rawLocale) ? rawLocale : "ru";
  const copy = t(locale);

  const filters = toStringRecord(rawFilters);
  const instructors = await getInstructors(locale);
  const filtered = filterInstructors(instructors, filters);

  const languageOptions = Array.from(new Set(instructors.flatMap((item) => item.languages))).map((lang) => ({
    value: lang,
    label: lang.toUpperCase(),
  }));

  return (
    <div className="space-y-6 pb-10">
      <ViewTracker event="view_catalog" params={{ type: "instructors", locale }} />
      <section className="space-y-2">
        <h1 className="font-serif text-4xl md:text-5xl">{copy.sections.instructors}</h1>
        <p className="max-w-3xl text-sm text-[var(--ink-muted)]">
          {locale === "ru"
            ? "Лыжи и сноуборд, индивидуальные и групповые занятия. Выбирайте формат и язык обучения."
            : "Ski and snowboard coaching for private and group sessions. Filter by level, format, and language."}
        </p>
      </section>

      <FilterPanel
        locale={locale}
        fields={[
          {
            key: "discipline",
            label: copy.labels.discipline,
            options: [
              { value: "ski", label: formatDiscipline(locale, "ski") },
              { value: "snowboard", label: formatDiscipline(locale, "snowboard") },
            ],
          },
          {
            key: "level",
            label: copy.labels.level,
            options: [
              { value: "beginner", label: formatLevel(locale, "beginner") },
              { value: "intermediate", label: formatLevel(locale, "intermediate") },
              { value: "advanced", label: formatLevel(locale, "advanced") },
            ],
          },
          {
            key: "format",
            label: copy.labels.format,
            options: [
              { value: "individual", label: "Individual" },
              { value: "group", label: "Group" },
            ],
          },
          {
            key: "language",
            label: copy.labels.language,
            options: languageOptions,
          },
          {
            key: "maxPrice",
            label: copy.labels.maxPrice,
            options: [],
            type: "number",
          },
        ]}
      />

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-[var(--line)] bg-white p-6 text-sm text-[var(--ink-muted)]">
          {copy.noResults}
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => (
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
      )}
    </div>
  );
}
