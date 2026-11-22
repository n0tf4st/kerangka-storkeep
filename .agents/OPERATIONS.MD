# OPERATIONS — <PROJECT NAME>

Where the app runs, how to deploy, and what must not be touched.
**No credentials in this document.**

Updated: `<YYYY-MM-DD HH:MM WIB>` — Model: `<name>`

---

## 1. Environments

| | Production | Staging |
|---|---|---|
| Runtime | `<VPS / Heroku / other>` | `<...>` |
| Domain / bot | `<...>` | `<...>` |
| Env | `<env path on server>` | `<Config Vars / file>` |
| Database | `<...>` | `<...>` |
| Deploy | `<command / manual>` | `<command>` |

**Rule:** production is never changed without an explicit user request.

## 2. Local env files (not pushed)

```
env/
├── mesin.env          # local tool keys (all environments)
├── production/.env    # mirror of production values for tools
├── staging/.env       # staging
└── vendor/            # vendor credentials: <vendor name>/
```

The whole `env/` folder is ignored via `.git/info/exclude` (see `git-exclude-template.txt`).

## 3. Variables used by the code

| Name | Required | Notes |
|---|---|---|
| `<NAME>` | yes/no | `<...>` |

## 4. Deploy

```sh
<step 1>
<step 2>
<verify logs / health check>
```

## 5. Security

| Aspect | State |
|---|---|
| DB access | `<DML-only? local port?>` |
| Credential rotation | `<interval / procedure>` |
| Data retention | `<...>` |

## 6. Operator tools

| Tool | Purpose |
|---|---|
| `tools/lokal/model/detect.mjs` | detect model + provider + host app for the session |
| `tools/lokal/structure/check.mjs` | check `.agents/` structure and stray temp files |
| `<...>` | `<...>` |

## 7. Common failures

| Symptom | Cause | Fix |
|---|---|---|
| `<...>` | `<...>` | `<...>` |
