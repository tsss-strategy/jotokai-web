import type { MetadataRoute } from "next"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { fetchAllPages } from "@/lib/supabase/fetch-all"
import { todayJst } from "@/lib/date"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://jotokai-web.vercel.app"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createServerSupabaseClient()
  const today = todayJst()

  const { data } = await fetchAllPages<{ prefecture: string }>((from, to) =>
    supabase
      .from("v_events_merged")
      .select("prefecture")
      .gte("event_date", today)
      .order("prefecture", { ascending: true })
      .order("event_date", { ascending: true })
      .order("organization_id", { ascending: true })
      .order("venue_name", { ascending: true })
      .range(from, to)
  )

  const prefs = [...new Set(data.map((d) => d.prefecture))]

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...prefs.map((p) => ({
      url: `${BASE_URL}/events/${encodeURIComponent(p)}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
  ]
}
