import "server-only";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import type { TodoRepository } from "@/application/todo";
import { createSqliteTodoRepository } from "@/infrastructure/sqlite";
import { getTodoSqliteDatabasePath } from "./todo-sqlite-path";

/**
 * Runs a function with a request-scoped SQLite-backed repository (open → migrate → work → close).
 */
export async function runWithTodoSqliteRepository<T>(
  fn: (repo: TodoRepository) => Promise<T>,
): Promise<T> {
  const databasePath = getTodoSqliteDatabasePath();
  mkdirSync(dirname(databasePath), { recursive: true });

  let repo: (TodoRepository & { close(): void }) | undefined;
  try {
    repo = createSqliteTodoRepository({ databasePath });
    return await fn(repo);
  } finally {
    repo?.close();
  }
}
