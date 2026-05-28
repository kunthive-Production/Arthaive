import { NextResponse } from "next/server"
import { getSiteStats } from "@/lib/db/analytics"

export const revalidate = 3600

export async function GET() {
  try {
    const stats = await getSiteStats()
    return NextResponse.json(stats, {
      headers: { "Cache-Control": "public, max-age=3600, s-maxage=3600" },
    })
  } catch (error) {
    console.error("GET /api/stats error:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
