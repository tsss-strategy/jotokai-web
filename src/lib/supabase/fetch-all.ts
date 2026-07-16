// PostgREST（Supabase）はサーバー設定 max-rows（既定1000行）で結果を
// エラーなしで切り捨てる。全件が必要なクエリは必ずこのページングを通す。

const PAGE_SIZE = 1000
const MAX_PAGES = 20 // 暴走防止（20,000行まで）

type PageResult<T> = {
  data: T[] | null
  error: { message: string } | null
}

/**
 * range() でページングしながら全件取得する。
 * fetchPage には from/to を .range(from, to) に渡すクエリを組んで返す関数を渡す。
 * 取得順が安定するよう、クエリ側で一意になる並び順（複数 order）を指定すること。
 */
export async function fetchAllPages<T>(
  fetchPage: (from: number, to: number) => PromiseLike<PageResult<T>>
): Promise<{ data: T[]; error: { message: string } | null }> {
  const rows: T[] = []
  for (let page = 0; page < MAX_PAGES; page++) {
    const from = page * PAGE_SIZE
    const { data, error } = await fetchPage(from, from + PAGE_SIZE - 1)
    if (error) return { data: rows, error }
    if (!data || data.length === 0) break
    rows.push(...data)
    if (data.length < PAGE_SIZE) break
  }
  return { data: rows, error: null }
}
