
export function buildQueryString(filters: Record<string, string | string[] | number | undefined>): string {
  const params = new URLSearchParams()
  for (const [k, v] of Object.entries(filters)) {
    if (v === undefined || v === "" || (Array.isArray(v) && !v.length)) continue
    params.set(k, Array.isArray(v) ? v.join(",") : String(v))
  }
  return params.toString()
}

export function parseQueryString(search: string): Record<string, string | string[]> {
  const params = new URLSearchParams(search)
  const result: Record<string, string | string[]> = {}
  for (const [k, v] of params.entries()) {
    result[k] = v.includes(",") ? v.split(",") : v
  }
  return result
}
