"use server";

import {
  createTodo,
  deleteTodo,
  listTodos,
  toggleTodoComplete,
  updateTodoText,
} from "@/application/todo";
import { mapUnknownToTodoActionFailure } from "@/interface-adapters/todos/map-todo-action-failure";
import {
  isTodoActionFailure,
  validateCreateTitleInput,
  validateIdOnlyInput,
  validateUpdateTodoInput,
} from "@/interface-adapters/todos/todo-boundary-validation";
import type { TodoActionResult, TodoPublicDto } from "@/interface-adapters/todos/todo-action-result";
import { toTodoPublicDto } from "@/interface-adapters/todos/todo-action-result";
import { runWithTodoSqliteRepository } from "@/server/with-todo-sqlite-repository";

export type { TodoActionResult, TodoPublicDto } from "@/interface-adapters/todos/todo-action-result";

export async function listTodosAction(): Promise<TodoActionResult<{ todos: TodoPublicDto[] }>> {
  try {
    const todos = await runWithTodoSqliteRepository((repo) => listTodos(repo));
    return { ok: true, data: { todos: todos.map(toTodoPublicDto) } };
  } catch (e) {
    return mapUnknownToTodoActionFailure(e);
  }
}

export async function createTodoAction(
  title: unknown,
): Promise<TodoActionResult<{ todo: TodoPublicDto }>> {
  const validated = validateCreateTitleInput(title);
  if (isTodoActionFailure(validated)) {
    return validated;
  }
  try {
    const todo = await runWithTodoSqliteRepository((repo) =>
      createTodo(repo, { title: validated.title }),
    );
    return { ok: true, data: { todo: toTodoPublicDto(todo) } };
  } catch (e) {
    return mapUnknownToTodoActionFailure(e);
  }
}

export async function updateTodoTextAction(
  input: unknown,
): Promise<TodoActionResult<{ todo: TodoPublicDto }>> {
  const validated = validateUpdateTodoInput(input);
  if (isTodoActionFailure(validated)) {
    return validated;
  }
  try {
    const todo = await runWithTodoSqliteRepository((repo) =>
      updateTodoText(repo, { id: validated.id, title: validated.title }),
    );
    return { ok: true, data: { todo: toTodoPublicDto(todo) } };
  } catch (e) {
    return mapUnknownToTodoActionFailure(e);
  }
}

export async function toggleTodoCompleteAction(
  id: unknown,
): Promise<TodoActionResult<{ todo: TodoPublicDto }>> {
  const validated = validateIdOnlyInput(id);
  if (isTodoActionFailure(validated)) {
    return validated;
  }
  try {
    const todo = await runWithTodoSqliteRepository((repo) =>
      toggleTodoComplete(repo, { id: validated.id }),
    );
    return { ok: true, data: { todo: toTodoPublicDto(todo) } };
  } catch (e) {
    return mapUnknownToTodoActionFailure(e);
  }
}

export async function deleteTodoAction(
  id: unknown,
): Promise<TodoActionResult<{ deleted: true }>> {
  const validated = validateIdOnlyInput(id);
  if (isTodoActionFailure(validated)) {
    return validated;
  }
  try {
    await runWithTodoSqliteRepository((repo) => deleteTodo(repo, { id: validated.id }));
    return { ok: true, data: { deleted: true } };
  } catch (e) {
    return mapUnknownToTodoActionFailure(e);
  }
}
