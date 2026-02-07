import { defineField, defineType } from "sanity";

export const articleType = defineType({
  name: "article",
  title: "Article",
  type: "document",
  fields: [
    defineField({ name: "title", type: "localizedString", validation: (rule) => rule.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title.ru", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "cover", type: "image", options: { hotspot: true }, validation: (rule) => rule.required() }),
    defineField({ name: "category", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "excerpt", type: "localizedText", validation: (rule) => rule.required() }),
    defineField({
      name: "contentRich",
      title: "Content",
      type: "localizedPortableText",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "content",
      type: "localizedText",
      hidden: true,
      description: "Legacy plain-text content. Kept for backward compatibility.",
    }),
    defineField({ name: "seoTitle", type: "localizedString" }),
    defineField({ name: "seoDescription", type: "localizedText" }),
    defineField({ name: "publishedAt", type: "datetime", validation: (rule) => rule.required() }),
    defineField({ name: "isPublished", type: "boolean", initialValue: false }),
  ],
  preview: {
    select: {
      title: "title.ru",
      subtitle: "category",
      media: "cover",
    },
  },
});
