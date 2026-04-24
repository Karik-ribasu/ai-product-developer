import { describe, expect, it } from "vitest";

import { TodoNotFoundError, TodoValidationError } from "@/domain/errors";
import { mapTodoThrownErrorToResponse } from "@/lib/server/todo-http";

describe("mapTodoThrownErrorToResponse", () => {
  it("maps validation errors to 400", async () => {
    const res = mapTodoThrownErrorToResponse(new TodoValidationError("bad"));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "validation", message: "bad" });
  });

  it("maps not-found errors to 404", async () => {
    const res = mapTodoThrownErrorToResponse(new TodoNotFoundError("id-1"));
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: "not_found", id: "id-1" });
  });

  it("maps generic errors to 500", async () => {
    const res = mapTodoThrownErrorToResponse(new Error("boom"));
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "internal", message: "boom" });
  });

  it("maps non-Error throws to 500 with a stable message", async () => {
    const res = mapTodoThrownErrorToResponse("weird");
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "internal", message: "Unexpected error" });
  });
});
