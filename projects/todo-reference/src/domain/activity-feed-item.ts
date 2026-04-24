export class ActivityFeedItem {
  private constructor(
    readonly id: string,
    readonly authorName: string,
    readonly authorHandle: string,
    readonly body: string,
    readonly occurredAt: Date,
    readonly mediaLabel: string | null,
  ) {}

  static rehydrate(input: {
    id: string;
    authorName: string;
    authorHandle: string;
    body: string;
    occurredAt: Date;
    mediaLabel: string | null;
  }): ActivityFeedItem {
    return new ActivityFeedItem(
      input.id,
      input.authorName,
      input.authorHandle,
      input.body,
      input.occurredAt,
      input.mediaLabel,
    );
  }
}
