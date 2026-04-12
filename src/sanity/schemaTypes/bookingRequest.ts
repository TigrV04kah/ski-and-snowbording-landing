import { defineField, defineType } from "sanity";

export const bookingRequestType = defineType({
  name: "bookingRequest",
  title: "Booking Request",
  type: "document",
  fields: [
    defineField({
      name: "requestId",
      title: "Request ID",
      type: "string",
      readOnly: true,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "instructor",
      title: "Instructor",
      type: "reference",
      to: [{ type: "instructor" }],
    }),
    defineField({
      name: "instructorSlug",
      title: "Instructor slug",
      type: "string",
    }),
    defineField({
      name: "hours",
      title: "Lesson hours",
      type: "number",
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "people",
      title: "Number of people",
      type: "number",
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "totalPrice",
      title: "Total price ($)",
      type: "number",
    }),
    defineField({
      name: "clientName",
      title: "Client name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
    }),
    defineField({
      name: "messenger",
      title: "Preferred messenger",
      type: "string",
    }),
    defineField({
      name: "comment",
      title: "Comment",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "locale",
      title: "Locale",
      type: "string",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "New", value: "new" },
          { title: "Contacted", value: "contacted" },
          { title: "Confirmed", value: "confirmed" },
          { title: "Paid", value: "paid" },
          { title: "Completed", value: "completed" },
          { title: "Cancelled", value: "cancelled" },
        ],
      },
      initialValue: "new",
    }),
    defineField({
      name: "submittedAt",
      title: "Submitted at",
      type: "datetime",
      readOnly: true,
    }),
  ],
  orderings: [
    {
      title: "Newest first",
      name: "submittedDesc",
      by: [{ field: "submittedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "requestId",
      clientName: "clientName",
      status: "status",
      date: "submittedAt",
    },
    prepare({ title, clientName, status, date }) {
      const d = date ? new Date(date).toLocaleDateString() : "";
      return {
        title: `${title} — ${clientName || "?"}`,
        subtitle: `${status || "new"} · ${d}`,
      };
    },
  },
});
