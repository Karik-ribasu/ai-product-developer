import type { Todo } from "@/domain/todo";

export type TodoPublicDto = {
  id: string;
  title: string;
  completed: boolean;
};

export type TodoActionFailureCode =
  | "invalid_input"
  | "empty_or_forbidden_title"
  | "persistence_failure";

export type TodoActionFailure = {
  ok: false;
  code: TodoActionFailureCode;
  message: string;
};

export type TodoActionSuccess<T> = { ok: true; data: T };

export type TodoActionResult<T> = TodoActionSuccess<T> | TodoActionFailure;

export function toTodoPublicDto(todo: Todo): TodoPublicDto {
  return {
    id: todo.id.value,
    title: todo.title,
    completed: todo.completed,
  };
}
