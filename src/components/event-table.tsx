"use client"

import { Badge } from "@/components/ui/badge"
import { formatTime } from "@/lib/format"
import type { MergedEvent } from "@/types/event"
import { isSafeUrl } from "@/lib/safe-url"

const DAY_OF_WEEK_MAP: Record<string, string> = {
  Mon: "月", Tue: "火", Wed: "水", Thu: "木", Fri: "金", Sat: "土", Sun: "日",
  月: "月", 火: "火", 水: "水", 木: "木", 金: "金", 土: "土", 日: "日",
}

function formatTableDate(dateStr: string, dayOfWeek?: string | null): string {
  const date = new Date(dateStr + "T00:00:00")
  const month = date.getMonth() + 1
  const day = date.getDate()

  let dow = dayOfWeek
  if (!dow) {
    const days = ["日", "月", "火", "水", "木", "金", "土"]
    dow = days[date.getDay()]
  } else {
    dow = DAY_OF_WEEK_MAP[dow] ?? dow
  }

  return `${month}月${day}日(${dow})`
}

function AnimalBadges({ animalTypes }: { animalTypes: string[] | null }) {
  if (!animalTypes || animalTypes.length === 0) {
    return <Badge variant="outline">犬猫</Badge>
  }
  return (
    <div className="flex flex-wrap gap-1">
      {animalTypes.map((type) => {
        let variant: "default" | "secondary" | "outline" = "outline"
        if (type === "犬") variant = "default"
        else if (type === "猫") variant = "secondary"
        return (
          <Badge key={type} variant={variant}>
            {type}
          </Badge>
        )
      })}
    </div>
  )
}

export function EventTable({ events }: { events: MergedEvent[] }) {
  if (events.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg">該当するイベントが見つかりませんでした</p>
        <p className="text-sm mt-2">条件を変更して再度お試しください</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-muted text-sm font-medium">
            <th className="px-3 py-2 text-left whitespace-nowrap">開催日</th>
            <th className="px-3 py-2 text-left whitespace-nowrap">動物</th>
            <th className="px-3 py-2 text-left whitespace-nowrap">団体名</th>
            <th className="px-3 py-2 text-left whitespace-nowrap">都道府県</th>
            <th className="px-3 py-2 text-left whitespace-nowrap">会場・住所</th>
            <th className="px-3 py-2 text-left whitespace-nowrap">時間</th>
            <th className="px-3 py-2 text-left whitespace-nowrap">詳細</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => {
            const rawAddress = event.address
              ? event.address.startsWith(event.prefecture)
                ? event.address.slice(event.prefecture.length).trimStart()
                : event.address
              : null
            const venue = event.venue_name
              ? rawAddress
                ? `${event.venue_name}　${rawAddress}`
                : event.venue_name
              : rawAddress ?? "-"
            const timeStr =
              event.start_time && event.end_time
                ? `${formatTime(event.start_time)}〜${formatTime(event.end_time)}`
                : event.start_time
                ? formatTime(event.start_time)
                : null
            const rawUrl =
              event.source_urls && event.source_urls.length > 0
                ? event.source_urls[0]
                : null
            const url = isSafeUrl(rawUrl) ? rawUrl : null
            // 回ごとのリンクが無いイベントは団体の代表リンクで代替
            const fallbackUrl =
              !url && isSafeUrl(event.org_fallback_url) ? event.org_fallback_url : null

            return (
              <tr
                key={`${event.organization_id}-${event.event_date}-${event.prefecture}`}
                className="border-b hover:bg-muted/50 transition-colors"
              >
                <td className="px-3 py-2 text-sm whitespace-nowrap">
                  {formatTableDate(event.event_date, event.day_of_week)}
                </td>
                <td className="px-3 py-2 text-sm">
                  <AnimalBadges animalTypes={event.animal_types} />
                </td>
                <td className="px-3 py-2 text-sm">{event.org_name}</td>
                <td className="px-3 py-2 text-sm whitespace-nowrap">{event.prefecture}</td>
                <td className="px-3 py-2 text-sm">{venue}</td>
                <td className="px-3 py-2 text-sm whitespace-nowrap">
                  {timeStr ?? (url ? (
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline"
                    >
                      サイトで確認↗
                    </a>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  ))}
                </td>
                <td className="px-3 py-2 text-sm whitespace-nowrap">
                  {url ? (
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline underline-offset-2 hover:opacity-80"
                    >
                      詳細↗
                    </a>
                  ) : fallbackUrl ? (
                    <a
                      href={fallbackUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline underline-offset-2 hover:opacity-80"
                    >
                      団体ページ↗
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
