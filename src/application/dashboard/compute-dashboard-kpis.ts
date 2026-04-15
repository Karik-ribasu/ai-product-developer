import type { DashboardTaskSource } from "./dashboard-task-source";

export type DashboardKpiVm = {
  total: number;
  open: number;
  done: number;
};

export function computeDashboardKpis(todos: DashboardTaskSource[]): DashboardKpiVm {
  const open = todos.filter((t) => !t.completed).length;
  return {
    total: todos.length,
    open,
    done: todos.length - open,
  };
}
