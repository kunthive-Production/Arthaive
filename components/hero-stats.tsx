import { fundingData } from "@/data/funding-data"
import { formatFundingAmount, isFundingDisclosed } from "@/lib/utils"

export function HeroStats() {
  // Only count disclosed funding amounts
  const disclosedDeals = fundingData.filter((d) => isFundingDisclosed(d.amount))
  const totalFunding = disclosedDeals.reduce((sum, d) => sum + d.amount, 0)
  const totalDeals = fundingData.length
  const disclosedDealsCount = disclosedDeals.length

  const sectors = Array.from(new Set(fundingData.flatMap((d) => d.sectors)))
  const topSector = sectors.reduce(
    (acc, sector) => {
      const count = fundingData.filter((d) => d.sectors.includes(sector)).length
      return count > acc.count ? { sector, count } : acc
    },
    { sector: "", count: 0 },
  )
  const largestDeal =
    disclosedDeals.length > 0
      ? disclosedDeals.reduce((max, d) => (d.amount > max.amount ? d : max), disclosedDeals[0])
      : { company: "N/A", amount: 0 }

  return (
    <div>
      <div className="mb-12 pb-8 border-b-4 border-black">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-2 leading-tight">
          ARTHAIVE
        </h1>
        <p className="text-gray-600 text-lg">India's open startup funding intelligence — discover, analyze, and understand the funding landscape</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div className="neo-border neo-hover p-6 bg-white">
          <div className="text-3xl font-bold text-green-700 mb-2">{formatFundingAmount(totalFunding)}</div>
          <div className="text-xs font-bold uppercase text-gray-600">Total Disclosed Funding</div>
          <div className="text-xs text-gray-500 mt-1">{disclosedDealsCount} of {totalDeals} deals</div>
        </div>
        <div className="neo-border neo-hover p-6 bg-white">
          <div className="text-3xl font-bold text-green-700 mb-2">{totalDeals}</div>
          <div className="text-xs font-bold uppercase text-gray-600">Total Deals</div>
          <div className="text-xs text-gray-500 mt-1">{totalDeals - disclosedDealsCount} undisclosed</div>
        </div>
        <div className="neo-border neo-hover p-6 bg-white">
          <div className="text-3xl font-bold text-green-700 mb-2">{topSector.count}</div>
          <div className="text-xs font-bold uppercase text-gray-600">{topSector.sector}</div>
          <div className="text-xs text-gray-500 mt-1">Most Active Sector</div>
        </div>
        <div className="neo-border neo-hover p-6 bg-white">
          <div className="text-3xl font-bold text-green-700 mb-2">{formatFundingAmount(largestDeal.amount)}</div>
          <div className="text-xs font-bold uppercase text-gray-600">Largest Deal</div>
          <div className="text-xs text-gray-500 mt-1">{largestDeal.company}</div>
        </div>
      </div>
    </div>
  )
}
