import { expect, test } from "@playwright/test";

/**
 * Harness smoke only: proves the isolated app responds over HTTP for Chromium QA wiring.
 * Feature-level E2E lives with qa-agent / quality-gate assignments.
 */
test("application base URL responds", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.ok()).toBeTruthy();
});
