import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import { fundingData } from "@/data/funding-data"
import type { MonthlyFunding, SectorStat, CityFunding, StageStat, SiteStats } from "@/lib/types"

export async function getSiteStats(): Promise<SiteStats> {
  const data = fundingData

  const disclosedDeals = data.filter((d) => d.amount > 0)
  const totalFunding = disclosedDeals.reduce((sum, d) => sum + d.amount, 0)

  const sectorCounts = new Map<string, number>()
  data.forEach((d) => d.sectors.forEach((s) => sectorCounts.set(s, (sectorCounts.get(s) || 0) + 1)))
  const topSectorEntry = [...sectorCounts.entries()].sort((a, b) => b[1] - a[1])[0]

  const largestDeal = disclosedDeals.reduce(
    (max, d) => (d.amount > max.amount ? d : max),
    disclosedDeals[0] || { company: "N/A", amount: 0 }
  )

  const allInvestors = new Set(
    data
      .flatMap((d) => d.investors)
      .filter((i) => i && i !== "Not Disclosed" && i !== "Undisclosed")
  )

  return {
    totalDeals: data.length,
    totalDisclosedFunding: totalFunding,
    disclosedDealsCount: disclosedDeals.length,
    topSector: topSectorEntry?.[0] || "",
    topSectorCount: topSectorEntry?.[1] || 0,
    largestDealCompany: largestDeal.company,
    largestDealAmount: largestDeal.amount,
    uniqueInvestors: allInvestors.size,
    uniqueCities: new Set(data.map((d) => d.location)).size,
    uniqueSectors: sectorCounts.size,
    lastUpdated: new Date().toISOString(),
  }
}

export async function getMonthlyFunding(months = 24): Promise<MonthlyFunding[]> {
  if (isSupabaseConfigured && supabase) {
    const since = new Date()
    since.setMonth(since.getMonth() - months)

    const { data, error } = await supabase
      .from("deals")
      .select("deal_date, amount_inr")
      .gte("deal_date", since.toISOString().split("T")[0])
      .order("deal_date", { ascending: true })

    if (!error && data) {
      return aggregateMonthly(data.map((r: { deal_date: string; amount_inr: number }) => ({ date: r.deal_date, amount: r.amount_inr })))
    }
  }

  const cutoff = new Date()
  cutoff.setMonth(cutoff.getMonth() - months)
  const filtered = fundingData
    .filter((d) => new Date(d.date) >= cutoff)
    .map((d) => ({ date: d.date, amount: d.amount }))

  return aggregateMonthly(filtered)
}

function aggregateMonthly(data: { date: string; amount: number }[]): MonthlyFunding[] {
  const byMonth = new Map<string, { total: number; count: number }>()

  for (const { date, amount } of data) {
    const month = date.substring(0, 7)
    const existing = byMonth.get(month) || { total: 0, count: 0 }
    byMonth.set(month, { total: existing.total + amount, count: existing.count + 1 })
  }

  return [...byMonth.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, { total, count }]) => ({
      month,
      totalFunding: total,
      dealCount: count,
      avgDealSize: count > 0 ? total / count : 0,
    }))
}

export async function getSectorStats(): Promise<SectorStat[]> {
  const data = fundingData
  const sectorMap = new Map<string, { count: number; funding: number }>()

  for (const deal of data) {
    for (const sector of deal.sectors) {
      const existing = sectorMap.get(sector) || { count: 0, funding: 0 }
      sectorMap.set(sector, { count: existing.count + 1, funding: existing.funding + deal.amount })
    }
  }

  const total = data.length
  return [...sectorMap.entries()]
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 20)
    .map(([sector, { count, funding }]) => ({
      sector,
      dealCount: count,
      totalFunding: funding,
      avgDealSize: count > 0 ? funding / count : 0,
      percentage: total > 0 ? (count / total) * 100 : 0,
    }))
}

export async function getCityFunding(limit = 15): Promise<CityFunding[]> {
  const cityMap = new Map<string, { count: number; funding: number }>()

  for (const deal of fundingData) {
    const existing = cityMap.get(deal.location) || { count: 0, funding: 0 }
    cityMap.set(deal.location, { count: existing.count + 1, funding: existing.funding + deal.amount })
  }

  return [...cityMap.entries()]
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, limit)
    .map(([city, { count, funding }]) => ({ city, dealCount: count, totalFunding: funding }))
}

export async function getStageDistribution(): Promise<StageStat[]> {
  const stageMap = new Map<string, { count: number; funding: number }>()
  const total = fundingData.length

  for (const deal of fundingData) {
    const existing = stageMap.get(deal.stage) || { count: 0, funding: 0 }
    stageMap.set(deal.stage, { count: existing.count + 1, funding: existing.funding + deal.amount })
  }

  return [...stageMap.entries()]
    .sort((a, b) => b[1].count - a[1].count)
    .map(([stage, { count, funding }]) => ({
      stage,
      count,
      percentage: total > 0 ? (count / total) * 100 : 0,
      totalFunding: funding,
    }))
}

export async function getYoYComparison(): Promise<{ year: string; totalFunding: number; dealCount: number }[]> {
  const yearMap = new Map<string, { funding: number; count: number }>()

  for (const deal of fundingData) {
    const year = new Date(deal.date).getFullYear().toString()
    const existing = yearMap.get(year) || { funding: 0, count: 0 }
    yearMap.set(year, { funding: existing.funding + deal.amount, count: existing.count + 1 })
  }

  return [...yearMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([year, { funding, count }]) => ({ year, totalFunding: funding, dealCount: count }))
}

export async function getTopInvestorsByActivity(limit = 10): Promise<{ name: string; dealCount: number; totalDeployed: number }[]> {
  const map = new Map<string, { count: number; deployed: number }>()

  for (const deal of fundingData) {
    for (const investor of deal.investors) {
      if (!investor || investor === "Not Disclosed" || investor === "Undisclosed") continue
      const existing = map.get(investor) || { count: 0, deployed: 0 }
      map.set(investor, { count: existing.count + 1, deployed: existing.deployed + deal.amount })
    }
  }

  return [...map.entries()]
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, limit)
    .map(([name, { count, deployed }]) => ({ name, dealCount: count, totalDeployed: deployed }))
}
