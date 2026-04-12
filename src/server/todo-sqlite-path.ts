import "server-only";
import { join } from "node:path";

const DEFAULT_RELATIVE = join(".data", "todos.sqlite");

/**
 * Resolves the SQLite file path from server-only configuration (never for client bundles).
 */
export function getTodoSqliteDatabasePath(): string {
  const fromEnv = process.env.TODO_SQLITE_PATH?.trim();
  if (fromEnv && fromEnv.length > 0) {
    return fromEnv;
  }
  return join(process.cwd(), DEFAULT_RELATIVE);
}
