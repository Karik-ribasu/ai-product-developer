import { PrismaClient } from "@prisma/client";

/**
 * Factory for a PrismaClient scoped to the given environment (singleton policy: no mutable globals).
 */
export function createDb(env: NodeJS.ProcessEnv): PrismaClient {
  const url = env.DATABASE_URL?.trim();
  if (!url) {
    throw new Error("DATABASE_URL is required for PostgreSQL persistence");
  }
  return new PrismaClient({
    datasources: {
      db: { url },
    },
  });
}
