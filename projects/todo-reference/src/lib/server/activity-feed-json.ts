import type { ActivityFeedItem } from "@/domain/activity-feed-item";

export type ActivityFeedJsonItem = {
  id: string;
  author: { name: string; handle: string };
  body: string;
  createdAt: string;
  mediaLabel: string | null;
};

export function activityFeedItemToJson(item: ActivityFeedItem): ActivityFeedJsonItem {
  return {
    id: item.id,
    author: { name: item.authorName, handle: item.authorHandle },
    body: item.body,
    createdAt: item.occurredAt.toISOString(),
    mediaLabel: item.mediaLabel,
  };
}

export function activityFeedDocument(items: ActivityFeedItem[]): {
  version: 1;
  items: ActivityFeedJsonItem[];
} {
  return { version: 1, items: items.map(activityFeedItemToJson) };
}
