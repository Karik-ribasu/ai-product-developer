import { NextResponse } from "next/server";

import { TodoNotFoundError, TodoValidationError } from "@/domain/errors";

export function mapTodoThrownErrorToResponse(error: unknown): NextResponse {
  if (error instanceof TodoValidationError) {
    return NextResponse.json(
      { error: "validation", message: error.message },
      { status: 400 },
    );
  }
  if (error instanceof TodoNotFoundError) {
    return NextResponse.json(
      { error: "not_found", id: error.todoId },
      { status: 404 },
    );
  }
  const message = error instanceof Error ? error.message : "Unexpected error";
  return NextResponse.json({ error: "internal", message }, { status: 500 });
}
