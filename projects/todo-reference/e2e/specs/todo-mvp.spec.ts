import { expect, test } from "@playwright/test";

test.describe.configure({ mode: "serial" });

test.describe("todo MVP UI", () => {
  test("stub login, four routes, todos, and feed", async ({ page }) => {
    const suffix = Math.random().toString(36).slice(2, 10);
    const content = `e2e todo ${suffix}`;
    const edited = `${content} edited`;

    await page.goto("/login");
    await expect(page.getByRole("heading", { name: "Welcome back." })).toBeVisible();
    await page.getByRole("button", { name: "Enter Workspace" }).click();

    await page.waitForURL("**/dashboard");
    await expect(page.getByRole("heading", { name: /Today's/i })).toBeVisible();

    await page.getByRole("textbox", { name: "New todo" }).fill(content);
    await page.getByRole("button", { name: "Add" }).click();

    await expect(page.getByText(content, { exact: true })).toBeVisible();

    const todoArticle = page.getByRole("article", { name: `Todo: ${content}` });
    await expect(todoArticle).toBeVisible();

    const toggle = todoArticle.getByRole("checkbox");
    await toggle.click();
    await expect(toggle).toBeChecked();

    await todoArticle.getByRole("button", { name: "Edit" }).click();
    await page.getByRole("textbox", { name: "Edit todo" }).fill(edited);
    await page.getByRole("button", { name: "Save" }).click();

    const editedArticle = page.getByRole("article", { name: `Todo: ${edited}` });
    await expect(editedArticle).toBeVisible();
    await expect(page.getByText(content, { exact: true })).not.toBeVisible();

    await editedArticle.getByRole("button", { name: "Delete" }).click();

    const dialog = page.getByRole("dialog", { name: "Delete todo?" });
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: "Delete" }).click();

    await expect(page.getByText(edited, { exact: true })).not.toBeVisible();

    await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Activity" }).click();
    await page.waitForURL("**/activity-feed");
    await expect(page.getByRole("heading", { name: "Community Flow." })).toBeVisible();
    await expect(page.getByText(/Alex Rivera/)).toBeVisible();

    await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Tasks" }).click();
    await page.waitForURL("**/tasks/new");
    await expect(page.getByRole("heading", { name: "Curate your next objective." })).toBeVisible();

    await page.getByRole("link", { name: "Back to dashboard" }).click();
    await page.waitForURL("**/dashboard");
  });
});
