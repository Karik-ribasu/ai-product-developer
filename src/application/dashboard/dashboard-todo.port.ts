import type { DashboardTaskSource } from "./dashboard-task-source";

export type DashboardTodoResult<T> =
  | { ok: true; data: T }
  | { ok: false; message: string };

/**
 * Outbound port: presentation wires a concrete adapter (server actions, mocks in tests).
 */
export type DashboardTodoPort = {
  listTodos(): Promise<DashboardTodoResult<{ todos: DashboardTaskSource[] }>>;
  createUntitledTask(): Promise<DashboardTodoResult<{ todo: DashboardTaskSource }>>;
  toggleTodo(id: string): Promise<DashboardTodoResult<{ todo: DashboardTaskSource }>>;
  deleteTodo(id: string): Promise<DashboardTodoResult<{ deleted: true }>>;
};
