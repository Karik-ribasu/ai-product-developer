import { describe, expect, test } from "bun:test";

import { breakpoints, media } from "@/design-system/breakpoints";

describe("breakpoints", () => {
  test("exports stable media queries", () => {
    expect(breakpoints.tabletMinPx).toBe(768);
    expect(breakpoints.desktopMinPx).toBe(1280);
    expect(media.tabletUp).toContain("768");
    expect(media.desktopUp).toContain("1280");
  });
});
