import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "my-gudauri-cookie-consent";
const ALLOWED_VALUES = new Set(["accepted", "declined"]);

export function GET(request: NextRequest) {
  const value = request.nextUrl.searchParams.get("value") ?? "";
  const redirect = request.nextUrl.searchParams.get("redirect") || "/";

  const safeValue = ALLOWED_VALUES.has(value) ? value : "declined";
  let safeRedirect = redirect.startsWith("/") ? redirect : "/";

  if (!request.nextUrl.searchParams.get("redirect")) {
    const referer = request.headers.get("referer");
    if (referer) {
      try {
        const refUrl = new URL(referer);
        safeRedirect = `${refUrl.pathname}${refUrl.search}`;
      } catch {
        safeRedirect = "/";
      }
    }
  }
  const protocol = request.headers.get("x-forwarded-proto") ?? request.nextUrl.protocol.replace(":", "");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "127.0.0.1:3000";
  const redirectUrl = new URL(safeRedirect, `${protocol}://${host}`);
  const response = NextResponse.redirect(redirectUrl);

  response.cookies.set({
    name: COOKIE_NAME,
    value: safeValue,
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    httpOnly: false,
    secure: request.nextUrl.protocol === "https:",
  });

  return response;
}
