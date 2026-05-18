import { NextResponse } from "next/server"
import { fundingData } from "@/data/funding-data"

export const dynamic = "force-dynamic"

export async function GET() {
  return NextResponse.json({
    status: "ok",
    version: process.env.npm_package_version ?? "0.1.0",
    env: process.env.NODE_ENV,
    deals: fundingData.length,
    ts: new Date().toISOString(),
    uptime: process.uptime ? Math.floor(process.uptime()) : null,
  })
}
