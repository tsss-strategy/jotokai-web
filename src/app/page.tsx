import { createServerSupabaseClient } from "@/lib/supabase/server"
import { EventFilters } from "@/components/event-filters"
import { fetchAllPages } from "@/lib/supabase/fetch-all"
import { todayJst } from "@/lib/date"
import type { MergedEvent } from "@/types/event"

export const revalidate = 600

export const metadata = {
  alternates: {
    canonical: "/",
  },
}

async function getEvents(): Promise<MergedEvent[]> {
  const supabase = createServerSupabaseClient()
  const today = todayJst()

  const { data, error } = await fetchAllPages<MergedEvent>((from, to) =>
    supabase
      .from("v_events_merged")
      .select("*")
      .gte("event_date", today)
      .order("event_date", { ascending: true })
      .order("organization_id", { ascending: true })
      .order("prefecture", { ascending: true })
      .order("venue_name", { ascending: true })
      .range(from, to)
  )

  if (error) {
    console.error("Failed to fetch events:", error.message)
  }
  return data
}

export default async function HomePage() {
  const events = await getEvents()

  return (
    <main className="container mx-auto px-4 py-6 max-w-5xl">
      <h1 className="text-2xl font-bold mb-2">譲渡会イベント一覧</h1>
      <p className="text-muted-foreground mb-6">
        {events.length}件のイベントが見つかりました
      </p>
      <EventFilters events={events} />
    </main>
  )
}
