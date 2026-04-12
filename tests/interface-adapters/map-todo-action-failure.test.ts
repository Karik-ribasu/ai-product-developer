import { describe, expect, test } from "bun:test";
import { mapUnknownToTodoActionFailure } from "@/interface-adapters/todos/map-todo-action-failure";
import {
  TodoInvalidInputError,
  TodoNotFoundError,
  TodoRuleViolationError,
} from "@/domain/todo";
import { DatabaseOpenError, MigrationFailedError } from "@/infrastructure/sqlite";

describe("mapUnknownToTodoActionFailure", () => {
  test("empty title domain signal maps to empty_or_forbidden_title", () => {
    const r = mapUnknownToTodoActionFailure(
      new TodoInvalidInputError("Todo title cannot be empty."),
    );
    expect(r).toEqual({
      ok: false,
      code: "empty_or_forbidden_title",
      message: expect.any(String),
    });
  });

  test("invalid id shape maps to invalid_input", () => {
    const r = mapUnknownToTodoActionFailure(
      new TodoInvalidInputError("Todo id must be a valid UUID v4."),
    );
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.code).toBe("invalid_input");
      expect(r.message).not.toContain("C:\\");
      expect(r.message).not.toContain("/");
    }
  });

  test("not found maps to invalid_input with safe copy", () => {
    const r = mapUnknownToTodoActionFailure(new TodoNotFoundError("x"));
    expect(r).toEqual({
      ok: false,
      code: "invalid_input",
      message: "We could not find that todo.",
    });
  });

  test("rule violation maps to invalid_input", () => {
    const r = mapUnknownToTodoActionFailure(
      new TodoRuleViolationError("Todo is already deleted."),
    );
    expect(r).toEqual({
      ok: false,
      code: "invalid_input",
      message: "This todo can no longer be changed.",
    });
  });

  test("database open maps to persistence_failure without leaking path", () => {
    const r = mapUnknownToTodoActionFailure(
      new DatabaseOpenError("internal", { cause: new Error("ENOENT: /secret/path") }),
    );
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.code).toBe("persistence_failure");
      expect(r.message).not.toContain("secret");
      expect(r.message).not.toContain("ENOENT");
    }
  });

  test("migration failure maps to persistence_failure", () => {
    const r = mapUnknownToTodoActionFailure(
      new MigrationFailedError(1, "boom", { cause: new Error("sql") }),
    );
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.code).toBe("persistence_failure");
    }
  });

  test("unknown errors map to persistence_failure and hide internals", () => {
    const r = mapUnknownToTodoActionFailure(new Error("sqlite near C:\\Users\\x\\db.sqlite"));
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.code).toBe("persistence_failure");
      expect(r.message).not.toContain("sqlite");
      expect(r.message).not.toContain("Users");
    }
  });
});
