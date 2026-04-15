"use client";

import styled from "styled-components";

import { ButtonPrimary } from "@/components/ui/atoms/button-primary";

const Root = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: ${({ theme }) => theme.space.space4};
  padding: ${({ theme }) => `${theme.space.space8} ${theme.space.space4}`};
`;

const Title = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.typeTitle.fontSize};
  line-height: ${({ theme }) => theme.typography.typeTitle.lineHeight};
  font-weight: ${({ theme }) => theme.typography.typeTitle.fontWeight};
  color: ${({ theme }) => theme.colors.fgDefault};
`;

const Body = styled.p`
  margin: 0;
  max-width: 40ch;
  font-size: ${({ theme }) => theme.typography.typeBody.fontSize};
  line-height: ${({ theme }) => theme.typography.typeBody.lineHeight};
  color: ${({ theme }) => theme.colors.fgMuted};
`;

const Linkish = styled.button`
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.typeLabel.fontSize};
  line-height: ${({ theme }) => theme.typography.typeLabel.lineHeight};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.accentPrimary};
  text-decoration: underline;

  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadows.focusRing};
    border-radius: 2px;
  }
`;

export type EmptyTaskListProps = {
  onNewTask: () => void;
  onLearnMore?: () => void;
};

export function EmptyTaskList({ onNewTask, onLearnMore }: EmptyTaskListProps) {
  return (
    <Root data-testid="empty-task-list">
      <Title>No tasks yet</Title>
      <Body>Create your first task to populate this dashboard.</Body>
      <ButtonPrimary onClick={() => void onNewTask()} data-testid="empty-primary-cta">
        New task
      </ButtonPrimary>
      {onLearnMore ? (
        <Linkish type="button" onClick={() => onLearnMore()}>
          Learn how tasks work
        </Linkish>
      ) : null}
    </Root>
  );
}
