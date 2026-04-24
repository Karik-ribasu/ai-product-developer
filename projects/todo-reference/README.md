# Todo reference (`projects/todo-reference`)

Greenfield **Next.js App Router** + **TypeScript** reference for the `todo-mvp` feature. Layout follows the architecture brief: `src/domain`, `src/application`, `src/infrastructure`, `src/app`, `src/components` (Atomic Design), and `src/styles` with shared tokens.

## Prerequisites

- [Bun](https://bun.sh) 1.x (lockfile: `bun.lock`; aligns with repo Docker harnesses that use Bun)
- [Docker Compose](https://docs.docker.com/compose/) v2 (for PostgreSQL dev DB and containerized integration/E2E)

## Install

```bash
cd projects/todo-reference
bun install
```

## PostgreSQL (local dev)

Start a **dedicated** Postgres instance for this worktree (named volume, healthcheck, stable service name `postgres` inside this compose project):

```bash
cd projects/todo-reference
docker compose -f docker-compose.postgres.yml up -d
```

- **Stop (keep data):** `docker compose -f docker-compose.postgres.yml stop`
- **Tear down and remove the volume:** `docker compose -f docker-compose.postgres.yml down -v`

Default credentials and DB name match `.env.example` (development only — **never** reuse for production or shared staging).

### Database name policy (per developer / worktree)

Align with `tasks/todo-mvp/architecture-brief.json` → `persistence.dev_isolation`: each clone or worktree should use its **own** database name so local experiments do not collide. Examples:

- Default: `todo_reference_dev` (compose default when `POSTGRES_DB` is unset).
- Override when starting: `POSTGRES_DB=todo_reference_dev_myworktree docker compose -f docker-compose.postgres.yml up -d`
- Map the same name in `.env.local` → `DATABASE_URL` (see below).

### `DATABASE_URL` — host vs Compose network

| Where the app runs        | Where Postgres runs              | Example `DATABASE_URL` |
| --------------------------- | -------------------------------- | -------------------------------------------------------------------------- |
| Host (e.g. `bun run dev`) | `docker-compose.postgres.yml`, port published to `5432` | `postgresql://todo:todos@127.0.0.1:5432/todo_reference_dev?schema=public` |
| Container on same stack as `postgres` | `postgres` service (DNS name `postgres`) | `postgresql://todo:todos@postgres:5432/todo_reference_integration?schema=public` (integration) or `.../todo_reference_e2e?...` (E2E) |

Use **`127.0.0.1`** (or `localhost`) only when the process is on the host and talking to the mapped container port. Use hostname **`postgres`** only from other containers attached to **that** compose file’s network.

**Forbidden:** pointing local dev or automated jobs at shared production/staging databases (see architecture brief).

### Prisma migrations and seed

After Postgres is up and `DATABASE_URL` is set (copy from `.env.example` into `.env.local` for local dev):

| Command | When to use |
| ------- | ----------- |
| `bun run db:generate` | Regenerate the Prisma Client after schema changes (also runs on `bun install` via `postinstall`). |
| `bun run db:migrate:dev` | **Local dev:** create/apply migrations against your dev database (interactive; requires `DATABASE_URL`). |
| `bun run db:migrate` | **CI / containers / prod-style:** apply committed migrations only (`prisma migrate deploy`). |
| `bun run db:seed` | **Idempotent seed:** upserts stub user, sample todos, and activity feed rows for Dashboard / Activity Feed / E2E baselines. Safe to run twice. |

Typical local sequence:

```bash
cd projects/todo-reference
docker compose -f docker-compose.postgres.yml up -d
# Set DATABASE_URL in .env.local, then:
bun run db:migrate:dev   # first time or after pulling new migrations
bun run db:seed
bun run dev
```

Integration and E2E compose stacks run `prisma migrate deploy` (plus seed where configured) **inside the container job** so tests never rely on a developer workstation database.

## Scripts

| Script                       | Purpose                                                                                            |
| ---------------------------- | -------------------------------------------------------------------------------------------------- |
| `bun run dev`                | Next dev server (Turbopack)                                                                        |
| `bun run build`              | Production build (`next build`)                                                                    |
| `bun run start`              | Start production server                                                                            |
| `bun run lint`               | ESLint (`next lint`)                                                                               |
| `bun run format`             | Prettier write                                                                                     |
| `bun run format:check`       | Prettier check                                                                                     |
| `bun run test:unit`          | Vitest unit suite (host runner)                                                                    |
| `bun run test:unit:coverage` | Vitest unit suite + **100% line** gate for `src/domain/**/*.ts` and `src/application/**/*.ts`      |
| `bun run db:migrate`         | Apply committed Prisma migrations (`migrate deploy`) — use with `DATABASE_URL` |
| `bun run db:migrate:dev`     | Create/apply migrations in local dev (`prisma migrate dev`) |
| `bun run db:seed`            | Idempotent Prisma seed (todos + activity feed + stub user) |
| `bun run test:integration`   | Integration suite + coverage **only via Docker** (isolated Node runner + **test-scoped Postgres**; see below) |
| `bun run test:e2e`           | Playwright Chromium suite against the **compose** stack (`E2E_BASE_URL=http://web:3000` inside CI) |

## Testing and coverage

- **Unit scope (100% lines, host):** `src/domain/**/*.ts`, `src/application/**/*.ts` — run `bun run test:unit:coverage` locally or in CI on the default runner.
- **Integration scope (100% lines, container-only):** `src/infrastructure/**/*.ts`, `src/lib/server/**/*.ts`, `src/app/**/actions.ts`, `src/app/api/**/route.ts`, `src/app/todo-action-contract.ts` — run `bun run test:integration`, which runs `docker compose -f docker-compose.integration.yml` with an isolated `node_modules` volume, a **dedicated `postgres` service** (database `todo_reference_integration`), and injects `DATABASE_URL=postgresql://todo:todos@postgres:5432/todo_reference_integration?schema=public`. The job runs `prisma migrate deploy`, `prisma generate`, and `db:seed` before Vitest. **`SQLITE_PATH`** remains set for legacy SQLite adapter coverage in `src/infrastructure/sqlite/**`. Vitest coverage uses **Node** inside that service because the Bun runtime does not expose the V8 coverage APIs Vitest relies on.
- **Integration / E2E DB rule:** In CI or locally, **do not** point integration or E2E jobs at a personal workstation `DATABASE_URL` from `.env.local`. Those jobs must use **only** the Postgres service defined in the same compose file (`docker-compose.integration.yml` or `docker-compose.e2e.yml`). See `e2e/README.md`.
- **E2E (Chromium, container-only):** `bun run test:e2e` builds `infra/docker/Dockerfile.app`, runs **Postgres** (`todo_reference_e2e`) plus the app (`SQLITE_PATH=/data/todos.sqlite` on volume `e2e-sqlite` for scaffold compatibility), then runs Playwright from `e2e/specs` with `E2E_BASE_URL=http://web:3000`. See `e2e/README.md` for reset/seed notes.

Declared coverage exclusions (currently none beyond standard `*.d.ts` test helpers) live in `tasks/todo-mvp/architecture-brief.json` under `coverage_scope_exclusions`.

## Environment variables

| Variable        | Scope            | Description                                                                                                               |
| --------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `SQLITE_PATH`   | server only      | Absolute or relative path to the SQLite file used by **legacy** SQLite adapters under `src/infrastructure/sqlite` (integration coverage only). **Do not** expose as `NEXT_PUBLIC_*`. |
| `DATABASE_URL`  | server only      | **Required** for todos, activity feed, and Prisma-backed routes/server actions. PostgreSQL connection string — match `docker-compose.postgres.yml` for local dev; see table above for host vs `postgres` hostname. **Never** use prod/staging. |
| `POSTGRES_DB`   | dev compose only | Optional override for `docker-compose.postgres.yml` default database name (`todo_reference_dev`).                         |
| `POSTGRES_PORT` | dev compose only | Optional host port mapping (default `5432`).                                                                              |
| `E2E_BASE_URL`  | test runner only | Playwright base URL; **`http://web:3000`** inside `docker-compose.e2e.yml`, override only for ad-hoc host-side debugging. |

Copy `.env.example` to `.env.local` for local overrides. Set **`DATABASE_URL`** for normal dev: todos, server actions, `/api/todos`, and `/api/activity-feed` read/write Postgres via Prisma. **`ACTIVITY_FEED_FIXTURE_PATH`** is **test-only** (with `NODE_ENV=test`): integration tests can force the activity-feed route to read a JSON file instead of Postgres for specific I/O scenarios — not part of the default product path.

### HTTP JSON API (todos + activity feed)

| Method / path | Purpose |
| ------------- | ------- |
| `GET /api/todos` | List todos (JSON array of `{ id, content, completed, createdAt, updatedAt }`). |
| `POST /api/todos` | Create todo; body `{ "content": string }`. |
| `PATCH /api/todos/[id]` | Update `content` and/or `{ "toggleCompleted": true }`. |
| `DELETE /api/todos/[id]` | Delete todo (`204` on success). |
| `GET /api/activity-feed` | Activity feed document `{ "version": 1, "items": [...] }` from Postgres (chronological items, oldest first). |

Validation/not-found errors return `400`/`404` with JSON `{ error, ... }` per handler.

### Stub auth + seeded user (Social Login)

- The `/login` route is **stub-only**: submitting the email form runs the `beginStubSession` server action, which sets the `stub-auth` cookie (`ui_spec.json` → `auth.cookie_name`) and redirects to `/dashboard`. There is **no** OAuth or real identity provider.
- `prisma/seed.ts` upserts a **StubUser** row used for QA copy and documentation: id `10000000-0000-4000-8000-000000000001`, display name **Stub User (QA)**. Todos and the activity feed are loaded via the HTTP JSON API above, not via SQLite fixtures on the default path.

Docker Compose sets `SQLITE_PATH` and/or `DATABASE_URL` explicitly for integration/E2E services so runs stay reproducible on clean clones.

### SQLite file lifecycle (local)

- Prefer `.data/` (gitignored) for the SQLite file to avoid committing runtime state.
- On Windows, avoid placing the DB on sync folders (OneDrive, Dropbox) if locking issues appear; use a local disk path via `SQLITE_PATH`.

## Layering and singleton policy

- **Dependency rule:** `src/app` and `src/components` may call **application** use cases; **infrastructure** implements adapters; **domain** stays framework-free.
- **Singleton policy (from architecture brief):** no mutable global singletons for database handles. Use explicit factories (`createDb`, `createRepositories`, etc.) per request, route handler, or test; inject temp paths or in-memory doubles in tests.

ESLint restricts `react`, `next`, and SQLite drivers under `src/domain/**` and `src/application/**`.

## Feature tasks

Delivery tasks and the architecture brief live under `tasks/todo-mvp/` in this folder tree.
