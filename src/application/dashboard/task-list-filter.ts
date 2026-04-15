import type { DashboardTaskSource } from "./dashboard-task-source";

export type TaskListFilter = "all" | "open" | "done";

export function applyTaskListFilter(todos: DashboardTaskSource[], filter: TaskListFilter): DashboardTaskSource[] {
  if (filter === "all") {
    return todos;
  }
  if (filter === "open") {
    return todos.filter((t) => !t.completed);
  }
  return todos.filter((t) => t.completed);
}
