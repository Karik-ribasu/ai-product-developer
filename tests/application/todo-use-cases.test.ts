import { describe, expect, test } from "bun:test";
import {
  createTodo,
  deleteTodo,
  listTodos,
  toggleTodoComplete,
  updateTodoText,
} from "@/application/todo";
import {
  TodoInvalidInputError,
  TodoNotFoundError,
  TodoRuleViolationError,
} from "@/domain/todo";
import { FakeTodoRepository } from "./fake-todo-repository";

describe("application todo use cases (fake repo)", () => {
  test("create then list", async () => {
    const repo = new FakeTodoRepository();
    const created = await createTodo(repo, { title: "  Alpha  " });
    expect(created.title).toBe("Alpha");
    const rows = await listTodos(repo);
    expect(rows).toHaveLength(1);
    expect(rows[0]!.id.value).toBe(created.id.value);
  });

  test("update text delegates trimming/empty rules to domain", async () => {
    const repo = new FakeTodoRepository();
    const created = await createTodo(repo, { title: "Old" });
    const updated = await updateTodoText(repo, {
      id: created.id.value,
      title: "  New title  ",
    });
    expect(updated.title).toBe("New title");
    const rows = await listTodos(repo);
    expect(rows[0]!.title).toBe("New title");
  });

  test("toggle complete persists state", async () => {
    const repo = new FakeTodoRepository();
    const created = await createTodo(repo, { title: "T" });
    expect(created.completed).toBe(false);
    const after = await toggleTodoComplete(repo, { id: created.id.value });
    expect(after.completed).toBe(true);
    const fromList = (await listTodos(repo))[0]!;
    expect(fromList.completed).toBe(true);
  });

  test("delete soft-removes from list but find still returns aggregate", async () => {
    const repo = new FakeTodoRepository();
    const created = await createTodo(repo, { title: "gone" });
    await deleteTodo(repo, { id: created.id.value });
    expect((await listTodos(repo))).toHaveLength(0);
    const still = await repo.findById(created.id);
    expect(still?.deleted).toBe(true);
  });

  test("missing id yields TodoNotFoundError", async () => {
    const repo = new FakeTodoRepository();
    const missing = "550e8400-e29b-41d4-a716-446655440000";
    await expect(updateTodoText(repo, { id: missing, title: "x" })).rejects.toThrow(
      TodoNotFoundError,
    );
    await expect(toggleTodoComplete(repo, { id: missing })).rejects.toThrow(
      TodoNotFoundError,
    );
    await expect(deleteTodo(repo, { id: missing })).rejects.toThrow(TodoNotFoundError);
  });

  test("invalid uuid id is rejected at domain parse", async () => {
    const repo = new FakeTodoRepository();
    await expect(updateTodoText(repo, { id: "nope", title: "x" })).rejects.toThrow(
      TodoInvalidInputError,
    );
  });

  test("empty title on create surfaces domain invalid input", async () => {
    const repo = new FakeTodoRepository();
    await expect(createTodo(repo, { title: "  " })).rejects.toThrow(TodoInvalidInputError);
  });

  test("mutations on deleted todo are domain rule violations", async () => {
    const repo = new FakeTodoRepository();
    const created = await createTodo(repo, { title: "x" });
    await deleteTodo(repo, { id: created.id.value });
    await expect(
      updateTodoText(repo, { id: created.id.value, title: "y" }),
    ).rejects.toThrow(TodoRuleViolationError);
  });
});
