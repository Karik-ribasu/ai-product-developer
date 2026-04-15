import { beforeEach, describe, expect, mock, test } from "bun:test";

const listTodosAction = mock(() =>
  Promise.resolve({ ok: true as const, data: { todos: [{ id: "1", title: "One", completed: false }] } }),
);
const createTodoAction = mock(() =>
  Promise.resolve({
    ok: true as const,
    data: { todo: { id: "2", title: "New task", completed: false } },
  }),
);
const toggleTodoCompleteAction = mock(() =>
  Promise.resolve({
    ok: true as const,
    data: { todo: { id: "1", title: "One", completed: true } },
  }),
);
const deleteTodoAction = mock(() => Promise.resolve({ ok: true as const, data: { deleted: true as const } }));

mock.module("@/app/actions/todos", () => ({
  listTodosAction,
  createTodoAction,
  toggleTodoCompleteAction,
  deleteTodoAction,
}));

const { createTodoActionsDashboardAdapter } = await import(
  "@/interface-adapters/dashboard/todo-actions-dashboard.adapter"
);

describe("todo-actions-dashboard.adapter", () => {
  beforeEach(() => {
    listTodosAction.mockImplementation(() =>
      Promise.resolve({ ok: true as const, data: { todos: [{ id: "1", title: "One", completed: false }] } }),
    );
    createTodoAction.mockImplementation(() =>
      Promise.resolve({
        ok: true as const,
        data: { todo: { id: "2", title: "New task", completed: false } },
      }),
    );
    toggleTodoCompleteAction.mockImplementation(() =>
      Promise.resolve({
        ok: true as const,
        data: { todo: { id: "1", title: "One", completed: true } },
      }),
    );
    deleteTodoAction.mockImplementation(() =>
      Promise.resolve({ ok: true as const, data: { deleted: true as const } }),
    );
  });

  test("maps list success", async () => {
    const a = createTodoActionsDashboardAdapter();
    const r = await a.listTodos();
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.data.todos).toHaveLength(1);
      expect(r.data.todos[0]?.title).toBe("One");
    }
  });

  test("maps list failure", async () => {
    listTodosAction.mockImplementation(() => Promise.resolve({ ok: false, message: "bad", code: "invalid_input" }));
    const a = createTodoActionsDashboardAdapter();
    const r = await a.listTodos();
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.message).toBe("bad");
    }
  });

  test("maps create success", async () => {
    const a = createTodoActionsDashboardAdapter();
    const r = await a.createUntitledTask();
    expect(r.ok).toBe(true);
  });

  test("maps create failure", async () => {
    createTodoAction.mockImplementation(() => Promise.resolve({ ok: false, message: "nope", code: "invalid_input" }));
    const a = createTodoActionsDashboardAdapter();
    const r = await a.createUntitledTask();
    expect(r.ok).toBe(false);
  });

  test("maps toggle success", async () => {
    const a = createTodoActionsDashboardAdapter();
    const r = await a.toggleTodo("1");
    expect(r.ok).toBe(true);
  });

  test("maps toggle failure", async () => {
    toggleTodoCompleteAction.mockImplementation(() =>
      Promise.resolve({ ok: false, message: "nope", code: "invalid_input" }),
    );
    const a = createTodoActionsDashboardAdapter();
    const r = await a.toggleTodo("1");
    expect(r.ok).toBe(false);
  });

  test("maps delete success", async () => {
    const a = createTodoActionsDashboardAdapter();
    const r = await a.deleteTodo("1");
    expect(r.ok).toBe(true);
  });

  test("maps delete failure", async () => {
    deleteTodoAction.mockImplementation(() =>
      Promise.resolve({ ok: false, message: "nope", code: "invalid_input" }),
    );
    const a = createTodoActionsDashboardAdapter();
    const r = await a.deleteTodo("1");
    expect(r.ok).toBe(false);
  });
});
