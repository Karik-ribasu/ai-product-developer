import designSystem from "./design-system.json";

export type DesignSystemJson = typeof designSystem;

export type TypographyStyle = {
  fontFamily: string;
  fontSize: string;
  lineHeight: string;
  fontWeight: string;
  letterSpacing?: string;
};

/** CamelCase token id (e.g. `bg-app` → `bgApp`). */
export function tokenIdToCamelCase(id: string): string {
  return id.split("-").reduce((acc, part, i) => {
    if (i === 0) {
      return part;
    }
    return acc + part.charAt(0).toUpperCase() + part.slice(1);
  }, "");
}

function extractHex(valueRule: string): string | undefined {
  const m = valueRule.match(/#([0-9A-Fa-f]{6})/);
  return m ? m[0] : undefined;
}

function extractPx(valueRule: string): string | undefined {
  const m = valueRule.match(/(\d+)px/);
  return m ? `${m[1]}px` : undefined;
}

function extractRadius(valueRule: string): string | undefined {
  if (valueRule.includes("9999")) {
    return "9999px";
  }
  return extractPx(valueRule);
}

function extractShadow(valueRule: string): string {
  if (valueRule.trim() === "none") {
    return "none";
  }
  return valueRule.trim();
}

export function parseTypographyRole(valueRule: string, sans: string): TypographyStyle {
  const size = valueRule.match(/size\s+(\d+)/)?.[1];
  const lh = valueRule.match(/lh\s+(\d+)/)?.[1];
  const weight = valueRule.match(/weight\s+(\d+)/)?.[1];
  const tracking = valueRule.match(/tracking\s+([^\s/]+)/)?.[1];
  return {
    fontFamily: sans,
    fontSize: `${size ?? "16"}px`,
    lineHeight: `${lh ?? "24"}px`,
    fontWeight: weight ?? "400",
    letterSpacing: tracking,
  };
}

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const r = Number.parseInt(h.slice(0, 2), 16);
  const g = Number.parseInt(h.slice(2, 4), 16);
  const b = Number.parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function errorBannerSurfaces(errorHex: string): { bg: string; border: string } {
  return {
    bg: hexToRgba(errorHex, 0.12),
    border: hexToRgba(errorHex, 0.45),
  };
}

export function buildAppTheme(ds: DesignSystemJson) {
  const colors: Record<string, string> = {};
  const space: Record<string, string> = {};
  const radiusTokens: Record<string, string> = {};
  const shadowTokens: Record<string, string> = {};
  const typography: Record<string, TypographyStyle> = {};

  const sans = ds.typography.font_families.sans;

  for (const row of ds.token_table) {
    const key = tokenIdToCamelCase(row.name);
    if (row.group === "color") {
      const hex = extractHex(row.value_rule);
      if (hex) {
        colors[key] = hex;
      }
    } else if (row.group === "space") {
      const px = extractPx(row.value_rule);
      if (px) {
        space[key] = px;
      }
    } else if (row.group === "radius") {
      const r = extractRadius(row.value_rule);
      if (r) {
        radiusTokens[key] = r;
      }
    } else if (row.group === "shadow") {
      shadowTokens[key] = extractShadow(row.value_rule);
    } else if (row.group === "type") {
      typography[key] = parseTypographyRole(row.value_rule, sans);
    }
  }

  const bgApp = colors.bgApp;
  const semanticError = colors.semanticError;
  if (!bgApp) {
    throw new Error("design_system.json missing color bg-app");
  }
  if (!semanticError) {
    throw new Error("design_system.json missing color semantic-error");
  }

  const scrimOverlay = hexToRgba(bgApp, 0.6);
  const errorSurfaces = errorBannerSurfaces(semanticError);

  const typeBody = typography.typeBody ?? parseTypographyRole("size 16 / lh 24 / weight 400", sans);
  const typeCaption = typography.typeCaption ?? parseTypographyRole("size 12 / lh 16 / weight 400", sans);
  const typeLabel = typography.typeLabel ?? parseTypographyRole("size 14 / lh 20 / weight 500", sans);
  const typeTitle = typography.typeTitle ?? parseTypographyRole("size 22 / lh 28 / weight 600", sans);
  const typeDisplay =
    typography.typeDisplay ?? parseTypographyRole("size 32 / lh 40 / weight 600 / tracking -0.01em", sans);

  const mergedColors: Record<string, string> = {
    ...colors,
    background: colors.bgApp,
    surface: colors.bgElevated,
    surfaceHover: colors.bgSubtle,
    text: colors.fgDefault,
    textMuted: colors.fgMuted,
    primary: colors.accentPrimary,
    primaryHover: colors.accentPrimaryHover,
    danger: colors.semanticError,
    dangerHover: colors.semanticError,
    border: colors.borderSubtle,
    focusRing: colors.accentPrimary,
    bannerErrorBg: errorSurfaces.bg,
    bannerErrorBorder: errorSurfaces.border,
    success: colors.semanticSuccess,
  };

  const mergedSpacing = {
    xs: space.space1 ?? "4px",
    sm: space.space2 ?? "8px",
    md: space.space4 ?? "16px",
    lg: space.space5 ?? "24px",
    xl: space.space6 ?? "32px",
  };

  const mergedRadii = {
    sm: radiusTokens.radiusSm ?? "6px",
    md: radiusTokens.radiusMd ?? "8px",
    pill: radiusTokens.radiusPill ?? "9999px",
  };

  const mergedFontSizes = {
    xs: typeCaption.fontSize,
    sm: typeLabel.fontSize,
    md: typeBody.fontSize,
    lg: typeTitle.fontSize,
    xl: typeDisplay.fontSize,
  };

  const mergedShadows = {
    sm: shadowTokens.shadowSm ?? "none",
    md: shadowTokens.shadowSm ?? "none",
    focusRing:
      shadowTokens.shadowFocusRing ??
      `0 0 0 3px ${hexToRgba(colors.accentPrimary ?? "#3B82F6", 0.35)}`,
  };

  return {
    fontFamilies: ds.typography.font_families,
    colors: mergedColors,
    space,
    radiusTokens,
    shadowTokens,
    radii: mergedRadii,
    shadows: mergedShadows,
    typography: {
      typeDisplay,
      typeTitle,
      typeBody,
      typeLabel,
      typeCaption,
    },
    spacing: mergedSpacing,
    fontSizes: mergedFontSizes,
    scrimOverlay,
  };
}

export type AppTheme = ReturnType<typeof buildAppTheme>;

export const appTheme: AppTheme = buildAppTheme(designSystem);
