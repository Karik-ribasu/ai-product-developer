import { readFile } from "node:fs/promises";

import { NextResponse } from "next/server";

import { makeListActivityFeedItems } from "@/application/activity-feed-use-cases";
import { activityFeedDocument } from "@/lib/server/activity-feed-json";
import { withRepositories } from "@/lib/server/with-repositories";

/**
 * Test-only escape hatch: when `NODE_ENV=test` and `ACTIVITY_FEED_FIXTURE_PATH` is set,
 * serve the JSON fixture directly (used by integration tests for I/O failure paths).
 * Normal dev/prod/test runs without that env var load feed items from PostgreSQL.
 */
async function readFixtureWhenGatedForTests(): Promise<NextResponse | null> {
  const override =
    process.env.NODE_ENV === "test"
      ? process.env.ACTIVITY_FEED_FIXTURE_PATH?.trim()
      : undefined;
  if (!override) {
    return null;
  }
  try {
    const raw = await readFile(override, "utf8");
    return new NextResponse(raw, {
      status: 200,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  } catch {
    return NextResponse.json({ error: "feed_unavailable" }, { status: 500 });
  }
}

export async function GET(): Promise<NextResponse> {
  const fixtureResponse = await readFixtureWhenGatedForTests();
  if (fixtureResponse) {
    return fixtureResponse;
  }

  try {
    const doc = await withRepositories(process.env, async ({ activityFeed }) => {
      const list = makeListActivityFeedItems(activityFeed);
      return activityFeedDocument(await list());
    });
    return NextResponse.json(doc);
  } catch {
    return NextResponse.json({ error: "feed_unavailable" }, { status: 500 });
  }
}
