import type { PrismaClient } from "@prisma/client";

import type { ActivityFeedRepository } from "@/application/ports/activity-feed-repository";
import { ActivityFeedItem } from "@/domain/activity-feed-item";

export class PrismaActivityFeedRepository implements ActivityFeedRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAllOrderedByOccurredAtAsc(): Promise<ActivityFeedItem[]> {
    const rows = await this.prisma.activityFeedItem.findMany({
      orderBy: { occurredAt: "asc" },
    });
    return rows.map((row) =>
      ActivityFeedItem.rehydrate({
        id: row.id,
        authorName: row.authorName,
        authorHandle: row.authorHandle,
        body: row.body,
        occurredAt: row.occurredAt,
        mediaLabel: row.mediaLabel,
      }),
    );
  }
}
