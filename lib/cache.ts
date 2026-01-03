const cache = new Map<string, { data: unknown; expiresAt: number }>()

export function setCache<T>(key: string, data: T, ttlMs = 60_000): void {
  cache.set(key, { data, expiresAt: Date.now() + ttlMs })
}

export function getCache<T>(key: string): T | null {
  const entry = cache.get(key)
  if (!entry) return null
  if (Date.now() > entry.expiresAt) { cache.delete(key); return null }
  return entry.data as T
}

export function invalidateCache(prefix?: string): void {
  if (!prefix) { cache.clear(); return }
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) cache.delete(key)
  }
}
