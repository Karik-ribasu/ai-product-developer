import { forwardRef, type InputHTMLAttributes } from "react";

import styles from "./TextField.module.css";

export type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  errorText?: string;
};

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ id, label, errorText, className = "", ...rest }, ref) => {
    const inputId = id ?? rest.name ?? "text-field";

    return (
      <div className={styles.wrap}>
        <label className={styles.label} htmlFor={inputId}>
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={`${styles.input} ${className}`.trim()}
          aria-invalid={errorText ? true : undefined}
          aria-describedby={errorText ? `${inputId}-error` : undefined}
          {...rest}
        />
        {errorText ? (
          <p className={styles.error} id={`${inputId}-error`} role="alert">
            {errorText}
          </p>
        ) : null}
      </div>
    );
  },
);

TextField.displayName = "TextField";
