import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

const tags = ["instructors", "services", "articles", "reviews", "site-settings", "category-pages"];

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");

  if (!process.env.SANITY_REVALIDATE_SECRET || secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  tags.forEach((tag) => revalidateTag(tag, "max"));

  return NextResponse.json({ ok: true, revalidated: tags });
}
