"use client";

import styled from "styled-components";

import { media } from "@/design-system/breakpoints";

const Row = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: ${({ theme }) => theme.space.space3};
  flex-wrap: wrap;

  ${media.tabletUp} {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const CtaSlot = styled.div`
  order: 1;
  width: 100%;
  ${media.tabletUp} {
    width: auto;
    order: 1;
  }
`;

const FilterSlot = styled.div`
  order: 2;
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space.space2};
  width: 100%;
  overflow-x: auto;
  padding-bottom: 2px;

  ${media.tabletUp} {
    width: auto;
    flex: 1;
    justify-content: flex-end;
  }
`;

export type ToolbarClusterProps = {
  primaryAction: React.ReactNode;
  filters: React.ReactNode;
};

export function ToolbarCluster({ primaryAction, filters }: ToolbarClusterProps) {
  return (
    <Row data-testid="toolbar-cluster">
      <CtaSlot>{primaryAction}</CtaSlot>
      <FilterSlot>{filters}</FilterSlot>
    </Row>
  );
}
