import { toCSVString } from "@/lib/filters"

export function exportDealsCSV(deals: Array<Record<string, unknown>>): string {
  const cols = ["company", "amount", "stage", "sectors", "investors", "location", "date"]
  return toCSVString(deals.map(d => ({
    ...d,
    sectors: Array.isArray(d.sectors) ? (d.sectors as string[]).join("; ") : d.sectors,
    investors: Array.isArray(d.investors) ? (d.investors as string[]).join("; ") : d.investors,
  })), cols)
}

export function exportDealsJSON(deals: unknown[]): string {
  return JSON.stringify(deals, null, 2)
}

export function triggerDownload(content: string, filename: string, mime = "text/csv"): void {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}
