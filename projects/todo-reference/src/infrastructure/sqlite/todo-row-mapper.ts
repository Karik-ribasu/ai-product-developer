import { Todo } from "@/domain/todo";

export type TodoRow = {
  id: string;
  content: string;
  completed: number;
  created_at: string;
  updated_at: string;
};

export function todoRowToDomain(row: TodoRow): Todo {
  return Todo.rehydrate({
    id: row.id,
    content: row.content,
    completed: row.completed === 1,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  });
}

export function todoDomainToRow(todo: Todo): TodoRow {
  return {
    id: todo.id,
    content: todo.content,
    completed: todo.completed ? 1 : 0,
    created_at: todo.createdAt.toISOString(),
    updated_at: todo.updatedAt.toISOString(),
  };
}
