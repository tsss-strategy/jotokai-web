"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { sourceDisplayName } from "@/lib/source-names"

interface SourceFilterProps {
  value: string
  onChange: (value: string) => void
  sources: string[]
}

export function SourceFilter({ value, onChange, sources }: SourceFilterProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="すべての情報元" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">すべての情報元</SelectItem>
        {sources.map((src) => (
          <SelectItem key={src} value={src}>
            {sourceDisplayName(src)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
