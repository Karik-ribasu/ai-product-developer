import type { Todo } from "@/domain/todo";
import type { TodoId } from "@/domain/todo";

/**
 * Persistence port for the Todo aggregate. Implementations live in infrastructure
 * (e.g. SQLite); this module must not reference drivers or frameworks.
 */
export interface TodoRepository {
  save(todo: Todo): Promise<void>;
  findById(id: TodoId): Promise<Todo | null>;
  /** Active todos only (non-deleted), order undefined unless adapter documents one. */
  list(): Promise<readonly Todo[]>;
}
