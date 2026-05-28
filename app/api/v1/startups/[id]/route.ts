import type { NextRequest } from "next/server"
import { v1Route } from "@/lib/api/handler"
import { apiResponse, apiError } from "@/lib/api/response"
import { getDealById, getDeals } from "@/lib/db/deals"

export const dynamic = "force-dynamic"

/**
 * GET /api/v1/startups/:id
 *
 * `id` is either a deal id (returns just that round) or a company name
 * (URL-encoded — returns the full funding history for that company).
 */
async function handler(req: NextRequest, { rate }: Parameters<Parameters<typeof v1Route>[0]>[1]) {
  const id = decodeURIComponent(req.nextUrl.pathname.split("/").pop() ?? "")
  if (!id) return apiError("Missing id", 400)

  // Try as a deal id first.
  const direct = await getDealById(id)
  if (direct) {
    // Then fetch sibling rounds for the same company.
    const history = await getDeals({
      search: direct.company,
      limit: 100,
      sortBy: "date",
    })
    const rounds = history.deals.filter((d) => d.company === direct.company)
    return apiResponse(
      {
        company: direct.company,
        company_url: direct.companyUrl,
        total_rounds: rounds.length,
        total_raised_inr: rounds.reduce((s, d) => s + d.amount, 0),
        rounds,
      },
      { rate },
    )
  }

  // Otherwise treat the id as a company name.
  const history = await getDeals({ search: id, limit: 100, sortBy: "date" })
  const rounds = history.deals.filter((d) => d.company.toLowerCase() === id.toLowerCase())
  if (rounds.length === 0) return apiError("Startup not found", 404)

  return apiResponse(
    {
      company: rounds[0].company,
      company_url: rounds[0].companyUrl,
      total_rounds: rounds.length,
      total_raised_inr: rounds.reduce((s, d) => s + d.amount, 0),
      rounds,
    },
    { rate },
  )
}

export const GET = v1Route(handler)
