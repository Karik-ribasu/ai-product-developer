import { describe, expect, it } from "vitest";

import { TodoNotFoundError, TodoValidationError } from "@/domain/errors";

describe("domain errors", () => {
  it("creates validation errors with stable code + name", () => {
    const err = new TodoValidationError("bad");
    expect(err.code).toBe("VALIDATION");
    expect(err.message).toBe("bad");
    expect(err.name).toBe("TodoValidationError");
  });

  it("creates not-found errors with todo id metadata", () => {
    const err = new TodoNotFoundError("id-1");
    expect(err.code).toBe("NOT_FOUND");
    expect(err.todoId).toBe("id-1");
    expect(err.message).toContain("id-1");
    expect(err.name).toBe("TodoNotFoundError");
  });
});
