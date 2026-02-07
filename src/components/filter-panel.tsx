"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Locale } from "@/lib/types";
import { t } from "@/lib/i18n";

interface Option {
  value: string;
  label: string;
}

interface FilterPanelProps {
  locale: Locale;
  fields: {
    key: string;
    label: string;
    options: Option[];
    type?: "select" | "number";
  }[];
}

export function FilterPanel({ locale, fields }: FilterPanelProps) {
  const copy = t(locale);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const values = useMemo(() => {
    const output: Record<string, string> = {};

    fields.forEach((field) => {
      output[field.key] = searchParams.get(field.key) ?? "";
    });

    return output;
  }, [fields, searchParams]);

  function apply(formData: FormData) {
    const params = new URLSearchParams();

    fields.forEach((field) => {
      const value = String(formData.get(field.key) ?? "").trim();
      if (value) {
        params.set(field.key, value);
      }
    });

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <form
      action={apply}
      className="rounded-3xl border border-[var(--line)] bg-white p-4 md:p-5"
    >
      <div className="mb-3 text-sm font-semibold">{copy.filtersTitle}</div>
      <div className="grid gap-3 md:grid-cols-5">
        {fields.map((field) => {
          const isSelect = field.type !== "number";
          return (
            <label key={field.key} className="flex flex-col gap-2 text-sm">
              <span className="text-[var(--ink-muted)]">{field.label}</span>
              {isSelect ? (
                <select
                  name={field.key}
                  defaultValue={values[field.key]}
                  className="h-10 rounded-xl border border-[var(--line)] px-3 outline-none focus:border-[var(--accent)]"
                >
                  <option value="">Any</option>
                  {field.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  name={field.key}
                  defaultValue={values[field.key]}
                  type="number"
                  min={0}
                  className="h-10 rounded-xl border border-[var(--line)] px-3 outline-none focus:border-[var(--accent)]"
                />
              )}
            </label>
          );
        })}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="submit"
          className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm text-white transition hover:opacity-90"
        >
          {copy.applyFilters}
        </button>
        <button
          type="button"
          onClick={() => router.push(pathname)}
          className="rounded-full border border-[var(--line)] px-4 py-2 text-sm"
        >
          {copy.clearFilters}
        </button>
      </div>
    </form>
  );
}
