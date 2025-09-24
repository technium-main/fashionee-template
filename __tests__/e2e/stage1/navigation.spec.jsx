import { test, expect } from "@playwright/test";

test.describe("Stage 1 — Навигация", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("По клику на Cart открывается страница корзины", async ({ page }) => {
    await page.getByTestId("cart-btn").click();
    await expect(page.getByTestId("cart-page")).toBeVisible();
  });

  test("Возврат из корзины в магазин", async ({ page }) => {
    await page.getByTestId("cart-btn").click();
    await page.getByTestId("shop-btn").click();
    await expect(page.getByTestId("showcase")).toBeVisible();
  });

  test("Можно переключаться туда-сюда несколько раз", async ({ page }) => {
    for (let i = 0; i < 2; i++) {
      await page.getByTestId("cart-btn").click();
      await expect(page.getByTestId("cart-page")).toBeVisible();

      await page.getByTestId("shop-btn").click();
      await expect(page.getByTestId("showcase")).toBeVisible();
    }
  });
});
