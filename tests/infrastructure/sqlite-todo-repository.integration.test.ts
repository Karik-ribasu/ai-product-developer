import { describe, expect, test } from "bun:test";
import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { Database } from "bun:sqlite";
import {
  createTodo,
  deleteTodo,
  listTodos,
  toggleTodoComplete,
  updateTodoText,
} from "@/application/todo";
import {
  createSqliteTodoRepository,
  DatabaseOpenError,
  MigrationFailedError,
  defaultMigrationsDir,
  loadMigrationsFromDir,
  openDatabaseAndMigrate,
  runMigrations,
} from "@/infrastructure/sqlite";

describe("SQLite TodoRepository (integration, temp file DB)", () => {
  function tempDbPath(): { dir: string; file: string; cleanup: () => void } {
    const dir = mkdtempSync(join(tmpdir(), "todo-sqlite-test-"));
    const file = join(dir, "todos.sqlite");
    return {
      dir,
      file,
      cleanup: () => {
        try {
          rmSync(dir, { recursive: true, force: true });
        } catch {
          /* best effort */
        }
      },
    };
  }

  test("migrations on empty DB then full CRUD round-trip", async () => {
    const { file, cleanup } = tempDbPath();
    try {
      const repo = createSqliteTodoRepository({ databasePath: file });
      const a = await createTodo(repo, { title: "  Alpha  " });
      expect(a.title).toBe("Alpha");
      const listed = await listTodos(repo);
      expect(listed.map((t) => t.title)).toEqual(["Alpha"]);

      await updateTodoText(repo, { id: a.id.value, title: "Beta" });
      await toggleTodoComplete(repo, { id: a.id.value });
      let current = await repo.findById(a.id);
      expect(current?.completed).toBe(true);
      expect(current?.title).toBe("Beta");

      await deleteTodo(repo, { id: a.id.value });
      expect(await listTodos(repo)).toHaveLength(0);
      current = await repo.findById(a.id);
      expect(current?.deleted).toBe(true);

      repo.close();
    } finally {
      cleanup();
    }
  });

  test("re-opening same file is idempotent (migrations + data)", async () => {
    const { file, cleanup } = tempDbPath();
    try {
      const r1 = createSqliteTodoRepository({ databasePath: file });
      await createTodo(r1, { title: "persist" });
      r1.close();

      const r2 = createSqliteTodoRepository({ databasePath: file });
      const listed = await listTodos(r2);
      expect(listed).toHaveLength(1);
      expect(listed[0]!.title).toBe("persist");
      r2.close();
    } finally {
      cleanup();
    }
  });

  test("schema bump: DB at v1 only receives v2 migration on open", () => {
    const { file, cleanup } = tempDbPath();
    try {
      const db = new Database(file, { strict: true });
      db.run(`
        CREATE TABLE todos (
          id TEXT PRIMARY KEY NOT NULL,
          title TEXT NOT NULL,
          completed INTEGER NOT NULL DEFAULT 0,
          deleted INTEGER NOT NULL DEFAULT 0
        )
      `);
      db.run(`
        CREATE TABLE schema_migrations (
          version INTEGER PRIMARY KEY NOT NULL,
          applied_at TEXT NOT NULL
        )
      `);
      db.run(
        "INSERT INTO schema_migrations (version, applied_at) VALUES (1, ?)",
        [new Date().toISOString()],
      );
      db.close();

      const repo = createSqliteTodoRepository({ databasePath: file });
      repo.close();

      const verify = new Database(file, { strict: true });
      const cols = verify
        .query<{ name: string }, []>("PRAGMA table_info(todos)")
        .all()
        .map((c) => c.name);
      expect(cols).toContain("client_sync_token");
      verify.close();
    } finally {
      cleanup();
    }
  });

  test("open failure is DatabaseOpenError (distinguishable)", () => {
    const badPath = join(tmpdir(), "nonexistent-dir-xyz", "nope.sqlite");
    expect(() => createSqliteTodoRepository({ databasePath: badPath })).toThrow(
      DatabaseOpenError,
    );
  });

  test("migration failure is MigrationFailedError (distinguishable)", () => {
    const { file, cleanup } = tempDbPath();
    try {
      const broken = [
        { version: 1, name: "bad.sql", sql: "NOT VALID SQL AT ALL;" },
      ];
      expect(() => openDatabaseAndMigrate({ databasePath: file, migrations: broken })).toThrow(
        MigrationFailedError,
      );
    } finally {
      cleanup();
    }
  });

  test("default migration set loads from disk and applies in order", () => {
    const { file, cleanup } = tempDbPath();
    try {
      const migrations = loadMigrationsFromDir(defaultMigrationsDir());
      expect(migrations.length).toBeGreaterThanOrEqual(2);
      expect(migrations[0]!.version).toBeLessThan(migrations[1]!.version);

      const db = new Database(file, { strict: true });
      runMigrations(db, migrations);
      runMigrations(db, migrations);
      const v = db
        .query<{ version: number }, []>("SELECT version FROM schema_migrations ORDER BY version")
        .all();
      expect(v.map((r) => r.version)).toEqual(migrations.map((m) => m.version));
      db.close();
    } finally {
      cleanup();
    }
  });
});
