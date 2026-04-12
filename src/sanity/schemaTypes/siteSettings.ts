import { defineArrayMember, defineField, defineType } from "sanity";

export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({ name: "siteName", type: "localizedString", validation: (rule) => rule.required() }),
    defineField({ name: "tagline", type: "localizedString", validation: (rule) => rule.required() }),
    defineField({ name: "description", type: "localizedText", validation: (rule) => rule.required() }),
    defineField({ name: "partnerCtaEmail", type: "string", validation: (rule) => rule.required().email() }),
    defineField({
      name: "hourlyRate",
      title: "Base hourly rate ($)",
      description: "Unified hourly rate for all instructors. Used on the catalog pricing banner.",
      type: "number",
      validation: (rule) => rule.min(0),
    }),
    defineField({ name: "contactPhone", type: "string" }),
    defineField({ name: "contactTelegram", type: "url" }),
    defineField({ name: "contactWhatsapp", type: "url" }),
    defineField({ name: "seoTitleDefault", type: "localizedString", validation: (rule) => rule.required() }),
    defineField({ name: "seoDescriptionDefault", type: "localizedText", validation: (rule) => rule.required() }),
    defineField({
      name: "socialLinks",
      type: "array",
      of: [defineArrayMember({ type: "socialLink" })],
    }),
  ],
});
