export const tokens = {
  colors: {
    background: "#0c1117",
    surface: "#151c26",
    surfaceHover: "#1c2633",
    text: "#e8eef5",
    textMuted: "#8b9cb0",
    primary: "#3d8bfd",
    primaryHover: "#2f7ae8",
    danger: "#f14c4c",
    dangerHover: "#d93d3d",
    border: "#2a3544",
    focusRing: "#6eb3ff",
    success: "#3ecf8e",
    bannerErrorBg: "#2a1518",
    bannerErrorBorder: "#5c2a32",
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
  },
  radii: {
    sm: "6px",
    md: "10px",
    pill: "999px",
  },
  fontSizes: {
    xs: "0.75rem",
    sm: "0.875rem",
    md: "1rem",
    lg: "1.25rem",
    xl: "1.5rem",
  },
  shadows: {
    sm: "0 1px 2px rgba(0, 0, 0, 0.35)",
    md: "0 4px 14px rgba(0, 0, 0, 0.35)",
  },
} as const;

export type AppTheme = typeof tokens;

export const theme: AppTheme = tokens;
