import { createHash, randomBytes } from "crypto"
import type { NextRequest } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

const PREFIX_LEN = 8
const KEY_PREFIX = "ifk_" // "India Funding Key" — visible on the dashboard so users can tell their keys apart.

export interface ApiKeyContext {
  id: string
  email: string
  label: string | null
  authenticated: true
}

export interface AnonContext {
  authenticated: false
}

export type AuthContext = ApiKeyContext | AnonContext

export function hashKey(raw: string): string {
  return createHash("sha256").update(raw).digest("hex")
}

/** Build a new random key and return both the raw value (to show once) and the hash to store. */
export function generateKey(): { raw: string; hash: string; prefix: string } {
  const raw = `${KEY_PREFIX}${randomBytes(24).toString("hex")}`
  return { raw, hash: hashKey(raw), prefix: raw.slice(0, PREFIX_LEN) }
}

/**
 * Validate the X-API-Key header against the api_keys table.
 * Returns `{ authenticated: false }` when:
 *   - header is missing
 *   - Supabase is not configured
 *   - the key is unknown or revoked
 *
 * Returns `{ authenticated: true, ... }` on a valid match.
 */
export async function authenticateRequest(req: NextRequest): Promise<AuthContext> {
  const headerKey = req.headers.get("x-api-key")
  if (!headerKey || !supabaseAdmin) return { authenticated: false }

  const hash = hashKey(headerKey.trim())
  const { data, error } = await supabaseAdmin
    .from("api_keys")
    .select("id, email, label, revoked_at")
    .eq("key_hash", hash)
    .maybeSingle()

  if (error || !data || data.revoked_at) return { authenticated: false }
  return { authenticated: true, id: data.id, email: data.email, label: data.label }
}

/** Stable per-request identifier for rate-limiting: API key id if present, else client IP. */
export function rateLimitIdentity(req: NextRequest, ctx: AuthContext): string {
  if (ctx.authenticated) return `key:${ctx.id}`
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anon"
  return `ip:${ip}`
}
