import { describe, expect, it } from "vitest";

import { makeListActivityFeedItems } from "@/application/activity-feed-use-cases";
import type { ActivityFeedRepository } from "@/application/ports/activity-feed-repository";
import { ActivityFeedItem } from "@/domain/activity-feed-item";

function createFakeActivityFeedRepository(
  items: ActivityFeedItem[],
): ActivityFeedRepository {
  return {
    async findAllOrderedByOccurredAtAsc() {
      return [...items];
    },
  };
}

describe("activity feed use cases", () => {
  it("lists feed items from the repository", async () => {
    const items = [
      ActivityFeedItem.rehydrate({
        id: "1",
        authorName: "A",
        authorHandle: "@a",
        body: "hello",
        occurredAt: new Date("2026-04-18T12:00:00.000Z"),
        mediaLabel: null,
      }),
    ];
    const repo = createFakeActivityFeedRepository(items);
    const list = makeListActivityFeedItems(repo);
    expect(await list()).toEqual(items);
  });
});
