import { NextResponse } from "next/server";

import { makeCreateTodo, makeListTodos } from "@/application/todo-use-cases";
import type { Todo } from "@/domain/todo";
import { mapTodoThrownErrorToResponse } from "@/lib/server/todo-http";
import { withRepositories } from "@/lib/server/with-repositories";

function toTodoJson(todo: Todo) {
  return {
    id: todo.id,
    content: todo.content,
    completed: todo.completed,
    createdAt: todo.createdAt.toISOString(),
    updatedAt: todo.updatedAt.toISOString(),
  };
}

export async function GET(): Promise<NextResponse> {
  try {
    const payload = await withRepositories(process.env, async ({ todos }) => {
      const listTodos = makeListTodos(todos);
      const rows = await listTodos();
      return rows.map(toTodoJson);
    });
    return NextResponse.json(payload);
  } catch (err) {
    return mapTodoThrownErrorToResponse(err);
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  let body: { content?: unknown };
  try {
    body = (await request.json()) as { content?: unknown };
  } catch {
    return NextResponse.json(
      { error: "validation", message: "Invalid JSON body" },
      { status: 400 },
    );
  }
  try {
    const content = typeof body.content === "string" ? body.content : "";
    const created = await withRepositories(process.env, async ({ todos }) => {
      const createTodo = makeCreateTodo(todos);
      return toTodoJson(await createTodo({ content }));
    });
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    return mapTodoThrownErrorToResponse(err);
  }
}
