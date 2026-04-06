"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type DateRange = "all" | "this_week" | "next_week" | "this_month" | "next_month" | "custom"

interface DateFilterProps {
  value: DateRange
  onChange: (value: DateRange) => void
  customFrom: string
  customTo: string
  onCustomFromChange: (value: string) => void
  onCustomToChange: (value: string) => void
}

export function DateFilter({
  value,
  onChange,
  customFrom,
  customTo,
  onCustomFromChange,
  onCustomToChange,
}: DateFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select value={value} onValueChange={(v) => onChange(v as DateRange)}>
        <SelectTrigger className="w-full sm:w-[160px]">
          <SelectValue placeholder="開催時期" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">すべての日程</SelectItem>
          <SelectItem value="this_week">今週</SelectItem>
          <SelectItem value="next_week">来週</SelectItem>
          <SelectItem value="this_month">今月</SelectItem>
          <SelectItem value="next_month">来月</SelectItem>
          <SelectItem value="custom">日付指定</SelectItem>
        </SelectContent>
      </Select>
      {value === "custom" && (
        <>
          <input
            type="date"
            value={customFrom}
            onChange={(e) => onCustomFromChange(e.target.value)}
            className="h-9 px-2 border rounded text-sm bg-background"
          />
          <span className="text-sm text-muted-foreground">〜</span>
          <input
            type="date"
            value={customTo}
            onChange={(e) => onCustomToChange(e.target.value)}
            className="h-9 px-2 border rounded text-sm bg-background"
          />
        </>
      )}
    </div>
  )
}

export type { DateRange }
