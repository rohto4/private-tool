# News Bot Runbook

## 目的

ニュース/RSS取得、Slack投稿、Misskey共有BOTを動かすために必要な設定と実行手順を整理する。

## 現在の到達点

現状のコードで確実にできること:
- Prisma schemaの生成。
- Neon PostgreSQLへmigrateする準備。
- source seedの投入。
- activeなRSS sourceから記事を取得し、DBへ保存するジョブの実行。
- 日次サマリ集計のdry-run。
- Slack command/interactions endpointの疎通枠。
- Misskey共有URLの生成。

まだできないこと:
- Slackへ記事を実投稿する。
- Slack slash commandから実ジョブを起動する。
- SlackボタンからMisskey APIへ実投稿する。
- 日次サマリをSlackへ実投稿する。

## 事前に必要なもの

### Neon

必要:
- Neon PostgreSQL project
- pooled接続URL
- unpooled接続URL

環境変数:
- `DATABASE_URL`
- `DATABASE_URL_UNPOOLED`

### Slack

必要:
- Slack App
- Bot Token
- Signing Secret
- 投稿先チャンネルID

対象workspace:
- `unibell4-dev.slack.com`

対象チャンネル:
- `#feed-ai`
- `#feed-tech`
- `#feed-other`

環境変数:
- `SLACK_BOT_TOKEN`
- `SLACK_SIGNING_SECRET`
- `SLACK_CHANNEL_FEED_AI`
- `SLACK_CHANNEL_FEED_TECH`
- `SLACK_CHANNEL_FEED_OTHER`

必要scope候補:
- `chat:write`
- `commands`

Slash command:
- command: `/pt-fetch`
- endpoint: `POST /api/slack/commands`

Interactivity:
- endpoint: `POST /api/slack/interactions`

### Misskey.io

必要:
- Misskey.io API token

環境変数:
- `MISSKEY_API_TOKEN`
- `MISSKEY_BASE_URL=https://misskey.io`

## ローカル起動手順

### 1. 依存関係を入れる

```bash
npm ci
```

### 2. envを作る

`.env.example` を参考に `.env.local` または `.env` を作る。

このPJでは `.env.local` を優先して読む。
Neon DB情報は `.env.local` に記載済み。

### 3. Prisma clientを生成する

```bash
npm run prisma:generate
```

### 4. DBへschemaを反映する

```bash
npm run prisma:migrate
```

2026-04-28時点では実行済み。

### 5. source seedを投入する

```bash
npm run db:seed
```

2026-04-28時点では実行済み。8 source targetsを投入済み。

注意:
- 現時点の初期sourceはRSS URL未検証のため全て `isActive=false`。
- DB上で検証済みsourceを `isActive=true` にしないと、hourly jobは取得しない。

### 6. hourly jobを実行する

```bash
npm run job:hourly
```

現状:
- active sourceからRSSを取得する。
- 新規記事をDBへ保存する。
- Slackへ投稿する。

注意:
- 初回は最大で `#feed-ai` 10件、`#feed-tech` 10件、`#feed-other` 20件流れる可能性がある。
- 実投稿前にチャンネルIDとBot参加状態を確認する。

### 7. daily summaryを確認する

```bash
npm run job:daily-summary
```

現状:
- 当日JSTの取得数、投稿数、スキップ数をJSON出力する。
- `#feed-other` へ日次サマリを投稿する。

## GitHub Actionsで動かす手順

### 1. repository secretsを設定する

必須:
- `DATABASE_URL`
- `DATABASE_URL_UNPOOLED`

Slack投稿まで進める場合:
- `SLACK_BOT_TOKEN`
- `SLACK_CHANNEL_FEED_AI`
- `SLACK_CHANNEL_FEED_TECH`
- `SLACK_CHANNEL_FEED_OTHER`

Slack command/interactivityまで進める場合:
- `SLACK_SIGNING_SECRET`

Misskey API投稿まで進める場合:
- `MISSKEY_API_TOKEN`

### 2. DB migrateを実施する

初回はローカルまたはGitHub Actions手動workflowでDB schemaを反映する。
現状はmigrate専用workflow未作成のため、ローカルから実施する。

```bash
npm run prisma:migrate
```

### 3. source seedを投入する

```bash
npm run db:seed
```

2026-04-28時点では実行済み。

### 4. RSS URLを検証してsourceを有効化する

DBの `source_targets.is_active` を `true` にする。
未検証URLは有効化しない。

2026-04-28時点では6 sourceをactive化済み。

### 5. Actionsを手動実行する

GitHub Actions:
- `Hourly Feed`
- `Daily Feed Summary`

どちらも `workflow_dispatch` 付き。

## 動作確認コマンド

```bash
npm run prisma:generate
npm run typecheck
npm run lint
npm run test
npm run build
npm audit --audit-level=moderate
```

現時点では全て成功済み。

## 動く状態の定義

最小で動く状態:
1. Neon DBにmigrate済み。
2. `source_targets` に1件以上 `isActive=true` のRSS sourceがある。
3. `npm run job:hourly` が記事を取得して `feed_items` に保存する。

Slack投稿まで動く状態:
1. 最小で動く状態を満たす。
2. Slack Bot Tokenとchannel IDが設定済み。
3. Slack投稿処理が実装済み。

2026-04-28時点では実装済み。`npm run job:hourly` で実投稿される。

Misskey one-click投稿まで動く状態:
1. Slack投稿まで動く状態を満たす。
2. Slack interactivity endpointが公開URLで設定済み。
3. Misskey API tokenが設定済み。
4. Misskey API投稿処理が実装済み。
