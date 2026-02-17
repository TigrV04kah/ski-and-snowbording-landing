import { defineField, defineType } from "sanity";

function hasLocalizedPortableText(value: unknown): boolean {
  if (!value || typeof value !== "object") {
    return false;
  }

  const localized = value as { ru?: unknown; en?: unknown };
  return (
    Array.isArray(localized.ru) &&
    localized.ru.length > 0 &&
    Array.isArray(localized.en) &&
    localized.en.length > 0
  );
}

function hasLocalizedLegacyText(value: unknown): boolean {
  if (!value || typeof value !== "object") {
    return false;
  }

  const localized = value as { ru?: unknown; en?: unknown };
  return (
    typeof localized.ru === "string" &&
    localized.ru.trim().length > 0 &&
    typeof localized.en === "string" &&
    localized.en.trim().length > 0
  );
}

export const instructorType = defineType({
  name: "instructor",
  title: "Instructor",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "photo", type: "image", options: { hotspot: true }, validation: (rule) => rule.required() }),
    defineField({ name: "gallery", type: "array", of: [{ type: "image" }] }),
    defineField({
      name: "disciplines",
      title: "Disciplines (multi-select)",
      description: "Choose one or more disciplines",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Ski", value: "ski" },
          { title: "Snowboard", value: "snowboard" },
        ],
        layout: "tags",
      },
      validation: (rule) =>
        rule.custom((value, context) => {
          if (Array.isArray(value) && value.length > 0) {
            return true;
          }

          const legacyDiscipline = (context.document as { discipline?: unknown } | undefined)?.discipline;
          if (typeof legacyDiscipline === "string" && legacyDiscipline.length > 0) {
            return true;
          }

          return "Select at least one discipline";
        }),
    }),
    defineField({
      name: "discipline",
      type: "string",
      hidden: true,
      description: "Legacy field kept for backward compatibility.",
    }),
    defineField({
      name: "level",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Beginner", value: "beginner" },
          { title: "Intermediate", value: "intermediate" },
          { title: "Advanced", value: "advanced" },
        ],
      },
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "format",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Individual", value: "individual" },
          { title: "Group", value: "group" },
        ],
      },
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "languages",
      type: "array",
      of: [{ type: "string" }],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({ name: "experienceYears", type: "number", validation: (rule) => rule.required().min(0) }),
    defineField({ name: "priceFrom", type: "number" }),
    defineField({
      name: "shortBioRich",
      title: "Short Bio",
      type: "localizedPortableText",
      validation: (rule) =>
        rule.custom((value, context) => {
          const legacyValue = (context.document as { shortBio?: unknown } | undefined)?.shortBio;
          if (hasLocalizedPortableText(value) || hasLocalizedLegacyText(legacyValue)) {
            return true;
          }

          return "Fill Short Bio in both RU and EN.";
        }),
    }),
    defineField({
      name: "fullDescriptionRich",
      title: "Full Description",
      type: "localizedPortableText",
      validation: (rule) =>
        rule.custom((value, context) => {
          const legacyValue = (context.document as { fullDescription?: unknown } | undefined)?.fullDescription;
          if (hasLocalizedPortableText(value) || hasLocalizedLegacyText(legacyValue)) {
            return true;
          }

          return "Fill Full Description in both RU and EN.";
        }),
    }),
    defineField({ name: "includedRich", title: "Included", type: "localizedPortableText" }),
    defineField({ name: "notIncludedRich", title: "Not Included", type: "localizedPortableText" }),
    defineField({ name: "conditionsRich", title: "Conditions", type: "localizedPortableText" }),
    defineField({
      name: "shortBio",
      title: "Short Bio (legacy)",
      type: "localizedText",
      hidden: true,
      description: "Legacy plain-text field. Kept for backward compatibility.",
    }),
    defineField({
      name: "fullDescription",
      title: "Full Description (legacy)",
      type: "localizedText",
      hidden: true,
      description: "Legacy plain-text field. Kept for backward compatibility.",
    }),
    defineField({
      name: "included",
      title: "Included (legacy)",
      type: "localizedText",
      hidden: true,
      description: "Legacy plain-text field. Kept for backward compatibility.",
    }),
    defineField({
      name: "notIncluded",
      title: "Not Included (legacy)",
      type: "localizedText",
      hidden: true,
      description: "Legacy plain-text field. Kept for backward compatibility.",
    }),
    defineField({
      name: "conditions",
      title: "Conditions (legacy)",
      type: "localizedText",
      hidden: true,
      description: "Legacy plain-text field. Kept for backward compatibility.",
    }),
    defineField({ name: "contacts", type: "contactLinks", validation: (rule) => rule.required() }),
    defineField({ name: "isFeatured", type: "boolean", initialValue: false }),
    defineField({ name: "isPublished", type: "boolean", initialValue: false }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "disciplines",
      media: "photo",
    },
    prepare({ title, subtitle, media }) {
      const labels = Array.isArray(subtitle) ? subtitle.join(", ") : subtitle;
      return {
        title,
        subtitle: labels || "No disciplines",
        media,
      };
    },
  },
});
