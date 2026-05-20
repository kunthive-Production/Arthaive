import { ExploreClient } from "@/components/explore-client"
import { getAllSectors, getAllLocations, getAllStages } from "@/lib/db/deals"

export const metadata = {
  title: "Explore Deals | IndiaFundTrack",
  description: "Browse and filter every verified Indian startup funding deal with sector, stage, city, and investor filters.",
}

export default async function ExplorePage() {
  const [sectors, locations, stages] = await Promise.all([
    getAllSectors(),
    getAllLocations(),
    getAllStages(),
  ])

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => String(currentYear - i))

  return (
    <ExploreClient
      sectors={sectors}
      locations={locations}
      stages={stages}
      years={years}
    />
  )
}
