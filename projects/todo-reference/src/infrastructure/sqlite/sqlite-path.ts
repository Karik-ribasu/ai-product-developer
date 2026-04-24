import { join } from "node:path";

/**
 * Resolves the SQLite file path from process env.
 * When SQLITE_PATH is unset or blank, defaults to `<cwd>/data/todo.sqlite` for local dev.
 */
export function resolveSqlitePathFromEnv(
  env: NodeJS.ProcessEnv = process.env,
  cwd: () => string = () => process.cwd(),
): string {
  const raw = env.SQLITE_PATH?.trim();
  if (raw) {
    return raw;
  }
  return join(cwd(), "data", "todo.sqlite");
}
