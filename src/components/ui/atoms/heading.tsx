import styled from "styled-components";

export const PageHeading = styled.h1`
  margin: 0 0 ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: 650;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.colors.text};
`;

export const SectionHeading = styled.h2`
  margin: 0 0 ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;
