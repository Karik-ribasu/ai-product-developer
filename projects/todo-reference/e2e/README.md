# Chromium E2E (`projects/todo-reference/e2e`)

Playwright tests run **only** against the containerized stack started by `docker-compose.e2e.yml` (see package script `test:e2e`).

## Base URL

- Inside Compose, the runner uses **`E2E_BASE_URL=http://web:3000`** (service DNS name `web`, port `3000`).
- For ad-hoc local runs against a host-started dev server, export **`E2E_BASE_URL=http://127.0.0.1:3000`** before invoking Playwright (not the default quality gate).

## Database isolation (PostgreSQL)

- The E2E compose stack runs a **dedicated** `postgres` service with database name **`todo_reference_e2e`** and stable hostname **`postgres`** on the stack network.
- **`DATABASE_URL` for integration/E2E jobs** must reference **only** that in-stack Postgres (or an equivalent disposable service defined in the same compose file). **Do not** reuse your workstation `.env.local` default, a shared team server, or production/staging URLs when running containerized test jobs.
- The `web` and `e2e` services receive a compose-defined `DATABASE_URL` pointing at `postgres:5432/todo_reference_e2e` so CI and local `bun run test:e2e` stay aligned with `architecture-brief.json` → `persistence.test_isolation`.

## Data seed / reset (scaffold)

- The compose stack mounts a dedicated SQLite volume at **`SQLITE_PATH=/data/todos.sqlite`** for the `web` service (legacy path until the app is fully on Prisma/Postgres).
- Reset runtime state between runs: `docker compose -f docker-compose.e2e.yml down -v` (removes volumes; rerun `test:e2e` for a cold database and SQLite file).
- Full MVP flows (create/toggle/edit/delete) will extend this strategy when persistence lands; keep resets volume-based so Chromium tests stay isolated.
