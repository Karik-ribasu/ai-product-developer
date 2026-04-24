import type { TodoActionResult, TodoDto } from "@/app/todo-action-contract";
import {
  todoDeleteResultFromFetchResponse,
  todoListResultFromFetchResponse,
  todoSingleResultFromFetchResponse,
} from "@/lib/todo-api-response";

export async function listTodosViaHttp(): Promise<TodoActionResult<TodoDto[]>> {
  const res = await fetch("/api/todos", { cache: "no-store" });
  return todoListResultFromFetchResponse(res);
}

export async function createTodoViaHttp(content: string): Promise<TodoActionResult<TodoDto>> {
  const res = await fetch("/api/todos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
  return todoSingleResultFromFetchResponse(res);
}

export async function updateTodoViaHttp(
  id: string,
  content: string,
): Promise<TodoActionResult<TodoDto>> {
  const res = await fetch(`/api/todos/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
  return todoSingleResultFromFetchResponse(res);
}

export async function toggleTodoViaHttp(id: string): Promise<TodoActionResult<TodoDto>> {
  const res = await fetch(`/api/todos/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ toggleCompleted: true }),
  });
  return todoSingleResultFromFetchResponse(res);
}

export async function deleteTodoViaHttp(id: string): Promise<TodoActionResult<{ id: string }>> {
  const res = await fetch(`/api/todos/${encodeURIComponent(id)}`, { method: "DELETE" });
  return todoDeleteResultFromFetchResponse(res, id);
}
