import { defineField, defineType } from "sanity";

export const categoryPageType = defineType({
  name: "categoryPage",
  title: "Category page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "localizedString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title.ru", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "kind",
      title: "Category kind",
      type: "string",
      options: {
        list: [
          { title: "Instructors", value: "instructors" },
          { title: "Tours", value: "tours" },
          { title: "Rental", value: "rental" },
          { title: "Places", value: "places" },
          { title: "Services", value: "services" },
          { title: "Transfer", value: "transfer" },
          { title: "Real estate", value: "real-estate" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "homeOrder",
      title: "Homepage order",
      type: "number",
      initialValue: 10,
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: "description",
      type: "localizedText",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tags",
      title: "Card tags",
      type: "array",
      of: [{ type: "string" }],
      validation: (rule) => rule.max(6),
    }),
    defineField({
      name: "contentRich",
      title: "Page content",
      type: "localizedPortableText",
    }),
    defineField({ name: "isPublished", type: "boolean", initialValue: false }),
  ],
  preview: {
    select: {
      title: "title.ru",
      subtitle: "kind",
    },
  },
});
