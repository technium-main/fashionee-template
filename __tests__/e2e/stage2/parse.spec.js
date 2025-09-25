import { test, expect } from "@playwright/test";

let categoriesFromJson = [];
let colorsFromJson = [];
let minPriceFromJson;
let maxPriceFromJson;

test.describe("Stage 2 — Фильтры парсятся из JSON", () => {
  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();

    await page.goto('/');

    const { products } = await page.evaluate(async () => {
      const res = await fetch("/products.json");
      return await res.json();
    });

    await page.close();

    categoriesFromJson = [...new Set(products.flatMap(p => p.categories))];
    colorsFromJson = [...new Set(products.map(p => p.color))];
    const prices = products.map(p => p.price);
    minPriceFromJson = Math.min(...prices);
    maxPriceFromJson = Math.max(...prices);
  });

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Фильтры по категориям совпадают с JSON", async ({ page }) => {
    for (const category of categoriesFromJson) {
      await expect(page.getByTestId(`filter-category-${category.toLowerCase()}`)).toBeVisible();
    }
  });

  test("Фильтры по цветам совпадают с JSON", async ({ page }) => {
    for (const color of colorsFromJson) {
      await expect(page.getByTestId(`filter-color-${color.toLowerCase()}`)).toBeVisible();
    }
  });

  test("Фильтр цены соответствует min/max из JSON", async ({ page }) => {
    const minInput = page.getByTestId("price-min-input");
    const maxInput = page.getByTestId("price-max-input");

    const minValue = await minInput.inputValue();
    const maxValue = await maxInput.inputValue();

    expect(Number(minValue)).toBe(minPriceFromJson);
    expect(Number(maxValue)).toBe(maxPriceFromJson);
  });
});
