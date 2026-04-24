import { randomUUID } from "node:crypto";

import type { TodoRepository } from "@/application/ports/todo-repository";
import { Todo } from "@/domain/todo";
import { TodoNotFoundError } from "@/domain/errors";

export function makeCreateTodo(repo: TodoRepository) {
  return async function createTodo(input: { content: string }): Promise<Todo> {
    const todo = Todo.create({
      id: randomUUID(),
      content: input.content,
      clock: () => new Date(),
    });
    await repo.insert(todo);
    return todo;
  };
}

export function makeListTodos(repo: TodoRepository) {
  return async function listTodos(): Promise<Todo[]> {
    return repo.findAll();
  };
}

export function makeToggleTodo(repo: TodoRepository) {
  return async function toggleTodo(id: string): Promise<Todo> {
    const existing = await repo.findById(id);
    if (!existing) {
      throw new TodoNotFoundError(id);
    }
    const next = existing.toggleCompleted(() => new Date());
    await repo.update(next);
    return next;
  };
}

export function makeUpdateTodo(repo: TodoRepository) {
  return async function updateTodo(id: string, content: string): Promise<Todo> {
    const existing = await repo.findById(id);
    if (!existing) {
      throw new TodoNotFoundError(id);
    }
    const next = existing.withContent(content, () => new Date());
    await repo.update(next);
    return next;
  };
}

export function makeDeleteTodo(repo: TodoRepository) {
  return async function deleteTodo(id: string): Promise<void> {
    const removed = await repo.deleteById(id);
    if (!removed) {
      throw new TodoNotFoundError(id);
    }
  };
}
