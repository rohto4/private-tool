# Private-Tool Project Context

## 目的

このPJの主な用途は、自分向けの各種ワークフローを管理する。
主な機能は次の通り。
2026/04/27 | 実装着手 | 各種ソースからニュースを取得し、SlackBOTが指定のチャンネルに投稿する。チャンネルの投稿にMisskey.ioへの連携ボタンがある。
2026/0x/xx | 実装前   | Misskey.ioの自分の投稿を一週間単位でまとめ、Misskey.ioに自動的に週報を投稿する。


## 優先度モデル

1. `AGENTS.md`
   - 全 tool 共通の最上位ルール。
2. `PROJECT.md`
   - この PJ の目的、情報配置、運用方針。
3. `docs/guide/`
   - 恒久的な運用ガイド、判断基準、ルール補足。
4. `docs/spec/`
   - 実装対象として確定した仕様、要件、設計前提。
5. `docs/candi-ref/`
   - Candidate Reference。実装候補の詳細、実現可能性確認、候補比較、未採用の選択肢。
6. `docs/imp/`
   - 実装メモ、作業記録、進捗。
7. `.agents/skills/`
   - ECC 由来の作業別 workflow。該当作業の時だけ読む。
8. `commands/`
   - ECC / ecc-expand 由来の試用 command。該当 command を使う時だけ読む。
9. `docs/memo.md`
   - 初回依頼などの生メモ。恒久ルールの正本にはしない。


## ECC のコピー元 skill
`G:\devwork\clone-dir\everything-claude-code`
`G:\devwork\clone-dir\ecc-expand`

## ECC から取り込んだ skill
`G:\devwork\private-tool\.agents\skills` に実体をコピーする。
ECCから取り込んだskillを参照し、コピー元は普段は参照しない。

現時点で取り込み済み:
- `api-design`
- `backend-patterns`
- `coding-standards`
- `content-engine`
- `crosspost`
- `documentation-lookup`
- `product-capability`
- `security-review`
- `tdd-workflow`
- `verification-loop`

## 試用導入した command

`commands/` に ECC / ecc-expand 由来の command を必要分だけ置く。

- `expand-answer`: 短い一次回答を必要時だけ詳しく展開する。
- `prp-plan`: 実装候補を詳細な計画ファイルに落とす。
- `prp-implement`: 計画ファイルを段階的に実行する。
- `prp-prd`: 大きめの要望を PRD / phase に分解する。

## 運用ルール

- ルールを増やす時は `AGENTS.md` に詰め込まず、原則 `PROJECT.md` か `docs/guide/` に分ける。
- 作業の一次記録は `docs/imp/` に置く。
- 実装対象として確定した仕様は `docs/spec/` に置く。
- Candidate Referenceとして、実装候補の詳細、調査、候補比較、実現可能性確認は `docs/candi-ref/` に置く。
- 一時メモを恒久ルールに昇格する時は、`docs/memo.txt` から該当箇所を整理して移す。
- `docs/` 配下の構成を変更した時は、`docs/README.md` を更新する。
- `docs/candi-ref/` のファイルを追加・削除・大きく変更した時は、`docs/candi-ref/candi-ref-summary.md` を更新する。
- `docs/guide/` のファイルを追加・削除・大きく変更した時は、`docs/guide/guide-summary.md` を更新する。
- `docs/spec/` のファイルを追加・削除・大きく変更した時は、`docs/spec/spec-summary.md` を更新する。
- ECC skill を追加する時は、必要な skill だけ `.agents/skills/` にコピーし、`docs/ecc-private-tool-setup.md` とこの `PROJECT.md` を更新する。
- command を追加する時は、必要な command だけ `commands/` にコピーし、`docs/ecc-private-tool-setup.md` とこの `PROJECT.md` を更新する。
