import { afterEach, beforeEach, describe, expect, it } from "vitest";

import {
  createTodoAction,
  deleteTodoAction,
  listTodosAction,
  toggleTodoAction,
  updateTodoAction,
} from "@/app/actions";
import { isTodoLoadSaveFailure, mapUnknownToTodoActionError } from "@/app/todo-action-contract";
import { TodoNotFoundError, TodoValidationError } from "@/domain/errors";

import { deleteAllTodos } from "./db-test-utils";

describe("todo server actions (integration)", () => {
  const prevDatabaseUrl = process.env.DATABASE_URL;

  beforeEach(async () => {
    await deleteAllTodos();
  });

  afterEach(() => {
    if (prevDatabaseUrl === undefined) {
      delete process.env.DATABASE_URL;
    } else {
      process.env.DATABASE_URL = prevDatabaseUrl;
    }
  });

  it("maps domain + unknown errors for frontend handling", () => {
    expect(mapUnknownToTodoActionError(new TodoValidationError("bad"))).toEqual({
      code: "VALIDATION",
      message: "bad",
    });
    const notFound = mapUnknownToTodoActionError(new TodoNotFoundError("id-1"));
    expect(notFound.code).toBe("NOT_FOUND");
    expect(notFound.details).toBe("id-1");
    expect(notFound.message).toContain("id-1");
    expect(mapUnknownToTodoActionError(new Error("boom"))).toEqual({
      code: "INTERNAL",
      message: "boom",
    });
    expect(mapUnknownToTodoActionError("weird")).toEqual({
      code: "INTERNAL",
      message: "Unexpected error",
    });
  });

  it("detects load/save failures from action results", () => {
    expect(isTodoLoadSaveFailure({ ok: true, data: [] })).toBe(false);
    expect(
      isTodoLoadSaveFailure({
        ok: false,
        error: { code: "INTERNAL", message: "x" },
      }),
    ).toBe(true);
  });

  it("lists todos as empty by default", async () => {
    const res = await listTodosAction();
    expect(res.ok).toBe(true);
    if (!res.ok) throw new Error("expected ok");
    expect(res.data).toEqual([]);
  });

  it("creates, lists, toggles, updates, and deletes todos", async () => {
    const created = await createTodoAction({ content: "first" });
    expect(created.ok).toBe(true);
    if (!created.ok) throw new Error("expected ok");
    expect(created.data.content).toBe("first");

    const listed = await listTodosAction();
    expect(listed.ok).toBe(true);
    if (!listed.ok) throw new Error("expected ok");
    expect(listed.data).toHaveLength(1);

    const toggled = await toggleTodoAction(created.data.id);
    expect(toggled.ok).toBe(true);
    if (!toggled.ok) throw new Error("expected ok");
    expect(toggled.data.completed).toBe(true);

    const updated = await updateTodoAction({ id: created.data.id, content: "second" });
    expect(updated.ok).toBe(true);
    if (!updated.ok) throw new Error("expected ok");
    expect(updated.data.content).toBe("second");

    const deleted = await deleteTodoAction(created.data.id);
    expect(deleted.ok).toBe(true);
    if (!deleted.ok) throw new Error("expected ok");
    expect(deleted.data.id).toBe(created.data.id);
  });

  it("returns validation errors for empty content", async () => {
    const res = await createTodoAction({ content: "  " });
    expect(res.ok).toBe(false);
    if (res.ok) throw new Error("expected failure");
    expect(res.error.code).toBe("VALIDATION");
  });

  it("returns not-found errors for missing ids", async () => {
    const missingId = "00000000-0000-0000-0000-000000000000";

    const toggle = await toggleTodoAction(missingId);
    expect(toggle.ok).toBe(false);
    if (toggle.ok) throw new Error("expected failure");
    expect(toggle.error.code).toBe("NOT_FOUND");

    const update = await updateTodoAction({ id: missingId, content: "x" });
    expect(update.ok).toBe(false);
    if (update.ok) throw new Error("expected failure");
    expect(update.error.code).toBe("NOT_FOUND");

    const del = await deleteTodoAction(missingId);
    expect(del.ok).toBe(false);
    if (del.ok) throw new Error("expected failure");
    expect(del.error.code).toBe("NOT_FOUND");
  });

  it("maps missing DATABASE_URL to INTERNAL action errors", async () => {
    delete process.env.DATABASE_URL;
    const res = await createTodoAction({ content: "x" });
    expect(res.ok).toBe(false);
    if (res.ok) throw new Error("expected failure");
    expect(res.error.code).toBe("INTERNAL");
  });
});
