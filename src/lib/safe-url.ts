/**
 * URLが安全なスキーム（http/https）かどうかを検証する
 * javascript: や data: スキームによるXSS攻撃を防止
 */
export function isSafeUrl(url: string | null | undefined): boolean {
  if (!url) return false
  try {
    const parsed = new URL(url, "https://placeholder.invalid")
    return parsed.protocol === "http:" || parsed.protocol === "https:"
  } catch {
    return false
  }
}
