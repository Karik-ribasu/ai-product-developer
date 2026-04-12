/**
 * Infrastructure-level failures distinguishable for upper layers (server boundary → user-safe copy).
 * No stack traces are required at this layer; callers map `kind` to safe messages.
 */

export class DatabaseOpenError extends Error {
  readonly kind = "database_open" as const;

  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "DatabaseOpenError";
  }
}

export class MigrationFailedError extends Error {
  readonly kind = "migration_failed" as const;

  constructor(
    public readonly targetVersion: number,
    message: string,
    options?: { cause?: unknown },
  ) {
    super(message, options);
    this.name = "MigrationFailedError";
  }
}

export function isDatabaseOpenError(e: unknown): e is DatabaseOpenError {
  return e instanceof DatabaseOpenError;
}

export function isMigrationFailedError(e: unknown): e is MigrationFailedError {
  return e instanceof MigrationFailedError;
}
