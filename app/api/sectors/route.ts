import { NextResponse } from "next/server"
import { getSectorStats } from "@/lib/db/analytics"
import { getAllSectors } from "@/lib/db/deals"

export const revalidate = 3600

export async function GET() {
  try {
    const [stats, allSectors] = await Promise.all([getSectorStats(), getAllSectors()])
    return NextResponse.json(
      { stats, sectors: allSectors },
      { headers: { "Cache-Control": "public, max-age=3600, s-maxage=3600" } },
    )
  } catch (error) {
    console.error("GET /api/sectors error:", error)
    return NextResponse.json({ error: "Failed to fetch sectors" }, { status: 500 })
  }
}
