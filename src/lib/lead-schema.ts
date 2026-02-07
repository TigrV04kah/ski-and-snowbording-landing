import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  contact: z.string().trim().min(4).max(120),
  inquiryType: z.enum(["instructor", "service"]),
  entitySlug: z.string().trim().max(120).optional(),
  message: z.string().trim().max(2000).optional(),
  locale: z.enum(["ru", "en"]),
  consent: z.literal(true),
  hp_field: z.string().max(0).optional().or(z.literal("")),
});

export type ValidLead = z.infer<typeof leadSchema>;
