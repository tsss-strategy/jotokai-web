# jotokai-web

譲渡会情報の公開Webサイト。Next.js + Vercel。

- **URL**: https://jotokai-web.vercel.app
- **リポジトリ**: tamura-tools/jotokai-web

## 機能

- イベント一覧（カード / テーブル / 地図ビュー）
- Web検索（Google Custom Search + Gemini）: `/search`
- マニュアル: `/help`
- CSVダウンロード（UTF-8-sig）

## コマンド

```bash
npm install && npm run dev    # ローカル開発
npx vercel --prod             # 本番デプロイ（手動）
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

- Supabase `v_events_merged` ビュー（jotokai-dashが投入したデータの統合表示）
- 環境変数: `GEMINI_API_KEY`, `GOOGLE_CUSTOM_SEARCH_API_KEY`, `GOOGLE_CUSTOM_SEARCH_ENGINE_ID`

## 注意事項

- GitHub連携は停止中 → デプロイは必ず `npx vercel --prod` で手動実行
- CSV列: 開催日 / 都道府県 / 主催団体名 / 住所・会場 / 時間 / 情報を取得したURL
- Vercel無料枠で運用
