import type { TodoRepository } from "@/application/todo/todo-repository";
import type { Todo } from "@/domain/todo";
import type { TodoId } from "@/domain/todo";

/** In-memory port fake for application-layer unit tests (no file DB). */
export class FakeTodoRepository implements TodoRepository {
  private readonly byId = new Map<string, Todo>();

  async save(todo: Todo): Promise<void> {
    this.byId.set(todo.id.value, todo);
  }

  async findById(id: TodoId): Promise<Todo | null> {
    return this.byId.get(id.value) ?? null;
  }

  async list(): Promise<readonly Todo[]> {
    return [...this.byId.values()]
      .filter((t) => !t.deleted)
      .sort((a, b) => a.id.value.localeCompare(b.id.value));
  }
}
