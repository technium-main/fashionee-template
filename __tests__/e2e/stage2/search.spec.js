import { test, expect } from "@playwright/test";

test.describe("Stage 2 — Поиск по товарам", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Поле поиска отображается", async ({ page }) => {
    await expect(page.getByTestId("search-input")).toBeVisible();
  });

  test("Фильтрация товаров по введённому тексту", async ({ page }) => {
    const searchInput = page.getByTestId("search-input");

    const initialCount = await page.getByTestId("product-card").count();
    expect(initialCount).toBeGreaterThan(0);

    await searchInput.fill("skirt");

    await page.waitForTimeout(500);

    const filteredCount = await page.getByTestId("product-card").count();
    expect(filteredCount).toBeLessThan(initialCount);

    // проверим, что хотя бы один товар содержит слово "skirt"
    const texts = await page.getByTestId("product-card").allTextContents();
    expect(texts.some((t) => t.toLowerCase().includes("skirt"))).toBe(true);
  });

  test("Поиск работает с debounce (не мгновенно)", async ({ page }) => {
    const searchInput = page.getByTestId("search-input");

    await searchInput.fill("sk");

    const countImmediately = await page.getByTestId("product-card").count();

    await page.waitForTimeout(500);

    const countAfter = await page.getByTestId("product-card").count();

    expect(countAfter).not.toBe(countImmediately);
  });

  test("При очистке поиска показываются все товары снова", async ({ page }) => {
    const searchInput = page.getByTestId("search-input");

    await searchInput.fill("skirt");
    await page.waitForTimeout(500);

    const filteredCount = await page.getByTestId("product-card").count();
    expect(filteredCount).toBeGreaterThan(0);

    await searchInput.fill("");
    await page.waitForTimeout(500);

    const resetCount = await page.getByTestId("product-card").count();
    expect(resetCount).toBeGreaterThan(filteredCount);
  });
});
