# MODEL-LOG

Session & model log per project. Format: `- HH:MM — [platform] note — Model: <name>`.

Grouped by month (newest first) → by date (newest first).

Rule: record only on events — new session / model switch / new date. A new session is recorded even when the model is unchanged. Never duplicate the same session.

Automatic: `node tools/lokal/model/detect.mjs --catat` (adds a "new session" entry for today).
If the tool cannot write (exit ≠ 0), the agent records it here manually.

Previous months: `archive/old-docs/MODEL-LOG-<year>-<month>.md`.

---

## `<YYYY>` — `<Month>`

### `<YYYY-MM-DD>`

- `<HH:MM>` — [`<Platform>`] new session — Model: `<name>`
