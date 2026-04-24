import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { chromium } from "@playwright/test";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

/**
 * Monorepo checkout: `.../ai-product-developer/projects/todo-reference`.
 * Docker E2E mount: `/workspace` = package root only — no grandparent `projects/`.
 */
function resolveStitchPaths(root) {
  const parent = path.resolve(root, "..");
  const grandparent = path.resolve(root, "..", "..");
  const localMeta = path.join(root, "design", "stitch", "meta.json");
  const underProjects =
    path.basename(parent) === "projects" && fs.existsSync(localMeta);
  if (underProjects) {
    return { stitchRoot: root, reportAnchor: grandparent };
  }
  if (fs.existsSync(localMeta)) {
    return { stitchRoot: root, reportAnchor: root };
  }
  const monoRef = path.join(grandparent, "projects", "todo-reference");
  if (fs.existsSync(path.join(monoRef, "design", "stitch", "meta.json"))) {
    return { stitchRoot: monoRef, reportAnchor: grandparent };
  }
  throw new Error(`Cannot resolve design/stitch from ${root}`);
}

const { stitchRoot, reportAnchor } = resolveStitchPaths(projectRoot);

const baseURL = process.env.E2E_BASE_URL ?? "http://127.0.0.1:3000";

const uiSpecPath = path.join(
  stitchRoot,
  "tasks/todo-mvp/07-ui-generator-stitch-four-screens/artifacts/ui_spec.json",
);

if (process.env.STITCH_BASELINE_UI !== "1") {
  // eslint-disable-next-line no-console
  console.warn(
    "[stitch-fidelity] Start the app with STITCH_BASELINE_UI=1 for deterministic dashboard pixels (e.g. STITCH_BASELINE_UI=1 npm run start).",
  );
}

const metaPath = path.join(stitchRoot, "design/stitch/meta.json");
const visualDir = path.join(stitchRoot, "tasks/todo-mvp/quality-gate/artifacts/visual");
const reportPath = path.join(stitchRoot, "tasks/todo-mvp/quality-gate/artifacts/stitch_fidelity_report.json");

function relReport(p) {
  return path.relative(reportAnchor, p).replaceAll("\\", "/");
}

const screens = [
  { id: "ed27f21d8f24440a940099c842b535bf", route: "/login", auth: "none" },
  { id: "11611814ea7a4a2881d76c0c95fd3066", route: "/dashboard", auth: "stub" },
  { id: "eeb35234b6764d199f5085e69e9cc0fc", route: "/activity-feed", auth: "stub" },
  { id: "0caac050ee504d6ebca41d202bbd1ca7", route: "/tasks/new", auth: "stub" },
];

/** Section ids that only appear for empty feed or error states — skip when not rendered. */
const OPTIONAL_UISPEC_SECTIONS = new Set(["feed.empty", "feed.error"]);

function readPngSize(filePath) {
  const buf = fs.readFileSync(filePath);
  const png = PNG.sync.read(buf);
  return { width: png.width, height: png.height, data: png.data };
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function loadUiSpec() {
  const raw = fs.readFileSync(uiSpecPath, "utf8");
  return JSON.parse(raw);
}

function routeSpecForScreen(uiSpec, stitchScreenId) {
  return uiSpec.routes?.find((r) => r.stitch_screen_id === stitchScreenId) ?? null;
}

/**
 * @param {import('@playwright/test').Page} page
 * @param {string} routePath
 * @param {string} sectionId
 * @returns {import('@playwright/test').Locator}
 */
function locatorForUiSpecSection(page, routePath, sectionId) {
  if (routePath === "/login") {
    if (sectionId === "login.header") return page.locator("main").locator("h1").first();
    if (sectionId === "login.providers")
      return page.getByRole("button", { name: /Continue with Google/i });
    if (sectionId === "login.primary_cta")
      return page.getByRole("button", { name: /Enter Workspace/i });
  }

  if (routePath === "/dashboard") {
    if (sectionId === "dashboard.hero") {
      return page
        .locator('[aria-labelledby="baseline-hero"], [aria-labelledby="dashboard-hero-title"]')
        .first();
    }
    if (sectionId === "dashboard.workspace") {
      return page.getByRole("heading", { name: /Top Priorities/i }).locator("..").locator("..");
    }
  }

  if (routePath === "/activity-feed") {
    if (sectionId === "feed.header") {
      return page.getByRole("heading", { name: /Community Flow/i }).locator("xpath=ancestor::header[1]");
    }
    if (sectionId === "feed.timeline") {
      return page.locator("main article").first();
    }
    if (sectionId === "feed.empty") {
      return page.getByRole("heading", { name: /No posts yet/i }).locator("xpath=ancestor::section[1]");
    }
    if (sectionId === "feed.error") {
      return page.getByRole("heading", { name: /Could not load the feed/i }).locator("xpath=ancestor::section[1]");
    }
  }

  if (routePath === "/tasks/new") {
    if (sectionId === "task_dark.header") {
      return page
        .locator("div")
        .filter({ has: page.getByRole("heading", { name: /Curate your next objective/i }) })
        .filter({ has: page.getByRole("link", { name: /Back to dashboard/i }) })
        .first();
    }
    if (sectionId === "task_dark.form") {
      return page.locator("#baseline-task-title, #task-title").first().locator("xpath=ancestor::section[1]");
    }
    if (sectionId === "task_dark.primary") {
      return page.getByRole("button", { name: /save task/i });
    }
  }

  return page.locator("__invalid__");
}

/**
 * @param {import('@playwright/test').Page} page
 * @param {string} routePath
 * @returns {Promise<string[]>}
 */
async function primaryAffordanceChecks(page, routePath) {
  const out = [];
  if (routePath === "/login") {
    const google = page.getByRole("button", { name: /Continue with Google/i });
    const enter = page.getByRole("button", { name: /Enter Workspace/i });
    if ((await google.count()) === 0 || !(await google.first().isVisible())) {
      out.push("ui_spec primary affordance: missing or hidden Continue with Google (login.providers).");
    }
    if ((await enter.count()) === 0 || !(await enter.first().isVisible())) {
      out.push("ui_spec primary affordance: missing or hidden Enter Workspace submit (login.primary_cta).");
    }
  }
  if (routePath === "/dashboard") {
    const hero = page.locator('[aria-labelledby="baseline-hero"], [aria-labelledby="dashboard-hero-title"]');
    if ((await hero.count()) === 0 || !(await hero.first().isVisible())) {
      out.push("ui_spec primary affordance: dashboard hero band not found (dashboard.hero).");
    }
    const priorities = page.getByRole("heading", { name: /Top Priorities/i });
    if ((await priorities.count()) === 0 || !(await priorities.first().isVisible())) {
      out.push("ui_spec primary affordance: Top Priorities workspace header not found (dashboard.workspace).");
    }
  }
  if (routePath === "/activity-feed") {
    const title = page.getByRole("heading", { name: /Community Flow/i });
    if ((await title.count()) === 0 || !(await title.first().isVisible())) {
      out.push("ui_spec primary affordance: feed title Community Flow not visible (feed.header).");
    }
    const timeline = page.locator("main article").first();
    const err = page.getByRole("heading", { name: /Could not load the feed/i });
    const empty = page.getByRole("heading", { name: /No posts yet/i });
    const hasTimeline = (await timeline.count()) > 0 && (await timeline.isVisible());
    const hasErr = (await err.count()) > 0 && (await err.first().isVisible());
    const hasEmpty = (await empty.count()) > 0 && (await empty.first().isVisible());
    if (!hasTimeline && !hasErr && !hasEmpty) {
      out.push(
        "ui_spec primary affordance: expected timeline articles, empty state (No posts yet), or error panel — none visible.",
      );
    }
  }
  if (routePath === "/tasks/new") {
    const back = page.getByRole("link", { name: /Back to dashboard/i });
    if ((await back.count()) === 0 || !(await back.first().isVisible())) {
      out.push("ui_spec primary affordance: back link to dashboard missing (task_dark.header).");
    }
    const save = page.getByRole("button", { name: /save task/i });
    if ((await save.count()) === 0 || !(await save.first().isVisible())) {
      out.push("ui_spec primary affordance: primary save CTA missing (task_dark.primary).");
    }
  }
  return out;
}

/**
 * @param {import('@playwright/test').Page} page
 * @param {object} routeSpec from ui_spec.routes[]
 * @returns {Promise<string[]>}
 */
async function collectUiSpecSemanticMismatches(page, routeSpec) {
  const mismatches = [];
  if (!routeSpec?.sections?.length) {
    mismatches.push(`ui_spec: no sections[] for route ${routeSpec?.path ?? "unknown"}.`);
    return mismatches;
  }

  const anchors = [];
  for (const sec of routeSpec.sections) {
    const loc = locatorForUiSpecSection(page, routeSpec.path, sec.id);
    const optional = OPTIONAL_UISPEC_SECTIONS.has(sec.id);
    const n = await loc.count();
    let visible = false;
    if (n > 0) {
      try {
        visible = await loc.first().isVisible();
      } catch {
        visible = false;
      }
    }
    if (optional) {
      if (!visible) continue;
    } else if (!visible) {
      mismatches.push(`ui_spec section "${sec.id}": not found or not visible — ${sec.description}`);
      continue;
    }
    const box = await loc.first().boundingBox();
    const top = box?.y ?? 0;
    anchors.push({ id: sec.id, top });
  }

  const ORDER_EPS = 2;
  for (let i = 1; i < anchors.length; i++) {
    if (anchors[i].top + ORDER_EPS < anchors[i - 1].top) {
      mismatches.push(
        `ui_spec section order: "${anchors[i - 1].id}" should appear above "${anchors[i].id}" (tops ${anchors[i - 1].top.toFixed(1)} vs ${anchors[i].top.toFixed(1)}).`,
      );
    }
  }

  mismatches.push(...(await primaryAffordanceChecks(page, routeSpec.path)));
  return mismatches;
}

async function stubLogin(page) {
  await page.goto(`${baseURL}/login`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Enter Workspace" }).click();
  await page.waitForURL("**/dashboard", { timeout: 30_000 });
}

async function main() {
  ensureDir(visualDir);

  let uiSpec;
  try {
    uiSpec = loadUiSpec();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(`[stitch-fidelity] Failed to load ui_spec: ${uiSpecPath}`, e);
    process.exit(1);
  }

  const browser = await chromium.launch();
  const perScreen = [];
  const consoleIssues = [];
  const networkIssues = [];

  try {
    for (const screen of screens) {
      const refPath = path.join(stitchRoot, "design/stitch/screens", `${screen.id}.png`);
      const ref = readPngSize(refPath);
      const viewport = { width: ref.width, height: ref.height };

      const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
      const page = await context.newPage();

      page.on("console", (msg) => {
        const type = msg.type();
        if (type === "error" || type === "warning") {
          consoleIssues.push({ screen: screen.id, type, text: msg.text() });
        }
      });

      page.on("response", (res) => {
        const status = res.status();
        if (status >= 400 && res.url().includes(baseURL.replace(/\/$/, ""))) {
          networkIssues.push({ screen: screen.id, url: res.url(), status });
        }
      });

      if (screen.auth === "stub") {
        await stubLogin(page);
        await page.setViewportSize(viewport);
      } else {
        await page.setViewportSize(viewport);
      }

      await page.goto(`${baseURL}${screen.route}`, { waitUntil: "networkidle" });
      await page.waitForTimeout(2000);

      const routeSpec = routeSpecForScreen(uiSpec, screen.id);
      const semanticMismatches = await collectUiSpecSemanticMismatches(page, routeSpec);

      const appShot = path.join(visualDir, `app-${screen.id}.png`);
      const refCopy = path.join(visualDir, `stitch-ref-${screen.id}.png`);
      fs.copyFileSync(refPath, refCopy);

      await page.screenshot({ path: appShot, fullPage: false });

      const appBuf = fs.readFileSync(appShot);
      const appPng = PNG.sync.read(appBuf);

      let diffRatio = 1;
      let pixelPass = false;
      const mismatches = [];

      if (appPng.width !== ref.width || appPng.height !== ref.height) {
        mismatches.push(
          `Dimension mismatch: app ${appPng.width}x${appPng.height} vs ref ${ref.width}x${ref.height}`,
        );
      } else {
        const diff = new PNG({ width: ref.width, height: ref.height });
        const numDiff = pixelmatch(ref.data, appPng.data, diff.data, ref.width, ref.height, {
          threshold: 0.1,
        });
        const total = ref.width * ref.height;
        diffRatio = total === 0 ? 0 : numDiff / total;
        pixelPass = numDiff === 0;
        const diffPath = path.join(visualDir, `diff-${screen.id}.png`);
        if (!pixelPass) {
          fs.writeFileSync(diffPath, PNG.sync.write(diff));
          mismatches.push(`Pixel difference count: ${numDiff} (diff image: ${relReport(diffPath)})`);
        }
      }

      mismatches.push(...semanticMismatches);

      /** Pixel gate only (task acceptance: diff_ratio 0); ui_spec findings live in `mismatches[]`. */
      const pass = pixelPass;

      await context.close();

      perScreen.push({
        id: screen.id,
        route: screen.route,
        stitch_png_path: relReport(refPath),
        app_screenshot_path: relReport(appShot),
        viewport,
        comparison_tool: "pixelmatch",
        diff_ratio: Number(diffRatio.toFixed(8)),
        pass,
        mismatches,
      });
    }
  } finally {
    await browser.close();
  }

  const noUiSpecViolations = perScreen.every(
    (r) => !r.mismatches.some((m) => typeof m === "string" && m.startsWith("ui_spec")),
  );
  const status = perScreen.every((r) => r.pass) && noUiSpecViolations ? "pass" : "fail";
  const report = {
    schema_version: 1,
    status,
    compared_baseline: relReport(metaPath),
    ui_spec_path: relReport(uiSpecPath),
    comparison_tool_default: "pixelmatch",
    viewports: screens.map((s) => {
      const row = perScreen.find((p) => p.id === s.id);
      return { id: s.id, route: s.route, viewport: row?.viewport ?? null };
    }),
    per_screen: perScreen,
    console_issues: consoleIssues,
    network_issues: networkIssues,
    generated_at: new Date().toISOString(),
    base_url: baseURL,
  };

  ensureDir(path.dirname(reportPath));
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  // eslint-disable-next-line no-console
  console.log(`Wrote ${relReport(reportPath)} (status=${status})`);
  process.exit(status === "pass" ? 0 : 1);
}

await main();
