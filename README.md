# Local Todo (SQLite)

Next.js **App Router** + **TypeScript**, managed with **Bun**. Persistence uses **`bun:sqlite`** (see `src/infrastructure/sqlite/`). SQLite paths and env vars are **server-only** (never exposed to the client bundle).

## Prerequisites

- [Bun](https://bun.sh/) installed and on `PATH` (Windows: confirm with `bun --version` in **cmd** or **PowerShell**, not only Git Bash, if you use multiple shells).

## Install

```bash
bun install
```

The repo uses **`bun:sqlite`** in `src/infrastructure/sqlite/`; **`@types/bun`** is listed as a dev dependency so `next build` (TypeScript check) resolves `bun:sqlite` without errors. Runtime remains Bun’s embedded SQLite.

## Environment

1. **Create `.env.local` at the repo root** (Next.js convention; the file is listed in `.gitignore` and must not be committed):
   - **Recommended (cross-platform):** `bun run env:bootstrap` — copies `.env.example` → `.env.local` when `.env.local` is missing.
   - **Manual:** copy `.env.example` to `.env.local` (e.g. `cp .env.example .env.local` on Unix/Git Bash, or duplicate the file in Explorer on Windows).
2. **Next.js** loads `.env.local` automatically for `bun run dev` and `bun run build` (same mechanism as upstream Next docs).
3. **Optional:** set **`TODO_SQLITE_PATH`** inside `.env.local` only if you need a non-default absolute DB path (see [Local SQLite database](#local-sqlite-database)). Leave it empty to use the default under `.data/`.
4. **Run the app:** `bun run dev` and open `http://localhost:3000`.

Variables such as **`TODO_SQLITE_PATH`** are read only in server code (e.g. `src/server/todo-sqlite-path.ts`). Do not add **`NEXT_PUBLIC_*`** variants for DB paths — those ship to the browser and are the wrong surface for SQLite configuration.

**Fresh clone (runnable dev):** `bun install` → `bun run env:bootstrap` → `bun run dev`. Git never needs `.data/` or `.env.local` committed; both are ignored.

## Local SQLite database

| Topic | Detail |
|--------|--------|
| **Default path** | When **`TODO_SQLITE_PATH`** is unset or empty, `getTodoSqliteDatabasePath()` in `src/server/todo-sqlite-path.ts` resolves the database file to **`<project-root>/.data/todos.sqlite`** (i.e. `process.cwd()` + `.data/todos.sqlite` at runtime). |
| **When it is created / opened** | The **`.data/`** directory and the **`.sqlite`** file appear the first time server code needs the DB: `runWithTodoSqliteRepository` calls `mkdirSync` on the parent directory, then the SQLite adapter opens the file (e.g. first todo load or mutation that hits that path). |
| **Override** | Set **`TODO_SQLITE_PATH`** in `.env.local` to an absolute path to the database file. |
| **Reset (safe)** | Stop the dev server, then delete the **`.data/`** directory at the project root **or** remove the single file pointed to by **`TODO_SQLITE_PATH`**, then start the app again so a new file can be created. |
| **Windows / OneDrive / sync folders** | If the repo or **`.data/`** lives under **OneDrive**, **Dropbox**, **iCloud**, or similar, you may see **`SQLITE_BUSY`** or **database is locked** due to background sync. Prefer a path outside synced folders (e.g. local-only disk, or set **`TODO_SQLITE_PATH`** to a non-synced absolute path). |

## Scripts

| Command | Purpose |
|--------|--------|
| `bun run env:bootstrap` | Create `.env.local` from `.env.example` when missing (safe dev defaults; never commits secrets). |
| `bun run dev` | Next.js dev server (App Router). **Uses `bun --bun`** so server code can load **`bun:sqlite`** (plain `next dev` runs under Node and will throw `Cannot find module 'bun:sqlite'`). |
| `bun run build` | Production build. |
| `bun run start` | Serve production build (run after `build`). **Must use Bun** — `bun --bun next start` so `bun:sqlite` resolves (same constraint as `dev`). |
| `bun run lint` | ESLint (flat config + `eslint-config-next`). |
| `bun run test` | Bun test runner — smoke tests under `tests/`. |
| `bun run test:unit` | Unit-only subset (excludes `tests/infrastructure` integration files). |
| `bun run test:integration:docker` | Integration tests inside **Docker** (`docker-compose.integration.yml`). |
| `bun run qa:compose` | **Quality gate harness:** isolated app container + **Chromium** (Playwright) per `docker-compose.qa.yml`. |

## QA / CI harness (Docker)

For **`app-ui-design-system`** quality gate and EM → `qa-agent` handoffs, see **`tasks/app-ui-design-system/06-infra-qa-e2e-harness/artifacts/EM_QA_HARNESS.md`**. GitHub Actions workflow: **`.github/workflows/ci.yml`**.

## Reserved source layout

| Path | Role |
|------|------|
| `src/app/` | Next.js App Router (UI + route handlers live at the edge). |
| `src/domain/` | Pure domain (no `react` / `next` / DB drivers). |
| `src/application/` | Use cases and ports. |
| `src/infrastructure/` | SQLite adapter, migrations, file path resolution (later tasks). |
| `src/interface-adapters/` | Mapping between HTTP/server actions and use cases (later tasks). |
| `src/components/ui/{atoms,molecules,organisms}/` | Atomic Design placeholders (UI task). |

SQLite file paths and drivers must remain **server-only** (never imported from Client Components). Prefer explicit factories (e.g. `createDbClient(path)`) — **no** mutable global connection (see architecture brief).

## Windows smoke checklist (Bun + Next + future SQLite)

Use this after clone or toolchain updates, especially on Windows before adding native SQLite bindings.

1. **Shell and Bun on PATH**  
   Open **PowerShell** (or **cmd**). Run `bun --version`. If it fails, fix `PATH` for the shell you use to run `bun run dev` (Git Bash vs PowerShell can differ).

2. **Clean install**  
   From repo root: `bun install`. Confirm `node_modules` exists and there are no postinstall errors.

3. **Lint**  
   `bun run lint` — must exit 0.

4. **Tests**  
   `bun run test` — must exit 0 (verifies Bun’s test runner).

5. **Production build**  
   `bun run build` — must complete without errors. Persistence in this repo uses Bun’s built-in **`bun:sqlite`** (no separate npm SQLite driver or native prebuild step). If you later add an optional native driver (e.g. `better-sqlite3`), re-run this step: **native modules require a toolchain matching the Node ABI Bun uses**; on Windows, install failures often mean missing **build tools** (e.g. VS Build Tools) or an incompatible prebuild — track that driver’s docs.

6. **Production server (Bun-backed)**  
   After a successful build, run `bun run start` (do **not** run plain `next start` under Node). The `start` script uses Bun so **`bun:sqlite`** loads; if you see `Cannot find module 'bun:sqlite'`, the process is not running under Bun. Open `http://localhost:3000` and confirm the app loads.

7. **Dev server**  
   `bun run dev` (runs `bun --bun next dev`). Open `http://localhost:3000` and confirm todos load/create without `bun:sqlite` errors. If you see **`Cannot find module 'bun:sqlite'`**, you are not using the scripted dev command (or Bun is too old).

8. **Paths for a file-backed DB**  
   Confirm defaults and env behaviour in [Local SQLite database](#local-sqlite-database) and [Environment](#environment). Use **`TODO_SQLITE_PATH`** only when you need a non-default absolute path. Do not expose paths or secrets to the browser bundle.

9. **Antivirus / controlled folder access**  
   If `bun install` or `bun run build` fails with access denied, allow-list the repo folder or run the terminal as a user with write access to `node_modules` and `.next`.

## Verify end-to-end (local)

```bash
bun install
bun run lint
bun run test
bun run build
bun run start
```

Both **`bun run dev`** and **`bun run start`** run Next under **Bun** so **`bun:sqlite`** works. Do not run plain `next dev` / `next start` under Node for this app. After smoke tests, stop the server with **Ctrl+C**.

## Architecture references

- Feature brief: `tasks/local-todo-sqlite/architecture-brief.json`
- Repo standards: `.cursor/skills/architecture-standards/SKILL.md`
