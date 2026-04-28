# Tech Stack

## 目的

このファイルは、Private-Tool の実装前提を固定する。
直近の対象は、ニュース/RSS取得、Slack投稿、Misskey.io共有ボタン付きBOT。

## 採用技術

- Language: TypeScript
- Runtime: Node.js
- Framework: Next.js App Router
- API: Next.js Route Handlers
- ORM: Prisma
- DB: Neon PostgreSQL
- Scheduler: GitHub Actions cron
- Manual Trigger: Slack slash command via Next.js API endpoint
- Slack UI: Slack Block Kit
- Slack API: `chat.postMessage`, slash command, interactivity endpoint
- Misskey integration:
  - share URL: `https://misskey.io/share?text={encodedText}`
  - one-click post: Misskey API called from server-side Slack interactivity endpoint

## 実行方式

### 定期実行

GitHub Actions からCLIを実行する。

理由:
- cron実行のログがGitHub Actionsに残る。
- GitHub Actions repository secrets/envでDB URLやSlack tokenを管理しやすい。
- Slackの3秒応答制約と切り離せる。

想定:
- `npm run job:hourly`
- `npm run job:daily-summary`

### Slack手動実行

Slack slash commandはNext.js API endpointで受ける。
GitHub Actionsを直接起動するのではなく、サーバー側の共通ロジックを呼ぶ。

理由:
- Slack request verificationをNext.js側で処理できる。
- Slackの応答制約に合わせて即時ackしやすい。
- Misskey one-click投稿にも同じAPI基盤を使える。

想定:
- `POST /api/slack/commands`
- `POST /api/slack/interactions`

## ディレクトリ方針

- `src/app/api/slack/commands/route.ts`: Slack slash command endpoint
- `src/app/api/slack/interactions/route.ts`: Slack interactive endpoint
- `src/lib/config/`: env/config読み込み
- `src/lib/db/`: Prisma client
- `src/lib/sources/`: source管理、RSS取得元
- `src/lib/feeds/`: RSS取得、正規化、重複判定
- `src/lib/routing/`: Slackチャンネル振り分け
- `src/lib/slack/`: Slack投稿、Block Kit生成
- `src/lib/misskey/`: Misskey共有URL/API投稿
- `src/lib/jobs/`: hourly/daily job本体
- `scripts/`: GitHub Actionsやローカルから呼ぶCLI entrypoint
- `prisma/`: Prisma schema/migration/seed
- `.github/workflows/`: GitHub Actions workflow

## DB方針

ai-summaryの大規模L1-L4構成は参考にするが、このPJでは軽量構成にする。

初期の主テーブル:
- `SourceTarget`: 取得元マスタ。SlackからON/OFF/追加/削除できるようにする。
- `FeedItem`: 取得した記事情報。後続再利用を考えて、RSS生情報と正規化情報を広めに持つ。
- `DeliveryLog`: Slack投稿やMisskey投稿の配送履歴。ただし二重Slack投稿の主判定は当面 `FeedItem.isSent`。
- `JobRun`: GitHub Actions/手動実行の実行記録。

## Slackチャンネル方針

初期チャンネル:
- `#feed-ai`
- `#feed-tech`
- `#feed-other`

取得後、保存時または投稿直前にキーワード判定で大分類を付ける。
初期はAI好み判定を入れず、チャンネル振り分けだけ行う。

## 投稿制限

1日あたりのSlack投稿上限:
- `#feed-ai`: 10件
- `#feed-tech`: 10件
- `#feed-other`: 20件

その日に取得して上限超過で流れなかった記事は、翌日に繰り越さない。
毎日21時ごろ、当日取得数とSlack投稿数のサマリを流す。

## secret/env方針

GitHub Actions:
- `DATABASE_URL`
- `DATABASE_URL_UNPOOLED`
- `SLACK_BOT_TOKEN`
- `SLACK_SIGNING_SECRET`
- `MISSKEY_API_TOKEN`

ローカル:
- `.env.local` を使う。
- `.env.example` に変数名だけを置く。
- secret値はリポジトリに置かない。

## 保留

- Slack channel IDは実装前に取得する。
- 指定サイトのRSS URLは実装前に検証する。
- Neonの接続URL名は、Prisma/Neonの実装時に最終確認する。
