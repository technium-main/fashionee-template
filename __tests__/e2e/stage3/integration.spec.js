import { test, expect } from "@playwright/test";

test.describe("Stage 3 — Интеграция фильтров, поиска, сортировки и пагинации", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Фильтр по категории + поиск + сортировка + пагинация", async ({ page }) => {
    await page.getByTestId("filter-category-women").click();

    await page.getByTestId("search-input").fill("a");
    await page.waitForTimeout(500);

    await page.getByTestId("apply-filter-btn").click();

    await page.getByTestId("sort-selector").click();
    await page.getByTestId("sort-by-price").click();

    const cards = page.getByTestId("product-card");
    const count = await cards.count();
    expect(count).toBeLessThanOrEqual(12);

    const prices = [];
    for (let i = 0; i < count; i++) {
      const price = await cards.nth(i).getAttribute("data-price");
      prices.push(Number(price));

      const categories = await cards.nth(i).getAttribute("data-categories");
      const text = await cards.nth(i).textContent();
      expect(categories.toLowerCase()).toContain("women");
      expect(text.toLowerCase()).toContain("a");
    }

    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });

  test("Фильтр по цвету + цене + сортировка по алфавиту", async ({ page }) => {
    await page.getByTestId("filter-color-red").click();
    await page.getByTestId("filter-color-black").click();
    await page.getByTestId("filter-color-brown").click();

    await page.getByTestId("price-min-input").fill("20");
    await page.getByTestId("price-max-input").fill("180");

    await page.getByTestId("apply-filter-btn").click();

    await page.getByTestId("sort-selector").click();
    await page.getByTestId("sort-by-alphabet").click();

    const counter = await page.getByTestId("products-count").textContent();
    expect(Number(counter)).toBe(13);

    const names = [];
    const colors = ['red', 'black', 'brown'];
    const cards = page.getByTestId("product-card");
    for (let i = 0; i < 12; i++) {
      const color = await cards.nth(i).getAttribute("data-color");
      const price = await cards.nth(i).getAttribute("data-price");
      const name = await cards.nth(i).getAttribute("data-name");

      expect(colors).toContain(color.toLowerCase());
      expect(Number(price)).toBeGreaterThanOrEqual(20);
      expect(Number(price)).toBeLessThanOrEqual(180);

      names.push(name.trim());
    }

    const sortedNames = [...names].sort((a, b) => a.localeCompare(b));
    expect(names).toEqual(sortedNames);
  });

  test("Комбинация фильтров + поиск может вернуть 0 товаров", async ({ page }) => {
    await page.getByTestId("filter-category-men").click();

    await page.getByTestId("search-input").fill("abracadabra");
    await page.waitForTimeout(500);

    await page.getByTestId("apply-filter-btn").click();

    const cards = page.getByTestId("product-card");
    const count = await cards.count();
    expect(count).toBe(0);

    await expect(Number(await page.getByTestId("products-count").textContent())).toBe(0);
  });

  test("Выбраны все фильтры → показываются все товары", async ({ page }) => {
    await page.getByTestId("filter-category-all").click();

    await page.getByTestId("filter-color-brown").click();
    await page.getByTestId("filter-color-black").click();
    await page.getByTestId("filter-color-white").click();
    await page.getByTestId("filter-color-red").click();
    await page.getByTestId("filter-color-blue").click();

    await page.getByTestId("price-min-input").clear();
    await page.getByTestId("price-max-input").clear();

    await page.getByTestId("apply-filter-btn").click();

    const cards = page.getByTestId("product-card");
    const count = await cards.count();
    expect(count).toBeLessThanOrEqual(12);

    const counterText = await page.getByTestId("products-count").textContent();
    expect(Number(counterText)).toBe(24);
  });
});
