import { Database } from "bun:sqlite";
import { DatabaseOpenError } from "./db-errors";
import {
  loadDefaultMigrations,
  runMigrations,
  type MigrationFile,
} from "./migration-runner";

export type OpenAndMigrateOptions = {
  databasePath: string;
  /** Override for tests (e.g. broken SQL); defaults to co-located versioned SQL files. */
  migrations?: readonly MigrationFile[];
};

/**
 * Opens a file-backed SQLite database and applies pending migrations.
 * No module-level pool: each call creates a new handle (factory / per-request style).
 */
export function openDatabaseAndMigrate(
  options: OpenAndMigrateOptions,
): Database {
  let db: Database;
  try {
    db = new Database(options.databasePath, { strict: true, create: true });
  } catch (cause) {
    throw new DatabaseOpenError("Could not open SQLite database.", { cause });
  }
  try {
    const migrations = options.migrations ?? loadDefaultMigrations();
    runMigrations(db, migrations);
  } catch (e) {
    try {
      db.close();
    } catch {
      /* ignore */
    }
    throw e;
  }
  return db;
}
