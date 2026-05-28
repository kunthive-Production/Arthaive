import { v1Route } from "@/lib/api/handler"
import { apiResponse } from "@/lib/api/response"
import { getSectorStats } from "@/lib/db/analytics"

export const dynamic = "force-dynamic"

/**
 * GET /api/v1/trends/sectors?from=2024-01-01&to=2024-12-31
 *
 * Returns sector funding totals. (Date range is a no-op for now — getSectorStats
 * aggregates across all verified deals; a future revision could push the filter down.)
 */
export const GET = v1Route(async (_req, { rate }) => {
  const stats = await getSectorStats()
  const series = stats.map((s) => ({
    sector: s.sector,
    deal_count: s.dealCount,
    total_funding_inr: s.totalFunding,
    avg_deal_size_inr: s.avgDealSize,
    pct_of_total: s.percentage,
  }))
  return apiResponse(series, {
    total: series.length,
    rate,
    cache: { maxAgeSeconds: 3600 },
  })
})
