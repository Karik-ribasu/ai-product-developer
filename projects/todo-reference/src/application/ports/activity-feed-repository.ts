import type { ActivityFeedItem } from "@/domain/activity-feed-item";

export interface ActivityFeedRepository {
  /** Chronological order (oldest first) — matches legacy `activity-feed.json` for stable API/UI baselines. */
  findAllOrderedByOccurredAtAsc(): Promise<ActivityFeedItem[]>;
}
