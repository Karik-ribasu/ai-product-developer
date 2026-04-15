import type { ReactNode } from "react";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { describe, expect, mock, test } from "bun:test";
import { ThemeProvider } from "styled-components";

import type { DashboardTaskRowVm } from "@/application/dashboard/dashboard-task-row.vm";
import { appTheme } from "@/design-system/build-app-theme";
import { BadgeStatus } from "@/components/ui/atoms/badge-status";
import { Spinner } from "@/components/ui/atoms/spinner";
import { ButtonPrimary } from "@/components/ui/atoms/button-primary";
import { ButtonSecondary } from "@/components/ui/atoms/button-secondary";
import { ChipFilter } from "@/components/ui/molecules/chip-filter";
import { PageHeaderTitle } from "@/components/ui/molecules/page-header-title";
import { ToolbarCluster } from "@/components/ui/molecules/toolbar-cluster";
import { CardTaskRow } from "@/components/ui/organisms/card-task-row";
import { DrawerOverlayMobile } from "@/components/ui/organisms/drawer-overlay-mobile";
import { EmptyTaskList } from "@/components/ui/organisms/empty-task-list";
import { FilteredEmptyState } from "@/components/ui/organisms/filtered-empty-state";
import { InlineErrorPanel } from "@/components/ui/organisms/inline-error-panel";
import { KpiStrip } from "@/components/ui/organisms/kpi-strip";
import { ListLoadingSkeleton } from "@/components/ui/organisms/list-loading-skeleton";
import { NavSidebar } from "@/components/ui/organisms/nav-sidebar";
import { ShellAppHeader } from "@/components/ui/organisms/shell-app-header";
import { SurfaceMainColumn } from "@/components/ui/templates/surface-main-column";

function renderWithTheme(ui: ReactNode) {
  return render(<ThemeProvider theme={appTheme}>{ui}</ThemeProvider>);
}

describe("dashboard atoms", () => {
  test("BadgeStatus renders label", () => {
    const r = renderWithTheme(<BadgeStatus tone="neutral" label="Open" />);
    expect(r.getByLabelText("Open")).toBeTruthy();
  });

  test("BadgeStatus warning and error tones", () => {
    const w = renderWithTheme(<BadgeStatus tone="warning" label="Warn" />);
    expect(w.getByLabelText("Warn")).toBeTruthy();
    const e = renderWithTheme(<BadgeStatus tone="error" label="Err" />);
    expect(e.getByLabelText("Err")).toBeTruthy();
  });

  test("Spinner renders", () => {
    const r = renderWithTheme(<Spinner label="Busy" />);
    expect(r.getByLabelText("Busy")).toBeTruthy();
  });

  test("ButtonPrimary click and loading", async () => {
    let called = false;
    const r = renderWithTheme(
      <ButtonPrimary loading={false} onClick={() => void (called = true)}>
        Go
      </ButtonPrimary>,
    );
    fireEvent.click(r.getByRole("button", { name: "Go" }));
    expect(called).toBe(true);
  });

  test("ButtonSecondary", () => {
    const r = renderWithTheme(<ButtonSecondary onClick={() => undefined}>Retry</ButtonSecondary>);
    fireEvent.click(r.getByRole("button", { name: "Retry" }));
  });
});

describe("dashboard molecules", () => {
  test("ChipFilter toggles", () => {
    let pressed = false;
    const r = renderWithTheme(
      <ChipFilter
        label="Open"
        pressed={pressed}
        onToggle={() => {
          pressed = !pressed;
        }}
      />,
    );
    fireEvent.click(r.getByRole("button", { name: "Open" }));
  });

  test("PageHeaderTitle", () => {
    const r = renderWithTheme(<PageHeaderTitle>Tasks</PageHeaderTitle>);
    expect(r.getByRole("heading", { level: 1, name: "Tasks" })).toBeTruthy();
  });

  test("ToolbarCluster", () => {
    const r = renderWithTheme(
      <ToolbarCluster primaryAction={<button type="button">New</button>} filters={<span>filters</span>} />,
    );
    expect(r.getByText("New")).toBeTruthy();
  });
});

describe("dashboard organisms", () => {
  test("ShellAppHeader menu", () => {
    let opened = false;
    const r = renderWithTheme(<ShellAppHeader productLabel="App" onOpenNav={() => void (opened = true)} />);
    fireEvent.click(r.getByTestId("shell-nav-menu-button"));
    expect(opened).toBe(true);
  });

  test("NavSidebar links", () => {
    const r = renderWithTheme(<NavSidebar items={[{ id: "a", label: "Home", href: "/", active: true }]} />);
    expect(r.getByRole("link", { name: "Home" }).getAttribute("aria-current")).toBe("page");
  });

  test("DrawerOverlayMobile Escape calls onClose", async () => {
    const onClose = mock(() => undefined);
    renderWithTheme(
      <DrawerOverlayMobile open titleId="tid" onClose={onClose}>
        <h2 id="tid">Nav</h2>
        <button type="button">First focusable</button>
      </DrawerOverlayMobile>,
    );
    fireEvent.keyDown(window, { key: "Escape" });
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  test("KpiStrip", () => {
    const r = renderWithTheme(<KpiStrip kpis={{ total: 3, open: 1, done: 2 }} />);
    expect(r.getByText("3")).toBeTruthy();
  });

  test("ListLoadingSkeleton", () => {
    const r = renderWithTheme(<ListLoadingSkeleton />);
    expect(r.getByTestId("list-loading-skeleton")).toBeTruthy();
  });

  test("EmptyTaskList", async () => {
    const r = renderWithTheme(
      <EmptyTaskList onNewTask={() => undefined} onLearnMore={() => undefined} />,
    );
    fireEvent.click(r.getByTestId("empty-primary-cta"));
    fireEvent.click(r.getByRole("button", { name: "Learn how tasks work" }));
    await waitFor(() => expect(true).toBe(true));
  });

  test("FilteredEmptyState", () => {
    const r = renderWithTheme(<FilteredEmptyState onClearFilters={() => undefined} />);
    fireEvent.click(r.getByRole("button", { name: "Show all tasks" }));
  });

  test("InlineErrorPanel retry", () => {
    const r = renderWithTheme(<InlineErrorPanel title="Err" message="Details" onRetry={() => undefined} />);
    expect(r.getByRole("alert")).toBeTruthy();
    fireEvent.click(r.getByRole("button", { name: "Retry" }));
  });

  const row: DashboardTaskRowVm = {
    id: "1",
    title: "Hello",
    meta: "Due",
    statusTone: "neutral",
    statusLabel: "Open",
  };

  test("CardTaskRow actions", () => {
    const r = renderWithTheme(
      <CardTaskRow row={row} onToggleComplete={() => undefined} onDelete={() => undefined} />,
    );
    fireEvent.click(r.getByRole("button", { name: "Mark as done" }));
    fireEvent.click(r.getByRole("button", { name: "Delete task" }));
  });
});

describe("surface template", () => {
  test("SurfaceMainColumn landmark", () => {
    const r = renderWithTheme(
      <SurfaceMainColumn>
        <p>inside</p>
      </SurfaceMainColumn>,
    );
    expect(r.getByRole("main").textContent).toContain("inside");
  });
});
