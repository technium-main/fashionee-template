import { test, expect } from "@playwright/test";

test.describe("Stage 1 — Layout", () => {
  test("Рендерит layout страницы", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByTestId("header")).toBeVisible();
    await expect(page.getByTestId("content-block")).toBeVisible();
    await expect(page.getByTestId("showcase")).toBeVisible();
    await expect(page.getByTestId("footer")).toBeVisible();

    const products = page.getByTestId("product-card");
    const count = await products.count();
    expect(count).toBeGreaterThan(0);
  });
});
