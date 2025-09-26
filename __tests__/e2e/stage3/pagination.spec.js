import { test, expect } from "@playwright/test";

test.describe("Stage 3 — Пагинация", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("На первой странице показывается максимум 12 товаров", async ({ page }) => {
    const cards = page.getByTestId("product-card");
    const count = await cards.count();
    expect(count).toBeLessThanOrEqual(12);
    await expect(page.getByTestId("page-1")).toHaveAttribute("data-active", "true");
  });

  test("Переход на вторую страницу по клику на цифру", async ({ page }) => {
    await page.getByTestId("page-2").click();

    const cards = page.getByTestId("product-card");
    const count = await cards.count();
    expect(count).toBeLessThanOrEqual(12);

    await expect(page.getByTestId("page-2")).toHaveAttribute("data-active", "true");
  });

  test("Переход на вторую страницу по стрелке →", async ({ page }) => {
    await page.getByTestId("next-page-arrow").click();

    const cards = page.getByTestId("product-card");
    const count = await cards.count();
    expect(count).toBeLessThanOrEqual(12);

    await expect(page.getByTestId("page-2")).toHaveAttribute("data-active", "true");
  });

  test("Возврат на первую страницу по стрелке ←", async ({ page }) => {
    await page.getByTestId("next-page-arrow").click();
    await page.getByTestId("previous-page-arrow").click();

    const cards = page.getByTestId("product-card");
    const count = await cards.count();
    expect(count).toBeLessThanOrEqual(12);

    await expect(page.getByTestId("page-1")).toHaveAttribute("data-active", "true");
  });

  test("Можно переключаться туда-сюда несколько раз", async ({ page }) => {
    for (let i = 0; i < 2; i++) {
      await page.getByTestId("next-page-arrow").click();
      await expect(page.getByTestId("page-2")).toHaveAttribute("data-active", "true");

      await page.getByTestId("previous-page-arrow").click();
      await expect(page.getByTestId("page-1")).toHaveAttribute("data-active", "true");
    }
  });
});
