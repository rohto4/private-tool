# Missing Parts

## 目的

現状から「実際に動くBOT」へ進めるために不足している部品を管理する。
不足は、Codex側で作るものと、ユーザ操作が必要なものに分ける。

## 前提更新

- Slack workspaceは `unibell4-dev.slack.com` を使う。
- Neon DB情報は `.env.local` に記載済み。
- `.env.local` はsecretを含むためgit管理しない。

## A. Codex側でまだ作っていないもの

### A-001 RSS URL検証とsource有効化

Status: 初期対応済み。

やること:
- 各サイトのRSS/Atom URLを調査する。
- parserで読めるか確認する。
- 使えるsourceは `src/lib/sources/initial-sources.ts` に反映する。
- 使えるsourceだけ `isActive=true` にする。
- 使えないsourceは対象外、または `isActive=false` のまま理由を残す。

対象:
- AINOW
- Ledge.ai
- AIsmiley
- ITmedia AI+
- Gizmodo Japan
- ITmedia
- CNET Japan
- Menthas

結果:
- active: AINOW
- active: ITmedia AI+
- active: Gizmodo Japan
- active: ITmedia
- active: CNET Japan
- active: Menthas
- inactive: Ledge.ai。`https://ledge.ai/feed.xml` は404。
- inactive: AIsmiley。`https://aismiley.co.jp/feed/` はparse可能だが0件。

### A-002 Slack実投稿処理

Status: 実装済み。実投稿テスト未実施。

現状:
- Block Kit生成、Slack投稿関数、hourly job接続まで実装済み。
- 実投稿は `npm run job:hourly` で行う。
- 初回は最大で `#feed-ai` 10件、`#feed-tech` 10件、`#feed-other` 20件投稿される可能性があるため、まだ実行していない。

作るもの:
- `src/lib/slack/client.ts`
- 未送信記事の抽出処理。
- channel別投稿上限の適用。
- `chat.postMessage` 呼び出し。
- 成功時の `FeedItem.isSent=true` 更新。
- `DeliveryLog` 保存。
- 上限超過時の `skippedAt` / `skipReason` 更新。
- hourly jobからSlack投稿までつなぐ処理。

### A-003 日次サマリSlack投稿

Status: 実装済み。実投稿テスト未実施。

現状:
- 日次サマリ集計とSlack投稿を接続済み。

作るもの:
- サマリ用テキストまたはBlock Kit生成。
- `#feed-other` への投稿処理。
- `npm run job:daily-summary` からSlack投稿までつなぐ処理。

### A-004 Slack署名検証

Status: 実装済み。

現状:
- `/api/slack/commands`
- `/api/slack/interactions`
- どちらも署名検証を実装済み。

作るもの:
- `SLACK_SIGNING_SECRET` による署名検証。
- timestamp replay対策。
- command payload parse。
- interaction payload parse。

### A-005 Slack slash command実行

Status: 実装済み。公開URL設定待ち。

現状:
- `/pt-fetch` を受けて即時ackし、裏でhourly job相当を起動する。

作るもの:
- `/pt-fetch` を受けて即時ack。
- hourly job相当の起動。
- 実行結果を `#feed-other` へ投稿。

### A-006 Misskey API投稿

Status: 実装済み。実投稿テスト未実施。

現状:
- Misskey共有URL生成、API投稿ボタン、Misskey API client、Slack interaction接続まで実装済み。

作るもの:
- `src/lib/misskey/client.ts`
- Misskey API投稿処理。
- Slack interaction payloadから `feedItemId` を取得。
- 投稿済み/失敗の `DeliveryLog` 保存。

### A-007 source管理コマンド

後続で作るもの:
- `/pt-source list`
- `/pt-source add`
- `/pt-source disable`
- `/pt-source enable`
- `/pt-source delete`

初期実装では後回しでよい。

### A-008 RSS URL検証補助コマンド

Status: 実装済み。

あると便利:
- `npm run source:check`
- source候補のRSS URLを取得してparserで読めるか確認する。

### A-009 dry-run投稿モード

あると便利:
- Slackへ投稿せず、投稿予定件数とBlock Kit JSONだけ確認する。

### A-010 migrate用workflow

あると便利:
- GitHub Actions手動実行でPrisma migrateを流すworkflow。

## B. ユーザ操作が必要なもの

### B-001 Slack App作成/設定

対象workspace:
- `unibell4-dev.slack.com`

必要:
- Slack Appを作成する。
- Bot Tokenを発行する。
- Signing Secretを取得する。
- Botを `#feed-ai`、`#feed-tech`、`#feed-other` に参加させる。

必要scope候補:
- `chat:write`
- `commands`

### B-002 Slack channel ID取得

必要:
- `#feed-ai` のchannel ID
- `#feed-tech` のchannel ID
- `#feed-other` のchannel ID

設定先:
- ローカル `.env.local`
- GitHub repository secrets

環境変数:
- `SLACK_CHANNEL_FEED_AI`
- `SLACK_CHANNEL_FEED_TECH`
- `SLACK_CHANNEL_FEED_OTHER`

### B-003 Slack token/secret設定

設定先:
- ローカル `.env.local`
- GitHub repository secrets

環境変数:
- `SLACK_BOT_TOKEN`
- `SLACK_SIGNING_SECRET`

### B-004 Neon DB migrate実行

現状:
- Neon DB情報は `.env.local` に記載済み。
- 2026-04-28: Codex側で `npx prisma migrate dev --name init` を実行済み。
- 2026-04-28: Codex側で `npx prisma migrate dev --name add-source-target-notes` を実行済み。
- 2026-04-28: Codex側で `npm run db:seed` を実行済み。8 source targetsを投入。
- 2026-04-28: RSS検証後に再seedし、6 sourceをactive化。

残り:
- Neon接続URLに `sslmode=require` が含まれる場合、将来互換のため `sslmode=verify-full` への変更を検討する。

補足:
- migrate/seedは実DBへ反映済み。

### B-005 GitHub repository secrets設定

Status: ユーザ操作待ち。

必要:
- `DATABASE_URL`
- `DATABASE_URL_UNPOOLED`
- `SLACK_BOT_TOKEN`
- `SLACK_SIGNING_SECRET`
- `SLACK_CHANNEL_FEED_AI`
- `SLACK_CHANNEL_FEED_TECH`
- `SLACK_CHANNEL_FEED_OTHER`
- `MISSKEY_API_TOKEN`

### B-006 deploy先の用意

Status: ユーザ操作待ち。

必要:
- Next.js API endpointを外部公開するdeploy先。
- 候補: Vercel。

理由:
- Slack slash command/interactivityは公開URLが必要。

### B-007 Slack Request URL設定

Status: deploy後にユーザ操作待ち。

deploy後に設定する。

Slash command:
- command: `/pt-fetch`
- Request URL: `https://<deploy-domain>/api/slack/commands`

Interactivity:
- Request URL: `https://<deploy-domain>/api/slack/interactions`

### B-008 Misskey API token設定

必要:
- Misskey.io API tokenを作成する。
- `.env.local` とGitHub repository secretsに設定する。

環境変数:
- `MISSKEY_API_TOKEN`

## 現時点の結論

Codex側で残っている主なもの。

1. source管理コマンド。
2. dry-run投稿モード。
3. migrate用workflow。

ユーザ操作が必要な最優先は次の3つ。

1. GitHub repository secrets設定。
2. deploy先の用意。
3. Slack Request URL設定。
