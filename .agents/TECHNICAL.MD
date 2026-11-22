# TECHNICAL — <PROJECT NAME>

How the code is organised. Update this whenever a file, command, or route is added/removed.

Stack: `<language + version>` · `<framework>` · `<database>` · `<deploy>`
Output language: `EN` (comments, docs, user-facing text)
Updated: `<YYYY-MM-DD HH:MM WIB>` — Model: `<name>`

---

## 1. Dependency direction (never reversed)

```
entry → app/router → handlers → services → repo → db
                         ↓
                  ui / lib        (no DB, no global ctx)
```

- Handlers may use the request/ctx object; services must not.
- All SQL lives **only** in `repo/` (or `db/`).
- `lib/` must be pure (no I/O) so it can be tested without a database.

## 2. Directory layout

```
src/
├── <entry>            # entry point
├── <router/handlers>  # commands / routes
├── <services>         # business rules
├── <repo>             # SQL
├── <lib>              # pure utilities
└── <config>           # env loading
tests/                 # unit tests
tools/
├── produksi/          # pushed (build, scheduled jobs)
└── lokal/             # not pushed (operator tools)
```

## 3. Commands / routes

| Command / Route | Handler | Notes |
|---|---|---|
| `<...>` | `<path>` | `<...>` |

Rule: one command = one handler; no two handlers for the same thing.

## 4. Database schema

| Table | Key | Content |
|---|---|---|
| `<...>` | `<...>` | `<...>` |

Schema file: `<path>`. Apply order: `<...>`.

## 5. Module status

| Module | Files | Status |
|---|---|---|
| `<...>` | `<...>` | `<todo / doing / done>` |

## 6. Required verification

```sh
<build command>
<test command>
<code audit command>
```

Every refactor must pass all of them.
