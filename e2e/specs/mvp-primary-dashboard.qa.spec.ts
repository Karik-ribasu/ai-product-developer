import { execSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { expect, test, type Page } from "@playwright/test";

const ARTIFACTS_DIR = join(
  process.cwd(),
  "tasks/app-ui-design-system/quality-gate/artifacts",
);
const VISUAL_DIR = join(ARTIFACTS_DIR, "visual");

type ConsoleIssue = { type: string; text: string; location?: string };
type NetworkIssue = { url: string; status: number; method: string };

function shouldIgnoreConsoleMessage(text: string): boolean {
  const t = text.trim();
  if (t.includes("Download the React DevTools")) return true;
  if (t.includes("favicon")) return true;
  return false;
}

function resolveGitSha(): string {
  try {
    return execSync("git rev-parse HEAD", { encoding: "utf8" }).trim();
  } catch {
    return process.env.GITHUB_SHA ?? "unknown";
  }
}

async function collectChromiumVersion(page: Page): Promise<string> {
  const b = page.context().browser();
  return (await b?.version()) ?? "unknown";
}

async function screenshotViewport(
  page: Page,
  fileName: string,
  viewport: { width: number; height: number },
): Promise<string> {
  await page.setViewportSize(viewport);
  await page.waitForLoadState("load");
  const rel = `artifacts/visual/${fileName}`;
  const abs = join(ARTIFACTS_DIR, "visual", fileName);
  await page.screenshot({ path: abs, fullPage: true });
  return rel;
}

test.describe.configure({ mode: "serial" });

test.describe("MVP primary dashboard (quality-gate)", () => {
  const consoleIssues: ConsoleIssue[] = [];
  const networkIssues: NetworkIssue[] = [];

  test.beforeEach(async ({ page }) => {
    page.on("console", (msg) => {
      const type = msg.type();
      if (type !== "error" && type !== "warning") return;
      const text = msg.text();
      if (shouldIgnoreConsoleMessage(text)) return;
      consoleIssues.push({
        type,
        text,
        location: msg.location().url ?? undefined,
      });
    });
    const origin = (process.env.BASE_URL ?? "http://127.0.0.1:3000").replace(/\/$/, "");
    page.on("response", (res) => {
      const status = res.status();
      if (status < 400) return;
      const url = res.url();
      if (url.includes("favicon")) return;
      if (!url.startsWith(origin)) return;
      networkIssues.push({ url, status, method: res.request().method() });
    });
  });

  test("automated-manual flows, console/network hygiene, visual evidence", async ({ page }) => {
    test.setTimeout(180_000);
    mkdirSync(VISUAL_DIR, { recursive: true });

    const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:3000";
    const inCompose = process.env.QA_IN_DOCKER_COMPOSE === "1";
    const chromiumVersion = await collectChromiumVersion(page);
    const capturedAt = new Date().toISOString();
    const captures: Array<{
      capture_id: string;
      viewport: "mobile" | "tablet" | "desktop";
      width_px: number;
      route: string;
      state: string;
      file_path: string;
      notes?: string;
    }> = [];

    const viewports: Array<{ id: "mobile" | "tablet" | "desktop"; width: number; height: number }> = [
      { id: "mobile", width: 390, height: 844 },
      { id: "tablet", width: 768, height: 1024 },
      { id: "desktop", width: 1280, height: 900 },
    ];

    const response = await page.goto("/");
    expect(response?.ok()).toBeTruthy();
    await expect(page.getByTestId("mvp-primary-dashboard")).toBeVisible({ timeout: 60_000 });
    await expect(page.getByTestId("task-list-region")).toBeVisible({ timeout: 30_000 });
    await Promise.race([
      page.getByTestId("empty-task-list").waitFor({ state: "visible", timeout: 120_000 }),
      page
        .locator('[data-testid^="card-task-row-"]')
        .first()
        .waitFor({ state: "visible", timeout: 120_000 }),
      page.getByTestId("inline-error-panel").waitFor({ state: "visible", timeout: 120_000 }),
    ]);
    if (await page.getByTestId("inline-error-panel").isVisible()) {
      throw new Error("Dashboard failed to load tasks (inline error panel visible).");
    }
    await page.getByTestId("chip-filter-all").click();
    for (let guard = 0; guard < 50; guard += 1) {
      const row = page.locator('[data-testid^="card-task-row-"]').first();
      if ((await row.count()) === 0) break;
      const testId = await row.getAttribute("data-testid");
      expect(testId).toBeTruthy();
      await row.getByRole("button", { name: "Delete task" }).click();
      await expect(page.locator(`[data-testid="${testId}"]`)).toHaveCount(0, { timeout: 15_000 });
    }

    await expect(page.getByTestId("empty-task-list")).toBeVisible({ timeout: 30_000 });

    for (const vp of viewports) {
      const rel = await screenshotViewport(page, `${vp.id}-home-empty.png`, vp);
      captures.push({
        capture_id: `${vp.id}-home-empty`,
        viewport: vp.id,
        width_px: vp.width,
        route: "/",
        state: "empty",
        file_path: rel,
        notes: "Fresh QA SQLite volume; anonymous demo data (empty task list).",
      });
    }

    await page.getByTestId("empty-primary-cta").click();
    await expect(page.getByTestId("toolbar-new-task")).toBeVisible();
    await expect(page.locator('[data-testid^="card-task-row-"]').first()).toBeVisible();

    for (const vp of viewports) {
      const rel = await screenshotViewport(page, `${vp.id}-home-with-task.png`, vp);
      captures.push({
        capture_id: `${vp.id}-home-with-task`,
        viewport: vp.id,
        width_px: vp.width,
        route: "/",
        state: "default",
        file_path: rel,
        notes: "Single untitled task after first create.",
      });
    }

    const row = page.locator('[data-testid^="card-task-row-"]').first();
    await row.getByRole("button", { name: "Mark as done" }).click();
    await expect(row.getByRole("button", { name: "Mark as open" })).toBeVisible();

    await page.getByTestId("chip-filter-open").click();
    await expect(page.getByTestId("filtered-empty-state")).toBeVisible();

    for (const vp of viewports) {
      const rel = await screenshotViewport(page, `${vp.id}-home-filtered-empty.png`, vp);
      captures.push({
        capture_id: `${vp.id}-home-filtered-empty`,
        viewport: vp.id,
        width_px: vp.width,
        route: "/",
        state: "filtered-empty",
        file_path: rel,
        notes: "Open filter while all tasks are done.",
      });
    }

    await page.getByRole("button", { name: "Show all tasks" }).click();
    await expect(page.getByTestId("filtered-empty-state")).toHaveCount(0);

    await page.getByTestId("chip-filter-all").click();

    await page.getByTestId("toolbar-new-task").click();
    await expect(page.locator('[data-testid^="card-task-row-"]')).toHaveCount(2);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.getByTestId("shell-nav-menu-button").click();
    await expect(page.getByRole("heading", { name: "Navigation" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("heading", { name: "Navigation" })).toBeHidden();

    await page.getByTestId("mvp-primary-dashboard").click({ position: { x: 4, y: 4 } });
    let focusedToolbar = false;
    for (let i = 0; i < 48; i += 1) {
      await page.keyboard.press("Tab");
      const id = await page.evaluate(() => document.activeElement?.getAttribute("data-testid"));
      if (id === "toolbar-new-task") {
        focusedToolbar = true;
        break;
      }
    }
    expect(focusedToolbar, "Expected Tab roving focus to reach toolbar New task (keyboard navigation).").toBe(
      true,
    );

    const manifest = {
      kind: "qa-visual-evidence" as const,
      schema_version: 1,
      feature_slug: "app-ui-design-system",
      surface_id: "mvp-primary-dashboard",
      build: {
        git_sha: resolveGitSha(),
        captured_at: capturedAt,
      },
      environment: {
        base_url: baseUrl,
        container_compose_service: inCompose ? "qa-chromium" : "local-workstation-not-compose",
        chromium_version: chromiumVersion,
        ...(inCompose
          ? {
              compose_project: "appui-design-system-qa",
              app_compose_service: "web",
              qa_in_docker_compose: true,
            }
          : {}),
      },
      captures,
      errors: inCompose
        ? ([] as string[])
        : [
            "Captured outside docker-compose.qa.yml (environment.container_compose_service=local-workstation-not-compose). For canonical evidence, run `bun run qa:compose` or CI `qa-e2e-chromium` (BASE_URL=http://web:3000, QA_IN_DOCKER_COMPOSE=1).",
          ],
    };

    writeFileSync(join(ARTIFACTS_DIR, "qa_visual_evidence.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

    const blockingConsole = consoleIssues.filter((c) => c.type === "error");
    expect(
      blockingConsole,
      `Unexpected console errors: ${JSON.stringify(blockingConsole)}`,
    ).toHaveLength(0);

    expect(networkIssues, `Unexpected network failures: ${JSON.stringify(networkIssues)}`).toHaveLength(0);
  });
});
