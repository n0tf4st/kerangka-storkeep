# STACK — catalogue for the first session

Read this **only** when the project is still empty (no code) and the stack is undecided.
Ask the user all questions at once, then record the answers at the top of `TECHNICAL.MD`.

## Questions (copy the list)

- **Project type**: chat bot (Telegram/Discord/Slack/WhatsApp) · REST/GraphQL API · web UI/SSR · CLI · worker/queue · scraper · library/SDK · desktop · mobile · IoT
- **Language**: JavaScript · TypeScript · Python · PHP · Go · Rust · Java · Kotlin · C# · Ruby · Elixir · Dart
- **Framework by language**
  - Node/JS: Express · Fastify · Hono · NestJS · Next.js · Nuxt · Remix · Astro · SvelteKit · Vite (React/Vue/Svelte) · grammY · Telegraf · discord.js · BullMQ
  - Python: Django · FastAPI · Flask · SQLAlchemy · Celery · aiogram · python-telegram-bot · Scrapy · Streamlit · pandas
  - PHP: Laravel · Symfony · CodeIgniter · Slim · vanilla
  - Go: Gin · Echo · Fiber · Chi · GORM
  - Rust: Axum · Actix Web · Rocket · SQLx
  - Java/Kotlin: Spring Boot · Quarkus · Ktor
  - C#/.NET: ASP.NET Core · EF Core · Dapper · Worker Service
  - Ruby: Rails · Sinatra · Sidekiq
  - Elixir: Phoenix · Ecto · Oban
  - Dart: Flutter
- **File extension**: `.js` · `.mjs` · `.cjs` · `.ts` · `.tsx` · `.vue` · `.svelte` · `.astro` · `.py` · `.php` · `.go` · `.rs` · `.java` · `.kt` · `.cs` · `.rb` · `.ex` · `.dart`
- **Database**: PostgreSQL · MySQL/MariaDB · SQLite · SQL Server · Oracle · MongoDB · Redis · ClickHouse · Cassandra · Firestore · Supabase · Neon · PlanetScale · none
- **ORM/query builder**: Prisma · Drizzle · TypeORM · Sequelize · Knex · SQLAlchemy · Django ORM · GORM · SQLx · EF Core · Eloquent · Doctrine · raw SQL
- **Cache/queue**: Redis · Memcached · BullMQ · RabbitMQ · Kafka · NATS · SQS · Celery · Sidekiq · Oban · none
- **Auth**: JWT · session cookie · OAuth2 (Google/GitHub/etc) · Better Auth · NextAuth · Clerk · Auth0 · Supabase Auth · passkey · API key · none
- **Storage**: local disk · S3/MinIO/R2 · Cloudinary · Neon Object Storage
- **Tests**: node:test · Jest · Vitest · Playwright · Pytest · PHPUnit · Go test · JUnit · xUnit · none
- **Lint/format**: ESLint · Biome · Prettier · Ruff · Black · PHP-CS-Fixer · golangci-lint · rustfmt · none
- **Package manager**: npm · pnpm · yarn · bun · pip/poetry/uv · composer · go mod · cargo · maven/gradle · nuget
- **Deploy**: VPS + systemd · Docker/Compose · Heroku · Railway · Fly.io · Render · Vercel · Netlify · Cloudflare Workers/Pages · AWS/GCP/Azure · local only
- **CI**: GitHub Actions · GitLab CI · none

## After the answers

1. Write the stack summary at the top of `TECHNICAL.MD` so later sessions never ask again.
2. Fill `PROJECT.MD` (goal, roles, limits) and `OPERATIONS.MD` (environments, env, deploy).
3. Create the source tree that matches the chosen framework — do not copy a layout from another project.
4. Record the first `CHANGELOG.MD` entry (one pass: header + six categories).
