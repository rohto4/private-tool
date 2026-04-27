# ECC Setup Memo

## 現在の扱い

- このPJはECC導入前提で扱う。
- 正本ルールは `AGENTS.md` と `PROJECT.md` を優先する。
- ECC repo全体、`hooks/`、`.codex/config.toml` は未導入。
- ECC skill は必要分だけ `.agents/skills/` にコピーして使う。
- command は必要分だけ `commands/` にコピーして試用する。

## コピー元

- ECC: `G:\devwork\clone-dir\everything-claude-code`
- ecc-expand: `G:\devwork\clone-dir\ecc-expand`

## 取り込み済み skill

- `api-design`: API契約、エラー、rate limitなどの設計時に使う。
- `backend-patterns`: サービス層、ジョブ、外部API連携などの実装時に使う。
- `coding-standards`: 共通のコード品質基準として使う。
- `content-engine`: 投稿文、要約、配信文面を扱う時に使う。
- `crosspost`: Misskeyなど複数投稿先への配信設計時に使う。
- `documentation-lookup`: ライブラリ/API仕様確認時に使う。
- `product-capability`: 大きめの機能を実装可能な制約へ落とす時に使う。
- `security-review`: Slack/Misskey tokenなどsecretや外部APIを扱う時に使う。
- `tdd-workflow`: 新機能、修正、リファクタ時のテスト方針に使う。
- `verification-loop`: 実装後のbuild/test/typecheck確認に使う。

## 取り込み済み command

- `commands/expand-answer.md`
- `commands/prp-plan.md`
- `commands/prp-implement.md`
- `commands/prp-prd.md`

## 未導入

- ECCのhooks
- `.codex/config.toml`
- ツール別の大規模設定
- 現時点の実装に不要なskill/command一式
