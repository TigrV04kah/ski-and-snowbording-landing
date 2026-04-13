import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

type Bucket = { count: number; resetAt: number };

const hasUpstash =
  Boolean(process.env.UPSTASH_REDIS_REST_URL) && Boolean(process.env.UPSTASH_REDIS_REST_TOKEN);

/* ─── leads limiter — 8 requests per minute ──────────────── */

const LEADS_MAX = 8;
const LEADS_WINDOW_MS = 60_000;
const leadsMemoryBuckets = new Map<string, Bucket>();

const leadsUpstashLimiter = hasUpstash
  ? new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(LEADS_MAX, "1 m"),
      analytics: true,
      prefix: "my-gudauri:leads",
    })
  : null;

/* ─── booking limiter — 3 requests per hour ──────────────── */

const BOOKING_MAX = 3;
const BOOKING_WINDOW_MS = 60 * 60 * 1000;
const bookingMemoryBuckets = new Map<string, Bucket>();

const bookingUpstashLimiter = hasUpstash
  ? new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(BOOKING_MAX, "1 h"),
      analytics: true,
      prefix: "my-gudauri:booking",
    })
  : null;

/* ─── shared in-memory bucket impl ──────────────────────── */

function checkMemoryBucket(
  key: string,
  buckets: Map<string, Bucket>,
  max: number,
  windowMs: number,
) {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    const resetAt = now + windowMs;
    buckets.set(key, { count: 1, resetAt });
    return { success: true, remaining: max - 1, resetAt };
  }

  bucket.count += 1;
  buckets.set(key, bucket);

  return {
    success: bucket.count <= max,
    remaining: Math.max(0, max - bucket.count),
    resetAt: bucket.resetAt,
  };
}

/* ─── public API ────────────────────────────────────────── */

export async function checkLeadRateLimit(key: string) {
  if (leadsUpstashLimiter) {
    const result = await leadsUpstashLimiter.limit(key);
    return {
      success: result.success,
      remaining: result.remaining,
      resetAt: result.reset,
    };
  }

  return checkMemoryBucket(key, leadsMemoryBuckets, LEADS_MAX, LEADS_WINDOW_MS);
}

export async function checkBookingRateLimit(key: string) {
  if (bookingUpstashLimiter) {
    const result = await bookingUpstashLimiter.limit(key);
    return {
      success: result.success,
      remaining: result.remaining,
      resetAt: result.reset,
    };
  }

  return checkMemoryBucket(
    key,
    bookingMemoryBuckets,
    BOOKING_MAX,
    BOOKING_WINDOW_MS,
  );
}
