import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { generateKey } from "@/lib/api/auth"
import { rateLimit } from "@/lib/rate-limit"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/**
 * POST /api/api-keys  { email, label? }
 *
 * Generates a new API key. The raw key is returned ONCE in the response — only
 * the SHA-256 hash is stored. Subsequent requests authenticate by re-hashing.
 *
 * Heavily rate-limited per IP (5 keys/hour) to prevent enumeration.
 */
export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anon"
  if (!rateLimit(`api-keys:${ip}`, 5, 60 * 60_000)) {
    return NextResponse.json({ error: "Too many key requests. Try again in an hour." }, { status: 429 })
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: "API key service unavailable" }, { status: 503 })
  }

  let body: { email?: string; label?: string }
  try {
    body = (await req.json()) as { email?: string; label?: string }
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const email = (body.email ?? "").trim().toLowerCase()
  const label = (body.label ?? "").trim().slice(0, 80) || null

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 })
  }

  const { raw, hash, prefix } = generateKey()

  const { error } = await supabaseAdmin.from("api_keys").insert({
    key_hash: hash,
    key_prefix: prefix,
    label,
    email,
  })

  if (error) {
    console.error("[api-keys] insert failed:", error)
    return NextResponse.json({ error: "Failed to create key" }, { status: 500 })
  }

  return NextResponse.json({
    key: raw,                // show ONCE — never returned again
    prefix,
    label,
    email,
    rate_limit_per_minute: 120,
    docs_url: "/api-docs",
    notice: "Store this key somewhere safe. It will not be shown again.",
  })
}
