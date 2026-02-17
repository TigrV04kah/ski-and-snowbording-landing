# My Gudauri (MVP)

Next.js + Sanity landing/catalog for ski & snowboard instructors and local services in Gudauri.

## Stack
- Next.js 16 (App Router, TypeScript)
- Sanity (headless CMS + Studio)
- Vercel-ready deployment
- Lead API with validation, honeypot, rate-limit, Telegram + email backup
- RU/EN localization

## Routes
- `/` (RU default via middleware rewrite)
- `/instructors`, `/instructors/[slug]`
- `/services`, `/services/[slug]`
- `/articles`, `/articles/[slug]`
- `/categories/[slug]` (separate landing page for each homepage category block)
- `/privacy`, `/cookies`
- `/en/*` localized English routes
- `/studio` Sanity Studio
- `POST /api/leads`

## Local start
1. Copy `.env.example` to `.env.local` and fill values.
2. Install dependencies: `npm install`
3. Run website: `npm run dev`
4. Run Sanity Studio: `npm run studio`

## Lead delivery
`POST /api/leads` payload:
- `name` (required)
- `contact` (required)
- `inquiryType` (`instructor|service`)
- `entitySlug` (optional)
- `message` (optional)
- `locale` (`ru|en`)
- `consent` (must be true)
- `hp_field` (must be empty)

## Webhook revalidation
Use Sanity webhook:
- URL: `https://<domain>/api/revalidate?secret=<SANITY_REVALIDATE_SECRET>`
- Method: POST

## Handover
Operational instructions are in `/docs/HANDOVER.md`.
