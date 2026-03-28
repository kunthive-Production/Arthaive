export function ChartSkeleton({ height = 288 }: { height?: number }) {
  return (
    <div
      className="w-full rounded-lg bg-muted/30 animate-pulse"
      style={{ height }}
    />
  )
}
