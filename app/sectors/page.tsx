import type { Metadata } from "next"
import { SectionHeader } from "@/components/section-header"

export const metadata: Metadata = { title: "Sectors | IndiaFundTrack" }

export default async function SectorsPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <SectionHeader
        title="Browse by Sector"
        subtitle="Funding activity across Indian startup verticals"
      />
      <p className="text-gray-500 mt-8">Sector pages loading...</p>
    </main>
  )
}
