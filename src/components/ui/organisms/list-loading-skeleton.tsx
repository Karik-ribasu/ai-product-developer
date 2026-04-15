"use client";

import styled, { keyframes } from "styled-components";

const pulse = keyframes`
  50% { opacity: 0.55; }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 40px minmax(0, 1fr) minmax(96px, auto) auto;
  gap: ${({ theme }) => theme.space.space3};
  align-items: center;
  min-height: 72px;
  padding: ${({ theme }) => theme.space.space4};
  border-radius: ${({ theme }) => theme.radiusTokens.radiusMd};
  border: 1px solid ${({ theme }) => theme.colors.borderSubtle};
  background: ${({ theme }) => theme.colors.bgSubtle};
  animation: ${pulse} 1.2s ease-in-out infinite;
`;

const Blob = styled.div`
  height: 12px;
  border-radius: ${({ theme }) => theme.radiusTokens.radiusSm};
  background: ${({ theme }) => theme.colors.bgElevated};
`;

export function ListLoadingSkeleton() {
  const rows = Array.from({ length: 6 }, (_, i) => i);
  return (
    <div data-testid="list-loading-skeleton" aria-live="polite" aria-busy="true">
      {rows.map((i) => (
        <Row key={i} style={{ marginBottom: i === rows.length - 1 ? 0 : "12px" }}>
          <Blob style={{ width: 28, height: 28, borderRadius: "50%" }} />
          <Blob style={{ width: "70%" }} />
          <Blob style={{ width: 72 }} />
          <Blob style={{ width: 96 }} />
        </Row>
      ))}
    </div>
  );
}
