"use client";

import { useServerInsertedHTML } from "next/navigation";
import { useState } from "react";
import { createGlobalStyle, ServerStyleSheet, StyleSheetManager, ThemeProvider } from "styled-components";

import { theme } from "./theme";

type StyledRegistryProps = {
  children: React.ReactNode;
};

const GlobalStyle = createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
    min-height: 100vh;
    background: ${({ theme }) => theme.colors.bgApp};
    color: ${({ theme }) => theme.colors.fgDefault};
    font-family: ${({ theme }) => theme.fontFamilies.sans};
  }

  main {
    max-width: none;
    margin: 0;
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
