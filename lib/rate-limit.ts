import { NextRequest, NextResponse } from "next/server";

type RateLimitOptions = {
  windowMs: number;
  max: number;
  keyPrefix?: string;
};

type HitInfo = {
  count: number;
  resetTime: number;
};

// In-memory store (per server instance) for rate limiting.
// For production at scale, replace this with Redis or another shared store.
const hits = new Map<string, HitInfo>();

/**
 * Simple in-memory rate limiter for Next.js App Router routes.
 *
 * Limits requests per IP + path within a given time window.
 * Returns a NextResponse when the limit is exceeded, or null when allowed.
 */
export function rateLimit(
  request: NextRequest,
  options: RateLimitOptions
): NextResponse | null {
  const { windowMs, max, keyPrefix = "rl" } = options;
  const now = Date.now();

  const ip =
    request.ip ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";

  const path = request.nextUrl.pathname;
  const key = `${keyPrefix}:${ip}:${path}`;

  const existing = hits.get(key);

  if (!existing || now > existing.resetTime) {
    hits.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });
    return null;
  }

  if (existing.count >= max) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((existing.resetTime - now) / 1000)
    );

    return NextResponse.json(
      {
        error: "Too many requests. Please try again later.",
      },
      {
        status: 429,
        headers: {
          "Retry-After": retryAfterSeconds.toString(),
        },
      }
    );
  }

  existing.count += 1;
  return null;
}
