export type DashboardStatusTone = "success" | "warning" | "error" | "neutral";

export type DashboardTaskRowVm = {
  id: string;
  title: string;
  meta: string;
  statusTone: DashboardStatusTone;
  statusLabel: string;
};
