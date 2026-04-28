# Implementation Wait

このファイルは、実装前または実装中に決める必要がある事項を管理する。
回答は各項目の「回答」欄へインラインで追記する。

## W-001 RSS取得元一覧の管理方法

質問:
- RSS取得元はどこで管理するか。
- 候補: DB、JSON/YAML設定ファイル、環境変数、管理画面。

回答:できればBOTが投稿するチャンネル内でON/OFF/追加/削除まで出来るといい。

## W-002 RSS取得元の初期リスト

質問:
- 最初に巡回するRSS URLは何か。
- source名も必要。

回答:何もベースが無いから、

## W-003 Slack投稿先チャンネル

質問:
- 投稿先Slackチャンネルはどこか。
- channel IDで管理するか、チャンネル名で管理するか。

回答:

## W-004 投稿頻度

質問:
- 何分または何時間ごとに収集・投稿するか。
- 1回あたりの最大投稿件数を設けるか。

回答:1時間ごとに収集。最終的には好みっぽいやつをパーソナライズする仕組みを入れて、それだけ投稿するチャンネルと、その他を投稿するチャンネルを分ける。

## W-005 Misskey共有文テンプレート

質問:
- Misskey.io共有時の定型文、タグ、URLの並びをどうするか。
- 暫定: `\n{title}\n{url}`

回答:暫定のやつで。

## W-006 DBの選定

質問:
- PostgreSQLはVercel Postgres系にするか、別のPostgreSQLにするか。

回答:NeonDB。これもG:\devwork\ai-summary\docs\specで使ってるやつで。

## W-007 定期実行方式

質問:
- GitHub Actions cronに寄せるか、Vercel Cron Jobsに寄せるか。
- 実行ログ、secret管理、無料枠、DB接続方式で判断する。

回答:GitHubActions。

## W-008 実行口の形式

質問:
- 収集と投稿の一括実行はAPI endpointにするか、CLIにするか。
- GitHub Actionsから実行する場合はCLIまたは保護されたAPI endpointが候補。

回答:SlackからGithubActionsに置いたスクリプトの実行は困難？置き場所はGitHubActionsじゃなくてもいいけど。

## W-009 Slack投稿済み判定

質問:
- `FeedItem.isSent` だけで管理するか、送信日時やSlack message tsも保存するか。

回答:`FeedItem.isSent` だけでいいよ

## W-010 重複判定

質問:
- 重複排除はURL uniqueだけでよいか。
- canonical URL、title類似、source別URL差分も見るか。

回答:これもtitle類似まで見たい。

## W-011 要約の扱い

質問:
- Slackに表示するsummaryはRSSのdescriptionをそのまま使うか。
- HTML除去、文字数制限、AI要約などを入れるか。

回答:そのまま使う。

## W-012 secret/env運用

質問:
- Slack token、DB URL、RSS設定、cron secretをどこで管理するか。
- `.env.example` に載せる変数名を確定する必要がある。

回答:GithubActionsだったらrepositoryのenvでいいか？そのほか必要ならPJローカルでもいいけど。

## W-013 データモデルの採用範囲

前提:
- `G:\devwork\ai-summary\docs\spec\04-data-model-and-sql.md` の `source_targets` / `articles_raw` / `articles_enriched` 系を参考にする。
- このPJではSlack投稿BOTが主目的なので、ai-summaryのL1-L4全体をそのまま移植する必要は薄い。

質問:
- 初期実装は `SourceTarget` + `FeedItem` + `DeliveryLog` 程度の軽量構成で始めてよいか。
- それとも `articles_raw` / `articles_enriched` の2層構成まで最初から分けるか。

回答:そこまで移植しなくていい。計量構成でいい。

## W-014 Slackチャンネル振り分けルール

前提:
- P-003/P-005で、Slack投稿直前に好み判定と記事特性に応じたチャンネル振り分けをしたい。

質問:
- チャンネル振り分けの初期ルールは何を使うか。
- 候補: `source_category`、`source_type`、sourceごとの固定チャンネル、キーワード、AI判定。
- 未分類または判定不能の記事を送るデフォルトチャンネルはどこか。

回答:#feed-aiと#feed-techと#feed-otherをとりあえず作った。取得して格納するタイミングで大雑把にキーワード判定スクリプトを通して、振り分ける。
キーワードのベースはこれを使ってもいいよ
G:\devwork\ai-summary\scripts\seed-keywords.mjs

## W-015 好み判定の初期方式

質問:
- 「私の好みに合っているか」の判定は、初期実装ではルールベースで始めるか、AI判定を入れるか。
- ルールベースの場合、採用/除外キーワードや優先sourceをどう置くか。
- AI判定の場合、利用するモデル/APIと判定プロンプトをどうするか。

回答:一旦W-014の振り分けだけで、好みうんぬんはなくていいや。

## W-016 Misskey API投稿ボタン

前提:
- P-006で、画面遷移する共有URLボタンに加えて、ワンボタンでMisskey.ioへ投稿するAPI連携ボタンも追加する。

質問:
- ワンボタン投稿はSlack interactive endpointで受けて、サーバー側からMisskey APIへ投稿する形でよいか。
- 投稿先Misskeyアカウントは個人アカウント固定でよいか。
- 誤投稿防止として確認ステップを挟むか、完全ワンクリックにするか。

回答:ワンクリックでいいよー。個人アカウントだし、多少ミスってもすぐ消せばいいので。
ワンボタン投稿はSlack interactive endpointで受けて、サーバー側からMisskey APIへ投稿する形でよいか。

## W-017 Slack slash command

前提:
- P-008で、定期実行とは別にSlackコマンドで最新取得トリガーを用意したい。

質問:
- Slackコマンド名は何にするか。
- 候補: `/news-fetch`, `/private-tool-fetch`, `/pt-fetch`
- コマンド実行を許可するユーザーまたはチャンネルを制限するか。

回答:feed-otherで実行する。ユーザは自分しかいないチャンネルなので、誰でもでOK。コマンド名はお任せ。

## W-018 GitHub Actionsからの実行方式

前提:
- P-009で定期実行はGitHub Actionsに決定。

質問:
- GitHub Actionsは `npm run` で直接DB/Slack/Misskeyへ接続するCLI方式にするか。
- それともデプロイ済みNext.jsの保護API endpointを叩く方式にするか。

回答:わかんないのでお勧めの方で。

## W-019 初回source seedの範囲

前提:
- `G:\devwork\ai-summary\scripts\seed.mjs` に多数のsource候補がある。

質問:
- 初回はai-summaryのactive sourceをそのまま候補に入れるか。
- それとも日本語source、公式source、Google Alertsなどに絞るか。

回答:ai-summaryは飽くまで商用利用前提だったので、今回とは話が違う気がする。
次のソースにしよう。
AI系
https://ainow.ai/
https://ledge.ai/
https://aismiley.co.jp/
https://www.itmedia.co.jp/aiplus/
tech系
https://www.gizmodo.jp/
https://www.itmedia.co.jp/
https://japan.cnet.com/
https://menthas.com/

## W-020 投稿件数とバックログ処理

質問:
- 初回起動時に大量の未投稿記事が保存された場合、Slackへ全件流すか。
- 1回あたりの投稿上限、古い記事のスキップ条件、初回seed時の投稿抑制を決めるか。

回答:流さない。feed-aiとfeed-techは1日10件まで。feed-otherも20件まで。
ただ、どれくらい流れなかったものがあるかは知りたいので、今日取得した記事と、今日slackに流した記事の数サマリは21時くらいに毎日流す。
詰まるのは嫌なので、その日に取得して、流れなかったものは、もうスルーして、次の日は次の日の取得分を流すようにする。
