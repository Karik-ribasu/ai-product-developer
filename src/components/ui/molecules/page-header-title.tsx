"use client";

import styled from "styled-components";

const H1 = styled.h1`
  margin: 0 0 ${({ theme }) => theme.space.space4};
  color: ${({ theme }) => theme.colors.fgDefault};
  font-size: ${({ theme }) => theme.typography.typeTitle.fontSize};
  line-height: ${({ theme }) => theme.typography.typeTitle.lineHeight};
  font-weight: ${({ theme }) => theme.typography.typeTitle.fontWeight};
`;

export type PageHeaderTitleProps = {
  children: React.ReactNode;
};

export function PageHeaderTitle({ children }: PageHeaderTitleProps) {
  return <H1>{children}</H1>;
}
