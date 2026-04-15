"use client";

import styled from "styled-components";

const Btn = styled.button<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.space1};
  padding: ${({ theme }) => `${theme.space.space1} ${theme.space.space3}`};
  border-radius: ${({ theme }) => theme.radiusTokens.radiusPill};
  border: 1px solid transparent;
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.typeLabel.fontSize};
  line-height: ${({ theme }) => theme.typography.typeLabel.lineHeight};
  font-weight: ${({ $active }) => ($active ? 600 : 500)};
  color: ${({ theme }) => theme.colors.fgDefault};
  background: ${({ theme, $active }) => ($active ? theme.colors.accentPrimary : theme.colors.bgSubtle)};
  box-shadow: ${({ theme, $active }) =>
    $active ? `inset 0 0 0 2px ${theme.colors.borderSubtle}` : "none"};

  &:hover:not(:disabled) {
    border-color: ${({ theme, $active }) => (!$active ? theme.colors.borderSubtle : "transparent")};
  }

  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme, $active }) =>
      `${theme.shadows.focusRing}${$active ? `, inset 0 0 0 2px ${theme.colors.borderSubtle}` : ""}`};
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

const Check = styled.span`
  font-size: 12px;
  line-height: 1;
`;

export type ChipFilterProps = {
  label: string;
  pressed: boolean;
  onToggle: () => void;
  disabled?: boolean;
  "data-testid"?: string;
};

export function ChipFilter({ label, pressed, onToggle, disabled, "data-testid": dataTestId }: ChipFilterProps) {
  return (
    <Btn
      type="button"
      aria-pressed={pressed}
      aria-label={label}
      $active={pressed}
      onClick={() => onToggle()}
      disabled={disabled}
      data-testid={dataTestId ?? `chip-filter-${label.toLowerCase().replace(/\s+/g, "-")}`}
    >
      {pressed ? (
        <Check aria-hidden>
          ✓
        </Check>
      ) : null}
      {label}
    </Btn>
  );
}
