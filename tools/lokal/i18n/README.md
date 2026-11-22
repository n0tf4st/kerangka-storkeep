# i18n helper

Rewrite strings inside a source file using a **dictionary per language**. One tool, many languages —
no separate script per language.

## Naming rule

Dictionaries live in `tools/lokal/i18n/dict/` and are named after the **target** language:

| File | Direction | Meaning |
|---|---|---|
| `en.json` | ID → EN | translate Indonesian strings into English |
| `id.json` | EN → ID | translate English strings back into Indonesian |
| `tr.json` | ID → TR | (example) Turkish target |
| `_template.json` | — | empty targets, used to build a new dictionary |

## Usage

```sh
node tools/lokal/i18n/translate.mjs --to=en --in=tools/lokal/model/detect.mjs --out=.agents/temp/detect.en.mjs
node tools/lokal/i18n/translate.mjs --to=id --in=tools/lokal/model/detect.mjs --out=.agents/temp/detect.id.mjs
node tools/lokal/i18n/translate.mjs --to=en --in=tools/lokal/model/detect.test.mjs --out=.agents/temp/test.en.mjs --tests
node tools/lokal/i18n/translate.mjs --list
```

| Flag | Meaning |
|---|---|
| `--to=<code>` | dictionary code (`en`, `id`, `tr`, …) — default `en` |
| `--in=<path>` | source file (default `tools/lokal/model/detect.mjs`) |
| `--out=<path>` | result file (default `.agents/temp/translated-<code>.txt`) |
| `--tests` | use the `tests` pairs instead of `source` |
| `--missing` | also print source strings not found in the input (leftover list) |
| `--list` | list available dictionaries (ignores `_template`) |
| `--scaffold=<code>` | create `dict/<code>.json` from `en.json` for a new language |

Exit codes: `0` applied (or input already in the target language), `1` nothing applied, `2` dictionary/input missing.

## Add a language (example: Turkish)

```sh
node tools/lokal/i18n/translate.mjs --scaffold=tr
```

Then open `tools/lokal/i18n/dict/tr.json`:

- set `"name": "Türkçe"`
- replace every **right-hand** string with the Turkish text

Finally:

```sh
node tools/lokal/i18n/translate.mjs --to=tr --in=tools/lokal/model/detect.mjs --out=.agents/temp/detect.tr.mjs --missing
```

`--missing` lists strings from the input the dictionary does not cover yet — use it as a checklist.

## Format

```json
{
  "name": "English",
  "source": [["from text", "to text"]],
  "tests": [["from text", "to text"]]
}
```

Rules:

- `source` = user-facing strings in the main script; `tests` = test titles.
- Keep the `from` side exactly as it appears in the file (spaces matter).
- Never translate code identifiers or file paths — only display strings.
- Only `en.json` ships complete; other languages are optional and can be contributed separately.
