import { TodoNotFoundError, TodoValidationError } from "@/domain/errors";

export type TodoDto = {
  id: string;
  content: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TodoActionError = {
  code: "VALIDATION" | "NOT_FOUND" | "INTERNAL";
  message: string;
  details?: string;
};

export type TodoActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: TodoActionError };

/**
 * Maps thrown domain/infrastructure errors to a stable, JSON-serializable contract
 * for client-side load/save failure handling (retry, toasts, inline messages).
 */
export function mapUnknownToTodoActionError(error: unknown): TodoActionError {
  if (error instanceof TodoValidationError) {
    return { code: "VALIDATION", message: error.message };
  }
  if (error instanceof TodoNotFoundError) {
    return {
      code: "NOT_FOUND",
      message: error.message,
      details: error.todoId,
    };
  }
  if (error instanceof Error) {
    return { code: "INTERNAL", message: error.message };
  }
  return { code: "INTERNAL", message: "Unexpected error" };
}

export function isTodoLoadSaveFailure<T>(
  result: TodoActionResult<T>,
): result is { ok: false; error: TodoActionError } {
  return result.ok === false;
}
