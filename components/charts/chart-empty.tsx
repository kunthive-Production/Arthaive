import { BarChart2 } from "lucide-react"

export function ChartEmpty({ message = "No data available" }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
      <BarChart2 className="h-10 w-10 opacity-30" />
      <p className="text-sm">{message}</p>
    </div>
  )
}
