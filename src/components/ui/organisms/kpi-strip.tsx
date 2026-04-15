"use client";

import styled from "styled-components";

import type { DashboardKpiVm } from "@/application/dashboard/compute-dashboard-kpis";
import { media } from "@/design-system/breakpoints";

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.space.space4};
  padding: ${({ theme }) => `${theme.space.space4} 0`};

  ${media.tabletUp} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  ${media.desktopUp} {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`;

const Card = styled.div`
  padding: ${({ theme }) => theme.space.space4};
  border-radius: ${({ theme }) => theme.radiusTokens.radiusMd};
  border: 1px solid ${({ theme }) => theme.colors.borderSubtle};
  background: ${({ theme }) => theme.colors.bgElevated};
`;

const Value = styled.div`
  font-size: ${({ theme }) => theme.typography.typeTitle.fontSize};
  line-height: ${({ theme }) => theme.typography.typeTitle.lineHeight};
  font-weight: ${({ theme }) => theme.typography.typeTitle.fontWeight};
  color: ${({ theme }) => theme.colors.fgDefault};
`;

const Label = styled.div`
  margin-top: ${({ theme }) => theme.space.space2};
  font-size: ${({ theme }) => theme.typography.typeCaption.fontSize};
  line-height: ${({ theme }) => theme.typography.typeCaption.lineHeight};
  color: ${({ theme }) => theme.colors.fgMuted};
`;

export type KpiStripProps = {
  kpis: DashboardKpiVm;
};

export function KpiStrip({ kpis }: KpiStripProps) {
  return (
    <Grid data-testid="kpi-strip" aria-label="Summary statistics">
      <Card>
        <Value>{kpis.total}</Value>
        <Label>Total tasks</Label>
      </Card>
      <Card>
        <Value>{kpis.open}</Value>
        <Label>Open</Label>
      </Card>
      <Card>
        <Value>{kpis.done}</Value>
        <Label>Done</Label>
      </Card>
      <Card>
        <Value>{kpis.total === 0 ? "—" : `${Math.round((kpis.done / kpis.total) * 100)}%`}</Value>
        <Label>Completion</Label>
      </Card>
    </Grid>
  );
}
