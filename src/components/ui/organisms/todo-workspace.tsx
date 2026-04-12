"use client";

import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";

import {
  createTodoAction,
  deleteTodoAction,
  listTodosAction,
  toggleTodoCompleteAction,
  updateTodoTextAction,
} from "@/app/actions/todos";
import type { TodoPublicDto } from "@/interface-adapters/todos/todo-action-result";
import type { TodoRowBusy } from "../molecules/todo-row";
import { PageHeading } from "../atoms/heading";
import { TodoCreateForm } from "./todo-create-form";
import { TodoListShell } from "./todo-list-shell";

const PageStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
`;

function mergeTodo(list: TodoPublicDto[], next: TodoPublicDto): TodoPublicDto[] {
  const idx = list.findIndex((t) => t.id === next.id);
  if (idx === -1) {
    return [...list, next];
  }
  const copy = [...list];
  copy[idx] = next;
  return copy;
}

export function TodoWorkspace() {
  const [todos, setTodos] = useState<TodoPublicDto[]>([]);
  const [listError, setListError] = useState<string | null>(null);
  const [listLoading, setListLoading] = useState(true);

  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const [rowBusy, setRowBusy] = useState<Partial<Record<string, TodoRowBusy>>>({});
  const [rowErrors, setRowErrors] = useState<Record<string, string | undefined>>({});

  const setBusy = useCallback((id: string, busy: TodoRowBusy | undefined) => {
    setRowBusy((prev) => {
      const next = { ...prev };
      if (busy === undefined) {
        delete next[id];
      } else {
        next[id] = busy;
      }
      return next;
    });
  }, []);

  const reloadList = useCallback(async () => {
    setListLoading(true);
    setListError(null);
    const res = await listTodosAction();
    setListLoading(false);
    if (res.ok) {
      setTodos(res.data.todos);
    } else {
      setListError(res.message);
    }
  }, []);

  useEffect(() => {
    void reloadList();
  }, [reloadList]);

  const handleCreate = useCallback(async (title: string) => {
    setCreateLoading(true);
    setCreateError(null);
    const res = await createTodoAction(title);
    setCreateLoading(false);
    if (res.ok) {
      setTodos((prev) => mergeTodo(prev, res.data.todo));
      return true;
    }
    setCreateError(res.message);
    return false;
  }, []);

  const handleToggle = useCallback(
    async (id: string) => {
      setRowErrors((r) => ({ ...r, [id]: undefined }));
      setBusy(id, "toggle");
      const res = await toggleTodoCompleteAction(id);
      setBusy(id, undefined);
      if (res.ok) {
        setTodos((prev) => mergeTodo(prev, res.data.todo));
        return true;
      }
      setRowErrors((r) => ({ ...r, [id]: res.message }));
      return false;
    },
    [setBusy],
  );

  const handleUpdateText = useCallback(
    async (id: string, title: string) => {
      setRowErrors((r) => ({ ...r, [id]: undefined }));
      setBusy(id, "update");
      const res = await updateTodoTextAction({ id, title });
      setBusy(id, undefined);
      if (res.ok) {
        setTodos((prev) => mergeTodo(prev, res.data.todo));
        return true;
      }
      setRowErrors((r) => ({ ...r, [id]: res.message }));
      return false;
    },
    [setBusy],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      setRowErrors((r) => ({ ...r, [id]: undefined }));
      setBusy(id, "delete");
      const res = await deleteTodoAction(id);
      setBusy(id, undefined);
      if (res.ok) {
        setTodos((prev) => prev.filter((t) => t.id !== id));
        return true;
      }
      setRowErrors((r) => ({ ...r, [id]: res.message }));
      return false;
    },
    [setBusy],
  );

  return (
    <PageStack>
      <PageHeading>Local Todo</PageHeading>
      <TodoListShell
        todos={todos}
        listError={listError}
        listLoading={listLoading}
        onReloadList={reloadList}
        rowBusy={rowBusy}
        rowErrors={rowErrors}
        onToggle={handleToggle}
        onUpdateText={handleUpdateText}
        onDelete={handleDelete}
      />
      <TodoCreateForm onCreate={handleCreate} loading={createLoading} error={createError} />
    </PageStack>
  );
}
