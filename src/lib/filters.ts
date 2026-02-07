import { Instructor, Service } from "@/lib/types";

export interface InstructorFilterInput {
  discipline?: string;
  level?: string;
  format?: string;
  language?: string;
  maxPrice?: string;
}

export interface ServiceFilterInput {
  serviceType?: string;
  season?: string;
}

export function filterInstructors(items: Instructor[], filters: InstructorFilterInput): Instructor[] {
  return items.filter((item) => {
    if (filters.discipline && !item.discipline.includes(filters.discipline as Instructor["discipline"][number])) {
      return false;
    }

    if (filters.level && !item.level.includes(filters.level as Instructor["level"][number])) {
      return false;
    }

    if (filters.format && !item.format.includes(filters.format as Instructor["format"][number])) {
      return false;
    }

    if (filters.language && !item.languages.includes(filters.language)) {
      return false;
    }

    if (
      filters.maxPrice &&
      filters.format !== "group" &&
      item.priceFrom &&
      item.priceFrom > Number(filters.maxPrice)
    ) {
      return false;
    }

    return true;
  });
}

export function filterServices(items: Service[], filters: ServiceFilterInput): Service[] {
  return items.filter((item) => {
    if (filters.serviceType && item.serviceType !== filters.serviceType) {
      return false;
    }

    if (filters.season && item.season !== filters.season) {
      return false;
    }

    return true;
  });
}

export function toStringRecord(
  searchParams: Record<string, string | string[] | undefined>,
): Record<string, string> {
  return Object.entries(searchParams).reduce<Record<string, string>>((acc, [key, value]) => {
    if (typeof value === "string" && value.length > 0) {
      acc[key] = value;
    }

    return acc;
  }, {});
}
