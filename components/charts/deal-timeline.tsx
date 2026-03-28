"use client"

import { useMemo } from "react"
import type { FundingDeal as Deal } from "@/data/funding-data"

export function DealTimeline({ deals }: { deals: Deal[] }) {
  const sorted = useMemo(
    () => [...deals].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 20),
    [deals]
  )

  return (
    <div className="relative space-y-0">
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
      {sorted.map((deal, i) => (
        <div key={deal.id} className="relative flex gap-4 pb-4">
          <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-background text-xs font-bold">
            {i + 1}
          </div>
          <div className="flex-1 pt-1">
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-semibold text-sm">{deal.company}</span>
              <span className="text-xs text-muted-foreground shrink-0">{deal.date}</span>
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              ₹{deal.amount.toLocaleString("en-IN")} Cr · {deal.stage} · {deal.location}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
