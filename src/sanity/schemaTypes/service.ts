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

export const serviceType = defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "cover", type: "image", options: { hotspot: true }, validation: (rule) => rule.required() }),
    defineField({ name: "gallery", type: "array", of: [{ type: "image" }] }),
    defineField({ name: "serviceType", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "duration", type: "string" }),
    defineField({ name: "season", type: "string" }),
    defineField({ name: "priceFrom", type: "number" }),
    defineField({
      name: "descriptionRich",
      title: "Description",
      type: "localizedPortableText",
      validation: (rule) =>
        rule.custom((value, context) => {
          const legacyValue = (context.document as { description?: unknown } | undefined)?.description;
          if (hasLocalizedPortableText(value) || hasLocalizedLegacyText(legacyValue)) {
            return true;
          }

          return "Fill Description in both RU and EN.";
        }),
    }),
    defineField({ name: "includedRich", title: "Included", type: "localizedPortableText" }),
    defineField({ name: "conditionsRich", title: "Conditions", type: "localizedPortableText" }),
    defineField({
      name: "description",
      title: "Description (legacy)",
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
      subtitle: "serviceType",
      media: "cover",
    },
  },
});
