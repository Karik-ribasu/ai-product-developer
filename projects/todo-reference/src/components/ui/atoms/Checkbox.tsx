import type { InputHTMLAttributes } from "react";

import styles from "./Checkbox.module.css";

export type CheckboxProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "onChange"
> & {
  label: string;
  hideLabelVisually?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

export function Checkbox({
  id,
  label,
  hideLabelVisually = false,
  onCheckedChange,
  className = "",
  disabled,
  ...rest
}: CheckboxProps) {
  const inputId = id ?? rest.name ?? "checkbox";

  return (
    <label className={`${styles.row} ${className}`.trim()} htmlFor={inputId}>
      <input
        {...rest}
        id={inputId}
        className={styles.input}
        type="checkbox"
        disabled={disabled}
        onChange={(e) => onCheckedChange?.(e.target.checked)}
      />
      <span className={hideLabelVisually ? styles.hiddenLabel : styles.labelText}>
        {label}
      </span>
    </label>
  );
}
