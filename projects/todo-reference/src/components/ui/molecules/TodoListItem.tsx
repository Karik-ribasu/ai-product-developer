"use client";

import { useEffect, useId, useRef, useState } from "react";

import type { TodoActionError, TodoDto } from "@/app/todo-action-contract";
import { toggleTodoViaHttp, updateTodoViaHttp } from "@/lib/client/todo-http-client";
import { Button } from "@/components/ui/atoms/Button";
import { Checkbox } from "@/components/ui/atoms/Checkbox";
import { TextField } from "@/components/ui/atoms/TextField";

import styles from "./TodoListItem.module.css";

export type TodoListItemProps = {
  todo: TodoDto;
  onUpdated: (todo: TodoDto) => void;
  onRequestDelete: (todo: TodoDto) => void;
  onMutationFailure: (error: TodoActionError, retry: () => Promise<void>) => void;
  disabled?: boolean;
};

export function TodoListItem({
  todo,
  onUpdated,
  onRequestDelete,
  onMutationFailure,
  disabled = false,
}: TodoListItemProps) {
  const reactId = useId();
  const editFieldId = `todo-edit-${todo.id}-${reactId}`;
  const editButtonRef = useRef<HTMLButtonElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(todo.content);
  const [editError, setEditError] = useState<string | undefined>(undefined);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!isEditing) {
      setDraft(todo.content);
      setEditError(undefined);
    }
  }, [isEditing, todo.content]);

  useEffect(() => {
    if (!isEditing) return;
    const el = inputRef.current;
    if (!el) return;
    el.focus();
    el.select?.();
  }, [isEditing]);

  async function runToggle() {
    setBusy(true);
    try {
      const result = await toggleTodoViaHttp(todo.id);
      if (!result.ok) {
        onMutationFailure(result.error, runToggle);
        return;
      }
      onUpdated(result.data);
    } finally {
      setBusy(false);
    }
  }

  async function runSave() {
    setEditError(undefined);
    setBusy(true);
    try {
      const result = await updateTodoViaHttp(todo.id, draft);
      if (!result.ok) {
        if (result.error.code === "VALIDATION") {
          setEditError(result.error.message);
          return;
        }
        onMutationFailure(result.error, runSave);
        return;
      }
      onUpdated(result.data);
      setIsEditing(false);
      requestAnimationFrame(() => editButtonRef.current?.focus());
    } finally {
      setBusy(false);
    }
  }

  function cancelEdit() {
    setIsEditing(false);
    setDraft(todo.content);
    setEditError(undefined);
    requestAnimationFrame(() => editButtonRef.current?.focus());
  }

  const toggleLabel = todo.completed
    ? `Mark “${todo.content}” as incomplete`
    : `Mark “${todo.content}” as complete`;

  return (
    <li className={styles.item}>
      <article className={styles.card} aria-label={`Todo: ${todo.content}`}>
        {!isEditing ? (
          <>
            <div className={styles.row}>
              <Checkbox
                id={`todo-done-${todo.id}`}
                label={toggleLabel}
                hideLabelVisually
                checked={todo.completed}
                disabled={disabled || busy}
                onCheckedChange={() => void runToggle()}
              />
              <div className={styles.content}>
                <p className={`${styles.text} ${todo.completed ? styles.done : ""}`}>{todo.content}</p>
              </div>
              <div className={styles.actions}>
                <Button
                  ref={editButtonRef}
                  type="button"
                  variant="secondary"
                  disabled={disabled || busy}
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
                <Button
                  type="button"
                  variant="danger"
                  disabled={disabled || busy}
                  onClick={() => onRequestDelete(todo)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className={styles.editGrid}>
            <TextField
              ref={inputRef}
              id={editFieldId}
              label="Edit todo"
              value={draft}
              disabled={disabled || busy}
              errorText={editError}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  e.preventDefault();
                  cancelEdit();
                }
                if (e.key === "Enter") {
                  e.preventDefault();
                  void runSave();
                }
              }}
            />
            <div className={styles.editActions}>
              <Button type="button" variant="secondary" disabled={busy} onClick={cancelEdit}>
                Cancel
              </Button>
              <Button type="button" variant="primary" disabled={busy} onClick={() => void runSave()}>
                Save
              </Button>
            </div>
          </div>
        )}
      </article>
    </li>
  );
}
