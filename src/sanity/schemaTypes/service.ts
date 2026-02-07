import { defineField, defineType } from "sanity";

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
    defineField({ name: "description", type: "localizedText", validation: (rule) => rule.required() }),
    defineField({ name: "included", type: "localizedText" }),
    defineField({ name: "conditions", type: "localizedText" }),
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
