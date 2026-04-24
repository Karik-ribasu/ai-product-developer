import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";

import { GET } from "@/app/api/activity-feed/route";

describe("activity feed route handler", () => {
  const prevFixture = process.env.ACTIVITY_FEED_FIXTURE_PATH;

  afterEach(() => {
    if (prevFixture === undefined) {
      delete process.env.ACTIVITY_FEED_FIXTURE_PATH;
    } else {
      process.env.ACTIVITY_FEED_FIXTURE_PATH = prevFixture;
    }
  });

  it("returns 500 when DATABASE_URL is missing", async () => {
    const prev = process.env.DATABASE_URL;
    delete process.env.DATABASE_URL;
    const res = await GET();
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body).toEqual({ error: "feed_unavailable" });
    process.env.DATABASE_URL = prev;
  });

  it("ignores ACTIVITY_FEED_FIXTURE_PATH outside test NODE_ENV", async () => {
    const prevNode = process.env.NODE_ENV;
    const dir = mkdtempSync(path.join(tmpdir(), "feed-ignored-"));
    const file = path.join(dir, "ignored.json");
    writeFileSync(file, JSON.stringify({ version: 1, items: [] }), "utf8");
    process.env.ACTIVITY_FEED_FIXTURE_PATH = file;
    process.env.NODE_ENV = "development";
    const res = await GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.items)).toBe(true);
    expect(body.items.length).toBeGreaterThan(0);
    process.env.NODE_ENV = prevNode;
  });

  it("returns persisted feed JSON with correct content type", async () => {
    delete process.env.ACTIVITY_FEED_FIXTURE_PATH;
    const res = await GET();
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("application/json");
    const body = await res.json();
    expect(body.version).toBe(1);
    expect(Array.isArray(body.items)).toBe(true);
    expect(body.items.length).toBeGreaterThan(0);
  });

  it("returns 500 when fixture path is unreadable (test-only gate)", async () => {
    process.env.ACTIVITY_FEED_FIXTURE_PATH = path.join(tmpdir(), `missing-feed-${Date.now()}.json`);
    const res = await GET();
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body).toEqual({ error: "feed_unavailable" });
  });

  it("reads custom fixture path when NODE_ENV=test and override is set", async () => {
    const dir = mkdtempSync(path.join(tmpdir(), "feed-fixture-"));
    const file = path.join(dir, "custom.json");
    writeFileSync(file, JSON.stringify({ version: 1, items: [] }), "utf8");
    process.env.ACTIVITY_FEED_FIXTURE_PATH = file;
    const res = await GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.items).toEqual([]);
  });
});
