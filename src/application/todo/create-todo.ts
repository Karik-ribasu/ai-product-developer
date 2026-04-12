import type { TodoRepository } from "./todo-repository";
import { Todo } from "@/domain/todo";

export async function createTodo(
  repo: TodoRepository,
  input: { title: string },
): Promise<Todo> {
  const todo = Todo.create(input);
  await repo.save(todo);
  return todo;
}
