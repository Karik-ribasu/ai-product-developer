export class TodoValidationError extends Error {
  readonly code = "VALIDATION" as const;

  constructor(message: string) {
    super(message);
    this.name = "TodoValidationError";
  }
}

export class TodoNotFoundError extends Error {
  readonly code = "NOT_FOUND" as const;

  constructor(public readonly todoId: string) {
    super(`Todo not found: ${todoId}`);
    this.name = "TodoNotFoundError";
  }
}
