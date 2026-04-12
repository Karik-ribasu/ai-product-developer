import styled, { keyframes } from "styled-components";

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const Ring = styled.span<{ $size: "sm" | "md" }>`
  display: inline-block;
  width: ${({ $size }) => ($size === "sm" ? "1rem" : "1.25rem")};
  height: ${({ $size }) => ($size === "sm" ? "1rem" : "1.25rem")};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-top-color: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
`;

type SpinnerProps = {
  size?: "sm" | "md";
  label?: string;
};

export function Spinner({ size = "md", label = "Loading" }: SpinnerProps) {
  return (
    <span role="status" aria-live="polite" aria-label={label}>
      <Ring $size={size} />
    </span>
  );
}
