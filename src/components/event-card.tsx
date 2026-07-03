import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatEventDate, formatTime } from "@/lib/format"
import type { MergedEvent } from "@/types/event"
import { isSafeUrl } from "@/lib/safe-url"
import { sourceDisplayName } from "@/lib/source-names"

export function EventCard({ event }: { event: MergedEvent }) {
  const detailUrl = isSafeUrl(event.source_urls?.[0]) ? event.source_urls![0] : null
  // 回ごとのリンクが無いイベント（定期開催シート由来など）は団体の代表リンクで代替
  const fallbackUrl =
    !detailUrl && isSafeUrl(event.org_fallback_url) ? event.org_fallback_url : null
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold">
            {formatEventDate(event.event_date, event.day_of_week)}
          </span>
          <div className="flex gap-1">
            {event.animal_types && event.animal_types.length > 0 ? (
              event.animal_types.map((type) => (
                <Badge
                  key={type}
                  variant={type === "犬" ? "default" : "secondary"}
                >
                  {type}
                </Badge>
              ))
            ) : (
              <Badge variant="outline">犬猫</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-1 text-sm">
        <p className="font-medium">{event.org_name}</p>
        <p className="text-muted-foreground">
          {event.prefecture}
          {event.address
            ? ` ${event.address.startsWith(event.prefecture) ? event.address.slice(event.prefecture.length).trimStart() : event.address}`
            : ""}
        </p>
        {event.venue_name && (
          <p className="text-muted-foreground">{event.venue_name}</p>
        )}
        {event.start_time ? (
          <p>
            {formatTime(event.start_time)}
            {event.end_time ? ` ~ ${formatTime(event.end_time)}` : ""}
          </p>
        ) : detailUrl ? (
          <a
            href={detailUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:underline"
          >
            詳細はサイトでご確認ください↗
          </a>
        ) : (
          <p className="text-muted-foreground text-xs">開催時間は未定です</p>
        )}
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-muted-foreground">
            情報元: {event.sources.map(sourceDisplayName).join(", ")}
          </span>
          {detailUrl ? (
            <a
              href={detailUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:underline"
            >
              詳細を見る
            </a>
          ) : fallbackUrl ? (
            <a
              href={fallbackUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:underline"
            >
              団体ページを見る
            </a>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}
