export const SOURCE_NAMES: Record<string, string> = {
  hugu: "ハグー",
  omusubi: "OMUSUBI",
  nekojirushi: "ネコジルシ",
  pethome: "ペットのおうち",
  instagram: "Instagram",
  twitter: "X (Twitter)",
  rss: "公式サイト・ブログ",
}

export function sourceDisplayName(src: string): string {
  return SOURCE_NAMES[src] || src
}
