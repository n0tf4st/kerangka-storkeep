# Storkeep Project Template

This folder is a **clean template**, not a project. How to use it:

## 1. Copy into a new project

```sh
cp -r "<template-dir>/." "<project-dir>/"
cd "<project-dir>"
```

`<template-dir>` = where this template lives on your machine (e.g. `~/web/storkeep-template`).

## 2. Set up git

```sh
git init
cp git-exclude-template.txt .git/info/exclude
rm git-exclude-template.txt
```

## 3. Run the first session

Open the project in your editor and tell the agent:

> "Read AGENTS.md, then ask me the model and the stack questions."

The agent will:
1. `node tools/lokal/model/detect.mjs --catat` — detect the model (or ask if it fails) and log it.
2. Ask the **language** question (default: EN) and the **stack** questions from `.agents/STACK.MD`.
3. Fill `PROJECT.MD`, `TECHNICAL.MD`, `OPERATIONS.MD` before writing code.
4. Create `src/`, `tests/`, and tools that match the chosen stack, then record the first changelog entry.

## What's inside

```
AGENTS.md                 working rules (the agent must read it)
MIGRATION.md              procedure for cleaning up older projects
README.md                 this file
LICENSE                   MIT
.env.example              env template covering many stacks
git-exclude-template.txt  copy to .git/info/exclude
.gitattributes            forces LF, avoids CRLF diff noise
.agents/
├── PROJECT.MD            what & why
├── TECHNICAL.MD          stack, layout, commands/routes, DB
├── OPERATIONS.MD         environments, env, deploy
├── WORK.MD               cases, roadmap, multi-agent
├── MODEL-LOG.MD          session & model log (automatic)
├── CHANGELOG.MD          history (format rules in AGENTS.md)
├── STACK.MD              stack catalogue (read only when undecided)
├── samples/README.md     bug reproduction material
└── temp/README.md        one-off scripts (delete after use)
tools/lokal/model/        detect.mjs (detect + log model), detect.test.mjs
tools/lokal/i18n/         translate.mjs + dict/en.json (dictionary-based translation)
tools/lokal/structure/    check.mjs (structure guard)
```

## Principles baked in

- The model is logged automatically (no manual question when the tool succeeds).
- One fact, one place: no duplicated documents.
- Changelog: single immutable version header, points `A.`/`A.1.`, model + WIB time per point.
- Secrets only in `env/` or the platform dashboard — never in `.agents/` or code.
- Tools are reused, not rewritten as throwaway scripts.

## Using it on another device

```sh
git clone git@github.com:n0tf4st/kerangka-storkeep.git
cd kerangka-storkeep
```

Then, on that machine:

1. `node tools/lokal/model/detect.mjs --catat` — verify the tool works and log the session (Node 20+ required).
2. Open a new project, copy `AGENTS.md` (and bootstrap `.agents/` via step 2 inside it).
3. Tell the agent: _"Read AGENTS.md, then ask me the model and stack questions."_

No credentials are needed to use the template — the detector only reads local editor session trails.

## License

MIT — see `LICENSE`. Free to use, modify, and share.
