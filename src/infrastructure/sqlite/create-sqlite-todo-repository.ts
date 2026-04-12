import type { Database } from "bun:sqlite";
import type { TodoRepository } from "@/application/todo/todo-repository";
import { SqliteTodoRepository } from "./sqlite-todo-repository";
import { openDatabaseAndMigrate, type OpenAndMigrateOptions } from "./open-and-migrate";

export type CreateSqliteTodoRepositoryOptions = OpenAndMigrateOptions;

/**
 * Explicit factory: opens the DB at `databasePath`, runs migrations, returns the port implementation.
 * No mutable global connection; callers own lifecycle (`SqliteTodoRepository.close` when needed).
 */
export function createSqliteTodoRepository(
  options: CreateSqliteTodoRepositoryOptions,
): TodoRepository & { close(): void } {
  const db: Database = openDatabaseAndMigrate(options);
  const inner = new SqliteTodoRepository(db);
  return {
    save: (t) => inner.save(t),
    findById: (id) => inner.findById(id),
    list: () => inner.list(),
    close: () => inner.close(),
  };
}
