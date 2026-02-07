import { defineField, defineType } from "sanity";

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
      name: "text",
      type: "localizedText",
      validation: (rule) => rule.required(),
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
