"use client";

import styled from "styled-components";

import type { DashboardStatusTone } from "@/application/dashboard/dashboard-task-row.vm";

const Root = styled.span<{ $tone: DashboardStatusTone }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.space1};
  padding: ${({ theme }) => theme.space.space1} ${({ theme }) => theme.space.space2};
  border-radius: ${({ theme }) => theme.radiusTokens.radiusPill};
  font-size: ${({ theme }) => theme.typography.typeCaption.fontSize};
  line-height: ${({ theme }) => theme.typography.typeCaption.lineHeight};
  font-weight: ${({ theme }) => theme.typography.typeCaption.fontWeight};
  color: ${({ theme, $tone }) => ($tone === "neutral" ? theme.colors.fgMuted : theme.colors.fgDefault)};
  background: ${({ theme, $tone }) => {
    if ($tone === "success") {
      return theme.colors.semanticSuccess;
    }
    if ($tone === "warning") {
      return theme.colors.semanticWarning;
    }
    if ($tone === "error") {
      return theme.colors.semanticError;
    }
    return theme.colors.bgSubtle;
  }};
`;

const Dot = styled.span<{ $tone: DashboardStatusTone }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ theme, $tone }) => {
    if ($tone === "neutral") {
      return theme.colors.fgMuted;
    }
    return theme.colors.fgDefault;
  }};
`;

export type BadgeStatusProps = {
  tone: DashboardStatusTone;
  label: string;
};

export function BadgeStatus({ tone, label }: BadgeStatusProps) {
  return (
    <Root $tone={tone} aria-label={label}>
      <Dot $tone={tone} aria-hidden />
      {label}
    </Root>
  );
}
