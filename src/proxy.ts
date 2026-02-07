import { NextResponse, type NextRequest } from "next/server";

const locales = ["ru", "en"];
const ignored = ["/_next", "/api", "/studio", "/favicon.ico", "/sitemap.xml", "/robots.txt"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (ignored.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  const pathSegments = pathname.split("/").filter(Boolean);
  const firstSegment = pathSegments[0];

  if (!firstSegment) {
    const url = request.nextUrl.clone();
    url.pathname = "/ru";
    return NextResponse.rewrite(url);
  }

  if (locales.includes(firstSegment)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `/ru${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!.*\\..*).*)"],
};
