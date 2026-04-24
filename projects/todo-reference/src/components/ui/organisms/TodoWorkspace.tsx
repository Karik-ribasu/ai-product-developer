"use client";

import { useCallback, useMemo, useState } from "react";

import type { TodoActionError, TodoDto } from "@/app/todo-action-contract";
import { isTodoLoadSaveFailure } from "@/app/todo-action-contract";
import { deleteTodoViaHttp, listTodosViaHttp } from "@/lib/client/todo-http-client";
import { ConfirmDialog } from "@/components/ui/molecules/ConfirmDialog";
import { EmptyTodosState } from "@/components/ui/molecules/EmptyTodosState";
import { ErrorBanner } from "@/components/ui/molecules/ErrorBanner";
import { NewTodoForm } from "@/components/ui/molecules/NewTodoForm";
import { TodoListItem } from "@/components/ui/molecules/TodoListItem";

import styles from "./TodoWorkspace.module.css";

export type TodoWorkspaceProps = {
  initialTodos: TodoDto[];
  initialListError: TodoActionError | null;
  /** When true, omit outer landmarks/header — used inside Dashboard bento per Stitch. */
  embedded?: boolean;
};

export function TodoWorkspace({ initialTodos, initialListError, embedded = false }: TodoWorkspaceProps) {
  const [todos, setTodos] = useState<TodoDto[]>(initialTodos);
  const [listOk, setListOk] = useState(initialListError === null);
  const [listError, setListError] = useState<TodoActionError | null>(initialListError);

  const [mutationBanner, setMutationBanner] = useState<{
    error: TodoActionError;
    retry: () => Promise<void>;
  } | null>(null);

  const [pendingDelete, setPendingDelete] = useState<TodoDto | null>(null);

  const reloadTodos = useCallback(async () => {
    setMutationBanner(null);
    const result = await listTodosViaHttp();
    if (isTodoLoadSaveFailure(result)) {
      setListOk(false);
      setListError(result.error);
      return;
    }
    setListOk(true);
    setListError(null);
    setTodos(result.data);
  }, []);

  const performDelete = useCallback(async (id: string) => {
    setMutationBanner(null);
    const result = await deleteTodoViaHttp(id);
    if (isTodoLoadSaveFailure(result)) {
      setMutationBanner({
        error: result.error,
        retry: async () => {
          await performDelete(id);
        },
      });
      return;
    }
    await reloadTodos();
  }, [reloadTodos]);

  const handleMutationFailure = useCallback((error: TodoActionError, retry: () => Promise<void>) => {
    setMutationBanner({
      error,
      retry: async () => {
        setMutationBanner(null);
        await retry();
      },
    });
  }, []);

  const handleDismissMutationBanner = useCallback(() => {
    setMutationBanner(null);
  }, []);

  const listRetry = useCallback(async () => {
    setListError(null);
    await reloadTodos();
  }, [reloadTodos]);

  const showEmptyState = listOk && todos.length === 0;
  const showList = listOk && todos.length > 0;

  const deleteDescription = useMemo(() => {
    if (!pendingDelete) return "";
    return `This will permanently remove “${pendingDelete.content}”. This action cannot be undone.`;
  }, [pendingDelete]);

  const stack = (
    <div className={embedded ? styles.embeddedStack : styles.stack}>
        {listError ? (
          <ErrorBanner
            error={listError}
            title="Could not load todos"
            onRetry={() => void listRetry()}
          />
        ) : null}

        {mutationBanner ? (
          <ErrorBanner
            error={mutationBanner.error}
            title="Could not save changes"
            onRetry={() => void mutationBanner.retry()}
            onDismiss={handleDismissMutationBanner}
          />
        ) : null}

        <NewTodoForm
          disabled={!listOk}
          onClearFailure={handleDismissMutationBanner}
          onCreated={() => void reloadTodos()}
          onFailure={(error, retry) => {
            setMutationBanner({
              error,
              retry: async () => {
                setMutationBanner(null);
                await retry();
              },
            });
          }}
        />

        {!listOk ? (
          <p className={styles.muted}>
            Fix the loading issue above to continue. Retry runs the same list request again.
          </p>
        ) : null}

        {showEmptyState ? <EmptyTodosState /> : null}

        {showList ? (
          <ul className={styles.list}>
            {todos.map((todo) => (
              <TodoListItem
                key={todo.id}
                todo={todo}
                disabled={!listOk}
                onMutationFailure={handleMutationFailure}
                onRequestDelete={(t) => setPendingDelete(t)}
                onUpdated={(next) => {
                  setTodos((prev) => prev.map((t) => (t.id === next.id ? next : t)));
                }}
              />
            ))}
          </ul>
        ) : null}
    </div>
  );

  if (embedded) {
    return (
      <>
        {stack}
        <ConfirmDialog
          open={pendingDelete !== null}
          title="Delete todo?"
          description={deleteDescription}
          confirmLabel="Delete"
          onCancel={() => setPendingDelete(null)}
          onConfirm={() => {
            const target = pendingDelete;
            setPendingDelete(null);
            if (!target) return;
            void performDelete(target.id);
          }}
        />
      </>
    );
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.subtitle}>
          Curator workspace aligned to the Stitch Dashboard screen — create tasks, complete them, edit, and delete with
          confirmation.
        </p>
      </header>

      {stack}

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete todo?"
        description={deleteDescription}
        confirmLabel="Delete"
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          const target = pendingDelete;
          setPendingDelete(null);
          if (!target) return;
          void performDelete(target.id);
        }}
      />
    </main>
  );
}
