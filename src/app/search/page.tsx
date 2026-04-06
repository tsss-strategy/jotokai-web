"use client"

import { useState, type FormEvent } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { isSafeUrl } from "@/lib/safe-url"

interface SearchEvent {
  eventDate: string
  startTime: string | null
  endTime: string | null
  prefecture: string
  address: string | null
  venueName: string | null
  orgName: string
  animalType: string | null
  sourceUrl: string
}

// YYYY-MM-DD を「YYYY年M月D日」形式に変換
function formatSearchEventDate(dateStr: string): string {
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) return dateStr
  const year = match[1]
  const month = parseInt(match[2], 10)
  const day = parseInt(match[3], 10)
  return `${year}年${month}月${day}日`
}

// 動物種別バッジのバリアントを返す
function animalTypeBadgeVariant(
  animalType: string | null
): "default" | "secondary" | "outline" {
  if (!animalType) return "outline"
  if (animalType.includes("犬") && animalType.includes("猫")) return "outline"
  if (animalType.includes("犬")) return "default"
  if (animalType.includes("猫")) return "secondary"
  return "outline"
}

// 動物種別バッジのラベルを返す
function animalTypeBadgeLabel(animalType: string | null): string {
  if (!animalType) return "犬猫"
  if (animalType === "犬のみ") return "犬"
  if (animalType === "猫のみ") return "猫"
  if (animalType === "犬猫両方") return "犬猫"
  return animalType
}

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [events, setEvents] = useState<SearchEvent[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!query.trim()) return

    setIsLoading(true)
    setError(null)
    setHasSearched(false)

    try {
      const res = await fetch("/api/web-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim() }),
      })
      const data = (await res.json()) as
        | { success: true; events: SearchEvent[]; searchQuery: string }
        | { success: false; error: string }

      if (!data.success) {
        setError(data.error)
        setEvents([])
      } else {
        setEvents(data.events)
      }
    } catch (err) {
      setError(`ネットワークエラーが発生しました: ${String(err)}`)
      setEvents([])
    } finally {
      setIsLoading(false)
      setHasSearched(true)
    }
  }

  return (
    <main className="container mx-auto px-4 py-6 max-w-5xl">
      <h1 className="text-2xl font-bold mb-2">イベントを検索</h1>
      <p className="text-muted-foreground mb-6">
        団体名・地域名・動物種別などで検索できます
      </p>

      {/* 検索フォーム */}
      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="例：東京 犬 譲渡会、〇〇保護団体"
          className="flex-1 border border-input rounded-md px-3 py-2 text-sm bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading || !query.trim()}>
          {isLoading ? "検索中..." : "検索"}
        </Button>
      </form>

      {/* ローディング表示 */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12 gap-4 text-muted-foreground">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
          <p className="text-sm">Webを検索してイベント情報を収集中...</p>
        </div>
      )}

      {/* エラー表示 */}
      {!isLoading && error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* 検索結果 */}
      {!isLoading && !error && hasSearched && (
        <>
          <p className="text-muted-foreground mb-4">
            {events.length > 0
              ? `${events.length}件のイベントが見つかりました`
              : "イベントが見つかりませんでした"}
          </p>

          {events.length > 0 && (
            <div className="space-y-4">
              {events.map((event, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold">
                        {formatSearchEventDate(event.eventDate)}
                      </span>
                      <Badge variant={animalTypeBadgeVariant(event.animalType)}>
                        {animalTypeBadgeLabel(event.animalType)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-1 text-sm">
                    <p className="font-medium">{event.orgName}</p>
                    <p className="text-muted-foreground">
                      {event.prefecture}
                      {event.address ? ` ${event.address}` : ""}
                    </p>
                    {event.venueName && (
                      <p className="text-muted-foreground">{event.venueName}</p>
                    )}
                    {event.startTime && (
                      <p>
                        {event.startTime}
                        {event.endTime ? ` ~ ${event.endTime}` : ""}
                      </p>
                    )}
                    <div className="flex items-center justify-end pt-1">
                      {isSafeUrl(event.sourceUrl) ? (
                        <a
                          href={event.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline"
                        >
                          詳細を見る
                        </a>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <p className="text-xs text-muted-foreground mt-6">
            ※ リアルタイムでWebを検索するため、DBの情報と異なる場合があります
          </p>
        </>
      )}
    </main>
  )
}
