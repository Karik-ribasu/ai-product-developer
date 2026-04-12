import type { TodoActionFailure } from "./todo-action-result";

export function isTodoActionFailure(value: unknown): value is TodoActionFailure {
  return (
    typeof value === "object" &&
    value !== null &&
    "ok" in value &&
    (value as { ok: unknown }).ok === false &&
    "code" in value &&
    typeof (value as { code: unknown }).code === "string"
  );
}

const MAX_TITLE_CHARS = 8_000;

export type BoundaryValidatedTitle = { title: string };

export type BoundaryValidatedId = { id: string };

export type BoundaryValidatedIdTitle = BoundaryValidatedId & BoundaryValidatedTitle;

function invalidInput(message: string): TodoActionFailure {
  return { ok: false, code: "invalid_input", message };
}

export function validateCreateTitleInput(raw: unknown): TodoActionFailure | BoundaryValidatedTitle {
  if (typeof raw !== "string") {
    return invalidInput("Title must be a text value.");
  }
  if (raw.length > MAX_TITLE_CHARS) {
    return invalidInput("Title is too long.");
  }
  return { title: raw };
}

export function validateUpdateTodoInput(raw: unknown): TodoActionFailure | BoundaryValidatedIdTitle {
  if (raw === null || typeof raw !== "object") {
    return invalidInput("Request body must be an object with id and title.");
  }
  const rec = raw as Record<string, unknown>;
  const id = rec.id;
  const title = rec.title;
  if (typeof id !== "string") {
    return invalidInput("Todo id must be a text value.");
  }
  if (typeof title !== "string") {
    return invalidInput("Title must be a text value.");
  }
  if (id.length > 512) {
    return invalidInput("Todo id is too long.");
  }
  if (title.length > MAX_TITLE_CHARS) {
    return invalidInput("Title is too long.");
  }
  return { id, title };
}

export function validateIdOnlyInput(raw: unknown): TodoActionFailure | BoundaryValidatedId {
  if (typeof raw !== "string") {
    return invalidInput("Todo id must be a text value.");
  }
  if (raw.length > 512) {
    return invalidInput("Todo id is too long.");
  }
  return { id: raw };
}
