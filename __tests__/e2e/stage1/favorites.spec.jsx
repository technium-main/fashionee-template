import { test, expect } from "@playwright/test";

test.describe("Stage 1 — Избранное", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Добавление товара в избранное", async ({ page }) => {
    const thirdProduct = page.getByTestId("product-card").nth(3);
    const favBtn = thirdProduct.getByTestId("favorite-btn");
    const thirdProductId = await thirdProduct.getAttribute("data-product-id");

    await favBtn.click();

    await expect(favBtn).toHaveAttribute("data-active", "true");

    const ls = await page.evaluate(() => JSON.parse(localStorage.getItem("favorites")));
    expect(ls).toContain(Number(thirdProductId));
  });

  test("Удаление товара из избранного", async ({ page }) => {
    const secondProduct = page.getByTestId("product-card").nth(2);
    const favBtn = secondProduct.getByTestId("favorite-btn");
    const secondProductId = await secondProduct.getAttribute("data-product-id");

    await favBtn.click();
    await favBtn.click();

    await expect(favBtn).toHaveAttribute("data-active", "false");

    const ls = await page.evaluate(() => JSON.parse(localStorage.getItem("favorites")));
    expect(ls).not.toContain(Number(secondProductId));
  });

  test("Состояние избранного сохраняется после перезагрузки", async ({ page }) => {
    const firstProduct = page.getByTestId("product-card").first();
    const favBtn = firstProduct.getByTestId("favorite-btn");

    await favBtn.click();
    await page.reload();

    await expect(firstProduct.getByTestId("favorite-btn")).toHaveAttribute(
      "data-active",
      "true"
    );
  });
});
