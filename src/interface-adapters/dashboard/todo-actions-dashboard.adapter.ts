import type { DashboardTodoPort, DashboardTodoResult } from "@/application/dashboard/dashboard-todo.port";
import type { DashboardTaskSource } from "@/application/dashboard/dashboard-task-source";
import {
  createTodoAction,
  deleteTodoAction,
  listTodosAction,
  toggleTodoCompleteAction,
} from "@/app/actions/todos";

function toSource(t: { id: string; title: string; completed: boolean }): DashboardTaskSource {
  return { id: t.id, title: t.title, completed: t.completed };
}

export function createTodoActionsDashboardAdapter(): DashboardTodoPort {
  return {
    async listTodos(): Promise<DashboardTodoResult<{ todos: DashboardTaskSource[] }>> {
      const res = await listTodosAction();
      if (!res.ok) {
        return { ok: false, message: res.message };
      }
      return { ok: true, data: { todos: res.data.todos.map(toSource) } };
    },

    async createUntitledTask(): Promise<DashboardTodoResult<{ todo: DashboardTaskSource }>> {
      const res = await createTodoAction("New task");
      if (!res.ok) {
        return { ok: false, message: res.message };
      }
      return { ok: true, data: { todo: toSource(res.data.todo) } };
    },

    async toggleTodo(id: string): Promise<DashboardTodoResult<{ todo: DashboardTaskSource }>> {
      const res = await toggleTodoCompleteAction(id);
      if (!res.ok) {
        return { ok: false, message: res.message };
      }
      return { ok: true, data: { todo: toSource(res.data.todo) } };
    },

    async deleteTodo(id: string): Promise<DashboardTodoResult<{ deleted: true }>> {
      const res = await deleteTodoAction(id);
      if (!res.ok) {
        return { ok: false, message: res.message };
      }
      return { ok: true, data: { deleted: true } };
    },
  };
}
