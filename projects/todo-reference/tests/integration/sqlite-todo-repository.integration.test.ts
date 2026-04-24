import { randomUUID } from "node:crypto";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";

import { Todo } from "@/domain/todo";
import { ensureTodoSchema } from "@/infrastructure/sqlite/bootstrap-schema";
import { openSqliteTodoDatabase } from "@/infrastructure/sqlite/open-database";
import {
  createSqliteTodoRepository,
  SqliteTodoRepository,
} from "@/infrastructure/sqlite/sqlite-todo-repository";
import { resolveSqlitePathFromEnv } from "@/infrastructure/sqlite/sqlite-path";
import {
  todoDomainToRow,
  todoRowToDomain,
} from "@/infrastructure/sqlite/todo-row-mapper";

describe("sqlite infrastructure (integration)", () => {
  const prevSqlitePath = process.env.SQLITE_PATH;

  afterEach(() => {
    if (prevSqlitePath === undefined) {
      delete process.env.SQLITE_PATH;
    } else {
      process.env.SQLITE_PATH = prevSqlitePath;
    }
  });

  it("resolves SQLITE_PATH from env with trim + fallback", () => {
    expect(resolveSqlitePathFromEnv({ SQLITE_PATH: " /tmp/x.sqlite " })).toBe(
      "/tmp/x.sqlite",
    );
    expect(
      resolveSqlitePathFromEnv({}, () => "/workspace"),
    ).toBe(path.join("/workspace", "data", "todo.sqlite"));
  });

  it("maps rows for completed=0 and completed=1", () => {
    const base = {
      id: "1",
      content: "c",
      created_at: "2026-04-18T12:00:00.000Z",
      updated_at: "2026-04-18T12:00:00.000Z",
    };
    const open = todoRowToDomain({ ...base, completed: 0 });
    const done = todoRowToDomain({ ...base, completed: 1 });
    expect(open.completed).toBe(false);
    expect(done.completed).toBe(true);

    expect(todoDomainToRow(done).completed).toBe(1);
    expect(todoDomainToRow(open).completed).toBe(0);
  });

  it("bootstraps schema idempotently and performs full CRUD", async () => {
    const dir = mkdtempSync(path.join(tmpdir(), "todo-sqlite-"));
    const file = path.join(dir, `${randomUUID()}.sqlite`);
    const db = openSqliteTodoDatabase(file);
    ensureTodoSchema(db);

    const repo = new SqliteTodoRepository(db);
    expect(await repo.findAll()).toEqual([]);

    const todo = Todo.create({
      id: randomUUID(),
      content: "hello",
      clock: () => new Date("2026-04-18T12:00:00.000Z"),
    });
    await repo.insert(todo);

    const hydrated = await repo.findById(todo.id);
    expect(hydrated?.content).toBe("hello");

    const toggled = todo.toggleCompleted(() => new Date("2026-04-18T12:05:00.000Z"));
    await repo.update(toggled);
    expect((await repo.findById(todo.id))?.completed).toBe(true);

    const updated = toggled.withContent("bye", () => new Date("2026-04-18T12:06:00.000Z"));
    await repo.update(updated);
    expect((await repo.findById(todo.id))?.content).toBe("bye");

    expect(await repo.deleteById(todo.id)).toBe(true);
    expect(await repo.deleteById(todo.id)).toBe(false);
    expect(await repo.findById(todo.id)).toBeNull();

    const viaFactory = createSqliteTodoRepository(db);
    expect(await viaFactory.findAll()).toEqual([]);

    db.close();
  });

  it("throws when updating a missing row", async () => {
    const dir = mkdtempSync(path.join(tmpdir(), "todo-sqlite-"));
    const file = path.join(dir, `${randomUUID()}.sqlite`);
    const db = openSqliteTodoDatabase(file);
    const repo = new SqliteTodoRepository(db);

    const orphan = Todo.rehydrate({
      id: randomUUID(),
      content: "ghost",
      completed: false,
      createdAt: new Date("2026-04-18T12:00:00.000Z"),
      updatedAt: new Date("2026-04-18T12:00:00.000Z"),
    });

    await expect(repo.update(orphan)).rejects.toThrow(/Failed to update todo/);
    db.close();
  });
});
