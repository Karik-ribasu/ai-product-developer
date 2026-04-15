"use client";

import styled from "styled-components";

import { ButtonSecondary } from "@/components/ui/atoms/button-secondary";

const Root = styled.div`
  padding: ${({ theme }) => theme.space.space6};
  border-radius: ${({ theme }) => theme.radiusTokens.radiusMd};
  border: 1px dashed ${({ theme }) => theme.colors.borderSubtle};
  color: ${({ theme }) => theme.colors.fgMuted};
  font-size: ${({ theme }) => theme.typography.typeBody.fontSize};
  line-height: ${({ theme }) => theme.typography.typeBody.lineHeight};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.space3};
  align-items: flex-start;
`;

export type FilteredEmptyStateProps = {
  onClearFilters: () => void;
};

export function FilteredEmptyState({ onClearFilters }: FilteredEmptyStateProps) {
  return (
    <Root data-testid="filtered-empty-state">
      No tasks match the current filters.
      <ButtonSecondary type="button" onClick={() => onClearFilters()}>
        Show all tasks
      </ButtonSecondary>
    </Root>
  );
}
