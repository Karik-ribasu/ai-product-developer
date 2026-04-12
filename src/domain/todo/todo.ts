import { TodoInvalidInputError, TodoRuleViolationError } from "./errors";
import { TodoId } from "./todo-id";

function assertNonEmptyTitle(raw: string): string {
  const title = raw.trim();
  if (title.length === 0) {
    throw new TodoInvalidInputError("Todo title cannot be empty.");
  }
  return title;
}

function newTodoId(): TodoId {
  const value = crypto.randomUUID();
  return TodoId.fromTrusted(value);
}

/** Aggregate root: enforces invariants for create, text updates, completion toggle, and delete. */
export class Todo {
  private constructor(
    private readonly _id: TodoId,
    private _title: string,
    private _completed: boolean,
    private _deleted: boolean,
  ) {}

  get id(): TodoId {
    return this._id;
  }

  get title(): string {
    return this._title;
  }

  get completed(): boolean {
    return this._completed;
  }

  get deleted(): boolean {
    return this._deleted;
  }

  static create(input: { title: string }): Todo {
    const title = assertNonEmptyTitle(input.title);
    return new Todo(newTodoId(), title, false, false);
  }

  /** Rebuild from persistence; trusts id shape only if caller validated — prefer TodoId.parse at the boundary. */
  static reconstitute(input: {
    id: TodoId;
    title: string;
    completed: boolean;
    deleted: boolean;
  }): Todo {
    const title = assertNonEmptyTitle(input.title);
    return new Todo(input.id, title, input.completed, input.deleted);
  }

  updateTitle(nextTitle: string): void {
    this.assertNotDeleted("Cannot update title of a deleted todo.");
    this._title = assertNonEmptyTitle(nextTitle);
  }

  toggleComplete(): void {
    this.assertNotDeleted("Cannot toggle completion of a deleted todo.");
    this._completed = !this._completed;
  }

  /** Logical delete; further mutations are rule violations. */
  delete(): void {
    if (this._deleted) {
      throw new TodoRuleViolationError("Todo is already deleted.");
    }
    this._deleted = true;
  }

  private assertNotDeleted(message: string): void {
    if (this._deleted) {
      throw new TodoRuleViolationError(message);
    }
  }
}
