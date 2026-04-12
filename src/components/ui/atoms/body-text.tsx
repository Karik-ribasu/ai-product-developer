import styled from "styled-components";

export const BodyText = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.5;
`;

export const MutedText = styled(BodyText)`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;
