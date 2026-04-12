import { TodoInvalidInputError } from "./errors";

const UUID_V4 =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** Identifier for a Todo; enforces MVP shape so mutating operations never accept garbage ids. */
export class TodoId {
  private constructor(public readonly value: string) {}

  static parse(raw: string): TodoId {
    const trimmed = raw.trim();
    if (trimmed.length === 0) {
      throw new TodoInvalidInputError("Todo id cannot be empty.");
    }
    if (!UUID_V4.test(trimmed)) {
      throw new TodoInvalidInputError("Todo id must be a valid UUID v4.");
    }
    return new TodoId(trimmed.toLowerCase());
  }

  /** For rehydration when the id was already validated (e.g. from persistence). */
  static fromTrusted(value: string): TodoId {
    return new TodoId(value);
  }

  equals(other: TodoId): boolean {
    return this.value === other.value;
  }
}
