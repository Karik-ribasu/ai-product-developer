# Local Todo (SQLite) — scaffold

Next.js **App Router** + **TypeScript**, managed with **Bun**. Inner layers are reserved under `src/` per `tasks/local-todo-sqlite/architecture-brief.json` (no SQLite driver in this task; no client-side DB path).

## Prerequisites

- [Bun](https://bun.sh/) installed and on `PATH` (Windows: confirm with `bun --version` in **cmd** or **PowerShell**, not only Git Bash, if you use multiple shells).

## Install

```bash
bun install
```

The repo uses **`bun:sqlite`** in `src/infrastructure/sqlite/`; **`@types/bun`** is listed as a dev dependency so `next build` (TypeScript check) resolves `bun:sqlite` without errors. Runtime remains Bun’s embedded SQLite.

## Scripts

| Command | Purpose |
|--------|---------|
| `bun run dev` | Next.js dev server (App Router). |
| `bun run build` | Production build. |
| `bun run start` | Serve production build (run after `build`). **Must use Bun** — the script runs `bun --bun next start` so `bun:sqlite` in server actions resolves (Node cannot load `bun:sqlite`). |
| `bun run lint` | ESLint (flat config + `eslint-config-next`). |
| `bun run test` | Bun test runner — smoke tests under `tests/`. |

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
   `bun run dev`, open `http://localhost:3000`, confirm the home page loads.

8. **Paths for a file-backed DB**  
   Use the **server-only** env var **`TODO_SQLITE_PATH`** (see `src/server/todo-sqlite-path.ts`) for an absolute path to the SQLite file under the project or user data dir. Avoid hard-coding drive letters shared across machines; watch **OneDrive / synced folders** (SQLite on Windows can hit `SQLITE_BUSY` / `database is locked` if another process or sync holds the file). Prefer short-lived handles (factory / per-request) over a shared mutable global connection. Do not expose the path to the browser bundle.

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

`bun run start` is the production smoke step (Bun runtime for `bun:sqlite`). After confirming the server starts, stop it with **Ctrl+C**. For local UI iteration, run `bun run dev` separately.

## Architecture references

- Feature brief: `tasks/local-todo-sqlite/architecture-brief.json`
- Repo standards: `.cursor/skills/architecture-standards/SKILL.md`
