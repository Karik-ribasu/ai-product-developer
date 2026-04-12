import styled from "styled-components";

type Variant = "primary" | "secondary" | "danger" | "ghost";

export const Button = styled.button<{ $variant?: Variant; $compact?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 600;
  cursor: pointer;
  border: 1px solid transparent;
  padding: ${({ $compact, theme }) =>
    $compact ? `${theme.spacing.xs} ${theme.spacing.sm}` : `${theme.spacing.sm} ${theme.spacing.md}`};
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease, opacity 0.15s ease;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.focusRing};
    outline-offset: 2px;
  }

  ${({ $variant = "primary", theme }) =>
    $variant === "primary" &&
    `
    background: ${theme.colors.primary};
    color: #fff;
    &:hover:not(:disabled) {
      background: ${theme.colors.primaryHover};
    }
  `}

  ${({ $variant, theme }) =>
    $variant === "secondary" &&
    `
    background: ${theme.colors.surface};
    color: ${theme.colors.text};
    border-color: ${theme.colors.border};
    &:hover:not(:disabled) {
      background: ${theme.colors.surfaceHover};
    }
  `}

  ${({ $variant, theme }) =>
    $variant === "danger" &&
    `
    background: ${theme.colors.danger};
    color: #fff;
    &:hover:not(:disabled) {
      background: ${theme.colors.dangerHover};
    }
  `}

  ${({ $variant, theme }) =>
    $variant === "ghost" &&
    `
    background: transparent;
    color: ${theme.colors.textMuted};
    &:hover:not(:disabled) {
      color: ${theme.colors.text};
      background: ${theme.colors.surface};
    }
  `}
`;
