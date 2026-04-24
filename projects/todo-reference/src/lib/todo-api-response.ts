import type { TodoActionError, TodoActionResult, TodoDto } from "@/app/todo-action-contract";

function asString(v: unknown): string | null {
  return typeof v === "string" ? v : null;
}

export function parseTodoDto(value: unknown): TodoDto | null {
  if (!value || typeof value !== "object") return null;
  const o = value as Record<string, unknown>;
  const id = asString(o.id);
  const content = asString(o.content);
  const completed = typeof o.completed === "boolean" ? o.completed : null;
  const createdAt = asString(o.createdAt);
  const updatedAt = asString(o.updatedAt);
  if (!id || !content || completed === null || !createdAt || !updatedAt) return null;
  return { id, content, completed, createdAt, updatedAt };
}

export async function mapHttpJsonToTodoActionError(res: Response): Promise<TodoActionError> {
  let body: unknown = null;
  try {
    body = await res.json();
  } catch {
    /* non-JSON error bodies */
  }
  if (body && typeof body === "object") {
    const o = body as Record<string, unknown>;
    const err = asString(o.error);
    const msg = asString(o.message) ?? res.statusText ?? "Request failed";
    if (res.status === 400 || err === "validation") {
      return { code: "VALIDATION", message: msg };
    }
    if (res.status === 404 || err === "not_found") {
      const id = asString(o.id);
      return { code: "NOT_FOUND", message: msg, details: id ?? undefined };
    }
  }
  const fallback =
    body && typeof body === "object" && "message" in body
      ? asString((body as { message?: unknown }).message)
      : null;
  return {
    code: "INTERNAL",
    message: fallback ?? `Request failed (${res.status})`,
  };
}

export async function todoListResultFromFetchResponse(
  res: Response,
): Promise<TodoActionResult<TodoDto[]>> {
  if (!res.ok) {
    return { ok: false, error: await mapHttpJsonToTodoActionError(res) };
  }
  let body: unknown;
  try {
    body = await res.json();
  } catch {
    return { ok: false, error: { code: "INTERNAL", message: "Invalid JSON from todos API" } };
  }
  if (!Array.isArray(body)) {
    return { ok: false, error: { code: "INTERNAL", message: "Expected array from todos API" } };
  }
  const todos: TodoDto[] = [];
  for (const item of body) {
    const t = parseTodoDto(item);
    if (!t) {
      return { ok: false, error: { code: "INTERNAL", message: "Invalid todo shape in list response" } };
    }
    todos.push(t);
  }
  return { ok: true, data: todos };
}

export async function todoSingleResultFromFetchResponse(
  res: Response,
): Promise<TodoActionResult<TodoDto>> {
  if (!res.ok) {
    return { ok: false, error: await mapHttpJsonToTodoActionError(res) };
  }
  let body: unknown;
  try {
    body = await res.json();
  } catch {
    return { ok: false, error: { code: "INTERNAL", message: "Invalid JSON from todos API" } };
  }
  const todo = parseTodoDto(body);
  if (!todo) {
    return { ok: false, error: { code: "INTERNAL", message: "Invalid todo in response" } };
  }
  return { ok: true, data: todo };
}

export async function todoDeleteResultFromFetchResponse(
  res: Response,
  id: string,
): Promise<TodoActionResult<{ id: string }>> {
  if (res.status === 204) {
    return { ok: true, data: { id } };
  }
  if (!res.ok) {
    return { ok: false, error: await mapHttpJsonToTodoActionError(res) };
  }
  return { ok: true, data: { id } };
}
