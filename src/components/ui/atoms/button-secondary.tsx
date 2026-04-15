"use client";

import styled from "styled-components";

const Btn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space.space2};
  min-height: 40px;
  padding: ${({ theme }) => `${theme.space.space2} ${theme.space.space4}`};
  border-radius: ${({ theme }) => theme.radiusTokens.radiusSm};
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.typeLabel.fontSize};
  line-height: ${({ theme }) => theme.typography.typeLabel.lineHeight};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.fgDefault};
  background: ${({ theme }) => theme.colors.bgSubtle};
  border: 1px solid ${({ theme }) => theme.colors.borderSubtle};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.bgElevated};
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadows.focusRing};
  }
`;

export type ButtonSecondaryProps = {
  children: React.ReactNode;
  onClick?: () => void | Promise<void>;
  disabled?: boolean;
  type?: "button" | "submit";
};

export function ButtonSecondary({ children, onClick, disabled, type = "button" }: ButtonSecondaryProps) {
  return (
    <Btn type={type} onClick={() => void onClick?.()} disabled={disabled}>
      {children}
    </Btn>
  );
}
