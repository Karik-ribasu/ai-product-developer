import type { AppTheme } from "./theme";

declare module "styled-components" {
  // `interface extends` is required for styled-components module augmentation.
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- merges AppTheme into DefaultTheme
  export interface DefaultTheme extends AppTheme {}
}

export {};
