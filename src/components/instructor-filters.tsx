"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterDef {
  key: string;
  label: string;
  options: FilterOption[];
}

function FilterDropdown({
  filter,
  activeValue,
  onSelect,
}: {
  filter: FilterDef;
  activeValue: string | null;
  onSelect: (key: string, value: string | null) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const onPointerDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onEscape);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm transition ${
          activeValue
            ? "border-[var(--accent)] bg-[var(--accent)] text-white"
            : "border-[var(--line)] bg-white text-[var(--ink)] hover:border-[var(--ink-muted)]"
        }`}
      >
        <span>
          {activeValue
            ? filter.options.find((o) => o.value === activeValue)?.label ?? filter.label
            : filter.label}
        </span>
        <span
          className={`text-[0.55rem] transition-transform ${isOpen ? "rotate-180" : ""}`}
        >
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-1 min-w-48 overflow-hidden rounded-xl border border-[var(--line)] bg-white p-1.5 shadow-[0_12px_32px_-16px_rgba(0,0,0,0.2)] before:absolute before:inset-x-0 before:-top-2 before:h-2">
          {activeValue && (
            <button
              type="button"
              onClick={() => {
                onSelect(filter.key, null);
                setIsOpen(false);
              }}
              className="block w-full rounded-lg px-3 py-2 text-left text-sm text-[var(--ink-muted)] hover:bg-[var(--bg-soft)]"
            >
              {filter.label === "Направление" || filter.label === "Discipline"
                ? "Все"
                : "All"}
            </button>
          )}
          {filter.options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onSelect(
                  filter.key,
                  activeValue === option.value ? null : option.value,
                );
                setIsOpen(false);
              }}
              className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                activeValue === option.value
                  ? "bg-[var(--ink)] text-white"
                  : "text-[var(--ink)] hover:bg-[var(--bg-soft)]"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function InstructorFilters({
  filters,
  countLabel,
}: {
  filters: FilterDef[];
  countLabel: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSelect = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  return (
    <div className="flex flex-wrap items-center gap-3">
      {filters.map((filter) => (
        <FilterDropdown
          key={filter.key}
          filter={filter}
          activeValue={searchParams.get(filter.key)}
          onSelect={handleSelect}
        />
      ))}
      <span className="ml-auto text-sm text-[var(--ink-muted)]">
        {countLabel}
      </span>
    </div>
  );
}
