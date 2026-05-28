import type { NextRequest } from "next/server"
import { v1Route } from "@/lib/api/handler"
import { apiResponse, apiError } from "@/lib/api/response"
import { getInvestorBySlug } from "@/lib/db/investors"
import { getDeals } from "@/lib/db/deals"

export const dynamic = "force-dynamic"

/**
 * GET /api/v1/investors/:id
 *
 * `id` is the investor slug (lower-kebab-case). Returns the investor profile + deal history.
 */
async function handler(req: NextRequest, { rate }: Parameters<Parameters<typeof v1Route>[0]>[1]) {
  const slug = decodeURIComponent(req.nextUrl.pathname.split("/").pop() ?? "")
  if (!slug) return apiError("Missing investor id", 400)

  const investor = await getInvestorBySlug(slug)
  if (!investor) return apiError("Investor not found", 404)

  // Ensure deal list — getInvestorBySlug fills `deals` from Supabase but static
  // fallback returns them already; backfill if missing.
  let deals = investor.deals ?? []
  if (deals.length === 0) {
    const result = await getDeals({ investorSearch: investor.name, limit: 200 })
    deals = result.deals
  }

  return apiResponse(
    {
      id: investor.id,
      slug: investor.slug,
      name: investor.name,
      type: investor.type,
      website: investor.website ?? null,
      deal_count: investor.dealCount,
      total_deployed_inr: investor.totalDeployed,
      sectors: investor.sectors,
      stages: investor.stages,
      cities: investor.cities,
      deals: deals.map((d) => ({
        id: d.id,
        company: d.company,
        amount_inr: d.amount,
        stage: d.stage,
        deal_date: d.date,
        sectors: d.sectors,
        city: d.location,
      })),
    },
    { rate },
  )
}

export const GET = v1Route(handler)
