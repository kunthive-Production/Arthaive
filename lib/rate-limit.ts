/**
 * In-memory token-bucket rate limiter. Process-local — fine for the single
 * Vercel function instance per request, but resets between cold starts.
 *
 * Two surfaces:
 *   - `rateLimit(id, max, windowMs)` → boolean (existing call sites)
 *   - `consume(id, max, windowMs)` → detailed info with remaining + resetAt (v1 API)
 */

const buckets = new Map<string, { count: number; resetAt: number }>()

export interface RateInfo {
  allowed: boolean
  remaining: number
  resetAt: number // ms epoch
  limit: number
}

export function consume(id: string, max: number, windowMs: number): RateInfo {
  const now = Date.now()
  const entry = buckets.get(id)

  if (!entry || now > entry.resetAt) {
    const resetAt = now + windowMs
    buckets.set(id, { count: 1, resetAt })
    return { allowed: true, remaining: max - 1, resetAt, limit: max }
  }

  if (entry.count >= max) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt, limit: max }
  }

  entry.count++
  return { allowed: true, remaining: max - entry.count, resetAt: entry.resetAt, limit: max }
}

export function rateLimit(ip: string, max = 60, windowMs = 60_000): boolean {
  return consume(ip, max, windowMs).allowed
}

// Public-API tiers used by every /api/v1/* route.
export const RATE_TIERS = {
  anon: { max: 30, windowMs: 60_000 },     // 30/min unauthenticated
  authenticated: { max: 120, windowMs: 60_000 }, // 120/min with API key
} as const
