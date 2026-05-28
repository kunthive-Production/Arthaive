import { NextResponse } from "next/server"
import { getCoverageRange } from "@/lib/db/analytics"

const VERSION = "1"

interface Meta {
  total?: number
  page?: number
  limit?: number
  coverage_note?: string
  version: string
}

interface RateInfo {
  remaining: number
  resetAt: number // ms epoch
  limit: number
}

export interface ApiEnvelope<T> {
  data: T
  meta: Meta
}

let coverageNoteCache: { note: string; expiresAt: number } | null = null

/**
 * Returns a human-readable coverage note, e.g. "Data complete from 2024-01-01 onwards".
 * Cached for 10 minutes — this is fetched on every API response.
 */
async function getCoverageNote(): Promise<string> {
  if (coverageNoteCache && coverageNoteCache.expiresAt > Date.now()) {
    return coverageNoteCache.note
  }
  try {
    const { earliest, total } = await getCoverageRange()
    const note = earliest
      ? `Data complete from ${earliest} onwards (${total.toLocaleString()} verified records).`
      : "Coverage range unavailable."
    coverageNoteCache = { note, expiresAt: Date.now() + 10 * 60_000 }
    return note
  } catch {
    return "Coverage range unavailable."
  }
}

interface ApiResponseOptions {
  total?: number
  page?: number
  limit?: number
  rate?: RateInfo
  cache?: { maxAgeSeconds: number }
}

/** Standard JSON envelope for all v1 responses. */
export async function apiResponse<T>(
  data: T,
  opts: ApiResponseOptions = {},
): Promise<NextResponse> {
  const meta: Meta = {
    version: VERSION,
    coverage_note: await getCoverageNote(),
  }
  if (opts.total != null) meta.total = opts.total
  if (opts.page != null) meta.page = opts.page
  if (opts.limit != null) meta.limit = opts.limit

  const headers: Record<string, string> = {}
  if (opts.rate) {
    headers["X-RateLimit-Limit"] = String(opts.rate.limit)
    headers["X-RateLimit-Remaining"] = String(opts.rate.remaining)
    headers["X-RateLimit-Reset"] = String(Math.floor(opts.rate.resetAt / 1000))
  }
  if (opts.cache) {
    headers["Cache-Control"] = `public, max-age=${opts.cache.maxAgeSeconds}, s-maxage=${opts.cache.maxAgeSeconds}`
  }

  return NextResponse.json({ data, meta }, { headers })
}

export function apiError(
  message: string,
  status: number,
  extra?: Record<string, unknown>,
): NextResponse {
  return NextResponse.json(
    { error: { message, status, ...extra }, meta: { version: VERSION } },
    { status },
  )
}
