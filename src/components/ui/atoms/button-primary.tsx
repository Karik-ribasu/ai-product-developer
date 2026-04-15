"use client";

import styled from "styled-components";

import { Spinner } from "@/components/ui/atoms/spinner";
import { media } from "@/design-system/breakpoints";

const focusRing = (p: { theme: { shadows: { focusRing: string } } }) => `
  &:focus-visible {
    outline: none;
    box-shadow: ${p.theme.shadows.focusRing};
  }
`;

const Btn = styled.button<{ $size: "sm" | "md" }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space.space2};
  width: 100%;
  min-height: ${({ $size }) => ($size === "md" ? "44px" : "32px")};
  min-width: ${({ $size }) => ($size === "md" ? "120px" : "auto")};
  padding: ${({ theme, $size }) =>
    $size === "md"
      ? `${theme.space.space3} ${theme.space.space4}`
      : `${theme.space.space2} ${theme.space.space3}`};
  border-radius: ${({ theme }) => theme.radiusTokens.radiusSm};
  border: none;
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.typeLabel.fontSize};
  line-height: ${({ theme }) => theme.typography.typeLabel.lineHeight};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.fgDefault};
  background: ${({ theme }) => theme.colors.accentPrimary};

  ${media.tabletUp} {
    width: auto;
    min-width: 120px;
  }

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.accentPrimaryHover};
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  ${(p) => focusRing(p)}
`;

export type ButtonPrimaryProps = {
  children: React.ReactNode;
  onClick?: () => void | Promise<void>;
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit";
  "aria-busy"?: boolean;
  "data-testid"?: string;
  size?: "sm" | "md";
};

export function ButtonPrimary({
  children,
  onClick,
  disabled,
  loading,
  type = "button",
  "aria-busy": ariaBusy,
  "data-testid": dataTestId,
  size = "md",
}: ButtonPrimaryProps) {
  const busy = Boolean(loading);
  return (
    <Btn
      type={type}
      onClick={() => void onClick?.()}
      disabled={disabled || busy}
      aria-busy={ariaBusy !== undefined ? ariaBusy : busy ? true : undefined}
      data-testid={dataTestId}
      $size={size}
    >
      {busy ? <Spinner size="sm" label="Loading" /> : null}
      {children}
    </Btn>
  );
}
