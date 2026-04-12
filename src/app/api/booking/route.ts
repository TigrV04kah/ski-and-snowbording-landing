import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sanityWriteClient } from "@/lib/sanity/client";

export const runtime = "nodejs";

const bookingSchema = z.object({
  requestId: z.string().min(1),
  instructorSlug: z.string().min(1),
  hours: z.number().min(1).max(40),
  people: z.number().min(1).max(10),
  totalPrice: z.number().min(0),
  clientName: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(4).max(40),
  email: z.string().email().max(120),
  messenger: z.string().max(40).optional().default(""),
  comment: z.string().max(2000).optional().default(""),
  locale: z.enum(["ru", "en"]),
  consent: z.literal(true),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = bookingSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Validation error", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const data = parsed.data;

  if (!sanityWriteClient) {
    console.error("SANITY_API_TOKEN not configured — booking request not saved.");
    return NextResponse.json(
      { ok: false, error: "CMS write not configured" },
      { status: 500 },
    );
  }

  try {
    // Find instructor document by slug to create a reference
    const instructor = await sanityWriteClient.fetch<{ _id: string } | null>(
      `*[_type == "instructor" && slug.current == $slug][0]{_id}`,
      { slug: data.instructorSlug },
    );

    const doc = {
      _type: "bookingRequest",
      requestId: data.requestId,
      instructor: instructor
        ? { _type: "reference", _ref: instructor._id }
        : undefined,
      instructorSlug: data.instructorSlug,
      hours: data.hours,
      people: data.people,
      totalPrice: data.totalPrice,
      clientName: data.clientName,
      phone: data.phone,
      email: data.email,
      messenger: data.messenger,
      comment: data.comment,
      locale: data.locale,
      status: "new",
      submittedAt: new Date().toISOString(),
    };

    const created = await sanityWriteClient.create(doc);

    return NextResponse.json({
      ok: true,
      requestId: data.requestId,
      documentId: created._id,
    });
  } catch (err) {
    console.error("Failed to save booking request:", err);
    return NextResponse.json(
      { ok: false, error: "Failed to save request" },
      { status: 500 },
    );
  }
}
