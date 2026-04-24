import type { PrismaClient } from "@prisma/client";

import type { TodoRepository } from "@/application/ports/todo-repository";
import type { Todo } from "@/domain/todo";
import { Todo as TodoEntity } from "@/domain/todo";

export class PrismaTodoRepository implements TodoRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async insert(todo: Todo): Promise<void> {
    await this.prisma.todo.create({
      data: {
        id: todo.id,
        content: todo.content,
        completed: todo.completed,
        createdAt: todo.createdAt,
        updatedAt: todo.updatedAt,
      },
    });
  }

  async findAll(): Promise<Todo[]> {
    const rows = await this.prisma.todo.findMany({
      orderBy: { createdAt: "asc" },
    });
    return rows.map((row) =>
      TodoEntity.rehydrate({
        id: row.id,
        content: row.content,
        completed: row.completed,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      }),
    );
  }

  async findById(id: string): Promise<Todo | null> {
    const row = await this.prisma.todo.findUnique({ where: { id } });
    if (!row) {
      return null;
    }
    return TodoEntity.rehydrate({
      id: row.id,
      content: row.content,
      completed: row.completed,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  async update(todo: Todo): Promise<void> {
    const result = await this.prisma.todo.updateMany({
      where: { id: todo.id },
      data: {
        content: todo.content,
        completed: todo.completed,
        updatedAt: todo.updatedAt,
      },
    });
    if (result.count === 0) {
      throw new Error(`Failed to update todo (missing id): ${todo.id}`);
    }
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await this.prisma.todo.deleteMany({ where: { id } });
    return result.count > 0;
  }
}
