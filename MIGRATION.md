# MIGRATION — cleaning up an older project

For projects whose `.agents/` already drifted (many documents, vendor folders, temp files).
One pass, safe: **nothing is deleted**, everything is moved.

## 1. Check the current state

```sh
node tools/lokal/structure/check.mjs
```

## 2. Create the target folders

```sh
mkdir -p .agents/archive/old-docs .agents/archive/cases-done .agents/archive/plans-done
```

## 3. Move the old documents

Only five documents stay in use: `PROJECT.MD`, `TECHNICAL.MD`, `OPERATIONS.MD`, `WORK.MD`, `CHANGELOG.MD`
(plus `MODEL-LOG.MD` and an optional `STACK.MD`).

Merge the content of the old docs into these first, then move the rest:

```sh
mv <OLD-DOCS...> .agents/archive/old-docs/
```

Typical merge map:

| Old documents | Merge into |
|---|---|
| concept + policy | `PROJECT.MD` |
| structure + modules | `TECHNICAL.MD` |
| API/hosting + environment map + configuration guide + DB security | `OPERATIONS.MD` |
| cases + model log + plan | `WORK.MD` (+ `MODEL-LOG.MD`) |

## 4. Move finished cases and plans

```sh
mv .agents/CASES-DONE/* .agents/archive/cases-done/ 2>/dev/null
mv .agents/PLAN-DONE/* .agents/archive/plans-done/ 2>/dev/null
rmdir .agents/CASES-DONE .agents/PLAN-DONE 2>/dev/null
```

## 5. Get credentials out of `.agents/`

```sh
mkdir -p env/vendor
mv .agents/hostdata .agents/cloudflare .agents/layerbase env/vendor/ 2>/dev/null
```

Make sure `env/` is listed in `git/info/exclude`.

## 6. Clean temp and root clutter

```sh
rm -rf .agents/temp
```

Root files like `_tmp_*.ps1`, `_tmp_*.php`, `*.bak`, `*~`: move them to `.agents/temp/`, use them, then delete.

## 7. Archive the old changelog

Move entries older than 2 months to `.agents/archive/CHANGELOG-<year>-<month>-old.MD`
and leave one index line per old version in `CHANGELOG.MD`.

## 8. Verify

```sh
node tools/lokal/structure/check.mjs
```

Target: exit `0`, and `.agents/` contains only the core docs plus `archive/`, `samples/`, `temp/`.
