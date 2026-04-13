import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sanityWriteClient } from "@/lib/sanity/client";
import { checkBookingRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

/* ─── schema ────────────────────────────────────────────── */

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
  // ─── anti-spam fields (Layer 2 + 3) — accept any value, custom checks below ──
  hp_field: z.string().optional().default(""),
  formStartedAt: z.number().int().positive(),
});

const MIN_FORM_FILL_MS = 3000;

/* ─── helpers ───────────────────────────────────────────── */

function buildRateLimitKey(request: NextRequest): string {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const ua = request.headers.get("user-agent") ?? "unknown";
  return `${ip}:${ua.slice(0, 80)}`;
}

function isOriginTrusted(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const host = request.headers.get("host");

  // In dev mode allow localhost/127.0.0.1
  if (process.env.NODE_ENV !== "production") {
    return true;
  }

  // Production — must come from our own host
  if (!origin && !referer) return false;

  const expected = host ? [`https://${host}`, `http://${host}`] : [];
  const explicitSite = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicitSite) expected.push(explicitSite);

  const matches = (url: string | null) =>
    url ? expected.some((e) => url.startsWith(e)) : false;

  return matches(origin) || matches(referer);
}

/* ─── handler ───────────────────────────────────────────── */

export async function POST(request: NextRequest) {
  // Layer 4 — Origin/Referer check
  if (!isOriginTrusted(request)) {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = bookingSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Validation error", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const data = parsed.data;

  // Layer 2 — Honeypot: silently accept (200) so bots don't know
  if ((data.hp_field ?? "") !== "") {
    return NextResponse.json({ ok: true, requestId: data.requestId });
  }

  // Layer 3 — Min form fill time: silently accept too fast submissions
  const elapsed = Date.now() - data.formStartedAt;
  if (elapsed < MIN_FORM_FILL_MS) {
    return NextResponse.json({ ok: true, requestId: data.requestId });
  }

  // Layer 1 — Rate limit: 3 per hour per IP+UA
  const rateLimit = await checkBookingRateLimit(buildRateLimitKey(request));
  if (!rateLimit.success) {
    return NextResponse.json(
      { ok: false, error: "Too many requests" },
      { status: 429 },
    );
  }

  // ─── Save to Sanity ────────────────────────────────────
  if (!sanityWriteClient) {
    console.error("SANITY_API_TOKEN not configured — booking request not saved.");
    return NextResponse.json(
      { ok: false, error: "CMS write not configured" },
      { status: 500 },
    );
  }

  try {
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
