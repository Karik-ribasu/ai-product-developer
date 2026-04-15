"use client";

import { useEffect, useRef } from "react";
import styled from "styled-components";

import { ButtonSecondary } from "@/components/ui/atoms/button-secondary";

const Panel = styled.div`
  padding: ${({ theme }) => theme.space.space4};
  border-radius: ${({ theme }) => theme.radiusTokens.radiusMd};
  border: 2px solid ${({ theme }) => theme.colors.semanticError};
  background: ${({ theme }) => theme.colors.bgElevated};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.space4};
`;

const Title = styled.div`
  font-size: ${({ theme }) => theme.typography.typeLabel.fontSize};
  line-height: ${({ theme }) => theme.typography.typeLabel.lineHeight};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.fgDefault};
`;

const Message = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.typeBody.fontSize};
  line-height: ${({ theme }) => theme.typography.typeBody.lineHeight};
  color: ${({ theme }) => theme.colors.fgDefault};
`;

export type InlineErrorPanelProps = {
  title: string;
  message: string;
  onRetry: () => void;
};

export function InlineErrorPanel({ title, message, onRetry }: InlineErrorPanelProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  return (
    <Panel ref={ref} role="alert" tabIndex={-1} data-testid="inline-error-panel">
      <Title>{title}</Title>
      <Message>{message}</Message>
      <div>
        <ButtonSecondary type="button" onClick={() => void onRetry()}>
          Retry
        </ButtonSecondary>
      </div>
    </Panel>
  );
}
