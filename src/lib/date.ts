// 日本時間（Asia/Tokyo）基準の日付ユーティリティ。
// Vercel のサーバーは UTC で動くため、new Date() を toISOString() 等で直接
// フォーマットすると JST より最大9時間古い日付になる。日付文字列の生成は必ずここを通す。

const JST_DATE_FORMAT = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Tokyo",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
})

/** 日本時間の今日を YYYY-MM-DD で返す */
export function todayJst(): string {
  return JST_DATE_FORMAT.format(new Date())
}

/**
 * 日本時間の今日を「UTC 0時の Date」として返す（日付演算専用）。
 * getUTC* / setUTC* / utcDateToString とだけ組み合わせ、
 * ローカルタイムゾーン系メソッド（getDay, setDate 等）とは混ぜないこと。
 */
export function jstTodayAsUtcDate(): Date {
  const [y, m, d] = todayJst().split("-").map(Number)
  return new Date(Date.UTC(y, m - 1, d))
}

/** 「UTC 0時の Date」（jstTodayAsUtcDate 系）を YYYY-MM-DD にする */
export function utcDateToString(date: Date): string {
  return date.toISOString().slice(0, 10)
}
