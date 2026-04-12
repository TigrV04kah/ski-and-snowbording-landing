/**
 * Seed script: creates 2 test reviews per instructor in Sanity.
 *
 * Usage:
 *   npx tsx scripts/seed-reviews.ts
 */

import { createClient } from "next-sanity";
import { readFileSync } from "node:fs";
import { join } from "node:path";

function loadDotenv(): void {
  const envPath = join(process.cwd(), ".env.local");
  const content = readFileSync(envPath, "utf8");
  for (const rawLine of content.split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const match = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (!match) continue;
    const [, key, value] = match;
    if (!(key in process.env)) {
      process.env[key] = value.replace(/^["']|["']$/g, "");
    }
  }
}

loadDotenv();

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-02-01";
const token = process.env.SANITY_API_TOKEN!;

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
  perspective: "raw",
});

interface SeedReview {
  author: string;
  rating: number;
  textRu: string;
  textEn: string;
  date: string;
}

const reviews: SeedReview[] = [
  {
    author: "Maria Lyon",
    rating: 5,
    textRu: "Отличный инструктор! Очень терпеливый, объясняет доступно. Ребёнок встал на доску за 2 часа.",
    textEn: "Great instructor! Very patient and clear. My kid was riding the board in 2 hours.",
    date: "2026-02-15",
  },
  {
    author: "Nikita Semenov",
    rating: 5,
    textRu: "Занимались 3 дня по 2 часа. Техника улучшилась кардинально. Рекомендую.",
    textEn: "Had 3 days of 2-hour sessions. Technique improved dramatically. Highly recommend.",
    date: "2026-03-01",
  },
];

async function main() {
  console.log(`Sanity project: ${projectId}  dataset: ${dataset}`);

  // Find all instructors
  const instructors = await client.fetch<{ _id: string; slug: string }[]>(
    `*[_type == "instructor" && isPublished == true]{_id, "slug": slug.current}`,
  );

  if (instructors.length === 0) {
    console.error("No published instructors found. Run seed-instructors.ts first.");
    process.exit(1);
  }

  console.log(`Found ${instructors.length} instructors. Seeding 2 reviews each…\n`);

  // Wipe existing seeded reviews
  const existing = await client.fetch<{ _id: string }[]>(`*[_type == "review"]{_id}`);
  for (const doc of existing) {
    await client.delete(doc._id);
  }
  if (existing.length > 0) {
    console.log(`· removed ${existing.length} existing reviews`);
  }

  for (const inst of instructors) {
    for (const review of reviews) {
      const doc = {
        _type: "review",
        instructor: { _type: "reference", _ref: inst._id },
        author: review.author,
        rating: review.rating,
        text: {
          _type: "localizedText",
          ru: review.textRu,
          en: review.textEn,
        },
        date: review.date,
        verified: true,
        isPublished: true,
      };

      const created = await client.create(doc);
      console.log(`✓ ${inst.slug} ← review by ${review.author} (${created._id})`);
    }
  }

  console.log("\n✅ Done.");
}

main().catch((err) => {
  console.error("\n❌ Seed failed:", err);
  process.exit(1);
});
