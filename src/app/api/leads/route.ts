import { NextRequest, NextResponse } from "next/server";
import { checkLeadRateLimit } from "@/lib/rate-limit";
import { leadSchema } from "@/lib/lead-schema";
import { hasLeadChannelConfigured, sendLeadToEmail, sendLeadToTelegram } from "@/lib/lead-delivery";

export const runtime = "nodejs";

function buildRateLimitKey(request: NextRequest): string {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const ua = request.headers.get("user-agent") ?? "unknown";

  return `${ip}:${ua.slice(0, 80)}`;
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = leadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Validation error" }, { status: 400 });
  }

  if ((parsed.data.hp_field ?? "") !== "") {
    return NextResponse.json({ ok: false, error: "Spam detected" }, { status: 400 });
  }

  const rateLimit = await checkLeadRateLimit(buildRateLimitKey(request));

  if (!rateLimit.success) {
    return NextResponse.json({ ok: false, error: "Too many requests" }, { status: 429 });
  }

  const lead = parsed.data;
  const { telegramConfigured, emailConfigured } = hasLeadChannelConfigured();

  const [telegramSent, emailSent] = await Promise.all([
    sendLeadToTelegram(lead).catch(() => false),
    sendLeadToEmail(lead).catch(() => false),
  ]);

  if ((telegramConfigured || emailConfigured) && !telegramSent && !emailSent) {
    return NextResponse.json({ ok: false, error: "Delivery channels failed" }, { status: 502 });
  }

  return NextResponse.json(
    {
      ok: true,
      consentAt: new Date().toISOString(),
      delivered: {
        telegram: telegramSent,
        email: emailSent,
      },
    },
    { status: 200 },
  );
}
