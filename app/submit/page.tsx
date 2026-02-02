import type { Metadata } from "next"
import { SectionHeader } from "@/components/section-header"

export const metadata: Metadata = { title: "Submit a Deal | IndiaFundTrack" }

export default function SubmitPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <SectionHeader
        title="Submit a Deal"
        subtitle="Help us track Indian startup funding. All submissions are reviewed."
      />
      <form className="mt-8 space-y-4" action="/api/submit" method="POST">
        <input name="company" placeholder="Company name" required className="w-full border-2 border-black px-3 py-2" />
        <input name="amount" placeholder="Amount raised (in ₹ Lakhs)" className="w-full border-2 border-black px-3 py-2" />
        <input name="stage" placeholder="Stage (Seed, Series A...)" className="w-full border-2 border-black px-3 py-2" />
        <input name="date" type="date" className="w-full border-2 border-black px-3 py-2" />
        <input name="sourceUrl" placeholder="Source URL" className="w-full border-2 border-black px-3 py-2" />
        <button type="submit" className="w-full bg-black text-white py-2 font-bold hover:bg-gray-800">Submit Deal</button>
      </form>
    </main>
  )
}
