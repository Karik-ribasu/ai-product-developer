# EM / QA harness — `app-ui-design-system`

Aligned with `tasks/app-ui-design-system/quality-gate/task.json` and stable id **`qa-manual-automated-e2e-chromium`** (`.cursor/skills/testing-and-qa-standards/SKILL.md`).

## Compose stack (isolated app + Chromium)

| Item | Value |
|------|--------|
| Compose project name | `appui-design-system-qa` (`docker-compose.qa.yml` → `name:`) |
| Web service | `web` — production Next build under Bun; SQLite file at `TODO_SQLITE_PATH=/data/todos.sqlite` (named volume `qa-app-sqlite`) |
| Chromium runner | `qa-chromium` — image `mcr.microsoft.com/playwright:v1.59.1-jammy` (via `infra/qa/Dockerfile.qa-runner`); **`PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1`** (browsers baked into base image) |
| App base URL inside stack | `http://web:3000` (Playwright uses **`BASE_URL`** from compose; host is **`web`** so Chromium avoids the `.app` HSTS/secure-TLD policy that breaks `http://app:3000`) |

### Local / agent invocation (same entrypoint as CI)

Prerequisites: Docker Compose v2, repo root as cwd.

```bash
# Full stack: build `web` image, wait for healthcheck, run Playwright
docker compose -f docker-compose.qa.yml up --build --abort-on-container-exit --exit-code-from qa-chromium qa-chromium
```

NPM script (equivalent):

```bash
bun run qa:compose
```

### CI pipeline targets (GitHub Actions)

Workflow file: **`.github/workflows/ci.yml`**

| Job | Purpose |
|-----|---------|
| `lint-and-unit` | `bun run lint` + **`bun run test:unit`** (runner VM; no Docker) |
| `integration-isolated` | **`docker compose -f docker-compose.integration.yml run --rm integration-tests`** — single **`oven/bun:1`** container; SQLite integration tests use temp files only (no auxiliary DB container). |
| `qa-e2e-chromium` | **`docker compose -f docker-compose.qa.yml build`** then **`docker compose -f docker-compose.qa.yml up --abort-on-container-exit --exit-code-from qa-chromium qa-chromium`** |

### Quality-gate assignment bundle for `qa-agent`

1. Run **`lint-and-unit`** expectations locally or confirm CI green.  
2. Run **`integration-isolated`** when integration scope applies (current repo: `tests/infrastructure/**`).  
3. Run **`qa-e2e-chromium`** (or `bun run qa:compose`) for **`qa-manual-automated-e2e-chromium`**.  
4. Extend Playwright specs under **`e2e/specs/`** for MVP surface flows; keep harness smoke in `app-reachable.spec.ts` or replace as coverage grows.  
5. E2E appendix fields: compose project **`appui-design-system-qa`**, Chromium via **Playwright 1.59.1** / **`mcr.microsoft.com/playwright:v1.59.1-jammy`**, feature list + console/network issues per `.cursor/agents/qa-agent.md`.

### Integration policy note

Integration job uses **one container** (Bun test runner). SQLite file IO is in-process / temp paths — **no** separate PostgreSQL/Redis service (not required for this scope). If future tasks declare DB/cache integration scopes, add one service per concern per **`integration-tests-isolated-containers`**.
