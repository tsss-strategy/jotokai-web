"use client"

// Trigger Vercel Rebuild: 2026-03-02
import { useState, useMemo } from "react"
import { EventList } from "./event-list"
import { EventTable } from "./event-table"
import { PrefectureSelect } from "./prefecture-select"
import { AnimalTypeFilter } from "./animal-type-filter"
import { SourceFilter } from "./source-filter"
import { ViewToggle } from "./view-toggle"
import { DateFilter, type DateRange } from "./date-filter"
import type { MergedEvent } from "@/types/event"
import { exportToCsv } from "@/lib/csv"
import dynamic from "next/dynamic"

const EventMap = dynamic(() => import("./event-map").then((m) => m.EventMap), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] bg-muted animate-pulse rounded-lg" />
  ),
})

export function EventFilters({ events }: { events: MergedEvent[] }) {
  const [prefecture, setPrefecture] = useState<string>("all")
  const [animalType, setAnimalType] = useState<string>("all")
  const [source, setSource] = useState<string>("all")
  const [view, setView] = useState<"list" | "map" | "table">("list")
  const [dateRange, setDateRange] = useState<DateRange>("all")
  const [customFrom, setCustomFrom] = useState("")
  const [customTo, setCustomTo] = useState("")

  const dateFilter = useMemo(() => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const fmt = (d: Date) => d.toISOString().split("T")[0]

    if (dateRange === "all") return { from: "", to: "" }

    if (dateRange === "custom") return { from: customFrom, to: customTo }

    if (dateRange === "this_week" || dateRange === "next_week") {
      const day = today.getDay()
      const diffToMonday = day === 0 ? 6 : day - 1
      const monday = new Date(today)
      monday.setDate(today.getDate() - diffToMonday + (dateRange === "next_week" ? 7 : 0))
      const sunday = new Date(monday)
      sunday.setDate(monday.getDate() + 6)
      return { from: fmt(monday), to: fmt(sunday) }
    }

    if (dateRange === "this_month") {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)
      return { from: fmt(firstDay), to: fmt(lastDay) }
    }

    // next_month
    const firstDay = new Date(today.getFullYear(), today.getMonth() + 1, 1)
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 2, 0)
    return { from: fmt(firstDay), to: fmt(lastDay) }
  }, [dateRange, customFrom, customTo])

  const filtered = useMemo(() => {
    return events.filter((e) => {
      if (prefecture !== "all" && e.prefecture !== prefecture) return false
      if (animalType !== "all" && !e.animal_types?.includes(animalType))
        return false
      if (source !== "all" && !e.sources?.includes(source)) return false
      if (dateFilter.from && e.event_date < dateFilter.from) return false
      if (dateFilter.to && e.event_date > dateFilter.to) return false
      return true
    })
  }, [events, prefecture, animalType, source, dateFilter])

  const availablePrefectures = useMemo(() => {
    return [...new Set(events.map((e) => e.prefecture))].sort()
  }, [events])

  const availableSources = useMemo(() => {
    return [...new Set(events.flatMap((e) => e.sources || []))].sort()
  }, [events])

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-6">
        <PrefectureSelect
          value={prefecture}
          onChange={setPrefecture}
          prefectures={availablePrefectures}
        />
        <DateFilter
          value={dateRange}
          onChange={setDateRange}
          customFrom={customFrom}
          customTo={customTo}
          onCustomFromChange={setCustomFrom}
          onCustomToChange={setCustomTo}
        />
        <AnimalTypeFilter value={animalType} onChange={setAnimalType} />
        <SourceFilter
          value={source}
          onChange={setSource}
          sources={availableSources}
        />
        <ViewToggle value={view} onChange={setView} />
        <button
          onClick={() => exportToCsv(filtered)}
          className="ml-auto text-sm px-3 py-2 border rounded hover:bg-muted transition-colors whitespace-nowrap"
        >
          CSVダウンロード
        </button>
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        {filtered.length}件表示中
      </p>

      {view === "list" ? (
        <EventList events={filtered} />
      ) : view === "table" ? (
        <EventTable events={filtered} />
      ) : (
        <EventMap events={filtered} />
      )}
    </div>
  )
}
