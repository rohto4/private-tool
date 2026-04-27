# obsidian-set Agent Instructions

## 最優先ルール

1. 日本語で対応する。
2. UTF-8 で読み書きする。
3. 質問と回答は連番を振り、ユーザとのやり取りを確実にする。
4. この PJ は ECC 導入前提で扱う。
5. ただし、この `AGENTS.md` と `PROJECT.md` は ECC 由来の一般ルールより優先する。
6. 通常の一次回答は短くする。詳しい説明や比較が必要な時、またはユーザが追加を求めた時だけ長めに回答する。
7. `commands/` は ECC 由来または `ecc-expand` 由来の試用 command 置き場として扱う。

## 回答の長さ

- 通常回答はかなり短くする。
- 目安は、詳細説明の 1/5 程度。まず結論、理由、次アクションだけを書く。
- 長い背景説明、比較、手順分解、詳細な根拠は初回回答に含めない。
- ユーザが「詳しく」「比較して」「展開して」「なぜ」などを求めた場合だけ、`commands/expand-answer.md` の方針で詳しく回答する。
- 迷った場合は短い回答を優先し、「必要なら詳しく展開します」と添える。
- 初回回答で長く説明しそうになった場合は、先に短い要約だけ返し、詳細化はユーザ確認後に行う。

## 読み込み順

1. `AGENTS.md`
   - 全 agent / tool 共通の最上位ルール。
2. `PROJECT.md`
   - PJ 固有の目的、情報配置、運用方針。
3. `docs/ecc-private-tool-setup.md`
   - ECC をこの PJ にどう取り込んだかの運用メモ。
4. 必要な `.agents/skills/*/SKILL.md`
   - 作業内容に応じて読む。常時すべてを読まない。
5. 必要な `commands/*.md`
   - command を使う時だけ読む。常時すべてを読まない。

## 恒久情報の置き場所

- ECC や `AGENTS.md` 以外の恒久ルール: `docs/guide/`
- 実装対象として確定した仕様: `docs/spec/`
- Candidate Reference。実装候補の詳細、実現可能性確認、候補比較: `docs/candi-ref/`
- 実装内容: `docs/imp/imp-*`
- 進捗状況: `docs/imp/*-status.md`

## ECC の扱い

- ECC は `.agents/skills/` にコピー済みの skill を優先して使う。
- ECC repo 全体、`hooks/`、`.codex/config.toml` はこの PJ には未導入。
- `commands/` は `ecc-expand` 経由で必要なものだけ試用導入する。
- Claude / Gemini / Codex などツール別ファイルは、共通ルールを複製せず、このファイルと `PROJECT.md` へ誘導する。
