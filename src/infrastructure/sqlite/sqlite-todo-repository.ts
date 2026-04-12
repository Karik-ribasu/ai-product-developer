import type { TodoRepository } from "@/application/todo/todo-repository";
import { Todo, TodoId } from "@/domain/todo";
import type { Database } from "bun:sqlite";

/**
 * SQLite implementation of the application `TodoRepository` port.
 * Holds a database handle created by the factory (no global pool).
 */
export class SqliteTodoRepository implements TodoRepository {
  constructor(private readonly db: Database) {}

  async save(todo: Todo): Promise<void> {
    this.db.run(
      `INSERT INTO todos (id, title, completed, deleted)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         title = excluded.title,
         completed = excluded.completed,
         deleted = excluded.deleted`,
      [
        todo.id.value,
        todo.title,
        todo.completed ? 1 : 0,
        todo.deleted ? 1 : 0,
      ],
    );
  }

  async findById(id: TodoId): Promise<Todo | null> {
    const row = this.db
      .query<
        { id: string; title: string; completed: number; deleted: number },
        [string]
      >("SELECT id, title, completed, deleted FROM todos WHERE id = ?")
      .get(id.value);

    if (!row) {
      return null;
    }
    return Todo.reconstitute({
      id: TodoId.fromTrusted(row.id),
      title: row.title,
      completed: row.completed !== 0,
      deleted: row.deleted !== 0,
    });
  }

  async list(): Promise<readonly Todo[]> {
    const rows = this.db
      .query<
        { id: string; title: string; completed: number; deleted: number },
        []
      >(
        `SELECT id, title, completed, deleted FROM todos
         WHERE deleted = 0
         ORDER BY id ASC`,
      )
      .all();

    return rows.map((row) =>
      Todo.reconstitute({
        id: TodoId.fromTrusted(row.id),
        title: row.title,
        completed: row.completed !== 0,
        deleted: row.deleted !== 0,
      }),
    );
  }

  /** Releases the handle; use in tests or when tearing down a request-scoped client. */
  close(): void {
    this.db.close();
  }
}
