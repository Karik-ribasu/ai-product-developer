"use client";

import { useMemo } from "react";

import { createTodoActionsDashboardAdapter } from "@/interface-adapters/dashboard/todo-actions-dashboard.adapter";

import { MvpPrimaryDashboard } from "./mvp-primary-dashboard";

/**
 * Thin edge component: wires the real server-action adapter so `MvpPrimaryDashboard`
 * stays testable without importing `server-only` transitively.
 */
export function DashboardPageClient() {
  const todoPort = useMemo(() => createTodoActionsDashboardAdapter(), []);
  return <MvpPrimaryDashboard todoPort={todoPort} />;
}
