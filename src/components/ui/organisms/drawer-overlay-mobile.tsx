"use client";

import { useEffect, useRef } from "react";
import styled from "styled-components";

import { media } from "@/design-system/breakpoints";

const Scrim = styled.div<{ $open: boolean }>`
  position: fixed;
  inset: 0;
  background: ${({ theme }) => theme.scrimOverlay};
  z-index: 40;
  display: ${({ $open }) => ($open ? "block" : "none")};

  ${media.tabletUp} {
    display: none !important;
  }
`;

const Panel = styled.div<{ $open: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: min(320px, 88vw);
  z-index: 41;
  transform: translateX(${({ $open }) => ($open ? "0" : "-100%")});
  transition: transform 0.2s ease;
  background: ${({ theme }) => theme.colors.bgElevated};
  border-right: 1px solid ${({ theme }) => theme.colors.borderSubtle};
  padding: ${({ theme }) => theme.space.space4};
  overflow: auto;

  ${media.tabletUp} {
    display: none;
  }
`;

export type DrawerOverlayMobileProps = {
  open: boolean;
  titleId: string;
  onClose: () => void;
  children: React.ReactNode;
};

export function DrawerOverlayMobile({ open, titleId, onClose, children }: DrawerOverlayMobileProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const lastActive = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    lastActive.current = document.activeElement as HTMLElement | null;
    const root = panelRef.current;
    const focusable = root?.querySelector<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
    );
    focusable?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lastActive.current?.focus?.();
    };
  }, [open, onClose]);

  return (
    <>
      <Scrim
        $open={open}
        aria-hidden={!open}
        onClick={() => onClose()}
        data-testid="drawer-scrim"
      />
      <Panel
        ref={panelRef}
        $open={open}
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
        aria-labelledby={titleId}
        tabIndex={-1}
        data-testid="drawer-overlay-mobile"
      >
        {children}
      </Panel>
    </>
  );
}
