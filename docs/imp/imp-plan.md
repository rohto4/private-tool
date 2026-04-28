# Implementation Plan

このファイルは、未完了の実装タスクだけを管理する。
完了済みの実装、確定済み仕様、回答済みの判断は `docs/imp/imp-comp.md` を正とする。

## 1. 現在の状態

- ニュース/RSS取得、DB保存、Slack投稿、Misskey共有/API投稿、日次サマリの初期実装は完了済み。
- ローカル実行では `npm run job:hourly` によりSlack実投稿まで確認済み。
- GitHub Actions workflowはmainに載っており、`schedule` と `workflow_dispatch` は定義済み。
- ただしGitHub repository secrets、deploy先、Slack Request URL設定が未完了のため、実用運用状態ではない。

## 2. 残タスク

### P-001 GitHub Actionsを本流運用に載せる

Status: 未完了

目的:
- GitHub Actions cronで `hourly-feed` と `daily-feed-summary` を安定実行する。

やること:
- GitHub repository secretsを設定する。
  - `DATABASE_URL`
  - `DATABASE_URL_UNPOOLED`
  - `SLACK_BOT_TOKEN`
  - `SLACK_SIGNING_SECRET`
  - `SLACK_CHANNEL_FEED_AI`
  - `SLACK_CHANNEL_FEED_TECH`
  - `SLACK_CHANNEL_FEED_OTHER`
  - `MISSKEY_API_TOKEN`
- GitHub Actions画面でworkflowが有効か確認する。
- `workflow_dispatch` で `hourly-feed` を手動実行し、Slack投稿とDB更新を確認する。
- `workflow_dispatch` で `daily-feed-summary` を手動実行し、`#feed-other` への投稿を確認する。
- 初回cron実行後、Actions log、DBの `JobRun`、Slack投稿結果を確認する。

完了条件:
- `hourly-feed` がGitHub Actions上で成功する。
- `daily-feed-summary` がGitHub Actions上で成功する。
- 1回以上のcron自動実行で成功を確認する。
- `JobRun` と `DeliveryLog` に成功履歴が残る。

注意:
- repository secrets未設定のまま自動実行されると失敗する。
- 自動投稿件数が多すぎる場合は、一時的にworkflow disable、投稿上限調整、dry-run導入のいずれかで止める。

### P-002 deploy先を用意してSlack公開endpointを接続する

Status: 未完了

目的:
- Slack slash commandとSlack interactivityを実運用できるようにする。

やること:
- Next.js API endpointを外部公開するdeploy先を用意する。
- deploy先に必要envを設定する。
- Slack AppのSlash Command Request URLを設定する。
  - `/pt-fetch`
  - `https://<deploy-domain>/api/slack/commands`
- Slack AppのInteractivity Request URLを設定する。
  - `https://<deploy-domain>/api/slack/interactions`
- Slackから `/pt-fetch` を実行し、即時ackと裏側job実行を確認する。
- Slack投稿内のMisskey API投稿ボタンを押し、Misskey投稿と `DeliveryLog` 記録を確認する。

完了条件:
- `/pt-fetch` がSlackから成功する。
- Slack interaction経由のMisskey投稿が成功する。
- Slack署名検証が本番URLで通る。

### P-003 source管理コマンドを作る

Status: 後続実装

目的:
- Feed取得元をSlackから管理できるようにする。

作るもの:
- `/pt-source list`
- `/pt-source add`
- `/pt-source disable`
- `/pt-source enable`
- `/pt-source delete`

設計メモ:
- `SourceTarget` はDB管理済み。
- 誤操作防止のため、削除は物理削除ではなく無効化を優先する。
- 初期は `#feed-other` での実行を想定する。

### P-004 dry-run投稿モードを作る

Status: 後続実装

目的:
- Slackへ実投稿せず、投稿予定件数とBlock Kit内容を確認できるようにする。

作るもの:
- hourly jobのdry-run option。
- 投稿予定件数、channel別件数、skip予定件数の出力。
- 可能ならBlock Kit JSONの確認出力。

使いどころ:
- 初回GitHub Actions実行前。
- source追加後。
- 投稿上限や振り分けルールを変更した時。

### P-005 migrate用GitHub Actions workflowを作る

Status: 後続実装

目的:
- GitHub Actionsから手動でPrisma migrationを流せるようにする。

作るもの:
- `workflow_dispatch` 専用のmigration workflow。
- `npm ci`
- `npm run prisma:generate`
- `prisma migrate deploy`

注意:
- 本番DB向けの破壊的migrationを避けるため、実行前の確認手順をrunbookへ書く。

### P-006 Neon接続URLのSSL modeを見直す

Status: 後続確認

目的:
- `sslmode=require` に関する将来互換警告を解消する。

やること:
- Neonの推奨接続URLを確認する。
- 可能なら `sslmode=verify-full` に変更する。
- ローカル、GitHub Actions、deploy先で接続確認する。

## 3. 停止条件

- GitHub repository secretsが未設定ならActions実用確認は止める。
- deploy先が未確定ならSlack slash command/interactivityの実接続は止める。
- Misskey API tokenが未設定ならワンクリック投稿の実接続は止める。
- 本番投稿が多すぎる懸念がある場合は、dry-runまたはworkflow disableを優先する。
