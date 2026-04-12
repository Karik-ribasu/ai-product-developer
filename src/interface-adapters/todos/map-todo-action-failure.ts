import {
  TodoDomainError,
  TodoInvalidInputError,
  TodoNotFoundError,
  TodoRuleViolationError,
} from "@/domain/todo";
import {
  isDatabaseOpenError,
  isMigrationFailedError,
} from "@/infrastructure/sqlite/db-errors";
import type { TodoActionFailure, TodoActionFailureCode } from "./todo-action-result";

const SAFE_MESSAGES = {
  invalid_input: "We could not use that input. Please check and try again.",
  empty_or_forbidden_title:
    "The title cannot be empty and must be allowed for this todo.",
  persistence_failure: "We could not reach the local database. Please try again.",
  not_found: "We could not find that todo.",
  rule_violation: "This todo can no longer be changed.",
} as const;

function isTitleInvariantMessage(message: string): boolean {
  return message.includes("Todo title");
}

function failure(code: TodoActionFailureCode, message: string): TodoActionFailure {
  return { ok: false, code, message };
}

/**
 * Maps domain and infrastructure errors to three explicit, user-safe failure classes.
 * Never forwards stack traces, driver text, or file paths.
 */
export function mapUnknownToTodoActionFailure(error: unknown): TodoActionFailure {
  if (error instanceof TodoInvalidInputError) {
    if (isTitleInvariantMessage(error.message)) {
      return failure("empty_or_forbidden_title", SAFE_MESSAGES.empty_or_forbidden_title);
    }
    return failure("invalid_input", SAFE_MESSAGES.invalid_input);
  }

  if (error instanceof TodoNotFoundError) {
    return failure("invalid_input", SAFE_MESSAGES.not_found);
  }

  if (error instanceof TodoRuleViolationError) {
    return failure("invalid_input", SAFE_MESSAGES.rule_violation);
  }

  if (error instanceof TodoDomainError) {
    return failure("invalid_input", SAFE_MESSAGES.invalid_input);
  }

  if (isDatabaseOpenError(error) || isMigrationFailedError(error)) {
    return failure("persistence_failure", SAFE_MESSAGES.persistence_failure);
  }

  return failure("persistence_failure", SAFE_MESSAGES.persistence_failure);
}
