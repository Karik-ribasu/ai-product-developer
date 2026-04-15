/**
 * Breakpoints aligned with `tasks/.../artifacts/ui_spec.json` (767/768, 1279/1280).
 */
export const breakpoints = {
  mobileMaxPx: 767,
  tabletMinPx: 768,
  tabletMaxPx: 1279,
  desktopMinPx: 1280,
} as const;

export const media = {
  tabletUp: `@media (min-width: ${breakpoints.tabletMinPx}px)`,
  desktopUp: `@media (min-width: ${breakpoints.desktopMinPx}px)`,
  mobileOnly: `@media (max-width: ${breakpoints.mobileMaxPx}px)`,
} as const;
