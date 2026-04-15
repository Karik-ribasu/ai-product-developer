import type { ReactNode } from "react";
import { fireEvent, render, waitFor, within } from "@testing-library/react";
import { describe, expect, test } from "bun:test";
import { ThemeProvider } from "styled-components";

import type { DashboardTaskSource } from "@/application/dashboard/dashboard-task-source";
import type { DashboardTodoPort } from "@/application/dashboard/dashboard-todo.port";
import { appTheme } from "@/design-system/build-app-theme";
import { MvpPrimaryDashboard } from "@/components/ui/organisms/mvp-primary-dashboard";

function renderWithTheme(ui: ReactNode) {
  return render(<ThemeProvider theme={appTheme}>{ui}</ThemeProvider>);
}

function fakePort(overrides?: Partial<DashboardTodoPort>): DashboardTodoPort {
  const todos: DashboardTaskSource[] = [{ id: "1", title: "Alpha", completed: false }];
  return {
    listTodos: async () => ({ ok: true, data: { todos } }),
    createUntitledTask: async () => ({
      ok: true,
      data: { todo: { id: "2", title: "New task", completed: false } },
    }),
    toggleTodo: async (id: string) => ({
      ok: true,
      data: { todo: { id, title: "Alpha", completed: true } },
    }),
    deleteTodo: async () => ({ ok: true, data: { deleted: true as const } }),
    ...overrides,
  };
}

describe("MvpPrimaryDashboard", () => {
  test("renders default state with tasks", async () => {
    const r = renderWithTheme(<MvpPrimaryDashboard todoPort={fakePort()} />);
    await waitFor(() => expect(r.getByText("Alpha")).toBeTruthy());
    expect(r.getByRole("heading", { name: "Tasks" })).toBeTruthy();
    expect(r.getByTestId("mvp-primary-dashboard")).toBeTruthy();
  });

  test("loading then empty", async () => {
    let resolveList: (v: Awaited<ReturnType<DashboardTodoPort["listTodos"]>>) => void = () => undefined;
    const listPromise = new Promise<Awaited<ReturnType<DashboardTodoPort["listTodos"]>>>((r) => {
      resolveList = r;
    });
    const port: DashboardTodoPort = {
      ...fakePort(),
      listTodos: async () => listPromise,
    };
    const r = renderWithTheme(<MvpPrimaryDashboard todoPort={port} />);
    expect(r.getByTestId("list-loading-skeleton")).toBeTruthy();
    resolveList({ ok: true, data: { todos: [] } });
    await waitFor(() => expect(r.getByTestId("empty-task-list")).toBeTruthy());
  });

  test("list error shows inline panel", async () => {
    const port: DashboardTodoPort = {
      ...fakePort(),
      listTodos: async () => ({ ok: false, message: "boom" }),
    };
    const r = renderWithTheme(<MvpPrimaryDashboard todoPort={port} />);
    await waitFor(() => expect(r.getByTestId("inline-error-panel")).toBeTruthy());
    fireEvent.click(r.getByRole("button", { name: "Retry" }));
  });

  test("filter to open hides completed", async () => {
    const port = fakePort({
      listTodos: async () => ({
        ok: true,
        data: {
          todos: [
            { id: "1", title: "Open row", completed: false },
            { id: "2", title: "Done row", completed: true },
          ],
        },
      }),
    });
    const r = renderWithTheme(<MvpPrimaryDashboard todoPort={port} />);
    await waitFor(() => expect(r.getByText("Done row")).toBeTruthy());
    fireEvent.click(r.getByTestId("chip-filter-open"));
    await waitFor(() => expect(r.queryByText("Done row")).toBeNull());
  });

  test("drawer opens from header", async () => {
    const r = renderWithTheme(<MvpPrimaryDashboard todoPort={fakePort()} />);
    await waitFor(() => expect(r.getByText("Alpha")).toBeTruthy());
    fireEvent.click(r.getByTestId("shell-nav-menu-button"));
    expect(r.getByTestId("drawer-overlay-mobile").getAttribute("aria-hidden")).not.toBe("true");
  });

  test("drawer nav link closes drawer", async () => {
    const r = renderWithTheme(<MvpPrimaryDashboard todoPort={fakePort()} />);
    await waitFor(() => expect(r.getByText("Alpha")).toBeTruthy());
    fireEvent.click(r.getByTestId("shell-nav-menu-button"));
    const drawer = r.getByTestId("drawer-overlay-mobile");
    fireEvent.click(within(drawer).getByRole("link", { name: "Dashboard", hidden: true }));
    await waitFor(() => expect(drawer.getAttribute("aria-hidden")).toBe("true"));
  });

  test("create task failure does not add row", async () => {
    const port = fakePort({
      createUntitledTask: async () => ({ ok: false, message: "cannot create" }),
    });
    const r = renderWithTheme(<MvpPrimaryDashboard todoPort={port} />);
    await waitFor(() => expect(r.getByText("Alpha")).toBeTruthy());
    fireEvent.click(r.getByTestId("toolbar-new-task"));
    await waitFor(() => expect(r.getByText("Alpha")).toBeTruthy());
  });

  test("toggle failure leaves row", async () => {
    const port = fakePort({
      toggleTodo: async () => ({ ok: false, message: "cannot toggle" }),
    });
    const r = renderWithTheme(<MvpPrimaryDashboard todoPort={port} />);
    await waitFor(() => expect(r.getByText("Alpha")).toBeTruthy());
    fireEvent.click(r.getByRole("button", { name: "Mark as done" }));
    await waitFor(() => expect(r.getByText("Alpha")).toBeTruthy());
  });

  test("delete failure leaves row", async () => {
    const port = fakePort({
      deleteTodo: async () => ({ ok: false, message: "cannot delete" }),
    });
    const r = renderWithTheme(<MvpPrimaryDashboard todoPort={port} />);
    await waitFor(() => expect(r.getByText("Alpha")).toBeTruthy());
    fireEvent.click(r.getByRole("button", { name: "Delete task" }));
    await waitFor(() => expect(r.getByText("Alpha")).toBeTruthy());
  });

  test("create success prepends task", async () => {
    const r = renderWithTheme(<MvpPrimaryDashboard todoPort={fakePort()} />);
    await waitFor(() => expect(r.getByText("Alpha")).toBeTruthy());
    fireEvent.click(r.getByTestId("toolbar-new-task"));
    await waitFor(() => expect(r.getByText("New task")).toBeTruthy());
  });

  test("toggle success marks complete", async () => {
    const r = renderWithTheme(<MvpPrimaryDashboard todoPort={fakePort()} />);
    await waitFor(() => expect(r.getByText("Alpha")).toBeTruthy());
    fireEvent.click(r.getByRole("button", { name: "Mark as done" }));
    await waitFor(() => expect(r.getByText("Completed")).toBeTruthy());
  });

  test("delete success removes task", async () => {
    const r = renderWithTheme(<MvpPrimaryDashboard todoPort={fakePort()} />);
    await waitFor(() => expect(r.getByText("Alpha")).toBeTruthy());
    fireEvent.click(r.getByRole("button", { name: "Delete task" }));
    await waitFor(() => expect(r.getByTestId("empty-task-list")).toBeTruthy());
  });
});
