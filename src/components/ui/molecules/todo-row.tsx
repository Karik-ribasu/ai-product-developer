"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";

import { Button } from "../atoms/button";
import { Checkbox } from "../atoms/checkbox";
import { MutedText } from "../atoms/body-text";
import { Spinner } from "../atoms/spinner";
import { TextField } from "../atoms/text-field";
import type { TodoPublicDto } from "@/interface-adapters/todos/todo-action-result";

const Row = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const TitleBlock = styled.div`
  min-width: 0;
`;

const TitleText = styled.span<{ $completed: boolean }>`
  display: block;
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.text};
  text-decoration: ${({ $completed }) => ($completed ? "line-through" : "none")};
  opacity: ${({ $completed }) => ($completed ? 0.65 : 1)};
  word-break: break-word;
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  justify-content: flex-end;
`;

const InlineError = styled(MutedText)`
  margin-top: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.danger};
`;

export type TodoRowBusy = "toggle" | "update" | "delete" | undefined;

type TodoRowProps = {
  todo: TodoPublicDto;
  busy?: TodoRowBusy;
  error?: string | null;
  onToggle: (id: string) => Promise<boolean>;
  onUpdateText: (id: string, title: string) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
};

export function TodoRow({ todo, busy, error, onToggle, onUpdateText, onDelete }: TodoRowProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.title);

  useEffect(() => {
    if (!editing) {
      setDraft(todo.title);
    }
  }, [todo.title, editing]);

  const isBusy = Boolean(busy);
  const showSpinner = busy === "toggle" || busy === "update";

  const startEdit = () => {
    setDraft(todo.title);
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setDraft(todo.title);
  };

  const saveEdit = async () => {
    const ok = await onUpdateText(todo.id, draft.trim());
    if (ok) {
      setEditing(false);
    }
  };

  return (
    <Row>
      <div>
        {showSpinner ? (
          <Spinner size="sm" label={`Updating ${todo.title}`} />
        ) : (
          <Checkbox
            checked={todo.completed}
            disabled={isBusy || editing}
            aria-label={todo.completed ? `Mark "${todo.title}" as not done` : `Mark "${todo.title}" as done`}
            onChange={() => {
              void onToggle(todo.id);
            }}
          />
        )}
      </div>
      <TitleBlock>
        {editing ? (
          <TextField
            value={draft}
            disabled={busy === "update"}
            onChange={(e) => setDraft(e.target.value)}
            aria-label="Edit todo title"
            onKeyDown={(e) => {
              if (e.key === "Enter") saveEdit();
              if (e.key === "Escape") cancelEdit();
            }}
          />
        ) : (
          <TitleText $completed={todo.completed}>{todo.title}</TitleText>
        )}
        {error ? <InlineError role="status">{error}</InlineError> : null}
      </TitleBlock>
      <Actions>
        {editing ? (
          <>
            <Button type="button" $variant="ghost" $compact onClick={cancelEdit} disabled={busy === "update"}>
              Cancel
            </Button>
            <Button type="button" $variant="primary" $compact onClick={saveEdit} disabled={busy === "update"}>
              {busy === "update" ? "Saving…" : "Save"}
            </Button>
          </>
        ) : (
          <>
            <Button type="button" $variant="ghost" $compact onClick={startEdit} disabled={isBusy}>
              Edit
            </Button>
            <Button
              type="button"
              $variant="danger"
              $compact
              onClick={() => {
                void onDelete(todo.id);
              }}
              disabled={isBusy}
            >
              {busy === "delete" ? "Deleting…" : "Delete"}
            </Button>
          </>
        )}
      </Actions>
    </Row>
  );
}
