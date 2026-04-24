import { describe, expect, it } from "vitest";

import { ActivityFeedItem } from "@/domain/activity-feed-item";

describe("ActivityFeedItem", () => {
  it("rehydrates fields", () => {
    const item = ActivityFeedItem.rehydrate({
      id: "feed-1",
      authorName: "Alex",
      authorHandle: "@alex",
      body: "hello",
      occurredAt: new Date("2026-04-18T12:00:00.000Z"),
      mediaLabel: "Note",
    });
    expect(item.id).toBe("feed-1");
    expect(item.authorName).toBe("Alex");
    expect(item.authorHandle).toBe("@alex");
    expect(item.body).toBe("hello");
    expect(item.occurredAt.toISOString()).toBe("2026-04-18T12:00:00.000Z");
    expect(item.mediaLabel).toBe("Note");
  });
});
