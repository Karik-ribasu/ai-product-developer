import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import type { Database } from "bun:sqlite";
import { MigrationFailedError } from "./db-errors";

export type MigrationFile = {
  version: number;
  name: string;
  sql: string;
};

const MIGRATION_FILENAME = /^(\d{3})_(.+)\.sql$/;

/** Default migrations directory (versioned SQL files co-located with this module). */
export function defaultMigrationsDir(): string {
  return join(fileURLToPath(new URL(".", import.meta.url)), "migrations");
}

/**
 * Reads `NNN_name.sql` from disk, sorted by numeric prefix.
 * Empty directory returns [] (caller may treat as error for production).
 */
export function loadMigrationsFromDir(dir: string): MigrationFile[] {
  const names = readdirSync(dir).filter((n) => MIGRATION_FILENAME.test(n));
  const parsed = names.map((name) => {
    const m = name.match(MIGRATION_FILENAME)!;
    const version = Number.parseInt(m[1], 10);
    const sql = readFileSync(join(dir, name), "utf8");
    return { version, name, sql };
  });
  parsed.sort((a, b) => a.version - b.version);
  return parsed;
}

function ensureMetaTable(db: Database): void {
  db.run(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version INTEGER PRIMARY KEY NOT NULL,
      applied_at TEXT NOT NULL
    )
  `);
}

function isApplied(db: Database, version: number): boolean {
  const row = db
    .query("SELECT 1 AS ok FROM schema_migrations WHERE version = ?")
    .get(version) as { ok: number } | null;
  return row != null;
}

function recordApplied(db: Database, version: number): void {
  const stamp = new Date().toISOString();
  db.run("INSERT INTO schema_migrations (version, applied_at) VALUES (?, ?)", [
    version,
    stamp,
  ]);
}

/**
 * Applies pending migrations in order inside a transaction per migration.
 * Idempotent: re-run on an already migrated DB is a no-op for applied versions.
 */
export function runMigrations(db: Database, migrations: readonly MigrationFile[]): void {
  ensureMetaTable(db);

  for (const m of migrations) {
    if (isApplied(db, m.version)) {
      continue;
    }
    try {
      db.run("BEGIN IMMEDIATE");
      db.exec(m.sql);
      recordApplied(db, m.version);
      db.run("COMMIT");
    } catch (cause) {
      try {
        db.run("ROLLBACK");
      } catch {
        /* ignore rollback errors */
      }
      throw new MigrationFailedError(
        m.version,
        `Migration ${m.version} (${m.name}) failed.`,
        { cause },
      );
    }
  }
}

export function loadDefaultMigrations(): MigrationFile[] {
  return loadMigrationsFromDir(defaultMigrationsDir());
}
