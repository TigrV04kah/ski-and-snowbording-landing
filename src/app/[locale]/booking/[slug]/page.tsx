import { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookingFlow } from "@/components/booking-flow";
import { getInstructorBySlug } from "@/lib/cms";
import { isLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : "ru";
  const instructor = await getInstructorBySlug(locale, slug);

  return buildMetadata({
    locale,
    title: instructor
      ? locale === "ru"
        ? `Бронирование — ${instructor.name}`
        : `Book a lesson — ${instructor.name}`
      : "Booking",
    description: "",
    path: `/booking/${slug}`,
    noindex: true,
  });
}

export default async function BookingPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : "ru";

  const instructor = await getInstructorBySlug(locale, slug);
  if (!instructor) notFound();

  const price = instructor.priceFrom ?? 45;

  return (
    <div className="pb-20 md:pb-24">
      <BookingFlow
        locale={locale}
        instructorSlug={instructor.slug}
        instructorName={instructor.name}
        instructorImage={instructor.coverImage}
        pricePerHour={price}
      />
    </div>
  );
}
