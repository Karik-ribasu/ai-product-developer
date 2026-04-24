import { TodoValidationError } from "@/domain/errors";

export class Todo {
  private constructor(
    readonly id: string,
    readonly content: string,
    readonly completed: boolean,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {}

  static create(input: { id: string; content: string; clock: () => Date }): Todo {
    const now = input.clock();
    const content = Todo.normalizeContent(input.content);
    return new Todo(input.id, content, false, now, now);
  }

  static rehydrate(input: {
    id: string;
    content: string;
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): Todo {
    return new Todo(
      input.id,
      input.content,
      input.completed,
      input.createdAt,
      input.updatedAt,
    );
  }

  private static normalizeContent(raw: string): string {
    const trimmed = raw.trim();
    if (!trimmed) {
      throw new TodoValidationError("Todo content cannot be empty");
    }
    return trimmed;
  }

  toggleCompleted(clock: () => Date): Todo {
    return new Todo(
      this.id,
      this.content,
      !this.completed,
      this.createdAt,
      clock(),
    );
  }

  withContent(raw: string, clock: () => Date): Todo {
    const content = Todo.normalizeContent(raw);
    return new Todo(this.id, content, this.completed, this.createdAt, clock());
  }
}
