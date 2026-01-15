"use client"

import Link from "next/link"
import { formatFundingAmount } from "@/lib/utils"
import type { Deal } from "@/lib/types"

interface InvestorPortfolioProps {
  deals: Deal[]
}

export function InvestorPortfolio({ deals }: InvestorPortfolioProps) {
  if (deals.length === 0) {
    return <p className="text-gray-500 text-sm py-8 text-center">No deals found.</p>
  }

  const byYear = deals.reduce<Record<string, Deal[]>>((acc, deal) => {
    const year = new Date(deal.date).getFullYear().toString()
    if (!acc[year]) acc[year] = []
    acc[year].push(deal)
    return acc
  }, {})

  const years = Object.keys(byYear).sort((a, b) => Number(b) - Number(a))

  return (
    <div className="space-y-6">
      {years.map((year) => (
        <div key={year}>
          <div className="flex items-center gap-3 mb-3">
            <h3 className="font-bold text-lg">{year}</h3>
            <div className="flex-1 h-0.5 bg-gray-200" />
            <span className="text-xs font-semibold text-gray-500">{byYear[year].length} deals</span>
          </div>
          <div className="space-y-2">
            {byYear[year].map((deal) => (
              <Link key={deal.id} href={`/deal/${deal.id}`}>
                <div className="flex items-center justify-between gap-4 p-4 neo-border hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm truncate">{deal.company}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">{deal.location}</span>
                      <span className="text-gray-300">·</span>
                      <span className="text-xs text-gray-500">{new Date(deal.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-bold text-green-700 text-sm">{formatFundingAmount(deal.amount)}</div>
                    <div className="text-xs px-2 py-0.5 bg-black text-white font-semibold mt-1">{deal.stage}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
