import type { DashboardTaskRowVm, DashboardStatusTone } from "./dashboard-task-row.vm";
import type { DashboardTaskSource } from "./dashboard-task-source";

function toneForTodo(t: DashboardTaskSource): DashboardStatusTone {
  if (t.completed) {
    return "success";
  }
  return "neutral";
}

function labelForTodo(t: DashboardTaskSource): string {
  return t.completed ? "Done" : "Open";
}

export function mapSourcesToRowVms(todos: DashboardTaskSource[]): DashboardTaskRowVm[] {
  return todos.map((t) => ({
    id: t.id,
    title: t.title,
    meta: t.completed ? "Completed" : "Due anytime",
    statusTone: toneForTodo(t),
    statusLabel: labelForTodo(t),
  }));
}
