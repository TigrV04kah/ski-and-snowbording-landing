/**
 * Seed script: creates 3 featured instructors in Sanity.
 *
 * Usage:
 *   npx tsx scripts/seed-instructors.ts
 *
 * Requires SANITY_API_TOKEN (Editor role) in .env.local.
 */

import { createClient } from "next-sanity";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// Manually load .env.local — tsx scripts don't pick up Next.js env automatically
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

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-02-01";
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !dataset || !token) {
  console.error(
    "Missing env vars. Need NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_TOKEN.",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
  perspective: "raw",
});

/** Build a portable-text block for a single paragraph. */
function block(text: string, key: string) {
  return {
    _type: "block",
    _key: key,
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: `${key}s`, text, marks: [] }],
  };
}

interface SeedInstructor {
  name: string;
  slug: string;
  shortBioRu: string;
  shortBioEn: string;
}

const seedInstructors: SeedInstructor[] = [
  {
    name: "Mikhail Andreev",
    slug: "mikhail-andreev",
    shortBioRu:
      "Сертифицированный инструктор с опытом 10+ лет. Работает со сноубордом и горными лыжами.",
    shortBioEn:
      "Certified instructor with 10+ years of experience. Teaches both snowboard and ski.",
  },
  {
    name: "Oleg Yung",
    slug: "oleg-yung",
    shortBioRu:
      "Тренер фрирайда и беговых лыж. Индивидуальные и групповые занятия для любого уровня.",
    shortBioEn:
      "Freeride and cross-country coach. Individual and group sessions for every level.",
  },
  {
    name: "Ivan Volkov",
    slug: "ivan-volkov",
    shortBioRu:
      "Детский и семейный инструктор. Фокус на комфорте, уверенности и безопасности на склоне.",
    shortBioEn:
      "Kids and family instructor. Focus on comfort, confidence and safety on the slope.",
  },
];

async function uploadPhotoAsset(): Promise<string> {
  const photoPath = join(process.cwd(), "public/home/instructors.png");
  const buffer = readFileSync(photoPath);
  const asset = await client.assets.upload("image", buffer, {
    filename: "seed-instructor.png",
  });
  console.log(`✓ Uploaded photo asset: ${asset._id}`);
  return asset._id;
}

async function createInstructor(
  inst: SeedInstructor,
  photoAssetId: string,
): Promise<void> {
  // Delete any existing instructor with the same slug to make the script idempotent
  const existing = await client.fetch<{ _id: string }[]>(
    `*[_type == "instructor" && slug.current == $slug]{_id}`,
    { slug: inst.slug },
  );
  for (const doc of existing) {
    await client.delete(doc._id);
    console.log(`  · removed existing ${doc._id}`);
  }

  const doc = {
    _type: "instructor",
    name: inst.name,
    slug: { _type: "slug", current: inst.slug },
    photo: {
      _type: "image",
      asset: { _type: "reference", _ref: photoAssetId },
    },
    disciplines: ["ski", "snowboard"],
    level: ["beginner", "intermediate", "advanced"],
    format: ["individual", "group"],
    languages: ["ru", "en"],
    experienceYears: 10,
    priceFrom: 45,
    shortBioRich: {
      _type: "localizedPortableText",
      ru: [block(inst.shortBioRu, "sb-ru")],
      en: [block(inst.shortBioEn, "sb-en")],
    },
    fullDescriptionRich: {
      _type: "localizedPortableText",
      ru: [
        block(
          `${inst.name} ведёт частные и групповые уроки для взрослых и детей на всех уровнях подготовки.`,
          "fd-ru-1",
        ),
        block(
          "Специализация — индивидуальные занятия с фокусом на технику и уверенность на склоне.",
          "fd-ru-2",
        ),
      ],
      en: [
        block(
          `${inst.name} teaches private and group lessons for adults and kids across all skill levels.`,
          "fd-en-1",
        ),
        block(
          "Specialty — individual sessions focused on technique and confidence on the slope.",
          "fd-en-2",
        ),
      ],
    },
    contacts: {
      _type: "contactLinks",
      phone: "+995555000000",
      telegram: "https://t.me/mygudauri",
      whatsapp: "https://wa.me/995555000000",
    },
    isFeatured: true,
    isPublished: true,
  };

  const created = await client.create(doc);
  console.log(`✓ Created ${inst.name}  →  _id=${created._id}  slug=${inst.slug}`);
}

async function main() {
  console.log(`Sanity project: ${projectId}  dataset: ${dataset}`);
  console.log("Seeding 3 featured instructors…\n");

  const photoAssetId = await uploadPhotoAsset();
  console.log();

  for (const inst of seedInstructors) {
    await createInstructor(inst, photoAssetId);
  }

  console.log("\n✅ Done.");
}

main().catch((err) => {
  console.error("\n❌ Seed failed:", err);
  process.exit(1);
});
