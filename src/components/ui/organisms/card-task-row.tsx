"use client";

import styled from "styled-components";

import type { DashboardTaskRowVm } from "@/application/dashboard/dashboard-task-row.vm";
import { BadgeStatus } from "@/components/ui/atoms/badge-status";
import { media } from "@/design-system/breakpoints";

const Row = styled.article`
  display: grid;
  grid-template-columns: 40px minmax(0, 1fr) minmax(96px, auto) auto;
  gap: ${({ theme }) => theme.space.space3};
  align-items: center;
  min-height: 72px;
  padding: ${({ theme }) => theme.space.space4};
  border-radius: ${({ theme }) => theme.radiusTokens.radiusMd};
  border: 1px solid ${({ theme }) => theme.colors.borderSubtle};
  background: ${({ theme }) => theme.colors.bgElevated};

  &:hover {
    background: ${({ theme }) => theme.colors.bgSubtle};
  }

  &:focus-within {
    box-shadow: ${({ theme }) => theme.shadows.focusRing};
  }
`;

const Title = styled.div`
  font-size: ${({ theme }) => theme.typography.typeBody.fontSize};
  line-height: ${({ theme }) => theme.typography.typeBody.lineHeight};
  color: ${({ theme }) => theme.colors.fgDefault};
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const Meta = styled.div`
  font-size: ${({ theme }) => theme.typography.typeCaption.fontSize};
  line-height: ${({ theme }) => theme.typography.typeCaption.lineHeight};
  color: ${({ theme }) => theme.colors.fgMuted};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space.space2};
`;

const IconBtn = styled.button`
  width: 44px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radiusTokens.radiusSm};
  border: 1px solid ${({ theme }) => theme.colors.borderSubtle};
  background: ${({ theme }) => theme.colors.bgSubtle};
  color: ${({ theme }) => theme.colors.fgDefault};
  cursor: pointer;

  ${media.tabletUp} {
    width: 40px;
    height: 40px;
  }

  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadows.focusRing};
  }
`;

export type CardTaskRowProps = {
  row: DashboardTaskRowVm;
  onToggleComplete: () => void;
  onDelete: () => void;
  toggleDisabled?: boolean;
  deleteDisabled?: boolean;
};

export function CardTaskRow({
  row,
  onToggleComplete,
  onDelete,
  toggleDisabled,
  deleteDisabled,
}: CardTaskRowProps) {
  return (
    <Row data-testid={`card-task-row-${row.id}`}>
      <BadgeStatus tone={row.statusTone} label={row.statusLabel} />
      <Title>{row.title}</Title>
      <Meta>{row.meta}</Meta>
      <Actions>
        <IconBtn
          type="button"
          aria-label={row.statusTone === "success" ? "Mark as open" : "Mark as done"}
          onClick={() => void onToggleComplete()}
          disabled={toggleDisabled}
        >
          {row.statusTone === "success" ? "↺" : "✓"}
        </IconBtn>
        <IconBtn type="button" aria-label="Delete task" onClick={() => void onDelete()} disabled={deleteDisabled}>
          🗑
        </IconBtn>
      </Actions>
    </Row>
  );
}
