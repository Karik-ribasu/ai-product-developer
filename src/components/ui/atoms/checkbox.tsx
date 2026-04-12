import styled from "styled-components";

const Root = styled.label`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
  user-select: none;
  color: ${({ theme }) => theme.colors.text};

  &:has(input:disabled) {
    cursor: not-allowed;
    opacity: 0.55;
  }
`;

const Native = styled.input`
  width: 1.1rem;
  height: 1.1rem;
  accent-color: ${({ theme }) => theme.colors.primary};
`;

type CheckboxProps = {
  checked: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
  "aria-label"?: string;
};

export function Checkbox({ checked, onChange, disabled, "aria-label": ariaLabel }: CheckboxProps) {
  return (
    <Root>
      <Native
        type="checkbox"
        checked={checked}
        disabled={disabled}
        aria-label={ariaLabel}
        onChange={(e) => onChange(e.target.checked)}
      />
    </Root>
  );
}
