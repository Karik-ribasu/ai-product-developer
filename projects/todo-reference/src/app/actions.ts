"use server";

import type { TodoRepository } from "@/application/ports/todo-repository";
import {
  makeCreateTodo,
  makeDeleteTodo,
  makeListTodos,
  makeToggleTodo,
  makeUpdateTodo,
} from "@/application/todo-use-cases";
import type { Todo } from "@/domain/todo";
import { createDb } from "@/infrastructure/prisma/create-db";
import { createRepositories } from "@/infrastructure/prisma/repositories-factory";

import {
  mapUnknownToTodoActionError,
  type TodoActionResult,
  type TodoDto,
} from "./todo-action-contract";

export type { TodoActionError, TodoActionResult, TodoDto } from "./todo-action-contract";

function toTodoDto(todo: Todo): TodoDto {
  return {
    id: todo.id,
    content: todo.content,
    completed: todo.completed,
    createdAt: todo.createdAt.toISOString(),
    updatedAt: todo.updatedAt.toISOString(),
  };
}

async function runWithTodoRepository<T>(
  fn: (repo: TodoRepository) => Promise<T>,
): Promise<T> {
  const prisma = createDb(process.env);
  try {
    const { todos } = createRepositories(prisma);
    return await fn(todos);
  } finally {
    await prisma.$disconnect();
  }
}

async function wrapAsync<T>(fn: () => Promise<T>): Promise<TodoActionResult<T>> {
  try {
    return { ok: true, data: await fn() };
  } catch (err) {
    return { ok: false, error: mapUnknownToTodoActionError(err) };
  }
}

export async function createTodoAction(input: {
  content: string;
}): Promise<TodoActionResult<TodoDto>> {
  return wrapAsync(async () =>
    runWithTodoRepository(async (repo) => {
      const createTodo = makeCreateTodo(repo);
      return toTodoDto(await createTodo({ content: input.content }));
    }),
  );
}

export async function listTodosAction(): Promise<TodoActionResult<TodoDto[]>> {
  return wrapAsync(async () =>
    runWithTodoRepository(async (repo) => {
      const listTodos = makeListTodos(repo);
      return (await listTodos()).map(toTodoDto);
    }),
  );
}

export async function toggleTodoAction(id: string): Promise<TodoActionResult<TodoDto>> {
  return wrapAsync(async () =>
    runWithTodoRepository(async (repo) => {
      const toggleTodo = makeToggleTodo(repo);
      return toTodoDto(await toggleTodo(id));
    }),
  );
}

export async function updateTodoAction(input: {
  id: string;
  content: string;
}): Promise<TodoActionResult<TodoDto>> {
  return wrapAsync(async () =>
    runWithTodoRepository(async (repo) => {
      const updateTodo = makeUpdateTodo(repo);
      return toTodoDto(await updateTodo(input.id, input.content));
    }),
  );
}

export async function deleteTodoAction(
  id: string,
): Promise<TodoActionResult<{ id: string }>> {
  return wrapAsync(async () =>
    runWithTodoRepository(async (repo) => {
      const deleteTodo = makeDeleteTodo(repo);
      await deleteTodo(id);
      return { id };
    }),
  );
}
