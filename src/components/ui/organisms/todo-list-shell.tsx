"use client";

import styled from "styled-components";

import { MutedText } from "../atoms/body-text";
import { Button } from "../atoms/button";
import { SectionHeading } from "../atoms/heading";
import { Spinner } from "../atoms/spinner";
import { ErrorBanner } from "../molecules/error-banner";
import { TodoRow, type TodoRowBusy } from "../molecules/todo-row";
import type { TodoPublicDto } from "@/interface-adapters/todos/todo-action-result";

const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

type BusyMap = Partial<Record<string, TodoRowBusy>>;

type TodoListShellProps = {
  todos: TodoPublicDto[];
  listError: string | null;
  listLoading: boolean;
  onReloadList: () => void;
  rowBusy: BusyMap;
  rowErrors: Record<string, string | undefined>;
  onToggle: (id: string) => Promise<boolean>;
  onUpdateText: (id: string, title: string) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
};

export function TodoListShell({
  todos,
  listError,
  listLoading,
  onReloadList,
  rowBusy,
  rowErrors,
  onToggle,
  onUpdateText,
  onDelete,
}: TodoListShellProps) {
  return (
    <Stack>
      <Toolbar>
        <SectionHeading>Todos</SectionHeading>
        <Button type="button" $variant="secondary" $compact onClick={onReloadList} disabled={listLoading}>
          {listLoading ? "Refreshing…" : "Refresh list"}
        </Button>
      </Toolbar>

      {listError ? (
        <ErrorBanner message={listError} onRetry={onReloadList} retryBusy={listLoading} />
      ) : null}

      {listLoading && !listError && todos.length === 0 ? (
        <Stack style={{ alignItems: "center", padding: "2rem 0" }}>
          <Spinner label="Loading todos" />
          <MutedText>Loading your todos…</MutedText>
        </Stack>
      ) : null}

      {!listLoading && !listError && todos.length === 0 ? (
        <MutedText>No todos yet — add one below.</MutedText>
      ) : null}

      <List>
        {todos.map((todo) => (
          <TodoRow
            key={todo.id}
            todo={todo}
            busy={rowBusy[todo.id]}
            error={rowErrors[todo.id]}
            onToggle={onToggle}
            onUpdateText={onUpdateText}
            onDelete={onDelete}
          />
        ))}
      </List>
    </Stack>
  );
}
