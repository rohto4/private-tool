# Implementation Completed

このファイルは、完了済みの実装、確定済み仕様、回答済み判断を管理する。
未完了タスクは `docs/imp/imp-plan.md`、未決事項は `docs/imp/imp-wait.md` を正とする。

## 1. 確定済み仕様

### 1.1 技術前提

- TypeScript + Next.js App Routerで進める。
- DBはNeon PostgreSQL + Prisma。
- 定期実行はGitHub Actions cron。
- GitHub ActionsはCLIを実行する方式にする。
- Slack slash commandとMisskey one-click投稿はNext.js API endpointで受ける。
- データモデルはai-summaryのL1-L4全移植ではなく、軽量構成にする。
- `.env.local` をローカルsecret置き場にし、secret値はgit管理しない。
- GitHub Actionsではrepository secretsを使う。

### 1.2 Slack / Misskey仕様

- Slack投稿チャンネルは `#feed-ai`、`#feed-tech`、`#feed-other`。
- Slack channel IDはenvで管理する。
- Slack手動実行コマンドは `/pt-fetch`。
- `/pt-fetch` は `#feed-other` で実行する想定。
- 初期ユーザー制限は入れない。
- Slack投稿にはMisskey共有URLボタンとMisskey API投稿ボタンを付ける。
- Misskey共有文は `{title}\n{url}`。
- Misskey API投稿は個人アカウント固定、確認なしのワンクリックにする。

### 1.3 Feed取得 / 投稿仕様

- RSS取得は1時間ごと。
- 初期sourceはユーザ指定の日本語AI/tech系sourceにする。
- ai-summaryの商用利用前提source一覧は流用しない。
- 初期の好み判定は入れず、キーワードによるチャンネル振り分けだけ行う。
- キーワードの参考元は `G:\devwork\ai-summary\scripts\seed-keywords.mjs`。
- Slack表示summaryはRSS descriptionを元にし、HTML除去と文字数制限を行う。
- 二重Slack投稿の主判定は `FeedItem.isSent`。
- 重複判定はURLに加えてtitle類似も見る。
- その日に投稿上限を超えた記事は翌日に繰り越さない。
- 毎日21時ごろ、当日取得数とSlack投稿数のサマリを `#feed-other` に流す。

### 1.4 投稿上限

- `#feed-ai`: 10件/日
- `#feed-tech`: 10件/日
- `#feed-other`: 20件/日

## 2. 完了済み実装

### 2.1 プロジェクト初期構成

実装済み:
- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `next.config.ts`
- `eslint.config.mjs`
- `vitest.config.ts`
- `.env.example`
- `.gitignore`
- `src/app/layout.tsx`
- `src/app/page.tsx`

script:
- `npm run dev`
- `npm run build`
- `npm run typecheck`
- `npm run lint`
- `npm run test`
- `npm run prisma:generate`
- `npm run prisma:migrate`
- `npm run prisma:studio`
- `npm run db:seed`
- `npm run source:check`
- `npm run job:hourly`
- `npm run job:daily-summary`

### 2.2 DBスキーマ / Prisma

軽量構成として実装済み:
- `SourceTarget`
- `FeedItem`
- `DeliveryLog`
- `JobRun`

実装済み:
- `prisma/schema.prisma`
- `prisma.config.ts`
- `src/lib/db/client.ts`
- `src/lib/config/env.ts`
- PostgreSQL adapter設定
- Prisma 7 client生成
- `.env.local` 優先読み込み

適用済みmigration:
- `20260428114120_init`
- `20260428114220_add_source_target_notes`

### 2.3 source seed / RSS検証

実装済み:
- `src/lib/sources/initial-sources.ts`
- `scripts/seed-sources.ts`
- `scripts/check-sources.ts`

初期投入:
- 8 source targetsを投入。
- RSS検証後、6 sourceをactive化。

active:
- AINOW
- ITmedia AI+
- Gizmodo Japan
- ITmedia
- CNET Japan
- Menthas

inactive:
- Ledge.ai: `https://ledge.ai/feed.xml` が404。
- AIsmiley: `https://aismiley.co.jp/feed/` はparse可能だが0件。

### 2.4 RSS取得 / 正規化 / 重複判定

実装済み:
- `src/lib/feeds/fetch.ts`
- `src/lib/feeds/normalize.ts`
- `src/lib/feeds/normalize.test.ts`
- `src/lib/jobs/hourly.ts`
- `scripts/run-hourly.ts`

機能:
- active source取得。
- sourceごとのRSS取得。
- source単位の失敗隔離。
- URL正規化。
- HTML除去。
- description文字数制限。
- `titleSignature` 生成。
- URL/title重複判定。
- DB保存。
- 最小テスト。

### 2.5 チャンネル振り分け

実装済み:
- `src/lib/routing/keywords.ts`
- `src/lib/routing/channel.ts`

初期ルール:
- AI系キーワード一致: `feed-ai`
- tech系sourceまたはtech系キーワード一致: `feed-tech`
- それ以外: `feed-other`

### 2.6 Slack投稿

実装済み:
- `src/lib/slack/client.ts`
- `src/lib/slack/blocks.ts`
- `src/lib/slack/posting.ts`
- `src/lib/slack/summary.ts`
- `src/lib/slack/verify.ts`

機能:
- Slack Web API client。
- channel keyからchannel IDへの解決。
- Block Kit生成。
- Misskey共有URLボタン。
- Misskey API投稿ボタン。
- Slack実投稿処理。
- channel別日次投稿上限。
- 投稿成功時の `FeedItem.isSent=true` / `sentAt` 更新。
- `DeliveryLog` 保存。
- 上限超過時の `skippedAt` / `skipReason` 更新。
- 日次サマリSlack投稿。
- Slack署名検証。
- timestamp replay対策。

### 2.7 Slack endpoint

実装済み:
- `src/app/api/slack/commands/route.ts`
- `src/app/api/slack/interactions/route.ts`

機能:
- `/pt-fetch` slash command。
- Slack interactivity endpoint。
- 署名検証。
- 即時ack。
- 裏側job実行。
- Misskey API投稿接続。

未確認:
- deploy先公開URL未設定のため、Slack Appからの実接続は未確認。

### 2.8 Misskey

実装済み:
- `src/lib/misskey/share-url.ts`
- `src/lib/misskey/client.ts`

機能:
- Misskey共有URL生成。
- Misskey API client。
- Slack interactionからMisskeyへワンクリック投稿。
- Misskey投稿結果の `DeliveryLog` 保存。

未確認:
- Slack interactivity公開URL未設定のため、Slackボタン経由の実投稿は未確認。

### 2.9 GitHub Actions workflow

実装済み:
- `.github/workflows/hourly-feed.yml`
- `.github/workflows/daily-feed-summary.yml`

機能:
- `schedule`
- `workflow_dispatch`
- `npm ci`
- `npm run prisma:generate`
- `npm run job:hourly`
- `npm run job:daily-summary`

未完了:
- repository secrets設定。
- GitHub Actions上での実行確認。
- cron自動実行成功確認。

### 2.10 日次サマリ

実装済み:
- `src/lib/jobs/daily-summary.ts`
- `scripts/run-daily-summary.ts`

機能:
- JST当日範囲計算。
- 取得数集計。
- 投稿数集計。
- skip数集計。
- `#feed-other` へのSlack投稿接続。

## 3. 実行済み検証

実行済み:
- `npm run prisma:generate`
- `npm run typecheck`
- `npm run lint`
- `npm run test`
- `npm run build`
- `npm audit --audit-level=moderate`

結果:
- typecheck成功。
- lint成功。
- test成功。
- build成功。
- auditは0件。

## 4. 初回hourly実行結果

実行:
- `npm run job:hourly`

結果:
- sourcesTotal: 6
- sourcesSucceeded: 6
- sourcesFailed: 0
- fetchedItems: 125
- insertedItems: 121
- duplicateItems: 4
- `#feed-ai`: 10件投稿
- `#feed-tech`: 10件投稿
- `#feed-other`: 0件投稿
- skipped `feed-ai`: 53件
- skipped `feed-tech`: 48件
- skipped `feed-other`: 0件
- posting failures: 0

## 5. 回答済みwait項目の反映先

- W-001: source管理はDB管理とし、後続でSlack管理コマンドを作る。
- W-002/W-019: 初期sourceは指定されたAI/tech系8サイトに確定。
- W-003/W-014: Slack投稿先は `#feed-ai`、`#feed-tech`、`#feed-other`。
- W-004/W-020: 1時間ごとに収集し、日次投稿上限と日次サマリを採用。
- W-005: Misskey共有文は `{title}\n{url}`。
- W-006: DBはNeon PostgreSQL。
- W-007/W-018: 定期実行はGitHub Actions CLI方式。
- W-008: SlackからはGitHub Actions直接起動ではなく、Next.js API endpointで共通jobを呼ぶ。
- W-009: 二重Slack投稿の主判定は `FeedItem.isSent`。
- W-010: URL重複に加えてtitle類似を見る。
- W-011: RSS descriptionを元summaryとして使う。
- W-012: secretはGitHub repository secretsとローカル `.env.local`。
- W-013: DBは軽量構成。
- W-015: 好み判定は初期実装に入れない。
- W-016: Misskey API投稿はSlack interactivity endpoint経由のワンクリック。
- W-017: Slack command名は `/pt-fetch`、実行場所は `#feed-other`。
