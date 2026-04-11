import type { Metadata } from "next";
import { Manrope, Paytone_One } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { TrackingScripts } from "@/components/tracking-scripts";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
});

const paytone = Paytone_One({
  subsets: ["latin"],
  variable: "--font-paytone",
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://mygudauri.example.com"),
  title: "My Gudauri",
  description: "Gudauri instructors and services in one focused directory.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${manrope.variable} ${paytone.variable} antialiased`}>
        {children}
        <TrackingScripts />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
