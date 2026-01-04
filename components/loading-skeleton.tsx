"use client"
export function DealCardSkeleton() {
  return (
    <div className="neo-border p-6 animate-pulse">
      <div className="flex justify-between mb-4">
        <div className="h-5 bg-gray-200 rounded w-1/2" />
        <div className="h-5 bg-gray-200 rounded w-16" />
      </div>
      <div className="h-7 bg-gray-200 rounded w-1/3 mb-2" />
      <div className="flex gap-2 mb-4">
        <div className="h-5 bg-gray-200 rounded w-20" />
        <div className="h-5 bg-gray-200 rounded w-20" />
      </div>
      <div className="border-t-2 border-gray-100 pt-4">
        <div className="h-4 bg-gray-200 rounded w-2/3" />
      </div>
    </div>
  )
}

export function InvestorCardSkeleton() {
  return (
    <div className="neo-border p-5 animate-pulse">
      <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
      <div className="grid grid-cols-2 gap-3">
        <div className="h-8 bg-gray-200 rounded" />
        <div className="h-8 bg-gray-200 rounded" />
      </div>
    </div>
  )
}

export function StatCardSkeleton() {
  return (
    <div className="neo-border p-6 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/2 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-3/4" />
    </div>
  )
}
