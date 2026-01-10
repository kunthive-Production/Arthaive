import { NextRequest, NextResponse } from "next/server"
import { getDeals } from "@/lib/db/deals"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    const filters = {
      search: searchParams.get("search") || "",
      investorSearch: searchParams.get("investor") || "",
      sectors: searchParams.getAll("sector"),
      stages: searchParams.getAll("stage"),
      location: searchParams.get("location") || "",
      minAmount: Number(searchParams.get("minAmount") || 0),
      maxAmount: Number(searchParams.get("maxAmount") || Infinity),
      years: searchParams.getAll("year"),
      showUndisclosed: searchParams.get("undisclosed") !== "false",
      sortBy: (searchParams.get("sort") || "date") as "date" | "amount",
      page: Number(searchParams.get("page") || 1),
      limit: Math.min(Number(searchParams.get("limit") || 20), 100),
    }

    const result = await getDeals(filters)
    return NextResponse.json(result)
  } catch (error) {
    console.error("GET /api/deals error:", error)
    return NextResponse.json({ error: "Failed to fetch deals" }, { status: 500 })
  }
}
