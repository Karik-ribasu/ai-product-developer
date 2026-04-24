"use client";

import { useState, type FormEvent } from "react";

import type { TodoActionError } from "@/app/todo-action-contract";
import { createTodoViaHttp } from "@/lib/client/todo-http-client";
import { Button } from "@/components/ui/atoms/Button";
import { TextField } from "@/components/ui/atoms/TextField";

import styles from "./NewTodoForm.module.css";

export type NewTodoFormProps = {
  disabled?: boolean;
  onCreated: () => void;
  onFailure: (error: TodoActionError, retry: () => Promise<void>) => void;
  onClearFailure: () => void;
};

export function NewTodoForm({
  disabled = false,
  onCreated,
  onFailure,
  onClearFailure,
}: NewTodoFormProps) {
  const [content, setContent] = useState("");
  const [fieldError, setFieldError] = useState<string | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);

  async function submit(nextContent: string) {
    onClearFailure();
    setFieldError(undefined);
    setSubmitting(true);
    try {
      const result = await createTodoViaHttp(nextContent);
      if (!result.ok) {
        onFailure(result.error, () => submit(nextContent));
        return;
      }
      setContent("");
      onCreated();
    } finally {
      setSubmitting(false);
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed) {
      setFieldError("Todo content cannot be empty");
      return;
    }
    await submit(trimmed);
  }

  return (
    <form className={styles.form} onSubmit={(e) => void onSubmit(e)} noValidate>
      <div className={styles.row}>
        <TextField
          id="dashboard-new-todo"
          label="New todo"
          name="new-todo"
          aria-label="New todo"
          value={content}
          autoComplete="off"
          disabled={disabled || submitting}
          errorText={fieldError}
          onChange={(e) => {
            setContent(e.target.value);
            if (fieldError) setFieldError(undefined);
          }}
        />
        <Button type="submit" variant="primary" disabled={disabled || submitting}>
          {submitting ? "Adding…" : "Add"}
        </Button>
      </div>
    </form>
  );
}
