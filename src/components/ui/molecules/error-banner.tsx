import styled from "styled-components";

import { Button } from "../atoms/button";
import { BodyText } from "../atoms/body-text";

const Banner = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.bannerErrorBorder};
  background: ${({ theme }) => theme.colors.bannerErrorBg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
`;

type ErrorBannerProps = {
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  retryBusy?: boolean;
};

export function ErrorBanner({ message, onRetry, retryLabel = "Try again", retryBusy }: ErrorBannerProps) {
  return (
    <Banner role="alert">
      <BodyText>{message}</BodyText>
      {onRetry ? (
        <Actions>
          <Button type="button" $variant="secondary" onClick={onRetry} disabled={retryBusy} $compact>
            {retryBusy ? "Retrying…" : retryLabel}
          </Button>
        </Actions>
      ) : null}
    </Banner>
  );
}
