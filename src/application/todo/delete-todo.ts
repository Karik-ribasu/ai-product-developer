import type { TodoRepository } from "./todo-repository";
import { TodoId, TodoNotFoundError } from "@/domain/todo";

export async function deleteTodo(
  repo: TodoRepository,
  input: { id: string },
): Promise<void> {
  const todoId = TodoId.parse(input.id);
  const existing = await repo.findById(todoId);
  if (!existing) {
    throw new TodoNotFoundError(todoId.value);
  }
  existing.delete();
  await repo.save(existing);
}
