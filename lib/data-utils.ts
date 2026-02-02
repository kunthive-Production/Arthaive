
export function normalizeDeals(raw: unknown[]): Array<Record<string, unknown>> {
  return raw.filter(Boolean).map(r => (typeof r === "object" ? r as Record<string, unknown> : {}))
}
