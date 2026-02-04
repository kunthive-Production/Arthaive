import { NextRequest, NextResponse } from "next/server"
import { fundingData } from "@/data/funding-data"
import { exportDealsCSV, exportDealsJSON } from "@/lib/export"

export async function GET(req: NextRequest) {
  const format = req.nextUrl.searchParams.get("format") ?? "json"
  const data = fundingData as unknown as Array<Record<string, unknown>>

  if (format === "csv") {
    const csv = exportDealsCSV(data)
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="india-startup-funding.csv"`,
      },
    })
  }

  return new NextResponse(exportDealsJSON(data), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="india-startup-funding.json"`,
    },
  })
}
