# Working Rules — <PROJECT NAME>

Storkeep template. Replace every `<...>` before use.

## 0. Session start (MANDATORY, before any work)

1. **Detect the model automatically — ask only if it fails**: run `node tools/lokal/model/detect.mjs --catat`
   (add `--json` for raw output). The tool prints `model`, `provider`, `platform`, `source` and writes the
   entry directly to `.agents/MODEL-LOG.MD`.
   - exit `0` → use the result, **DO NOT ask the user**
   - exit `2` (not detected) → ask: _"Which model am I using for this session?"_
   - exit `1` (write failed) → record manually in `.agents/MODEL-LOG.MD`
   - Sources: `copilot session-state`, `9router usageHistory`, `Zed threads`, `opencode session`,
     env `AGENT_MODEL` (highest priority).
   - **DO NOT** copy the model name from old entries in `MODEL-LOG.MD` / `CHANGELOG.MD`.
   - Mid-session model change: if the user says "switch model" / "now using model X", re-run the tool
     and record a new entry when the result changes. Ask the user only if the tool fails.
2. **Bootstrap the structure when `.agents/` is missing**: a new project may contain only `AGENTS.md`.
   Copy the canonical skeleton **without overwriting** existing files:

   ```sh
   cp -rn "<template-dir>/.agents/." .agents/
   cp -rn "<template-dir>/tools/." tools/
   ```

   `<template-dir>` = where this template is cloned on this machine. If unknown, ask the user **once**
   (never guess). Trigger: `.agents/WORK.MD` missing, or any of `PROJECT.MD` / `TECHNICAL.MD` /
   `OPERATIONS.MD` / `CHANGELOG.MD` missing. For a new repo, also copy
   `git-exclude-template.txt` → `.git/info/exclude`.
3. **Language question (MANDATORY, ask in English)**: before writing code, ask:
   _"Which language should I use for comments, docs, and user-facing text? (default: EN)"_
   Offer: EN · ID · other. Record the answer at the top of `.agents/TECHNICAL.MD`.
   Default is **EN** when the user does not answer.
4. **If the project is still empty** (no code yet), ask **all at once** — read `.agents/STACK.MD`
   for the full catalogue and copy the questions from there (project type, language, framework,
   file extension, database, ORM, cache/queue, auth, storage, test, lint, package manager,
   deploy, CI). Then fill `PROJECT.MD` + `TECHNICAL.MD` + `OPERATIONS.MD` before writing code.
5. **Read the docs** (paths relative to root): `PROJECT.MD`, `TECHNICAL.MD`, `OPERATIONS.MD`,
   `WORK.MD`, `MODEL-LOG.MD`, and only the **top 60 lines** of `CHANGELOG.MD`.

## 1. Output language

Default EN. Follow the language chosen at session start (step 3) for comments, docs, and user-facing text.

## 2. Docs in `.agents/`

| File | Content |
|---|---|
| `PROJECT.MD` | what & why: goal, roles, limits, privacy |
| `TECHNICAL.MD` | stack, directory layout, commands/routes, DB schema, module status |
| `OPERATIONS.MD` | environments, env, deploy, security, tools, troubleshooting |
| `WORK.MD` | active cases, roadmap, multi-agent work |
| `MODEL-LOG.MD` | session & model log (automatic via `detect.mjs --catat`) |
| `CHANGELOG.MD` | change history (format rules live in `AGENTS.md`) |
| `STACK.MD` | stack catalogue — read only when the stack is undecided |
| `archive/` | old docs, finished cases, old changelogs |
| `samples/` | chat logs / sample input for bug reproduction |
| `temp/` | one-off scripts and outputs (delete after use) |

Rule: one fact, one place. Do not duplicate information — reference instead.

## 3. CHANGELOG

- Header: `## YYYY-MM-DD — vX.Y.Z — Model: <first editor> — HH:MM WIB` (written once, never edited again,
  even if the model changes).
- Points: `- **A.** …`, sub-points `  - **A.1.** …`; each lettered point ends with
  `— Model: <name> — HH:MM WIB`.
- Canonical categories: ✨ Features · 🔧 Fixes · 🔒 Security · ⚙️ Deploy & Infra · 🎨 UI/Text · 📝 Docs.
- On a new date: write in one pass (header + existing points + all six categories; empty ones `_none yet_`).
- History older than 2 months → `archive/CHANGELOG-<year>-<month>-old.MD`.

## 4. Cases (`WORK.MD`)

- Format: `- YYYY-MM-DD HH:MM — [level] title — status — Model: <name>` + `Location: path:line`.
- Levels: `critical` (secret/data leak) · `urgent` (main feature broken) · `casual` (cleanup).
- Flow: record 🔴 → ask approval → 🟡 work → ✅ archive to `.agents/archive/cases-done/`.
- Recording needs no permission; working does.

## 5. Secrets

- Only in `env/` (git-ignored) or the platform dashboard (Config Vars / control panel).
- Never in `.agents/`, `.MD` docs, code, or logs. When debugging, print the variable name only.
- Copy `git-exclude-template.txt` into `.git/info/exclude` for new repos.

## 6. Code

- **No comments** in source files; design rationale belongs in `.agents/TECHNICAL.MD`.
- No leftover debug `console.log` — use a leveled logger.
- No `TODO`/`FIXME` in code — record them in `WORK.MD`.
- Validate input, escape output, cap payload size, set timeouts on network calls.
- Handlers must be safe when the same event is delivered twice (idempotent).

## 7. Tools

- Check `tools/` before writing a temporary script.
- `tools/produksi/` = pushed (used by builds/jobs). `tools/lokal/` = not pushed.
- One-off scripts: `.agents/temp/`, deleted after use.

## 8. Git

- Commit messages in English, prefixes `feat: ` / `fix: ` / `refactor: ` / `docs: ` / `chore: ` / `deploy: `.
- One commit = one intent. Never `push --force` to `main`.
- Commit/push after build & tests pass; deploys and production actions require user confirmation.

## 9. Session close

Mention: credentials worth rotating (when the session touched env/deploy) and the state of each environment
(staging on/off) — never shut anything down without an explicit user request.

## 10. Structure guard

- `.agents/` may only contain the 6 core docs plus `STACK.MD`, `archive/`, `samples/`, `temp/`.
  Anything else → `archive/old-docs/`.
- Credentials never live in `.agents/` — use `env/` or the platform dashboard.
- No stray temp files in the project root (`_tmp_*`, `*.bak`, `*.old`, `*~`). Put them in `.agents/temp/`, then delete.
- Run the checker whenever the structure feels off:

  ```sh
  node tools/lokal/structure/check.mjs
  ```

  Exit `0` clean · `1` findings (listed per line) · `2` cannot run.
- Older projects that are still messy: follow `MIGRATION.md` (move, never delete).
