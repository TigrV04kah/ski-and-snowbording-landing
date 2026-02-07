import { cookies } from "next/headers";
import { Locale } from "@/lib/types";
import { t } from "@/lib/i18n";

const STORAGE_KEY = "my-gudauri-cookie-consent";

export async function CookieBanner({ locale }: { locale: Locale }) {
  const copy = t(locale);
  const cookieStore = await cookies();
  const consent = cookieStore.get(STORAGE_KEY)?.value;

  if (consent === "accepted" || consent === "declined") {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-4 z-[200] px-4">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-3 rounded-2xl border border-[var(--line)] bg-white p-4 shadow-lg md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-[var(--ink-muted)]">{copy.cookie.text}</p>
        <div className="flex gap-2">
          <form method="GET" action="/api/cookie-consent">
            <input type="hidden" name="value" value="declined" />
            <button
              type="submit"
              className="cursor-pointer rounded-full border border-[var(--line)] px-4 py-2 text-sm"
            >
              {copy.cookie.decline}
            </button>
          </form>
          <form method="GET" action="/api/cookie-consent">
            <input type="hidden" name="value" value="accepted" />
            <button
              type="submit"
              className="cursor-pointer rounded-full bg-[var(--ink)] px-4 py-2 text-sm text-white"
            >
              {copy.cookie.accept}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
