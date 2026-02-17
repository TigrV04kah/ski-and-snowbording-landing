import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { getHomeData } from "@/lib/cms";
import { isLocale, toLocalePath } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { Locale } from "@/lib/types";

interface HomeCategoryCard {
  key: string;
  title: string;
  description: string;
  href: string;
  tags: string[];
  className: string;
  tagTone?: "soft" | "accent";
}

function formatHeroDate(locale: Locale) {
  return new Intl.DateTimeFormat(locale === "ru" ? "ru-RU" : "en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
    .format(new Date())
    .replace(/\./g, "")
    .toLowerCase();
}

function resolveHeroVariant(value: string | string[] | undefined): 1 | 2 | 3 {
  const input = Array.isArray(value) ? value[0] : value;
  if (input === "1") {
    return 1;
  }
  if (input === "3") {
    return 3;
  }

  return 2;
}

function buildCategoryCards(locale: Locale): HomeCategoryCard[] {
  const isRu = locale === "ru";
  const services = toLocalePath(locale, "/services");

  return [
    {
      key: "instructors",
      title: "Instructors",
      description: isRu ? "Проверенные лыжные и сноуборд инструкторы." : "Verified ski and snowboard instructors.",
      href: toLocalePath(locale, "/instructors"),
      tags: isRu ? ["ski", "snowboard"] : ["ski", "snowboard"],
      className: "xl:col-span-3 xl:row-span-2",
    },
    {
      key: "tours",
      title: "Tours",
      description: isRu ? "Сопровождение и маршруты по Гудаури." : "Guided routes and freeride tours in Gudauri.",
      href: `${services}?serviceType=tour`,
      tags: ["Freeride", "Ski tour"],
      className: "xl:col-span-4",
      tagTone: "accent",
    },
    {
      key: "rental",
      title: "Rental",
      description: isRu ? "Прокат досок, лыж и защитного снаряжения." : "Rent boards, skis, and protective gear.",
      href: `${services}?serviceType=rental`,
      tags: isRu ? ["snowboards", "ski"] : ["snowboards", "ski"],
      className: "xl:col-span-5",
    },
    {
      key: "places",
      title: "Places",
      description: isRu ? "Лучшие места для еды, отдыха и aprés-ski." : "Best places to eat, chill and après-ski.",
      href: toLocalePath(locale, "/articles"),
      tags: isRu ? ["Bars", "Restaurants"] : ["Bars", "Restaurants"],
      className: "xl:col-span-6",
    },
    {
      key: "services",
      title: "Services",
      description: isRu ? "Фото, видео и семейные сервисы на склоне." : "Photo, video, and family services on slope.",
      href: toLocalePath(locale, "/services"),
      tags: isRu ? ["Nannies", "Foto", "Video"] : ["Nannies", "Photo", "Video"],
      className: "xl:col-span-3 xl:row-span-2",
    },
    {
      key: "transfer",
      title: "Transfer",
      description: isRu ? "Комфортная логистика до и от курорта." : "Reliable transfers to and from the resort.",
      href: `${services}?serviceType=transfer`,
      tags: ["Batumi - Gudauri", "Tbilisi - Gudauri"],
      className: "xl:col-span-5",
    },
    {
      key: "real-estate",
      title: "Real estate",
      description: isRu ? "Апартаменты и шале рядом со склоном." : "Apartments and chalets near the slopes.",
      href: `${services}?serviceType=accommodation`,
      tags: ["Apartments", "Chalets"],
      className: "xl:col-span-4",
      tagTone: "accent",
    },
  ];
}

function CategoryCard({ card }: { card: HomeCategoryCard }) {
  return (
    <Link
      href={card.href}
      className={`group relative min-h-[225px] overflow-hidden rounded-[2rem] border border-white/80 bg-[#ececec] px-7 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] transition hover:-translate-y-0.5 hover:shadow-xl md:min-h-[235px] md:px-9 md:py-5 ${card.className}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/85 via-white/30 to-transparent" />

      <div className="relative z-10 flex h-full flex-col gap-2">
        <h2 className="font-sans text-4xl font-black leading-[0.95] tracking-tight text-[#151618] md:text-5xl">
          {card.title}
        </h2>
        <p className="max-w-[30ch] text-lg leading-snug text-black/45">{card.description}</p>

        <div className="mt-auto flex flex-wrap gap-2 pt-4">
          {card.tags.map((tag) => (
            <span
              key={`${card.key}-${tag}`}
              className={`rounded-full px-3 py-1 text-sm font-medium ${
                card.tagTone === "accent"
                  ? "bg-[#ff4b4b] text-white"
                  : "bg-black/10 text-black/80 backdrop-blur"
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : "ru";
  const home = await getHomeData(locale);

  return buildMetadata({
    locale,
    title: home.settings.seoTitleDefault,
    description: home.settings.seoDescriptionDefault,
    path: "/",
  });
}

export default async function HomePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ locale: rawLocale }, query] = await Promise.all([params, searchParams]);
  const locale = isLocale(rawLocale) ? rawLocale : "ru";
  const heroVariant = resolveHeroVariant(query.hero);
  const heroImage = `/home/mountains-${heroVariant}.jpg`;
  const cards = buildCategoryCards(locale);

  return (
    <div className="space-y-12 pb-12">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "My Gudauri",
          url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://mygudauri.example.com",
          inLanguage: locale,
        }}
      />

      <section className="-mx-4 overflow-hidden rounded-b-[2rem] border-b border-[var(--line)] bg-[#f4f5f7] md:-mx-6">
        <div className="relative px-4 pt-6 md:px-6 md:pt-8">
          <div className="pointer-events-none absolute left-[-10%] top-5 hidden h-[2px] w-[140%] -rotate-[22deg] bg-black/15 md:block" />
          <div className="pointer-events-none absolute left-[-14%] top-20 hidden h-[2px] w-[140%] -rotate-[22deg] bg-black/15 md:block" />
          <div className="pointer-events-none absolute left-[-18%] top-36 hidden h-[2px] w-[140%] -rotate-[22deg] bg-black/15 md:block" />

          <div className="relative z-10 mx-auto mt-14 flex max-w-5xl flex-col items-center text-center md:mt-20 lg:mt-24">
            <span className="rounded-lg bg-[#ff4b4b] px-2.5 py-1 text-sm font-bold text-white">
              {formatHeroDate(locale)}
            </span>
            <h1 className="mt-4 font-sans text-6xl font-black uppercase leading-[0.88] tracking-tight text-[#232427] md:text-8xl lg:text-9xl">
              MY GUDAURI
            </h1>
            <p className="mt-4 max-w-xl text-xl text-black/80">
              {locale === "ru"
                ? "Все сервисы Гудаури, один удобный поиск"
                : "All Gudauri services, one easy search"}
            </p>
          </div>

        </div>

        <div className="relative mt-8 h-52 md:h-72 lg:h-[22rem]">
          <Image src={heroImage} alt="Gudauri mountains" fill className="object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#f4f5f7] via-transparent to-transparent" />
        </div>
      </section>

      <section id="sections" className="-mx-4 scroll-mt-28 rounded-[2rem] bg-[#dedede] px-6 py-4 md:-mx-6 md:px-10 md:py-5">
        <div className="grid gap-x-4 gap-y-8 md:grid-cols-2 md:gap-x-[18px] md:gap-y-10 xl:auto-rows-[220px] xl:grid-cols-12 xl:gap-x-5 xl:gap-y-10">
          {cards.map((card) => (
            <CategoryCard key={card.key} card={card} />
          ))}
        </div>
      </section>

      <div id="about-gudauri" className="scroll-mt-28" />
    </div>
  );
}
