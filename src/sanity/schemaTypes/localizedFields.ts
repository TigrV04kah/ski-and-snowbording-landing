import { defineArrayMember, defineField, defineType } from "sanity";

export const localizedString = defineType({
  name: "localizedString",
  title: "Localized string",
  type: "object",
  fields: [
    defineField({
      name: "ru",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "en",
      type: "string",
      validation: (rule) => rule.required(),
    }),
  ],
});

export const localizedText = defineType({
  name: "localizedText",
  title: "Localized text",
  type: "object",
  fields: [
    defineField({
      name: "ru",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "en",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
  ],
});

const portableTextMembers = [
  defineArrayMember({
    type: "block",
    styles: [
      { title: "Normal", value: "normal" },
      { title: "Heading 2", value: "h2" },
      { title: "Heading 3", value: "h3" },
      { title: "Heading 4", value: "h4" },
      { title: "Quote", value: "blockquote" },
    ],
    lists: [
      { title: "Bulleted", value: "bullet" },
      { title: "Numbered", value: "number" },
    ],
    marks: {
      decorators: [
        { title: "Bold", value: "strong" },
        { title: "Italic", value: "em" },
        { title: "Underline", value: "underline" },
        { title: "Strike", value: "strike-through" },
        { title: "Code", value: "code" },
      ],
      annotations: [
        defineArrayMember({
          name: "link",
          title: "Link",
          type: "object",
          fields: [
            defineField({
              name: "href",
              type: "url",
              validation: (rule) => rule.required().uri({ scheme: ["http", "https", "mailto", "tel"] }),
            }),
            defineField({
              name: "openInNewTab",
              type: "boolean",
              initialValue: true,
            }),
          ],
        }),
      ],
    },
  }),
  defineArrayMember({
    type: "image",
    options: { hotspot: true },
    fields: [
      defineField({
        name: "alt",
        type: "string",
        title: "Alt text",
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: "caption",
        type: "string",
        title: "Caption",
      }),
    ],
  }),
];

export const localizedPortableText = defineType({
  name: "localizedPortableText",
  title: "Localized rich text",
  type: "object",
  fields: [
    defineField({
      name: "ru",
      type: "array",
      of: portableTextMembers,
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "en",
      type: "array",
      of: portableTextMembers,
      validation: (rule) => rule.required().min(1),
    }),
  ],
});
