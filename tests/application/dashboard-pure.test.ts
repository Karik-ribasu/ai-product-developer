import { describe, expect, test } from "bun:test";

import { computeDashboardKpis } from "@/application/dashboard/compute-dashboard-kpis";
import { mapSourcesToRowVms } from "@/application/dashboard/map-sources-to-row-vms";
import type { DashboardTaskSource } from "@/application/dashboard/dashboard-task-source";
import { applyTaskListFilter } from "@/application/dashboard/task-list-filter";

const samples: DashboardTaskSource[] = [
  { id: "1", title: "A", completed: false },
  { id: "2", title: "B", completed: true },
];

describe("applyTaskListFilter", () => {
  test("all returns full list", () => {
    expect(applyTaskListFilter(samples, "all")).toEqual(samples);
  });

  test("open filters incomplete", () => {
    expect(applyTaskListFilter(samples, "open")).toEqual([samples[0]]);
  });

  test("done filters complete", () => {
    expect(applyTaskListFilter(samples, "done")).toEqual([samples[1]]);
  });
});

describe("mapSourcesToRowVms", () => {
  test("maps tones and labels", () => {
    const rows = mapSourcesToRowVms(samples);
    expect(rows[0]?.statusTone).toBe("neutral");
    expect(rows[1]?.statusTone).toBe("success");
    expect(rows[1]?.statusLabel).toBe("Done");
  });
});

describe("computeDashboardKpis", () => {
  test("counts open and done", () => {
    expect(computeDashboardKpis(samples)).toEqual({ total: 2, open: 1, done: 1 });
  });

  test("handles empty", () => {
    expect(computeDashboardKpis([])).toEqual({ total: 0, open: 0, done: 0 });
  });
});
