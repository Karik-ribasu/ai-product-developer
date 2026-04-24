import { forwardRef, type ButtonHTMLAttributes } from "react";

import styles from "./Button.module.css";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  fullWidth?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "secondary", fullWidth = false, className = "", type = "button", ...rest },
  ref,
) {
  const variantClass =
    variant === "primary"
      ? styles.primary
      : variant === "danger"
        ? styles.danger
        : variant === "ghost"
          ? styles.ghost
          : styles.secondary;

  return (
    <button
      ref={ref}
      type={type}
      className={`${styles.button} ${variantClass} ${fullWidth ? styles.fullWidth : ""} ${className}`.trim()}
      {...rest}
    />
  );
});
