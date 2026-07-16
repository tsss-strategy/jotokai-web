import { EventCard } from "./event-card"
import type { MergedEvent } from "@/types/event"

export function EventList({ events }: { events: MergedEvent[] }) {
  if (events.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg">該当するイベントが見つかりませんでした</p>
        <p className="text-sm mt-2">条件を変更して再度お試しください</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {events.map((event) => (
        <EventCard
          key={`${event.organization_id}-${event.event_date}-${event.prefecture}-${event.venue_name ?? ""}`}
          event={event}
        />
      ))}
    </div>
  )
}
