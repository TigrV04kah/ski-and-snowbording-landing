import { defineField, defineType } from "sanity";

export const contactLinksType = defineType({
  name: "contactLinks",
  type: "object",
  fields: [
    defineField({ name: "whatsapp", type: "url" }),
    defineField({ name: "telegram", type: "url" }),
    defineField({ name: "phone", type: "string" }),
  ],
});

export const socialLinkType = defineType({
  name: "socialLink",
  type: "object",
  fields: [
    defineField({ name: "label", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "url", type: "url", validation: (rule) => rule.required() }),
  ],
});
