import { NextResponse } from "next/server";

import { makeDeleteTodo, makeToggleTodo, makeUpdateTodo } from "@/application/todo-use-cases";
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

type PatchBody = {
  content?: unknown;
  toggleCompleted?: unknown;
};

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  let body: PatchBody;
  try {
    body = (await request.json()) as PatchBody;
  } catch {
    return NextResponse.json(
      { error: "validation", message: "Invalid JSON body" },
      { status: 400 },
    );
  }
  try {
    const { id } = await context.params;
    const toggle =
      body.toggleCompleted === true || body.toggleCompleted === "true";
    const contentRaw = body.content;
    const hasContent = typeof contentRaw === "string";

    if (!hasContent && !toggle) {
      return NextResponse.json(
        { error: "validation", message: "Provide content and/or toggleCompleted" },
        { status: 400 },
      );
    }

    const payload = await withRepositories(process.env, async ({ todos }) => {
      let current: Todo | null = null;
      if (hasContent) {
        const updateTodo = makeUpdateTodo(todos);
        current = await updateTodo(id, contentRaw);
      }
      if (toggle) {
        const toggleTodo = makeToggleTodo(todos);
        current = await toggleTodo(id);
      }
      return toTodoJson(current!);
    });
    return NextResponse.json(payload);
  } catch (err) {
    return mapTodoThrownErrorToResponse(err);
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const { id } = await context.params;
    await withRepositories(process.env, async ({ todos }) => {
      const deleteTodo = makeDeleteTodo(todos);
      await deleteTodo(id);
    });
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return mapTodoThrownErrorToResponse(err);
  }
}
