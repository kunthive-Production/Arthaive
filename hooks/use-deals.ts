"use client"
import { useState, useCallback } from "react"
import type { Deal, DealFilters } from "@/lib/types"

export type DealsErrorKind = "auth" | "rate-limit" | "server" | "network"

export interface DealsError {
  kind: DealsErrorKind
  message: string
}

function classifyStatus(status: number): DealsError {
  if (status === 401 || status === 403)
    return { kind: "auth", message: "Your session has expired. Sign in again to view deals." }
  if (status === 429)
    return { kind: "rate-limit", message: "Too many requests. Wait a moment and try again." }
  return { kind: "server", message: `Couldn't load deals (server error ${status}). Please retry.` }
}

export function useDeals() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<DealsError | null>(null)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  const load = useCallback(async (filters: DealFilters) => {
    setLoading(true)
    setError(null)
    try {
      const qs = new URLSearchParams()

      if (filters.search)                   qs.set("search", filters.search)
      if (filters.investorSearch)           qs.set("investor", filters.investorSearch)
      if (filters.location)                 qs.set("location", filters.location)
      if (filters.sortBy)                   qs.set("sort", filters.sortBy)
      if (filters.page)                     qs.set("page", String(filters.page))
      if (filters.limit)                    qs.set("limit", String(filters.limit))
      if (filters.minAmount && filters.minAmount > 0) qs.set("minAmount", String(filters.minAmount))
      if (filters.maxAmount && filters.maxAmount < Infinity) qs.set("maxAmount", String(filters.maxAmount))
      if (filters.showUndisclosed === false) qs.set("undisclosed", "false")

      filters.sectors?.forEach((s) => qs.append("sector", s))
      filters.stages?.forEach((s)  => qs.append("stage", s))
      filters.years?.forEach((y)   => qs.append("year", y))

      const res = await fetch(`/api/deals?${qs}`)
      if (!res.ok) {
        // Distinguish auth/rate-limit/server failures from a genuine empty
        // result — otherwise every failure renders as "No deals found", which
        // sends users to fiddle with filters that aren't the problem.
        setDeals([])
        setTotal(0)
        setTotalPages(1)
        setError(classifyStatus(res.status))
        return
      }
      const data = await res.json()

      setDeals(data.deals ?? [])
      setTotal(data.total ?? 0)
      setTotalPages(data.totalPages ?? 1)
    } catch {
      setDeals([])
      setTotal(0)
      setTotalPages(1)
      setError({ kind: "network", message: "Network error — check your connection and retry." })
    } finally {
      setLoading(false)
    }
  }, [])

  // No auto-fetch on mount: the consumer (ExploreClient) drives the first load
  // through its filter effect, so fetching here too would double every request.
  return { deals, loading, error, total, totalPages, refetch: load }
}
