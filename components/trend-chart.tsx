"use client"
import { formatCompact } from "@/lib/utils"

interface TrendChartProps {
  data: Array<{ label: string; value: number }>
  title?: string
  color?: string
}

export function TrendChart({ data, title, color = "#15803d" }: TrendChartProps) {
  if (!data.length) return null
  const max = Math.max(...data.map(d => d.value), 1)
  return (
    <div className="neo-border p-4">
      {title && <div className="text-xs font-bold uppercase text-gray-600 mb-3">{title}</div>}
      <div className="flex items-end gap-1 h-32">
        {data.map(d => (
          <div key={d.label} className="flex flex-col items-center gap-1 flex-1" title={`${d.label}: ${formatCompact(d.value)}`}>
            <div
              style={{ height: `${(d.value / max) * 100}%`, backgroundColor: color }}
              className="w-full min-h-[2px] transition-all"
            />
            <span className="text-xs text-gray-500 truncate w-full text-center">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
