"use client";

import { useServerInsertedHTML } from "next/navigation";
import { useState } from "react";
import { createGlobalStyle, ServerStyleSheet, StyleSheetManager, ThemeProvider } from "styled-components";

import { theme } from "./theme";

type StyledRegistryProps = {
  children: React.ReactNode;
};

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 1.5rem;
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  main {
    max-width: 48rem;
    margin: 0 auto;
  }
`;

/**
 * Next.js App Router + styled-components v6: collect SSR styles and avoid
 * hydration class/order mismatches (relevant on Windows + strict hydration).
 */
export function StyledRegistry({ children }: StyledRegistryProps) {
  const [styledSheet] = useState(() => new ServerStyleSheet());

  useServerInsertedHTML(() => {
    const elements = styledSheet.getStyleElement();
    styledSheet.instance.clearTag();
    return <>{elements}</>;
  });

  if (typeof window !== "undefined") {
    return (
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        {children}
      </ThemeProvider>
    );
  }

  return (
    <StyleSheetManager sheet={styledSheet.instance}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        {children}
      </ThemeProvider>
    </StyleSheetManager>
  );
}
