import { PrismaClient } from "@prisma/client";

function requireDatabaseUrl(): string {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    throw new Error("DATABASE_URL is required for integration database helpers");
  }
  return url;
}

export async function deleteAllTodos(): Promise<void> {
  const prisma = new PrismaClient({
    datasources: { db: { url: requireDatabaseUrl() } },
  });
  try {
    await prisma.todo.deleteMany();
  } finally {
    await prisma.$disconnect();
  }
}
