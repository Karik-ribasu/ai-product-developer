import type { AppTheme } from "@/design-system/build-app-theme";

declare module "styled-components" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- merges AppTheme into DefaultTheme
  export interface DefaultTheme extends AppTheme {}
}

export {};
