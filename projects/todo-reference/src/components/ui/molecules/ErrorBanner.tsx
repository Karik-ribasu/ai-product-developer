"use client";

import type { TodoActionError } from "@/app/todo-action-contract";

import { Button } from "@/components/ui/atoms/Button";

import styles from "./ErrorBanner.module.css";

export type ErrorBannerProps = {
  error: TodoActionError;
  onRetry?: () => void;
  onDismiss?: () => void;
  retryLabel?: string;
  title?: string;
};

export function ErrorBanner({
  error,
  onRetry,
  onDismiss,
  retryLabel = "Retry",
  title = "Something went wrong",
}: ErrorBannerProps) {
  return (
    <section
      className={styles.banner}
      role="alert"
      aria-live="assertive"
      aria-relevant="additions text"
    >
      <div className={styles.titleRow}>
        <h2 className={styles.heading}>{title}</h2>
        {onDismiss ? (
          <Button type="button" variant="ghost" onClick={onDismiss}>
            Dismiss
          </Button>
        ) : null}
      </div>
      <p className={styles.message}>{error.message}</p>
      <p className={styles.code}>Code: {error.code}</p>
      {onRetry ? (
        <div className={styles.actions}>
          <Button type="button" variant="primary" onClick={onRetry}>
            {retryLabel}
          </Button>
        </div>
      ) : null}
    </section>
  );
}
