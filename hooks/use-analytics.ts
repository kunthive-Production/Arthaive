"use client"
import { useState, useEffect } from "react"
import type { AnalyticsFilter } from "@/lib/types"

export function useAnalytics(filter: AnalyticsFilter) {
  const [data, setData] = useState<unknown>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    const qs = new URLSearchParams()
    if (filter.dateFrom) qs.set("from", filter.dateFrom)
    if (filter.dateTo) qs.set("to", filter.dateTo)
    qs.set("metric", filter.metric)
    fetch(`/api/analytics?${qs}`)
      .then(r => r.ok ? r.json() : Promise.reject(r.statusText))
      .then(d => { if (!cancelled) { setData(d); setError(null) } })
      .catch(e => { if (!cancelled) setError(String(e)) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [filter.dateFrom, filter.dateTo, filter.metric])

  return { data, loading, error }
}
