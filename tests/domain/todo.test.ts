import { describe, expect, test } from "bun:test";
import {
  Todo,
  TodoId,
  TodoInvalidInputError,
  TodoNotFoundError,
  TodoRuleViolationError,
} from "@/domain/todo";

const validId = "550e8400-e29b-41d4-a716-446655440000";

describe("TodoId", () => {
  test("parses valid UUID v4", () => {
    const id = TodoId.parse(validId);
    expect(id.value).toBe(validId);
  });

  test("rejects empty id", () => {
    expect(() => TodoId.parse("")).toThrow(TodoInvalidInputError);
    expect(() => TodoId.parse("   ")).toThrow(TodoInvalidInputError);
  });

  test("rejects non-uuid v4", () => {
    expect(() => TodoId.parse("not-a-uuid")).toThrow(TodoInvalidInputError);
    expect(() => TodoId.parse("550e8400-e29b-31d4-a716-446655440000")).toThrow(
      TodoInvalidInputError,
    );
  });
});

describe("Todo aggregate", () => {
  test("create happy path", () => {
    const todo = Todo.create({ title: "  Buy milk  " });
    expect(todo.title).toBe("Buy milk");
    expect(todo.completed).toBe(false);
    expect(todo.deleted).toBe(false);
    expect(todo.id.value).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    );
  });

  test("reconstitute and update title", () => {
    const id = TodoId.parse(validId);
    const todo = Todo.reconstitute({
      id,
      title: "Walk dog",
      completed: false,
      deleted: false,
    });
    todo.updateTitle("Walk dog — park");
    expect(todo.title).toBe("Walk dog — park");
  });

  test("toggle complete", () => {
    const todo = Todo.create({ title: "Task" });
    expect(todo.completed).toBe(false);
    todo.toggleComplete();
    expect(todo.completed).toBe(true);
    todo.toggleComplete();
    expect(todo.completed).toBe(false);
  });

  test("delete sets deleted and blocks further mutations", () => {
    const todo = Todo.create({ title: "One-off" });
    todo.delete();
    expect(todo.deleted).toBe(true);
    expect(() => todo.updateTitle("Nope")).toThrow(TodoRuleViolationError);
    expect(() => todo.toggleComplete()).toThrow(TodoRuleViolationError);
  });

  test("double delete is a rule violation", () => {
    const todo = Todo.create({ title: "x" });
    todo.delete();
    expect(() => todo.delete()).toThrow(TodoRuleViolationError);
  });

  test("empty title on create", () => {
    expect(() => Todo.create({ title: "" })).toThrow(TodoInvalidInputError);
    expect(() => Todo.create({ title: "  \t  " })).toThrow(TodoInvalidInputError);
  });

  test("empty title on update", () => {
    const todo = Todo.create({ title: "ok" });
    expect(() => todo.updateTitle("")).toThrow(TodoInvalidInputError);
  });

  test("reconstitute rejects empty persisted title", () => {
    const id = TodoId.parse(validId);
    expect(() =>
      Todo.reconstitute({
        id,
        title: " ",
        completed: false,
        deleted: false,
      }),
    ).toThrow(TodoInvalidInputError);
  });
});

describe("TodoNotFoundError", () => {
  test("carries id for ubiquitous not-found outcome", () => {
    const err = new TodoNotFoundError(validId);
    expect(err).toBeInstanceOf(Error);
    expect(err.kind).toBe("not_found");
    expect(err.todoId).toBe(validId);
  });
});
