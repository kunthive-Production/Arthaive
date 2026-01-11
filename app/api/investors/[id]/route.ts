import { NextRequest, NextResponse } from "next/server"
import { getInvestorBySlug } from "@/lib/db/investors"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const investor = await getInvestorBySlug(decodeURIComponent(id))
    if (!investor) return NextResponse.json({ error: "Investor not found" }, { status: 404 })
    return NextResponse.json(investor)
  } catch (error) {
    console.error("GET /api/investors/[id] error:", error)
    return NextResponse.json({ error: "Failed to fetch investor" }, { status: 500 })
  }
}
