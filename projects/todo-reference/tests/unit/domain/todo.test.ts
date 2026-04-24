import { describe, expect, it } from "vitest";

import { TodoValidationError } from "@/domain/errors";
import { Todo } from "@/domain/todo";

describe("Todo", () => {
  it("creates todos with trimmed content", () => {
    const clock = () => new Date("2026-04-18T12:00:00.000Z");
    const todo = Todo.create({ id: "a", content: "  hello  ", clock });
    expect(todo.id).toBe("a");
    expect(todo.content).toBe("hello");
    expect(todo.completed).toBe(false);
    expect(todo.createdAt).toEqual(clock());
    expect(todo.updatedAt).toEqual(clock());
  });

  it("rehydrates persisted todos", () => {
    const createdAt = new Date("2026-04-18T12:00:00.000Z");
    const updatedAt = new Date("2026-04-18T13:00:00.000Z");
    const todo = Todo.rehydrate({
      id: "b",
      content: "x",
      completed: true,
      createdAt,
      updatedAt,
    });
    expect(todo.completed).toBe(true);
    expect(todo.createdAt).toEqual(createdAt);
    expect(todo.updatedAt).toEqual(updatedAt);
  });

  it("rejects empty content on create", () => {
    expect(() =>
      Todo.create({
        id: "c",
        content: "   ",
        clock: () => new Date(),
      }),
    ).toThrow(TodoValidationError);
  });

  it("toggles completion and updates timestamp via clock", () => {
    const t0 = new Date("2026-04-18T12:00:00.000Z");
    const t1 = new Date("2026-04-18T12:01:00.000Z");
    const todo = Todo.create({ id: "d", content: "x", clock: () => t0 });
    const next = todo.toggleCompleted(() => t1);
    expect(next.completed).toBe(true);
    expect(next.createdAt).toEqual(t0);
    expect(next.updatedAt).toEqual(t1);
    const back = next.toggleCompleted(() => t1);
    expect(back.completed).toBe(false);
  });

  it("updates content with validation + clock", () => {
    const t0 = new Date("2026-04-18T12:00:00.000Z");
    const t1 = new Date("2026-04-18T12:02:00.000Z");
    const todo = Todo.create({ id: "e", content: "a", clock: () => t0 });
    const next = todo.withContent("  b  ", () => t1);
    expect(next.content).toBe("b");
    expect(next.updatedAt).toEqual(t1);
  });

  it("rejects empty content on update", () => {
    const todo = Todo.create({
      id: "f",
      content: "ok",
      clock: () => new Date(),
    });
    expect(() => todo.withContent(" ", () => new Date())).toThrow(TodoValidationError);
  });
});
