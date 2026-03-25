"use client"

import { Header } from "@/components/header"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { fundingData } from "@/data/funding-data"
import { FundingTrendLine } from "@/components/charts/funding-trend-line"
import { SectorBarChart } from "@/components/charts/sector-bar-chart"
import { StageFunnel } from "@/components/charts/stage-funnel"
import { BubbleChart } from "@/components/charts/bubble-chart"
import { FundingHeatmap } from "@/components/charts/funding-heatmap"
import { SankeyDiagram } from "@/components/charts/sankey-diagram"
import { IndiaMap } from "@/components/charts/india-map"
import { YoYComparison } from "@/components/charts/yoy-comparison"
import { DealVelocity } from "@/components/charts/deal-velocity"

const TOP_SECTORS = [
  "Fintech", "Edtech", "Healthtech", "SaaS", "EV", "Logistics",
  "D2C", "Agritech", "Deeptech", "Gaming",
]

export default function AnalyticsPage() {
  const deals = fundingData

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="pb-6 border-b-4 border-black mb-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">ANALYTICS</h1>
          <p className="text-gray-600 mt-2">Trends, insights, and patterns in Indian startup funding</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="flex-wrap h-auto gap-1">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="deepdive">Deep Dive</TabsTrigger>
            <TabsTrigger value="flow">Money Flow</TabsTrigger>
            <TabsTrigger value="geography">Geography</TabsTrigger>
            <TabsTrigger value="compare">Year-on-Year</TabsTrigger>
            <TabsTrigger value="velocity">Sector Velocity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <div>
              <h2 className="text-lg font-semibold mb-4">Monthly Funding Volume</h2>
              <FundingTrendLine deals={deals} />
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-4">Top 15 Sectors by Total Funding</h2>
              <SectorBarChart deals={deals} topN={15} />
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-4">Deal Count by Stage</h2>
              <StageFunnel deals={deals} />
            </div>
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="deepdive" className="space-y-8">
            <div>
              <h2 className="text-lg font-semibold mb-2">Sector Bubble Chart</h2>
              <p className="text-sm text-muted-foreground mb-4">
                X = deal count · Y = average deal size · Bubble size = total funding
              </p>
              <BubbleChart deals={deals} />
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-4">Funding Heatmap (Month × Sector)</h2>
              <FundingHeatmap deals={deals} topSectors={12} />
            </div>
          </TabsContent>

          <TabsContent value="flow" className="space-y-8">
            <div>
              <h2 className="text-lg font-semibold mb-2">Investor → Sector Money Flow</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Top 10 lead investors funding top 8 sectors
              </p>
              <SankeyDiagram deals={deals} topInvestors={10} topSectors={8} />
            </div>
          </TabsContent>

          <TabsContent value="geography">
            <div>
              <h2 className="text-lg font-semibold mb-4">Funding by City</h2>
              <IndiaMap deals={deals} />
            </div>
          </TabsContent>

          <TabsContent value="compare">
            <div>
              <h2 className="text-lg font-semibold mb-4">Year-on-Year Monthly Comparison</h2>
              <YoYComparison deals={deals} />
            </div>
          </TabsContent>

          <TabsContent value="velocity">
            <div>
              <h2 className="text-lg font-semibold mb-4">Sector Deal Velocity (rolling 16 weeks)</h2>
              <DealVelocity deals={deals} sectors={TOP_SECTORS} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
