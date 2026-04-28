# News Bot Status

## 2026-04-28

実装済み:
- `docs/spec/tech-stack.md` を作成。
- `docs/imp/imp-plan.md` を回答済み事項に沿って再構成。
- Next.js + TypeScript + Prisma + Vitest + ESLint の初期構成を追加。
- Prisma軽量スキーマを追加。
- source seed雛形を追加。
- RSS取得、正規化、URL/title重複判定、DB保存の骨格を追加。
- チャンネル振り分けの初期キーワード判定を追加。
- Slack Block Kit生成の骨格を追加。
- Misskey共有URL生成を追加。
- Slack command/interactions endpoint枠を追加。
- GitHub Actions workflow骨格を追加。
- 日次サマリ集計の骨格を追加。
- Neon DBへ初期migrationを適用。
- `SourceTarget.notes` 追加migrationを適用。
- source seedを実行し、8 source targetsを投入。
- RSS URL検証を実施し、6 sourceをactive化。
- Slack実投稿処理をhourly jobに接続。
- 日次サマリSlack投稿を接続。
- Slack署名検証を実装。
- `/pt-fetch` slash commandを実装。
- Misskey API投稿をSlack interactionに接続。

検証:
- `npm run prisma:generate`
- `npm run typecheck`
- `npm run lint`
- `npm run test`
- `npm run build`
- `npm audit --audit-level=moderate`

結果:
- 全て成功。
- npm auditは0件。

停止中:
- Slack App公開URL設定前のため、slash command/interactivityの実接続は未実施。
- Misskey API投稿の実接続は未実施。

## 2026-04-28 初回hourly実行

実行:
- `npm run job:hourly`

結果:
- sourcesTotal: 6
- sourcesSucceeded: 6
- sourcesFailed: 0
- fetchedItems: 125
- insertedItems: 121
- duplicateItems: 4
- posted:
  - `feed_ai`: 10
  - `feed_tech`: 10
  - `feed_other`: 0
- skipped:
  - `feed_ai`: 53
  - `feed_tech`: 48
  - `feed_other`: 0
- posting failures: 0

補足:
- Neon接続でSSL modeの将来警告が出ている。接続URLの `sslmode=require` は `sslmode=verify-full` への変更を検討する。

運用整理:
- `docs/guide/news-bot-runbook.md` に「何を設定すれば動くか」を整理。
- `docs/imp/missing-parts.md` に不足部品を整理。
