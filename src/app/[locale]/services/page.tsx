import { Metadata } from "next";
import { EntityCard } from "@/components/entity-card";
import { FilterPanel } from "@/components/filter-panel";
import { ViewTracker } from "@/components/view-tracker";
import { getServices } from "@/lib/cms";
import { filterServices, toStringRecord } from "@/lib/filters";
import { isLocale, t } from "@/lib/i18n";
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
    title: locale === "ru" ? "Услуги в Гудаури" : "Services in Gudauri",
    description:
      locale === "ru"
        ? "Прокат, трансфер, фото и другие сервисы для отдыха в Гудаури."
        : "Rental, transfer, photo and other local services in Gudauri.",
    path: "/services",
    noindex: hasFilterParams(query),
  });
}

export default async function ServicesPage({
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
  const services = await getServices(locale);
  const filtered = filterServices(services, filters);

  const typeOptions = Array.from(new Set(services.map((item) => item.serviceType))).map((value) => ({
    value,
    label: value,
  }));

  const seasonOptions = Array.from(new Set(services.map((item) => item.season).filter(Boolean))).map((value) => ({
    value: String(value),
    label: String(value),
  }));

  return (
    <div className="space-y-6 pb-10">
      <ViewTracker event="view_catalog" params={{ type: "services", locale }} />
      <section className="space-y-2">
        <h1 className="font-serif text-4xl md:text-5xl">{copy.sections.services}</h1>
        <p className="max-w-3xl text-sm text-[var(--ink-muted)]">
          {locale === "ru"
            ? "Локальные сервисы, которые закрывают ключевые задачи на курорте: логистика, снаряжение, сопровождение."
            : "Local services that cover core resort needs: logistics, gear, and on-slope support."}
        </p>
      </section>

      <FilterPanel
        locale={locale}
        fields={[
          {
            key: "serviceType",
            label: copy.labels.serviceType,
            options: typeOptions,
          },
          {
            key: "season",
            label: copy.labels.season,
            options: seasonOptions,
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
              href={`/services/${item.slug}`}
              name={item.name}
              description={item.shortDescription}
              image={item.coverImage}
              tags={[item.serviceType, item.season ?? ""]}
              priceFrom={item.priceFrom}
            />
          ))}
        </div>
      )}
    </div>
  );
}
