export interface MergedEvent {
  organization_id: string
  org_name: string
  event_date: string
  day_of_week: string | null
  prefecture: string
  address: string | null
  venue_name: string | null
  start_time: string | null
  end_time: string | null
  animal_types: string[] | null
  sources: string[]
  source_urls: string[] | null
  latitude: number | null
  longitude: number | null
  updated_at: string
  org_fallback_url: string | null
}
