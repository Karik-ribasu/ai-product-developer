import type { TodoRepository } from "./todo-repository";
import type { Todo } from "@/domain/todo";

export async function listTodos(repo: TodoRepository): Promise<readonly Todo[]> {
  return repo.list();
}
