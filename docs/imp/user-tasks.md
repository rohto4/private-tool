# User Tasks

このファイルは、ユーザ側で実施する作業を管理する。
Codex側の実装タスクは `imp-plan.md`、完了済み内容は `imp-comp.md`、未決事項は `imp-wait.md` を正とする。

## 1. 最優先

### U-001 GitHub repository secrets設定

Status: 未完了

目的:
- GitHub ActionsからDB、Slack、Misskeyへ接続できるようにする。

設定するsecrets:
- `DATABASE_URL`
- `DATABASE_URL_UNPOOLED`
- `SLACK_BOT_TOKEN`
- `SLACK_SIGNING_SECRET`
- `SLACK_CHANNEL_FEED_AI`
- `SLACK_CHANNEL_FEED_TECH`
- `SLACK_CHANNEL_FEED_OTHER`
- `MISSKEY_API_TOKEN`

完了後に確認すること:
- `Hourly Feed` を `workflow_dispatch` で手動実行する。
- `Daily Feed Summary` を `workflow_dispatch` で手動実行する。
- Actions log、Slack投稿、DBの `JobRun` / `DeliveryLog` を確認する。

### U-002 deploy先の用意

Status: 未完了

目的:
- Slack slash commandとinteractivity endpointを外部公開する。

必要:
- Next.js App Routerをdeployできる公開環境。
- 候補: Vercel。
- deploy先にも必要envを設定する。

必要env:
- `DATABASE_URL`
- `DATABASE_URL_UNPOOLED`
- `SLACK_BOT_TOKEN`
- `SLACK_SIGNING_SECRET`
- `SLACK_CHANNEL_FEED_AI`
- `SLACK_CHANNEL_FEED_TECH`
- `SLACK_CHANNEL_FEED_OTHER`
- `MISSKEY_API_TOKEN`
- `MISSKEY_BASE_URL`

完了条件:
- `https://<deploy-domain>/api/slack/commands` がSlackから到達可能。
- `https://<deploy-domain>/api/slack/interactions` がSlackから到達可能。

### U-003 Slack Request URL設定

Status: deploy後に実施

目的:
- Slackから `/pt-fetch` とボタン操作を受けられるようにする。

設定:
- Slash command
  - command: `/pt-fetch`
  - Request URL: `https://<deploy-domain>/api/slack/commands`
- Interactivity
  - Request URL: `https://<deploy-domain>/api/slack/interactions`

完了後に確認すること:
- `#feed-other` で `/pt-fetch` を実行する。
- 即時ackが返る。
- 裏側でhourly job相当が動く。
- Slack投稿内のMisskey API投稿ボタンが動く。

## 2. 必要に応じて確認

### U-004 Misskey API token設定

Status: 未完了

目的:
- SlackボタンからMisskey.ioへワンクリック投稿できるようにする。

必要:
- Misskey.io API tokenを作成する。
- ローカル `.env.local` に設定する。
- GitHub repository secretsに設定する。
- deploy先envに設定する。

環境変数:
- `MISSKEY_API_TOKEN`
- `MISSKEY_BASE_URL=https://misskey.io`

### U-005 Slack App / channel状態確認

Status: 一部完了

確認すること:
- Slack workspaceは `unibell4-dev.slack.com`。
- Botが `#feed-ai`、`#feed-tech`、`#feed-other` に参加している。
- Bot Tokenが有効。
- Signing Secretが取得済み。
- 必要scopeが付いている。
  - `chat:write`
  - `commands`

### U-006 Neon接続URLのSSL mode確認

Status: 後続確認

目的:
- `sslmode=require` に関する将来互換警告を避ける。

確認:
- Neonの接続URLで `sslmode=verify-full` が使えるか。
- ローカル、GitHub Actions、deploy先で接続できるか。

## 3. 完了済みまたはCodex実施済み

- Neon DB migrateはローカルから実施済み。
- source seedは投入済み。
- RSS検証後、6 sourceをactive化済み。
- ローカル `.env.local` にはNeon DB情報を設定済み。
- ローカル `npm run job:hourly` でSlack実投稿まで確認済み。

## 4. 現時点の実用化条件

実用状態にするには、最低限次を完了する。

1. U-001 GitHub repository secrets設定。
2. GitHub Actionsの手動実行確認。
3. 1回以上のcron自動実行確認。

Slack command / Misskey one-clickまで含める場合は、追加で次を完了する。

1. U-002 deploy先の用意。
2. U-003 Slack Request URL設定。
3. U-004 Misskey API token設定。
