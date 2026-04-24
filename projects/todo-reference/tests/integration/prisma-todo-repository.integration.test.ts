import { randomUUID } from "node:crypto";
import { PrismaClient } from "@prisma/client";
import { describe, expect, it } from "vitest";

import { Todo } from "@/domain/todo";
import { PrismaTodoRepository } from "@/infrastructure/prisma/prisma-todo-repository";

describe("prisma todo repository (integration)", () => {
  it("throws when updating a missing row", async () => {
    const url = process.env.DATABASE_URL?.trim();
    if (!url) {
      throw new Error("DATABASE_URL is required");
    }
    const prisma = new PrismaClient({ datasources: { db: { url } } });
    const repo = new PrismaTodoRepository(prisma);
    const orphan = Todo.rehydrate({
      id: randomUUID(),
      content: "ghost",
      completed: false,
      createdAt: new Date("2026-04-18T12:00:00.000Z"),
      updatedAt: new Date("2026-04-18T12:00:00.000Z"),
    });
    await expect(repo.update(orphan)).rejects.toThrow(/Failed to update todo/);
    await prisma.$disconnect();
  });
});
