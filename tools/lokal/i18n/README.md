# i18n helper

Rewrite strings inside a source file using a **dictionary per language**. One tool, many languages —
no need for a separate script per language.

## Usage

```sh
node tools/lokal/i18n/translate.mjs --to=en --in=tools/lokal/model/detect.mjs --out=.agents/temp/detect.en.mjs
node tools/lokal/i18n/translate.mjs --to=en --in=tools/lokal/model/detect.test.mjs --out=.agents/temp/detect.test.en.mjs --tests
node tools/lokal/i18n/translate.mjs --list
```

| Flag | Meaning |
|---|---|
| `--to=<code>` | dictionary code (`en`, `id`, `tr`, …) — default `en` |
| `--in=<path>` | source file (default `tools/lokal/model/detect.mjs`) |
| `--out=<path>` | result file (default `.agents/temp/translated-<code>.txt`) |
| `--tests` | use the `tests` pairs instead of `source` |
| `--missing` | also print source strings that were not found in the input |
| `--list` | list available dictionaries |

Exit codes: `0` applied, `1` nothing applied (dictionary mismatch), `2` dictionary/input missing.

## Add a language (example: Turkish)

1. Copy the dictionary: `cp tools/lokal/i18n/dict/en.json tools/lokal/i18n/dict/tr.json`
2. Change `"name": "Türkçe"` and translate every **right-hand** string.
3. Run it:

```sh
node tools/lokal/i18n/translate.mjs --to=tr --in=tools/lokal/model/detect.mjs --out=.agents/temp/detect.tr.mjs --missing
```

`--missing` lists strings in the input that the dictionary does not cover yet — use that list to complete the file.

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
- `en.json` ships with the template; other languages are optional and can be contributed separately.
