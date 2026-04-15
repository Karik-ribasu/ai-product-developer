import { describe, expect, test } from "bun:test";

import designSystem from "@/design-system/design-system.json";
import {
  buildAppTheme,
  parseTypographyRole,
  tokenIdToCamelCase,
  type DesignSystemJson,
} from "@/design-system/build-app-theme";

describe("tokenIdToCamelCase", () => {
  test("maps hyphenated ids", () => {
    expect(tokenIdToCamelCase("bg-app")).toBe("bgApp");
    expect(tokenIdToCamelCase("space-4")).toBe("space4");
    expect(tokenIdToCamelCase("shadow-focus-ring")).toBe("shadowFocusRing");
  });
});

describe("parseTypographyRole", () => {
  test("parses standard role string", () => {
    const t = parseTypographyRole("size 22 / lh 28 / weight 600", "sans");
    expect(t.fontSize).toBe("22px");
    expect(t.lineHeight).toBe("28px");
    expect(t.fontWeight).toBe("600");
    expect(t.fontFamily).toBe("sans");
  });

  test("parses optional tracking", () => {
    const t = parseTypographyRole("size 32 / lh 40 / weight 600 / tracking -0.01em", "sans");
    expect(t.letterSpacing).toBe("-0.01em");
  });
});

describe("buildAppTheme", () => {
  test("builds theme from published design_system.json", () => {
    const t = buildAppTheme(designSystem as DesignSystemJson);
    expect(t.colors.bgApp).toMatch(/^#/);
    expect(t.colors.accentPrimary).toMatch(/^#/);
    expect(t.space.space4).toBe("16px");
    expect(t.radiusTokens.radiusMd).toBe("8px");
    expect(t.shadowTokens.shadowFocusRing).toContain("rgba");
    expect(t.typography.typeTitle.fontSize).toBe("22px");
    expect(t.scrimOverlay.startsWith("rgba(")).toBe(true);
    expect(t.colors.background).toBe(t.colors.bgApp);
  });

  test("throws when bg-app token missing", () => {
    const bad: DesignSystemJson = {
      ...designSystem,
      token_table: designSystem.token_table.filter((r) => r.name !== "bg-app"),
    } as DesignSystemJson;
    expect(() => buildAppTheme(bad)).toThrow(/bg-app/);
  });

  test("uses focus-ring shadow fallback when token row missing", () => {
    const clone = JSON.parse(JSON.stringify(designSystem)) as DesignSystemJson;
    clone.token_table = clone.token_table.filter((r) => r.name !== "shadow-focus-ring");
    const t = buildAppTheme(clone);
    expect(t.shadows.focusRing).toContain("rgba");
  });

  test("focus ring fallback uses default accent hex when accent-primary missing", () => {
    const clone = JSON.parse(JSON.stringify(designSystem)) as DesignSystemJson;
    clone.token_table = clone.token_table.filter(
      (r) => r.name !== "shadow-focus-ring" && r.name !== "accent-primary",
    );
    const t = buildAppTheme(clone);
    expect(t.shadows.focusRing).toContain("rgba");
  });

  test("uses typography fallbacks when type tokens missing", () => {
    const clone = JSON.parse(JSON.stringify(designSystem)) as DesignSystemJson;
    clone.token_table = clone.token_table.filter((r) => r.group !== "type");
    const t = buildAppTheme(clone);
    expect(t.typography.typeTitle.fontSize).toBe("22px");
  });
});
