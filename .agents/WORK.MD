# WORK — <PROJECT NAME>

Everything in progress. Findings are recorded first (no permission needed) and worked on after approval.
Finished cases move to `archive/cases-done/YYYY-MM-DD-category-title.md`.

**Case format:** `- YYYY-MM-DD HH:MM — [level] title — status — Model: <name>` + a `Location:` line.
Levels: `critical` (secret/access/data leak) · `urgent` (main feature broken) · `casual` (cleanup).
Status: 🔴 New · 🟡 Doing · ⏸️ On hold · ✅ Done.

---

## 1. Active cases

_none yet_

## 2. Roadmap

_none yet_

## 3. Session & model

Moved to its own file: **`.agents/MODEL-LOG.MD`** (current month; previous months in `archive/old-docs/`).
Record with `node tools/lokal/model/detect.mjs --catat`, or manually when the tool fails.

## 4. Multi-agent work

Used only when the user writes `work together` / `multi agent` / `split tasks`.

- `- YYYY-MM-DD HH:MM (COORDINATOR|SUB-AGENT) — [level] title — status — Model: <name>` + checklist.
- Only the coordinator writes this section; sub-agents report via `PLAN-PROGRESS/`.
- Finished plans: `archive/plans-done/YYYY-MM-DD-title.md`.

Status: _none yet_
