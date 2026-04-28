# PJ活動ナレッジ蓄積ルール候補

## 1. 目的

`G:\knowledge-vault` を、各PJの活動履歴、判断、再利用可能な知識を長期的に蓄積する横断ナレッジ基盤として使うための候補計画。

`G:\devwork\obsidian-set` で定めた Obsidian / vault 運用ルールを土台にしつつ、各開発PJから使いやすい汎用ルールへ改変する。

## 2. 前提

- 本運用vaultは `G:\knowledge-vault`。
- vault本体は初期状態ではGitHub repo化しない。
- 各PJ固有の実装状態、仕様、進捗は各PJ内を正本にする。
- 横断的に再利用できる知識、作業要約、判断理由、参照元はvaultへ保存する。
- API key、token、private URL、個人情報はvaultへ保存しない。
- 同じ事実セットの正本を複数作らない。

## 3. Capability

各PJで作業したagentまたは人間が、作業終了時や大きな判断時に、PJ内の正本情報を壊さずに `G:\knowledge-vault` へ要約・知識・根拠・記憶索引を保存できる。

結果として、別セッション、別agent、別PJでも「過去に何をしたか」「なぜそう判断したか」「再利用できる知識は何か」を辿れる状態にする。

## 4. Constraints

- PJ固有の詳細正本はPJ内に残す。
- vaultは横断保存先であり、PJ docsの代替にしない。
- `memory/` は正本ではなく、LLM想起用の短縮レイヤーにする。
- `tasks/` は作業単位の履歴正本にする。
- `knowledge/` は再利用可能な整理済み知識の正本にする。
- `sources/` は根拠資料、外部情報、実験結果の正本にする。
- `prompts/` はユーザプロンプト全文とAI回答要約を保存する。
- `inbox/` は迷った時の一時置き場に限定する。
- Markdown noteを正本にし、DataviewやSQLite indexは派生物にする。

## 5. 保存判断案

| 保存対象 | 保存先 | 判断 |
|---|---|---|
| セッションで実施した作業 | `tasks/` | PJ名、日付、目的、実施内容、検証、残タスクを残す。 |
| ユーザ依頼とAI回答要約 | `prompts/` | 全文が必要な依頼だけ保存し、AI出力は要約中心にする。 |
| 再利用できる手順や設計判断 | `knowledge/` | 特定PJを超えて使える形に抽象化できる場合だけ昇格する。 |
| 外部URL、公式docs、調査結果 | `sources/` | 取得日、source class、review_afterを付ける。 |
| LLMに毎回思い出してほしい要点 | `memory/` | 短く、リンク中心にする。詳細は正本へリンクする。 |
| 保存先に迷う未整理情報 | `inbox/` | 後で整理する前提で一時保存する。 |

## 6. PJ側に置く案

各PJの `AGENTS.md` または `PROJECT.md` に、最低限だけ追記する。

```text
横断ナレッジ vault: G:\knowledge-vault

PJ固有の仕様・実装状態・進捗はこのPJ内を正本にする。
横断的に再利用できる知識、作業要約、判断理由、根拠資料は必要に応じて vault に保存する。
secret、private URL、個人情報は vault に保存しない。
```

## 7. Vault側ルール化案

`G:\knowledge-vault` 側には、次の恒久ルールを整備する候補。

- `AGENTS.md`: agent向けの最優先ルールを維持・拡張する。
- `PROJECT.md`: vault全体の目的、正本ルール、バックアップ方針を維持・拡張する。
- `templates/task-summary.md`: PJ活動ログ用テンプレート。
- `templates/ai-session-summary.md`: ユーザ依頼とAI回答要約テンプレート。
- `templates/source-note.md`: 根拠資料テンプレート。
- `memory/project-index.md`: 主要PJと関連noteへの短い索引。
- `knowledge/project-workflow/`: PJ横断で再利用する作業ルール置き場。

## 8. Note Frontmatter案

`obsidian-set` の `note-frontmatter.md` を土台にする。

```yaml
---
title: ""
type: task
status: draft
project: ""
topic: []
source: []
created: 2026-04-28
updated: 2026-04-28
confidence: medium
review_after:
tags: []
---
```

追加候補:

- `project`: 対象PJ名。例: `private-tool`
- `repo`: 関連repo pathまたはURL。secretを含まない範囲に限定。
- `session_date`: 作業日。
- `related`: 関連noteへの相対リンク。

## 9. 運用タイミング案

- 作業終了時: `tasks/` に作業要約を残す。
- 大きな判断時: `knowledge/` または `tasks/` に判断理由を残す。
- 外部調査時: `sources/` に根拠を残す。
- セッション引き継ぎ時: `memory/` に短い索引を追加または更新する。
- 保存先に迷う時: `inbox/` に置き、後で整理する。

## 10. Non-Goals

- PJ内docsをvaultへ全面移行しない。
- vaultをGitHub repoの代替にしない。
- secret管理や認証情報保存の仕組みにしない。
- AI出力全文の無制限アーカイブにはしない。
- 最初から複雑な自動同期やMCP連携を前提にしない。

## 11. Open Questions

- 各PJからvaultへ保存するタイミングを「毎セッション必須」にするか、「大きな区切りのみ」にするか。
- `tasks/` 配下を日付別にするか、PJ別にするか。
- `memory/project-index.md` を単一ファイルにするか、PJ別memory noteに分けるか。
- PJ名、repo、日付のファイル名規則をどうするか。
- `prompts/` にユーザプロンプト全文をどこまで保存するか。

## 12. Handoff

次に進めるなら、まずこの候補をもとに `G:\knowledge-vault` 側の恒久ルール案を作る。

実装順序案:

1. vault側 `AGENTS.md` / `PROJECT.md` の差分案を作る。
2. `templates/` に task / prompt / source のテンプレートを整える。
3. `memory/project-index.md` の初期形を作る。
4. このPJの `AGENTS.md` または `PROJECT.md` に vault 参照ルールを最小追記する。
5. 1回だけ `private-tool` の今日の作業をvaultへ試験保存し、運用しやすいか確認する。
