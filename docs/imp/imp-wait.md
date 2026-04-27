# Implementation Wait

このファイルは、実装前または実装中に決める必要がある事項を管理する。
回答は各項目の「回答」欄へインラインで追記する。

## W-001 RSS取得元一覧の管理方法

質問:
- RSS取得元はどこで管理するか。
- 候補: DB、JSON/YAML設定ファイル、環境変数、管理画面。

回答:

## W-002 RSS取得元の初期リスト

質問:
- 最初に巡回するRSS URLは何か。
- source名も必要。

回答:

## W-003 Slack投稿先チャンネル

質問:
- 投稿先Slackチャンネルはどこか。
- channel IDで管理するか、チャンネル名で管理するか。

回答:

## W-004 投稿頻度

質問:
- 何分または何時間ごとに収集・投稿するか。
- 1回あたりの最大投稿件数を設けるか。

回答:

## W-005 Misskey共有文テンプレート

質問:
- Misskey.io共有時の定型文、タグ、URLの並びをどうするか。
- 例: `{title}\n{url}\n#news`

回答:

## W-006 DBの選定

質問:
- PostgreSQLはVercel Postgres系にするか、別のPostgreSQLにするか。

回答:

## W-007 定期実行方式

質問:
- GitHub Actions cronに寄せるか、Vercel Cron Jobsに寄せるか。
- 実行ログ、secret管理、無料枠、DB接続方式で判断する。

回答:

## W-008 実行口の形式

質問:
- 収集と投稿の一括実行はAPI endpointにするか、CLIにするか。
- GitHub Actionsから実行する場合はCLIまたは保護されたAPI endpointが候補。

回答:

## W-009 Slack投稿済み判定

質問:
- `FeedItem.isSent` だけで管理するか、送信日時やSlack message tsも保存するか。

回答:

## W-010 重複判定

質問:
- 重複排除はURL uniqueだけでよいか。
- canonical URL、title類似、source別URL差分も見るか。

回答:

## W-011 要約の扱い

質問:
- Slackに表示するsummaryはRSSのdescriptionをそのまま使うか。
- HTML除去、文字数制限、AI要約などを入れるか。

回答:

## W-012 secret/env運用

質問:
- Slack token、DB URL、RSS設定、cron secretをどこで管理するか。
- `.env.example` に載せる変数名を確定する必要がある。

回答:
