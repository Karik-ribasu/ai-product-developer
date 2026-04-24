import type Database from "better-sqlite3";

import type { TodoRepository } from "@/application/ports/todo-repository";
import type { Todo } from "@/domain/todo";
import { todoDomainToRow, todoRowToDomain } from "@/infrastructure/sqlite/todo-row-mapper";

export class SqliteTodoRepository implements TodoRepository {
  constructor(private readonly db: Database.Database) {}

  async insert(todo: Todo): Promise<void> {
    const row = todoDomainToRow(todo);
    this.db
      .prepare(
        `
        INSERT INTO todos (id, content, completed, created_at, updated_at)
        VALUES (@id, @content, @completed, @created_at, @updated_at)
      `,
      )
      .run(row);
  }

  async findAll(): Promise<Todo[]> {
    const rows = this.db
      .prepare(
        `
        SELECT id, content, completed, created_at, updated_at
        FROM todos
        ORDER BY datetime(created_at) ASC
      `,
      )
      .all() as Array<{
        id: string;
        content: string;
        completed: number;
        created_at: string;
        updated_at: string;
      }>;

    return rows.map(todoRowToDomain);
  }

  async findById(id: string): Promise<Todo | null> {
    const row = this.db
      .prepare(
        `
        SELECT id, content, completed, created_at, updated_at
        FROM todos
        WHERE id = ?
      `,
      )
      .get(id) as
      | {
          id: string;
          content: string;
          completed: number;
          created_at: string;
          updated_at: string;
        }
      | undefined;

    if (!row) {
      return null;
    }

    return todoRowToDomain(row);
  }

  async update(todo: Todo): Promise<void> {
    const row = todoDomainToRow(todo);
    const result = this.db
      .prepare(
        `
        UPDATE todos
        SET content = @content,
            completed = @completed,
            updated_at = @updated_at
        WHERE id = @id
      `,
      )
      .run(row);

    if (result.changes === 0) {
      throw new Error(`Failed to update todo (missing id): ${todo.id}`);
    }
  }

  async deleteById(id: string): Promise<boolean> {
    const result = this.db.prepare(`DELETE FROM todos WHERE id = ?`).run(id);
    return result.changes > 0;
  }
}

export function createSqliteTodoRepository(db: Database.Database): TodoRepository {
  return new SqliteTodoRepository(db);
}
