import type { PrismaClient } from "@prisma/client";

import type { ActivityFeedRepository } from "@/application/ports/activity-feed-repository";
import type { TodoRepository } from "@/application/ports/todo-repository";

import { PrismaActivityFeedRepository } from "@/infrastructure/prisma/prisma-activity-feed-repository";
import { PrismaTodoRepository } from "@/infrastructure/prisma/prisma-todo-repository";

export type Repositories = {
  todos: TodoRepository;
  activityFeed: ActivityFeedRepository;
};

export function createRepositories(prisma: PrismaClient): Repositories {
  return {
    todos: new PrismaTodoRepository(prisma),
    activityFeed: new PrismaActivityFeedRepository(prisma),
  };
}
