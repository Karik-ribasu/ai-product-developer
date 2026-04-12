import { describe, expect, test } from "bun:test";
import {
  isTodoActionFailure,
  validateCreateTitleInput,
  validateIdOnlyInput,
  validateUpdateTodoInput,
} from "@/interface-adapters/todos/todo-boundary-validation";

describe("todo boundary validation", () => {
  test("create rejects non-string title", () => {
    const r = validateCreateTitleInput(123);
    expect(isTodoActionFailure(r)).toBe(true);
    if (isTodoActionFailure(r)) {
      expect(r.code).toBe("invalid_input");
    }
  });

  test("create accepts string title for domain to trim", () => {
    const r = validateCreateTitleInput("  hi  ");
    expect(isTodoActionFailure(r)).toBe(false);
    if (!isTodoActionFailure(r)) {
      expect(r.title).toBe("  hi  ");
    }
  });

  test("update requires object with string id and title", () => {
    expect(isTodoActionFailure(validateUpdateTodoInput(null))).toBe(true);
    expect(isTodoActionFailure(validateUpdateTodoInput({ id: 1, title: "a" }))).toBe(true);
    const ok = validateUpdateTodoInput({ id: "uuid", title: "t" });
    expect(isTodoActionFailure(ok)).toBe(false);
    if (!isTodoActionFailure(ok)) {
      expect(ok.id).toBe("uuid");
      expect(ok.title).toBe("t");
    }
  });

  test("id-only validates string", () => {
    expect(isTodoActionFailure(validateIdOnlyInput(undefined))).toBe(true);
    const ok = validateIdOnlyInput("abc");
    expect(isTodoActionFailure(ok)).toBe(false);
    if (!isTodoActionFailure(ok)) {
      expect(ok.id).toBe("abc");
    }
  });
});
