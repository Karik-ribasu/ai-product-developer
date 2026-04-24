import { createDb } from "@/infrastructure/prisma/create-db";
import { createRepositories, type Repositories } from "@/infrastructure/prisma/repositories-factory";

export async function withRepositories<T>(
  env: NodeJS.ProcessEnv,
  fn: (repos: Repositories) => Promise<T>,
): Promise<T> {
  const prisma = createDb(env);
  try {
    return await fn(createRepositories(prisma));
  } finally {
    await prisma.$disconnect();
  }
}
