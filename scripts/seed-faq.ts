/**
 * Seed script: creates FAQ items in Sanity (ru + en).
 *
 * Usage:
 *   npx tsx scripts/seed-faq.ts
 *
 * Requires SANITY_API_TOKEN (Editor role) in .env.local.
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

interface SeedFaq {
  order: number;
  ru: { question: string; answer: string };
  en: { question: string; answer: string };
}

const SEED: SeedFaq[] = [
  {
    order: 1,
    ru: {
      question: "Цена зависит от конкретного инструктора?",
      answer:
        "Итоговая цена может различаться по опыту, формату и длительности, но на платформе удобно сравнить предложения без лишних переписок.",
    },
    en: {
      question: "Is the price different for each instructor?",
      answer:
        "Pricing can vary depending on experience, lesson format, and session length, but the platform makes it easy to compare options.",
    },
  },
  {
    order: 2,
    ru: {
      question: "Как распределяются часы занятий по дням?",
      answer:
        "Часы можно распределять по дням — вы согласовываете расписание напрямую с инструктором.",
    },
    en: {
      question: "How are lesson hours distributed across days?",
      answer:
        "Hours can be split across days — you arrange the schedule directly with the instructor.",
    },
  },
  {
    order: 3,
    ru: {
      question: "Как происходит бронирование?",
      answer:
        "Вы оставляете заявку на сайте, после чего связываетесь с инструктором или сервисом напрямую.",
    },
    en: {
      question: "How does the booking process work?",
      answer:
        "Submit a request on the site, then coordinate directly with the instructor to confirm timing and details.",
    },
  },
  {
    order: 4,
    ru: {
      question: "Когда я получу контакты инструктора?",
      answer:
        "Сразу после выбора профиля можно отправить запрос, контакты уже в карточке инструктора.",
    },
    en: {
      question: "When do I receive the instructor's contact details?",
      answer:
        "As soon as you pick a profile you can send a request — contacts are already listed in the card.",
    },
  },
];

async function main() {
  console.log(`Sanity project: ${projectId}  dataset: ${dataset}`);
  console.log(`Seeding ${SEED.length} FAQ items…\n`);

  // Idempotent: wipe any existing faqItem docs
  const existing = await client.fetch<{ _id: string }[]>(
    `*[_type == "faqItem"]{_id}`,
  );
  for (const doc of existing) {
    await client.delete(doc._id);
    console.log(`· removed existing ${doc._id}`);
  }

  for (const item of SEED) {
    const doc = {
      _type: "faqItem",
      order: item.order,
      isPublished: true,
      question: {
        _type: "localizedString",
        ru: item.ru.question,
        en: item.en.question,
      },
      answer: {
        _type: "localizedText",
        ru: item.ru.answer,
        en: item.en.answer,
      },
    };

    const created = await client.create(doc);
    console.log(`✓ [${item.order}] ${item.en.question}  →  ${created._id}`);
  }

  console.log("\n✅ Done.");
}

main().catch((err) => {
  console.error("\n❌ Seed failed:", err);
  process.exit(1);
});
