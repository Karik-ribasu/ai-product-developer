"use client";

import styled from "styled-components";

import { media } from "@/design-system/breakpoints";

const Main = styled.main`
  flex: 1;
  min-width: 0;
  background: ${({ theme }) => theme.colors.bgApp};
  padding: ${({ theme }) => `${theme.space.space4} ${theme.space.space4}`};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.space5};

  ${media.tabletUp} {
    padding: ${({ theme }) => `${theme.space.space6} ${theme.space.space6}`};
    min-width: 320px;
  }

  ${media.desktopUp} {
    min-width: 480px;
  }
`;

export type SurfaceMainColumnProps = {
  children: React.ReactNode;
};

export function SurfaceMainColumn({ children }: SurfaceMainColumnProps) {
  return (
    <Main role="main" data-testid="surface-main-column">
      {children}
    </Main>
  );
}
