import type { ActivityFeedRepository } from "@/application/ports/activity-feed-repository";
import type { ActivityFeedItem } from "@/domain/activity-feed-item";

export function makeListActivityFeedItems(repo: ActivityFeedRepository) {
  return async function listActivityFeedItems(): Promise<ActivityFeedItem[]> {
    return repo.findAllOrderedByOccurredAtAsc();
  };
}
