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

export const reviewType = defineType({
  name: "review",
  title: "Review",
  type: "document",
  fields: [
    defineField({
      name: "instructor",
      title: "Instructor",
      type: "reference",
      to: [{ type: "instructor" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "author",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "rating",
      type: "number",
      validation: (rule) => rule.required().min(1).max(5),
    }),
    defineField({
      name: "textRich",
      title: "Text",
      type: "localizedPortableText",
      validation: (rule) =>
        rule.custom((value, context) => {
          const legacyValue = (context.document as { text?: unknown } | undefined)?.text;
          if (hasLocalizedPortableText(value) || hasLocalizedLegacyText(legacyValue)) {
            return true;
          }

          return "Fill Review Text in both RU and EN.";
        }),
    }),
    defineField({
      name: "text",
      title: "Text (legacy)",
      type: "localizedText",
      hidden: true,
      description: "Legacy plain-text field. Kept for backward compatibility.",
    }),
    defineField({
      name: "date",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "verified",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "isPublished",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "author",
      subtitle: "instructor.name",
    },
    prepare({ title, subtitle }) {
      return {
        title: `${title ?? "Unknown"}`,
        subtitle: subtitle ? `Instructor: ${subtitle}` : "Instructor",
      };
    },
  },
});
