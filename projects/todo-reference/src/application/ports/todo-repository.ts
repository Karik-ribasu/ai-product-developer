import type { Todo } from "@/domain/todo";

export interface TodoRepository {
  insert(todo: Todo): Promise<void>;
  findAll(): Promise<Todo[]>;
  findById(id: string): Promise<Todo | null>;
  update(todo: Todo): Promise<void>;
  deleteById(id: string): Promise<boolean>;
}
