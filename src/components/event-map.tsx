"use client"

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import type { MergedEvent } from "@/types/event"
import { formatEventDate, formatTime } from "@/lib/format"
import { isSafeUrl } from "@/lib/safe-url"

// Fix default marker icon issue with webpack bundling
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

L.Marker.prototype.options.icon = defaultIcon

const JAPAN_CENTER: [number, number] = [36.5, 137.5]

export function EventMap({ events }: { events: MergedEvent[] }) {
  const mappableEvents = events.filter((e) => e.latitude && e.longitude)

  if (mappableEvents.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg">地図に表示できるイベントがありません</p>
        <p className="text-sm mt-2">
          位置情報が登録されているイベントがまだありません
        </p>
      </div>
    )
  }

  return (
    <MapContainer
      center={JAPAN_CENTER}
      zoom={6}
      className="h-[500px] rounded-lg z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {mappableEvents.map((event, i) => (
        <Marker
          key={`${event.organization_id}-${event.event_date}-${i}`}
          position={[event.latitude!, event.longitude!]}
        >
          <Popup>
            <div className="text-sm">
              <p className="font-bold">{event.org_name}</p>
              <p>{formatEventDate(event.event_date, event.day_of_week)}</p>
              {event.address && <p>{event.address}</p>}
              {event.start_time ? (
                <p>
                  {formatTime(event.start_time)}
                  {event.end_time ? ` ~ ${formatTime(event.end_time)}` : ""}
                </p>
              ) : (
                <p className="text-gray-500">時間未定</p>
              )}
              {isSafeUrl(event.source_urls?.[0]) && (
                <a
                  href={event.source_urls![0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  詳細を見る
                </a>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
