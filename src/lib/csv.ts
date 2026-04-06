import type { MergedEvent } from "@/types/event"

// 曜日変換マップ（format.ts の DAY_OF_WEEK_MAP に合わせて独自定義）
const DAY_OF_WEEK_MAP: Record<string, string> = {
  Mon: "月", Tue: "火", Wed: "水", Thu: "木", Fri: "金", Sat: "土", Sun: "日",
  月: "月", 火: "火", 水: "水", 木: "木", 金: "金", 土: "土", 日: "日",
}

/**
 * YYYY-MM-DD と day_of_week から "YYYY/MM/DD(曜)" 形式に変換
 */
function formatDateForCsv(dateStr: string, dayOfWeek: string | null): string {
  const date = new Date(dateStr + "T00:00:00")
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  let dow: string
  if (dayOfWeek) {
    dow = DAY_OF_WEEK_MAP[dayOfWeek] ?? dayOfWeek
  } else {
    const days = ["日", "月", "火", "水", "木", "金", "土"]
    dow = days[date.getDay()]
  }

  return `${year}/${month}/${day}(${dow})`
}

/**
 * 住所と会場名を結合する（住所　会場名 の順）
 * prefecture が指定された場合、住所の先頭から都道府県名を除去する
 */
function formatLocation(address: string | null, venueName: string | null, prefecture: string | null): string {
  const clean = (s: string) => s.replace(/[\r\n]+/g, " ").trim()
  let addr = address ? clean(address) : null
  if (addr && prefecture && addr.startsWith(prefecture)) {
    addr = addr.slice(prefecture.length).trimStart()
  }
  if (addr && venueName) {
    return `${addr}　${clean(venueName)}`
  }
  return addr ? addr : venueName ? clean(venueName) : ""
}

/**
 * 時間フィールドを "HH:MM〜HH:MM" 形式に変換
 * start_time のみの場合は "HH:MM"、両方なければ ""
 */
function formatTimeForCsv(startTime: string | null, endTime: string | null): string {
  if (!startTime) return ""
  const start = startTime.slice(0, 5)
  if (!endTime) return start
  const end = endTime.slice(0, 5)
  return `${start}〜${end}`
}

/**
 * CSV用にセルの値をエスケープする（RFC 4180準拠）
 * カンマ・ダブルクォート・改行を含む場合はダブルクォートで囲む
 */
function escapeCsvCell(value: string): string {
  // CSV formula injection対策: =, +, -, @, \t, \r で始まるセルにプリフィックスを追加
  if (/^[=+\-@\t\r]/.test(value)) {
    value = "'" + value
  }
  if (value.includes(",") || value.includes('"') || value.includes("\n") || value.includes("\r") || value.includes("'")) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}


/**
 * MergedEvent 配列を CSV 文字列に変換する
 */
function convertToCsvString(events: MergedEvent[]): string {
  const headers = [
    "開催日",
    "都道府県",
    "主催団体名",
    "住所・会場",
    "時間",
    "情報を取得したURL",
  ]

  const rows: string[] = [headers.map(escapeCsvCell).join(",")]

  for (const event of events) {
    const eventDate = formatDateForCsv(event.event_date, event.day_of_week)
    const location = formatLocation(event.address, event.venue_name, event.prefecture)
    const time = formatTimeForCsv(event.start_time, event.end_time)
    const allUrls = event.source_urls ?? []
    const webUrls = allUrls.filter(
      (url) => !url.includes("instagram.com") && !url.includes("twitter.com") && !url.includes("x.com")
    )
    const urls = webUrls[0] ?? allUrls[0] ?? ""

    const row = [
      eventDate,
      event.prefecture,
      event.org_name,
      location,
      time,
      urls,
    ]

    rows.push(row.map(escapeCsvCell).join(","))
  }

  return rows.join("\r\n")
}

/**
 * イベントデータをCSVファイルとしてブラウザでダウンロードさせる
 * ファイル名: jotokai_events_YYYYMMDD.csv
 * 文字コード: UTF-8 BOM付き（Excelで文字化けしないよう）
 */
export function exportToCsv(events: MergedEvent[]): void {
  const csvString = convertToCsvString(events)

  // UTF-8 BOM付きで Blob を作成
  const bom = "\uFEFF"
  const blob = new Blob([bom + csvString], { type: "text/csv;charset=utf-8;" })

  // 今日の日付を YYYYMMDD 形式で取得
  const today = new Date()
  const yyyy = today.getFullYear()
  const mm = String(today.getMonth() + 1).padStart(2, "0")
  const dd = String(today.getDate()).padStart(2, "0")
  const fileName = `jotokai_events_${yyyy}${mm}${dd}.csv`

  // a タグを使ってダウンロードを発火
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
