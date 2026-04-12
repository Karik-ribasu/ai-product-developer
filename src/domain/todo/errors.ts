/**
 * Domain-level failures for the Todo bounded context (ubiquitous language).
 * No framework or persistence imports.
 */

export abstract class TodoDomainError extends Error {
  abstract readonly kind: "invalid_input" | "rule_violation" | "not_found";

  protected constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

/** Malformed or unusable identifiers, titles, or other raw input at the domain edge. */
export class TodoInvalidInputError extends TodoDomainError {
  readonly kind = "invalid_input" as const;

  constructor(message: string) {
    super(message);
  }
}

/** Invariants broken by an operation on an existing Todo (e.g. mutating a deleted task). */
export class TodoRuleViolationError extends TodoDomainError {
  readonly kind = "rule_violation" as const;

  constructor(message: string) {
    super(message);
  }
}

/** No Todo exists for the given identifier (application maps empty repository reads here). */
export class TodoNotFoundError extends TodoDomainError {
  readonly kind = "not_found" as const;

  constructor(public readonly todoId: string) {
    super(`Todo not found for id: ${todoId}`);
  }
}
