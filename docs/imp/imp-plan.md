# Implementation Plan

このファイルは、現時点で決まっている実装タスクを管理する。
技術前提は `docs/spec/tech-stack.md` を正とする。
追加質問と回答履歴は `docs/imp/imp-wait.md` を参照する。

## 現在の方針

判断済み:
- TypeScript + Next.js App Routerで進める。
- DBはNeon PostgreSQL + Prisma。
- 定期実行はGitHub Actions cron。
- GitHub ActionsはCLIを実行する方式を推奨採用する。
- Slack slash commandとMisskey one-click投稿はNext.js API endpointで受ける。
- データモデルはai-summaryのL1-L4全移植ではなく、軽量構成にする。
- Slack投稿チャンネルは `#feed-ai`、`#feed-tech`、`#feed-other`。
- 初期の好み判定は入れず、キーワードによるチャンネル振り分けだけ行う。
- Misskey共有はURLボタンとAPI投稿ボタンを両方用意する。
- API投稿ボタンは個人アカウント固定、確認なしのワンクリックでよい。
- summaryはRSS descriptionをHTML除去/文字数制限程度で使う。AI要約は初期実装に入れない。
- 二重Slack投稿の主判定は `FeedItem.isSent`。
- 重複判定はURLに加えてtitle類似も見る。
- その日に投稿上限を超えた記事は翌日に繰り越さない。
- 毎日21時ごろ、当日取得数とSlack投稿数のサマリを流す。

## 実装フェーズ

### Phase 0: 実装前提の固定

Status: 完了

- `docs/spec/tech-stack.md` を作成する。
- `docs/spec/spec-summary.md` を更新する。
- `imp-wait.md` の回答を実装計画へ反映する。

### Phase 1: プロジェクト初期構成

Status: 実装済み

タスク:
- Next.js + TypeScriptのプロジェクト構成を作成する。
- Prismaを導入する。
- ESLint/format/typecheck/testの最低限のnpm scriptを用意する。
- `.env.example` を作成する。
- `.gitignore` に `.env*`、ただし `.env.example` は除外しない設定を入れる。
- GitHub Actions workflow用の土台を作る。

想定script:
- `npm run dev`
- `npm run build`
- `npm run typecheck`
- `npm run lint`
- `npm run test`
- `npm run prisma:migrate`
- `npm run prisma:generate`
- `npm run job:hourly`
- `npm run job:daily-summary`

停止条件:
- Node/npm系の初期化で依存解決が壊れる場合は、ログを `docs/imp/` に残して止める。

実装済み:
- `package.json`
- `tsconfig.json`
- `next.config.ts`
- `eslint.config.mjs`
- `vitest.config.ts`
- `.env.example`
- `.gitignore`
- 最小Next.js App Router画面

### Phase 2: DBスキーマ

Status: 実装済み

方針:
- ai-summaryの `source_targets` / `articles_raw` の思想を軽量化して採用する。
- 取得元はSlackからON/OFF/追加/削除できるよう、DB管理にする。
- `FeedItem` は後続再利用のため、最低限より広めに保持する。

モデル案:
- `SourceTarget`
  - `sourceTargetId`
  - `sourceKey`
  - `displayName`
  - `siteUrl`
  - `feedUrl`
  - `sourceKind`: `rss`
  - `sourceCategory`: `ai` / `tech` / `other`
  - `defaultChannelKey`: `feed-ai` / `feed-tech` / `feed-other`
  - `isActive`
  - `createdAt`
  - `updatedAt`
- `FeedItem`
  - `feedItemId`
  - `sourceTargetId`
  - `sourceItemId`
  - `sourceUrl`
  - `normalizedUrl`
  - `canonicalUrl`
  - `title`
  - `description`
  - `descriptionText`
  - `author`
  - `publishedAt`
  - `sourceUpdatedAt`
  - `rawGuid`
  - `rawMeta`
  - `titleSignature`
  - `matchedKeywords`
  - `channelKey`
  - `isSent`
  - `sentAt`
  - `skippedAt`
  - `skipReason`
  - `createdAt`
  - `updatedAt`
- `DeliveryLog`
  - `deliveryLogId`
  - `feedItemId`
  - `deliveryType`: `slack` / `misskey`
  - `channelKey`
  - `targetId`
  - `status`
  - `externalTs`
  - `errorMessage`
  - `createdAt`
- `JobRun`
  - `jobRunId`
  - `jobName`
  - `triggerKind`: `github_actions` / `slack_command` / `local`
  - `status`
  - `startedAt`
  - `finishedAt`
  - `summary`
  - `errorMessage`

インデックス:
- `SourceTarget.sourceKey` unique
- `FeedItem.normalizedUrl`
- `FeedItem.titleSignature`
- `FeedItem.isSent, FeedItem.createdAt`
- `FeedItem.channelKey, FeedItem.createdAt`
- `DeliveryLog.feedItemId, DeliveryLog.deliveryType`
- `JobRun.jobName, JobRun.startedAt`

停止条件:
- PrismaでJSON型やenumを使う箇所がNeon/PostgreSQLと合わない場合は、型を単純化して記録する。

実装済み:
- `prisma/schema.prisma`
- Prisma 7 client生成
- PostgreSQL adapter設定

### Phase 3: source seed

Status: 初期seed雛形まで実装済み。RSS URL検証待ち。

方針:
- 初期sourceはユーザ指定のサイトを採用する。
- ai-summaryの商用利用前提source一覧は流用しない。
- RSS URLは実装時に検証してからseedに入れる。

初期source候補:
- AI系
  - `https://ainow.ai/`
  - `https://ledge.ai/`
  - `https://aismiley.co.jp/`
  - `https://www.itmedia.co.jp/aiplus/`
- tech系
  - `https://www.gizmodo.jp/`
  - `https://www.itmedia.co.jp/`
  - `https://japan.cnet.com/`
  - `https://menthas.com/`

タスク:
- 各サイトのRSS/Atom URLを検証する。
- `sourceKey`、`displayName`、`sourceCategory`、`defaultChannelKey` を定義する。
- `prisma/seed.ts` または `scripts/seed-sources.ts` を作る。
- SlackからsourceをON/OFF/追加/削除する前提で、seedは初期投入に限定する。

停止条件:
- RSS URLが公式に見つからないサイトは `SourceTarget.isActive=false` で保留するか、source候補から外す。
- RSSHubなど第三者変換を使うかは、別途判断が必要なら `imp-wait.md` に追記する。

実装済み:
- `src/lib/sources/initial-sources.ts`
- `scripts/seed-sources.ts`

注意:
- 初期sourceはすべて `isActive=false` にしている。RSS URL検証後に有効化する。

### Phase 4: RSS取得と正規化

Status: DB保存骨格まで実装済み

方針:
- source単位の失敗でジョブ全体を止めない。
- `rss-parser` などで取得し、共通形式へ正規化する。
- RSS descriptionを元summaryとして使う。
- HTML除去と文字数制限は行う。

タスク:
- activeな `SourceTarget` を取得する。
- sourceごとにRSSを取得する。
- URLを正規化する。
- `titleSignature` を作る。
- `rawMeta` にRSS由来の追加情報を保存する。
- `sourceUrl` / `normalizedUrl` / `title` / `descriptionText` を必須扱いにする。
- source単位、item単位のエラーを `JobRun.summary` またはログへ残す。

停止条件:
- RSS parserが対象サイトのfeedを正しく読めない場合は、そのsourceだけinactive候補にする。

実装済み:
- `src/lib/feeds/fetch.ts`
- `src/lib/feeds/normalize.ts`
- `src/lib/jobs/hourly.ts`
- `scripts/run-hourly.ts`

### Phase 5: 重複判定

Status: 初期実装済み

方針:
- URL重複を主軸にする。
- title類似も見る。
- 初期実装では重いAI類似判定は入れない。

タスク:
- `normalizedUrl` 一致を重複とする。
- `titleSignature` 一致を重複候補とする。
- title類似は、まず正規化タイトルの完全一致/記号除去一致/短い距離判定で実装する。
- 類似重複は自動削除ではなく保存スキップまたは既存itemへの紐付けで扱う。

停止条件:
- title類似の誤判定が多い場合は、URL重複のみで先に進め、類似判定を後続に落とす。

実装済み:
- `normalizedUrl` 既存チェック
- `titleSignature` 既存チェック
- 正規化ロジックの最小テスト

### Phase 6: チャンネル振り分け

Status: 初期実装済み

方針:
- 初期はW-014の通り、取得して格納するタイミングで大雑把にキーワード判定する。
- 好み判定は入れない。
- `G:\devwork\ai-summary\scripts\seed-keywords.mjs` のキーワードを参考にする。

タスク:
- AI系キーワードセットを作る。
- tech系キーワードセットを作る。
- sourceのdefault channelとキーワード判定を組み合わせる。
- 判定結果を `FeedItem.channelKey` と `matchedKeywords` に保存する。
- 判定不能は `feed-other` にする。

初期ルール:
- AI系キーワード一致: `feed-ai`
- tech系sourceまたはtech系キーワード一致: `feed-tech`
- それ以外: `feed-other`

停止条件:
- Slack channel IDが未取得の場合、投稿処理は実装しても実送信テストで止める。

実装済み:
- `src/lib/routing/keywords.ts`
- `src/lib/routing/channel.ts`

### Phase 7: Slack投稿

Status: Block Kit骨格まで実装済み。実送信はchannel ID待ち。

方針:
- Slack `chat.postMessage` を使う。
- Block Kitで記事タイトル、descriptionText、元URL、Misskeyボタンを表示する。
- 投稿上限は1日単位でチャンネル別に見る。
- その日上限で流れなかった記事は `skippedAt` と `skipReason` を付け、翌日に繰り越さない。

投稿上限:
- `feed-ai`: 10件/日
- `feed-tech`: 10件/日
- `feed-other`: 20件/日

タスク:
- `src/lib/slack/client.ts` を作る。
- `src/lib/slack/blocks.ts` を作る。
- channel keyからchannel IDへ変換するconfigを作る。
- 未送信itemをchannel別に抽出する。
- 当日投稿済み数を見て上限内だけ投稿する。
- 成功したら `FeedItem.isSent=true`、`sentAt`、`DeliveryLog` を更新する。
- 上限超過分は `skippedAt`、`skipReason=daily_limit_exceeded` を更新する。

停止条件:
- `SLACK_BOT_TOKEN` とchannel IDが未設定なら、dry-runまでで止める。

実装済み:
- `src/lib/slack/blocks.ts`

### Phase 8: Misskey共有

Status: URL共有骨格とendpoint枠まで実装済み。API投稿本体はtoken/endpoint設定待ち。

方針:
- Slack投稿には2種類のボタンを付ける。
- 1つはMisskey共有画面を開くURLボタン。
- もう1つはSlack interactivityで受け、サーバー側からMisskey API投稿するボタン。
- API投稿は確認なしのワンクリック。

共有文:

```text
{title}
{url}
```

タスク:
- `src/lib/misskey/share-url.ts` を作る。
- `src/lib/misskey/client.ts` を作る。
- Slack button action_idを設計する。
- interactivity payloadから `feedItemId` を取得する。
- Misskey APIへ投稿する。
- `DeliveryLog` にMisskey投稿結果を保存する。

停止条件:
- `MISSKEY_API_TOKEN` 未設定ならURL共有ボタンのみ有効にする。

実装済み:
- `src/lib/misskey/share-url.ts`
- `src/app/api/slack/interactions/route.ts`

### Phase 9: Slack slash command

Status: endpoint枠まで実装済み。Slack App設定待ち。

方針:
- コマンド名は `/pt-fetch` とする。
- `#feed-other` で実行する。
- ユーザー制限は初期実装では入れない。
- SlackからGitHub Actionsを直接動かさず、Next.js API endpointで受けて共通jobを呼ぶ。

タスク:
- `POST /api/slack/commands` を作る。
- Slack署名検証を実装する。
- `/pt-fetch` を受ける。
- 即時ackを返す。
- 裏でhourly job相当を起動する。
- 実行結果を `#feed-other` へ投稿する。

停止条件:
- 公開URLがない状態ではSlack Appから呼べないため、ローカルでは署名検証単体テストまでに留める。

実装済み:
- `src/app/api/slack/commands/route.ts`

### Phase 10: GitHub Actions定期実行

Status: workflow骨格まで実装済み。secrets設定待ち。

方針:
- GitHub Actions cronから `npm run job:hourly` を実行する。
- 21時ごろに `npm run job:daily-summary` を実行する。
- Asia/Tokyoの21時はUTC 12:00。

タスク:
- `.github/workflows/hourly-feed.yml` を作る。
- `.github/workflows/daily-feed-summary.yml` を作る。
- repository secrets/envの必要項目をREADMEまたはspecに記載する。
- workflow_dispatchも付けて手動実行できるようにする。

停止条件:
- GitHub repository secretsが未設定ならpush後のActions実行は失敗するため、ローカルdry-runとworkflow構文確認までに留める。

実装済み:
- `.github/workflows/hourly-feed.yml`
- `.github/workflows/daily-feed-summary.yml`

### Phase 11: 日次サマリ

Status: 集計ロジック骨格まで実装済み。Slack投稿はchannel ID待ち。

方針:
- 毎日21時ごろ、当日取得数とSlack投稿数を通知する。
- チャンネル別の取得数/投稿数/スキップ数を出す。

タスク:
- 当日JST範囲を計算する。
- `FeedItem.createdAt` ベースの取得数を集計する。
- `FeedItem.sentAt` ベースの投稿数を集計する。
- `skippedAt` と `skipReason` を集計する。
- `#feed-other` へサマリ投稿する。

停止条件:
- channel ID未設定ならdry-run出力まで。

実装済み:
- `src/lib/jobs/daily-summary.ts`
- `scripts/run-daily-summary.ts`

### Phase 12: 管理操作

Status: 後続実装

方針:
- SourceTargetのON/OFF/追加/削除は、最終的にはBOT投稿チャンネル内で操作したい。
- 初期実装ではCLIまたはDB seedで管理し、Slack管理操作は後続に分ける。

後続タスク:
- `/pt-source list`
- `/pt-source add`
- `/pt-source disable`
- `/pt-source enable`
- `/pt-source delete`

停止理由:
- Slack commandの設計と、誤操作防止の最低限UIを先に決める必要がある。

## 実装順

1. Phase 1: プロジェクト初期構成
2. Phase 2: DBスキーマ
3. Phase 3: source seed
4. Phase 4: RSS取得と正規化
5. Phase 5: 重複判定
6. Phase 6: チャンネル振り分け
7. Phase 7: Slack投稿 dry-run
8. Phase 10: GitHub Actions workflow
9. Phase 11: 日次サマリ dry-run
10. Phase 8: Misskey URL共有
11. Phase 9: Slack slash command
12. Phase 8: Misskey API投稿
13. Phase 12: Slack source管理

## 現時点の停止条件まとめ

- Slack channel IDが未設定だと実送信テストは止める。
- Slack Appの公開endpoint設定が未完だとslash command/interactivityの実接続は止める。
- Misskey API tokenが未設定だとワンクリック投稿は止め、URL共有だけにする。
- 指定サイトのRSS URLが検証できない場合、そのsourceはinactiveまたは保留にする。
- GitHub repository secrets/envが未設定だとActions実行は失敗するため、workflow作成までに留める。

## 次に実装する最小単位

次の作業単位で進める。

1. `package.json`、Next.js、TypeScript、Prismaの初期化。
2. `schema.prisma` に `SourceTarget`、`FeedItem`、`DeliveryLog`、`JobRun` を追加。
3. `.env.example` とconfig loaderを追加。
4. source seedの雛形を追加。
5. RSS取得とDB保存のdry-run CLIを追加。
