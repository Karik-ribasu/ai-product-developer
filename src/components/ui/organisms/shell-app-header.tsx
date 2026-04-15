"use client";

import styled from "styled-components";

import { media } from "@/design-system/breakpoints";

const Banner = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space.space4};
  padding: ${({ theme }) => `${theme.space.space4} ${theme.space.space6}`};
  background: ${({ theme }) => theme.colors.bgElevated};
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderSubtle};
  min-height: 64px;
`;

const ProductLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.typeLabel.fontSize};
  line-height: ${({ theme }) => theme.typography.typeLabel.lineHeight};
  font-weight: ${({ theme }) => theme.typography.typeLabel.fontWeight};
  color: ${({ theme }) => theme.colors.fgDefault};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MenuBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: ${({ theme }) => theme.radiusTokens.radiusSm};
  border: 1px solid ${({ theme }) => theme.colors.borderSubtle};
  background: ${({ theme }) => theme.colors.bgSubtle};
  color: ${({ theme }) => theme.colors.fgDefault};
  cursor: pointer;

  ${media.tabletUp} {
    display: none;
  }

  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadows.focusRing};
  }
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.space3};
  min-width: 0;
`;

export type ShellAppHeaderProps = {
  productLabel: string;
  onOpenNav?: () => void;
};

export function ShellAppHeader({ productLabel, onOpenNav }: ShellAppHeaderProps) {
  return (
    <Banner role="banner" data-testid="shell-app-header">
      <Left>
        <MenuBtn
          type="button"
          aria-label="Open navigation"
          data-testid="shell-nav-menu-button"
          onClick={() => onOpenNav?.()}
        >
          ☰
        </MenuBtn>
        <ProductLabel>{productLabel}</ProductLabel>
      </Left>
    </Banner>
  );
}
