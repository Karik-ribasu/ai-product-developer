import type { TodoRepository } from "./todo-repository";
import { TodoId, TodoNotFoundError, type Todo } from "@/domain/todo";

export async function updateTodoText(
  repo: TodoRepository,
  input: { id: string; title: string },
): Promise<Todo> {
  const todoId = TodoId.parse(input.id);
  const existing = await repo.findById(todoId);
  if (!existing) {
    throw new TodoNotFoundError(todoId.value);
  }
  existing.updateTitle(input.title);
  await repo.save(existing);
  return existing;
}
