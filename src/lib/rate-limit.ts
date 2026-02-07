import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const MAX_REQUESTS = 8;
const WINDOW_MS = 60_000;

type Bucket = { count: number; resetAt: number };

const memoryBuckets = new Map<string, Bucket>();

const hasUpstash =
  Boolean(process.env.UPSTASH_REDIS_REST_URL) && Boolean(process.env.UPSTASH_REDIS_REST_TOKEN);

const upstashLimiter = hasUpstash
  ? new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(MAX_REQUESTS, "1 m"),
      analytics: true,
      prefix: "my-gudauri:leads",
    })
  : null;

function checkMemory(key: string) {
  const now = Date.now();
  const bucket = memoryBuckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    const resetAt = now + WINDOW_MS;
    memoryBuckets.set(key, { count: 1, resetAt });
    return { success: true, remaining: MAX_REQUESTS - 1, resetAt };
  }

  bucket.count += 1;
  memoryBuckets.set(key, bucket);

  return {
    success: bucket.count <= MAX_REQUESTS,
    remaining: Math.max(0, MAX_REQUESTS - bucket.count),
    resetAt: bucket.resetAt,
  };
}

export async function checkLeadRateLimit(key: string) {
  if (upstashLimiter) {
    const result = await upstashLimiter.limit(key);
    return {
      success: result.success,
      remaining: result.remaining,
      resetAt: result.reset,
    };
  }

  return checkMemory(key);
}
