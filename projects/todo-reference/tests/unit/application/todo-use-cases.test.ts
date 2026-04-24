import { describe, expect, it } from "vitest";

import type { TodoRepository } from "@/application/ports/todo-repository";
import {
  makeCreateTodo,
  makeDeleteTodo,
  makeListTodos,
  makeToggleTodo,
  makeUpdateTodo,
} from "@/application/todo-use-cases";
import { TodoNotFoundError } from "@/domain/errors";
import { Todo } from "@/domain/todo";

function createFakeTodoRepository(seed: Todo[] = []): TodoRepository {
  const todos = new Map(seed.map((t) => [t.id, t]));
  return {
    async insert(todo) {
      todos.set(todo.id, todo);
    },
    async findAll() {
      return Array.from(todos.values()).sort(
        (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
      );
    },
    async findById(id) {
      return todos.get(id) ?? null;
    },
    async update(todo) {
      todos.set(todo.id, todo);
    },
    async deleteById(id) {
      return todos.delete(id);
    },
  };
}

describe("todo use cases", () => {
  it("creates and lists todos (empty list is valid)", async () => {
    const repo = createFakeTodoRepository();
    const listTodos = makeListTodos(repo);
    expect(await listTodos()).toEqual([]);

    const createTodo = makeCreateTodo(repo);
    const created = await createTodo({ content: "first" });
    expect(created.content).toBe("first");

    const listed = await listTodos();
    expect(listed).toHaveLength(1);
    expect(listed[0]?.id).toBe(created.id);
  });

  it("propagates validation errors from the domain on create", async () => {
    const repo = createFakeTodoRepository();
    const createTodo = makeCreateTodo(repo);
    await expect(createTodo({ content: "  " })).rejects.toThrowError();
    expect(await repo.findAll()).toEqual([]);
  });

  it("toggles, updates, and deletes todos", async () => {
    const repo = createFakeTodoRepository();
    const createTodo = makeCreateTodo(repo);
    const toggleTodo = makeToggleTodo(repo);
    const updateTodo = makeUpdateTodo(repo);
    const deleteTodo = makeDeleteTodo(repo);

    const todo = await createTodo({ content: "x" });
    expect((await toggleTodo(todo.id)).completed).toBe(true);
    expect((await updateTodo(todo.id, "y")).content).toBe("y");

    await deleteTodo(todo.id);
    expect(await repo.findById(todo.id)).toBeNull();
  });

  it("throws when toggling missing todos", async () => {
    const repo = createFakeTodoRepository();
    const toggleTodo = makeToggleTodo(repo);
    await expect(toggleTodo("missing")).rejects.toThrow(TodoNotFoundError);
  });

  it("throws when updating missing todos", async () => {
    const repo = createFakeTodoRepository();
    const updateTodo = makeUpdateTodo(repo);
    await expect(updateTodo("missing", "x")).rejects.toThrow(TodoNotFoundError);
  });

  it("throws when deleting missing todos", async () => {
    const repo = createFakeTodoRepository();
    const deleteTodo = makeDeleteTodo(repo);
    await expect(deleteTodo("missing")).rejects.toThrow(TodoNotFoundError);
  });
});
