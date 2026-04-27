# Implementation Plan

このファイルは、現時点で決まっている実装タスクを管理する。
未決定事項は `docs/imp/imp-wait.md` を参照する。

## P-001 プロジェクト初期構成

- TypeScriptベースで構成する。
- Next.js App Router / API Routesを候補スタックとして使う。
- Prisma + PostgreSQLを前提にする。
- `.env.example` を作成する。
- 実装ディレクトリ構成案を作る。

## P-002 Prismaデータモデル

- `FeedItem` モデルを作成する。
- `url` はuniqueにする。
- 最低限のフィールド:
  - `id`
  - `url`
  - `title`
  - `description`
  - `source`
  - `publishedAt`
  - `isSent`

## P-003 RSS取得ロジック

- 複数RSS URLから記事を取得する。
- `rss-parser` などを候補にする。
- 取得結果を共通のFeedItem入力形式に正規化する。
- URLが既存DBにない新規アイテムのみ保存する。

## P-004 重複排除

- 初期実装ではURL uniqueを主軸にする。
- 再実行時に同じ記事を二重保存しない。
- 詳細な重複判定は `imp-wait.md` の決定後に拡張する。

## P-005 Slack投稿ロジック

- Slack `chat.postMessage` APIを使う。
- Slack Block Kitで記事タイトル、summary、元URLを表示する。
- 投稿対象は未送信の `FeedItem` にする。

## P-006 Misskey.io共有ボタン

- Slack Block KitのURL buttonを使う。
- URLは `https://misskey.io/share?text={encodedText}` 形式にする。
- `encodedText` は定型文、タグ、記事タイトル、記事URLを組み立てられる関数にする。

## P-007 投稿済み更新

- Slack投稿に成功した記事は送信済みに更新する。
- 初期実装では `isSent = true` を最低条件にする。
- 送信日時やSlack message tsの保存は `imp-wait.md` の決定後に追加する。

## P-008 一括実行ハンドラー

- 収集、DB保存、未送信抽出、Slack投稿を一括実行できる入口を作る。
- API endpointまたはCLIのどちらにするかは `imp-wait.md` で決める。
- 内部ロジックはAPI/CLIから再利用できる形に分ける。

## P-009 定期実行

- GitHub Actions cronまたはVercel Cron Jobsで定期実行する。
- 方式は `imp-wait.md` で決める。
- 実行ログと失敗時の確認方法を用意する。

## P-010 ドキュメント昇格

- `docs/candi-ref/news-slack-misskey-bot-candidate.md` の内容を元にする。
- 決定済みになった仕様は `docs/spec/` に昇格する。
- 実装中の判断と進捗は `docs/imp/` に記録する。
