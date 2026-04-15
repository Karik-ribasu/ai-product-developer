"use client";

import { useCallback, useEffect, useId, useMemo, useState } from "react";
import styled from "styled-components";

import type { DashboardTaskSource } from "@/application/dashboard/dashboard-task-source";
import { computeDashboardKpis } from "@/application/dashboard/compute-dashboard-kpis";
import type { DashboardTodoPort } from "@/application/dashboard/dashboard-todo.port";
import { mapSourcesToRowVms } from "@/application/dashboard/map-sources-to-row-vms";
import type { TaskListFilter } from "@/application/dashboard/task-list-filter";
import { applyTaskListFilter } from "@/application/dashboard/task-list-filter";
import { ButtonPrimary } from "@/components/ui/atoms/button-primary";
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
import type { NavItem } from "@/components/ui/organisms/nav-sidebar";
import { NavSidebar } from "@/components/ui/organisms/nav-sidebar";
import { ShellAppHeader } from "@/components/ui/organisms/shell-app-header";
import { SurfaceMainColumn } from "@/components/ui/templates/surface-main-column";

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Body = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  min-height: 0;
`;

const DrawerNav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.space2};
`;

const DrawerLink = styled.a<{ $active?: boolean }>`
  padding: ${({ theme }) => `${theme.space.space3} ${theme.space.space3}`};
  border-radius: ${({ theme }) => theme.radiusTokens.radiusSm};
  font-size: ${({ theme }) => theme.typography.typeLabel.fontSize};
  color: ${({ theme, $active }) => ($active ? theme.colors.fgDefault : theme.colors.fgMuted)};
  text-decoration: none;
  background: ${({ theme, $active }) => ($active ? theme.colors.bgSubtle : "transparent")};

  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadows.focusRing};
  }
`;

const ListStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.space3};
`;

export type MvpPrimaryDashboardProps = {
  todoPort: DashboardTodoPort;
};

export function MvpPrimaryDashboard({ todoPort }: MvpPrimaryDashboardProps) {

  const [sources, setSources] = useState<DashboardTaskSource[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [filter, setFilter] = useState<TaskListFilter>("all");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [createBusy, setCreateBusy] = useState(false);
  const [rowBusy, setRowBusy] = useState<Record<string, "toggle" | "delete" | undefined>>({});

  const drawerTitleId = useId();

  const navItems: NavItem[] = useMemo(
    () => [
      { id: "dash", label: "Dashboard", href: "/", active: true },
      { id: "tasks", label: "Tasks", href: "/", active: false },
    ],
    [],
  );

  const reload = useCallback(async () => {
    setListLoading(true);
    setListError(null);
    const res = await todoPort.listTodos();
    setListLoading(false);
    if (res.ok) {
      setSources(res.data.todos);
    } else {
      setListError(res.message);
    }
  }, [todoPort]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const filtered = useMemo(() => applyTaskListFilter(sources, filter), [sources, filter]);
  const rows = useMemo(() => mapSourcesToRowVms(filtered), [filtered]);
  const kpis = useMemo(() => computeDashboardKpis(sources), [sources]);

  const setChip = (next: TaskListFilter) => {
    setFilter(next);
  };

  const onNewTask = useCallback(async () => {
    setCreateBusy(true);
    const res = await todoPort.createUntitledTask();
    setCreateBusy(false);
    if (res.ok) {
      setSources((prev) => [res.data.todo, ...prev]);
    }
  }, [todoPort]);

  const onToggle = useCallback(
    async (id: string) => {
      setRowBusy((b) => ({ ...b, [id]: "toggle" }));
      const res = await todoPort.toggleTodo(id);
      setRowBusy((b) => ({ ...b, [id]: undefined }));
      if (res.ok) {
        setSources((prev) => prev.map((t) => (t.id === id ? res.data.todo : t)));
      }
    },
    [todoPort],
  );

  const onDelete = useCallback(
    async (id: string) => {
      setRowBusy((b) => ({ ...b, [id]: "delete" }));
      const res = await todoPort.deleteTodo(id);
      setRowBusy((b) => ({ ...b, [id]: undefined }));
      if (res.ok) {
        setSources((prev) => prev.filter((t) => t.id !== id));
      }
    },
    [todoPort],
  );

  const listRegion = (() => {
    if (listLoading) {
      return <ListLoadingSkeleton />;
    }
    if (listError) {
      return (
        <InlineErrorPanel title="Could not load tasks" message={listError} onRetry={() => void reload()} />
      );
    }
    if (sources.length === 0) {
      return <EmptyTaskList onNewTask={() => void onNewTask()} />;
    }
    if (rows.length === 0) {
      return <FilteredEmptyState onClearFilters={() => setFilter("all")} />;
    }
    return (
      <ListStack>
        {rows.map((r) => (
          <CardTaskRow
            key={r.id}
            row={r}
            onToggleComplete={() => void onToggle(r.id)}
            onDelete={() => void onDelete(r.id)}
            toggleDisabled={rowBusy[r.id] !== undefined}
            deleteDisabled={rowBusy[r.id] !== undefined}
          />
        ))}
      </ListStack>
    );
  })();

  return (
    <Page data-testid="mvp-primary-dashboard">
      <ShellAppHeader productLabel="Smart Task Manager" onOpenNav={() => setDrawerOpen(true)} />
      <Body>
        <NavSidebar items={navItems} />
        <DrawerOverlayMobile open={drawerOpen} titleId={drawerTitleId} onClose={() => setDrawerOpen(false)}>
          <h2 id={drawerTitleId} style={{ marginTop: 0 }}>
            Navigation
          </h2>
          <DrawerNav>
            {navItems.map((it) => (
              <DrawerLink key={it.id} href={it.href} $active={it.active} onClick={() => setDrawerOpen(false)}>
                {it.label}
              </DrawerLink>
            ))}
          </DrawerNav>
        </DrawerOverlayMobile>
        <SurfaceMainColumn>
          <PageHeaderTitle>Tasks</PageHeaderTitle>
          <KpiStrip kpis={kpis} />
          <ToolbarCluster
            primaryAction={
              <ButtonPrimary
                loading={createBusy}
                onClick={() => void onNewTask()}
                data-testid="toolbar-new-task"
              >
                New task
              </ButtonPrimary>
            }
            filters={
              <>
                <ChipFilter label="All" pressed={filter === "all"} onToggle={() => setChip("all")} />
                <ChipFilter label="Open" pressed={filter === "open"} onToggle={() => setChip("open")} />
                <ChipFilter label="Done" pressed={filter === "done"} onToggle={() => setChip("done")} />
              </>
            }
          />
          <section data-testid="task-list-region" aria-live={listLoading ? "polite" : undefined}>
            {listRegion}
          </section>
        </SurfaceMainColumn>
      </Body>
    </Page>
  );
}
