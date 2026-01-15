import Link from "next/link"
import { formatFundingAmount } from "@/lib/utils"
import type { Investor } from "@/lib/types"

interface InvestorCardProps {
  investor: Investor
  rank?: number
}

const TYPE_COLORS: Record<string, string> = {
  VC: "bg-blue-100 text-blue-800 border-blue-300",
  Angel: "bg-purple-100 text-purple-800 border-purple-300",
  Corporate: "bg-orange-100 text-orange-800 border-orange-300",
  "Family Office": "bg-yellow-100 text-yellow-800 border-yellow-300",
  Government: "bg-green-100 text-green-800 border-green-300",
  Other: "bg-gray-100 text-gray-800 border-gray-300",
}

export function InvestorCard({ investor, rank }: InvestorCardProps) {
  return (
    <Link href={`/investors/${investor.slug}`}>
      <div className="neo-border neo-hover p-5 bg-white cursor-pointer h-full flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {rank && (
              <div className="w-7 h-7 bg-black text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                {rank}
              </div>
            )}
            <h3 className="font-bold text-base leading-tight line-clamp-2">{investor.name}</h3>
          </div>
          <span
            className={`text-xs font-semibold px-2 py-0.5 border whitespace-nowrap ${TYPE_COLORS[investor.type] || TYPE_COLORS.Other}`}
          >
            {investor.type}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <div className="text-xl font-bold text-green-700">{investor.dealCount}</div>
            <div className="text-xs text-gray-500 uppercase font-semibold">Deals</div>
          </div>
          <div>
            <div className="text-xl font-bold text-green-700">{formatFundingAmount(investor.totalDeployed)}</div>
            <div className="text-xs text-gray-500 uppercase font-semibold">Deployed</div>
          </div>
        </div>

        {investor.sectors.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-auto">
            {investor.sectors.slice(0, 3).map((s) => (
              <span key={s} className="text-xs px-2 py-0.5 bg-gray-100 border border-gray-300 font-medium">
                {s}
              </span>
            ))}
            {investor.sectors.length > 3 && (
              <span className="text-xs text-gray-400 font-medium">+{investor.sectors.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}
