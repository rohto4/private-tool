# News Slack Misskey Bot Candidate

## 位置づけ

この資料はCandidate Reference。
RSSやニュースフィードから情報を収集し、SlackへMisskey.io共有ボタン付きで投稿する機能の実装候補を整理する。

## プロジェクト概要

RSSやニュースフィードから情報を自動収集し、重複排除を行った上で、Slackの特定チャンネルへMisskey.io共有ボタン付きで投稿する。

## 技術スタック候補

- Language: TypeScript
- Framework: Next.js App Router / API Routes
- ORM/DB: Prisma + PostgreSQL
- Platform: Vercel + GitHub Actions scheduled workflow
- UI: Slack Block Kit Actions / Buttons

## フェーズ案

### Phase 1: データモデルと収集ロジック

Prisma Schema:
- `FeedItem`
- `id`
- `url` unique
- `title`
- `description`
- `source`
- `publishedAt`
- `isSent`

収集スクリプト:
- `rss-parser` などで複数RSS URLから取得する。
- DBを検索し、URLが存在しない新規アイテムのみ保存する。

### Phase 2: Slack投稿インターフェース

Slack投稿:
- `chat.postMessage` APIを使用する。
- セクションブロックで記事タイトルとサマリーを表示する。

Misskey.io共有ボタン:
- Slack Block Kitの `button` を使う。
- `url` に `https://misskey.io/share?text={encodedText}` を設定する。
- `encodedText` には定型文、タグ、記事タイトル、URLを含められるようにする。

### Phase 3: 自動実行ワークフロー

実行口:
- 収集と投稿を一括で行うAPI endpointまたはCLIを作る。

定期実行:
- GitHub Actionsのcronで定期実行する。
- Vercel Cron Jobsも候補に残す。

## 期待する成果物

- `schema.prisma`
- RSS取得からDB保存までの主要関数
- Slack投稿関数
- Slack Block Kit JSON構造
- Misskey共有URL生成関数
- GitHub Actions workflow
- プロジェクトのディレクトリ構成案

## このPJ向けの判断メモ

- まずは仕様確定前なので `docs/spec/` ではなく `docs/candi-ref/` に置く。
- Vercel Cron JobsとGitHub Actions cronはどちらも候補。どちらを正にするかは、secret管理、実行ログ、無料枠、DB接続方式を見て決める。
- Slack token、Misskey共有文テンプレート、RSS取得元はsecretや設定ファイルで外出しする。
- 初期実装では「取得」と「投稿」を分離し、再実行時に同じ記事を二重投稿しないことを優先する。

## 未決定事項

- RSS取得元一覧の管理方法。
- Slack投稿先チャンネル。
- 投稿頻度。
- Misskey共有文の定型文、タグ。
- DBをVercel Postgres系にするか、別PostgreSQLにするか。
- 実行方式をGitHub Actionsに寄せるか、Vercel Cron Jobsに寄せるか。
