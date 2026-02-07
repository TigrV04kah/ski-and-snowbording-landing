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
    title: locale === "ru" ? "Политика конфиденциальности" : "Privacy policy",
    description: locale === "ru" ? "Правила обработки персональных данных." : "Personal data handling policy.",
    path: "/privacy",
    noindex: true,
  });
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : "ru";

  return (
    <article className="mx-auto max-w-3xl space-y-4 pb-12 text-sm text-[var(--ink-muted)]">
      <h1 className="font-serif text-4xl text-[var(--ink)]">
        {locale === "ru" ? "Политика конфиденциальности" : "Privacy policy"}
      </h1>
      <p>
        {locale === "ru"
          ? "Мы собираем данные, которые пользователь добровольно отправляет через форму заявки: имя, контакт, комментарий и время отправки согласия."
          : "We collect data voluntarily submitted via the lead form: name, contact details, message, and consent timestamp."}
      </p>
      <p>
        {locale === "ru"
          ? "Данные используются только для связи по заявке и не передаются третьим лицам, кроме технических провайдеров, обеспечивающих работу сайта и доставку уведомлений."
          : "Data is used only for lead communication and is not shared with third parties except technical providers required to operate the website and notifications."}
      </p>
      <p>
        {locale === "ru"
          ? "Запрос на удаление данных можно отправить на email: privacy@mygudauri.com"
          : "Data deletion requests can be sent to privacy@mygudauri.com"}
      </p>
    </article>
  );
}
