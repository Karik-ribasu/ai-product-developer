"use client";

import styled from "styled-components";

import { media } from "@/design-system/breakpoints";

const Aside = styled.aside`
  width: 264px;
  flex: 0 0 264px;
  padding: ${({ theme }) => theme.space.space4};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.space2};
  background: ${({ theme }) => theme.colors.bgElevated};
  border-right: 1px solid ${({ theme }) => theme.colors.borderSubtle};
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.space2};
`;

const Link = styled.a<{ $active?: boolean }>`
  padding: ${({ theme }) => `${theme.space.space2} ${theme.space.space3}`};
  border-radius: ${({ theme }) => theme.radiusTokens.radiusSm};
  font-size: ${({ theme }) => theme.typography.typeLabel.fontSize};
  line-height: ${({ theme }) => theme.typography.typeLabel.lineHeight};
  font-weight: 500;
  color: ${({ theme, $active }) => ($active ? theme.colors.fgDefault : theme.colors.fgMuted)};
  background: ${({ theme, $active }) => ($active ? theme.colors.bgSubtle : "transparent")};
  text-decoration: none;

  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadows.focusRing};
  }

  &:hover {
    color: ${({ theme }) => theme.colors.fgDefault};
  }
`;

const Rail = styled(Aside)`
  display: none;
  ${media.tabletUp} {
    display: flex;
  }
`;

export type NavItem = { id: string; label: string; href: string; active?: boolean };

export type NavSidebarProps = {
  items: NavItem[];
};

export function NavSidebar({ items }: NavSidebarProps) {
  return (
    <Rail aria-label="Primary" data-testid="nav-sidebar">
      <Nav>
        {items.map((it) => (
          <Link key={it.id} href={it.href} aria-current={it.active ? "page" : undefined} $active={it.active}>
            {it.label}
          </Link>
        ))}
      </Nav>
    </Rail>
  );
}
