import { Metadata } from "next";
import { isLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : "ru";

  return buildMetadata({
    locale,
    title: locale === "ru" ? "Cookie policy" : "Cookie policy",
    description: locale === "ru" ? "Использование cookies на сайте." : "Cookie usage on the website.",
    path: "/cookies",
    noindex: true,
  });
}

export default async function CookiesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : "ru";

  return (
    <article className="mx-auto max-w-3xl space-y-4 pb-12 text-sm text-[var(--ink-muted)]">
      <h1 className="font-serif text-4xl text-[var(--ink)]">Cookie policy</h1>
      <p>
        {locale === "ru"
          ? "Мы используем технические cookies и, при согласии пользователя, аналитические cookies (GA4/Я.Метрика) для оценки качества сервиса."
          : "We use technical cookies and, after user consent, analytics cookies (GA4/Yandex Metrica) to evaluate service quality."}
      </p>
      <p>
        {locale === "ru"
          ? "Вы можете изменить решение о согласии, очистив cookies в браузере и выбрав вариант заново."
          : "You can change your decision at any time by clearing browser cookies and choosing again."}
      </p>
    </article>
  );
}
