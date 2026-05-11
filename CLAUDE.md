# jotokai-web

譲渡会情報の公開Webサイト。Next.js + Vercel。

- **URL**: https://jotokai-web.vercel.app
- **リポジトリ**: tsss-strategy/jotokai-web
- **Vercel**: tsss-strategy team / jotokai-web
- **Doppler**: `jotokai-web` プロジェクト、`prd` config が Vercel Production と連携

## 機能

- イベント一覧（カード / テーブル / 地図ビュー）
- Web検索（Google Custom Search + Gemini）: `/search`
- マニュアル: `/help`
- CSVダウンロード（UTF-8-sig）

## コマンド

```bash
doppler run --config dev_personal -- npm run dev   # ローカル開発（Doppler 経由で env 注入）
npm install                                        # 依存追加時
git push origin main                               # main push で Vercel が自動デプロイ
npx vercel --prod                                  # 緊急時の手動デプロイ
```

## 構成

```
src/
├── app/           — ページ（events/, search/, help/）
│   └── api/       — APIルート
├── components/    — UIコンポーネント（event-card, event-table, event-map等）
├── lib/           — ユーティリティ（csv.ts, supabase/, format.ts）
└── types/         — 型定義
```

## データソース

- Supabase project `pyylggxlwatsmphxglcu` の `v_events_merged` ビュー（jotokai-dashが投入したデータの統合表示）
- 環境変数は Doppler `jotokai-web/prd` で管理。主要キー:
  - `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (旧JWT形式、四半期ローテ対象 → `project_jotokai_web_service_role_rotation_pending.md`)
  - `GEMINI_API_KEY` / `GOOGLE_CUSTOM_SEARCH_API_KEY` / `GOOGLE_CUSTOM_SEARCH_ENGINE_ID`

## 注意事項

- main push で Vercel が自動デプロイ。手動デプロイは `npx vercel --prod`
- env は Vercel UI で直接編集しない（Doppler 側で編集し sync させる）
- Preview/Development env は空運用（memory `feedback_vercel_env_rules.md` ルール3遵守）
- CSV列: 開催日 / 都道府県 / 主催団体名 / 住所・会場 / 時間 / 情報を取得したURL
- Vercel無料枠で運用
