"use client"

import { Header } from "@/components/header"
import { DealDetail } from "@/components/deal-detail"
import { fundingData } from "@/data/funding-data"
import { useParams } from "next/navigation"
import { formatCurrency } from "@/lib/format"

export default function DealPage() {
  const params = useParams()
  const raw = Array.isArray(params?.id) ? params.id[0] : params?.id
  const id = raw ? decodeURIComponent(raw) : ""
  const deal = fundingData.find((d) => d.id === id)

  if (!deal) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Deal Not Found</h1>
          <p className="text-gray-600">The deal you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    )
  }

  // Article-style JSON-LD for funding announcement pages. Google/Bing index this
  // even from client components; pairing it with the existing deal copy lets us
  // appear in funding-news rich snippets.
  const ldJson = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: deal.amount > 0
      ? `${deal.company} raises ${formatCurrency(deal.amount)} ${deal.stage}`
      : `${deal.company} raises ${deal.stage}`,
    datePublished: deal.date,
    dateModified: deal.date,
    about: {
      "@type": "Organization",
      name: deal.company,
      industry: deal.sectors?.[0],
      location: deal.location,
    },
    publisher: {
      "@type": "Organization",
      name: "IndiaFundTrack",
    },
    isBasedOn: deal.sourceUrl || undefined,
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJson) }}
      />
      <DealDetail deal={deal} />
    </div>
  )
}
