import { ExploreClient } from "@/components/explore-client"
import { getAllSectors, getAllLocations, getAllStages, getDealYears } from "@/lib/db/deals"

export const metadata = {
  title: "Explore Deals | Arthaive",
  description: "Browse and filter every verified Indian startup funding deal with sector, stage, city, and investor filters.",
}

// Regenerate the filter facets (sectors, locations, years) periodically so they
// don't freeze at build time as new deals land. Without this the page is fully
// static and the dropdowns go stale between deploys.
export const revalidate = 3600

export default async function ExplorePage() {
  const [sectors, locations, stages, years] = await Promise.all([
    getAllSectors(),
    getAllLocations(),
    getAllStages(),
    getDealYears(),
  ])

  return (
    <ExploreClient
      sectors={sectors}
      locations={locations}
      stages={stages}
      years={years}
    />
  )
}
