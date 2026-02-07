# Handover Runbook (for friend/admin)

## 1. How to add an instructor
1. Open `/studio`.
2. Create `Instructor`.
3. Fill required fields: name, slug, photo, discipline, level, format, languages, short/full RU+EN, contacts.
4. Set `isPublished = true`.
5. Optionally set `isFeatured = true` to show on homepage.

## 2. How to update price
1. Open target Instructor/Service in Studio.
2. Change `priceFrom`.
3. Publish.

## 3. How to publish an article
1. Create `Article` in Studio.
2. Fill RU+EN fields (title, excerpt, content).
3. Set `publishedAt` and `isPublished = true`.
4. Publish.

## 4. If leads stop coming
1. Check Vercel logs for `/api/leads`.
2. Verify `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID`.
3. Verify SMTP env vars (`SMTP_*`, `LEADS_EMAIL_TO`).
4. Submit test lead from website.
5. If delivery fails, temporarily keep only one working channel (Telegram or Email) and fix second channel later.

## 5. Weekly 5-minute checklist
1. Open latest 10 listings and check contact links.
2. Confirm no outdated prices.
3. Ensure RU/EN texts are both filled.
4. Review form submissions in Telegram/email for spam patterns.
