import { test, expect } from "@playwright/test";

test.describe("Stage 3 — Сортировка", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Сортировка по алфавиту (A–Z)", async ({ page }) => {
    await page.getByTestId("sort-selector").click();
    await page.getByTestId("sort-by-alphabet").click();

    const cards = page.getByTestId("product-card");
    const count = await cards.count();

    const names = [];
    for (let i = 0; i < count; i++) {
      const name = await cards.nth(i).getAttribute("data-name");
      names.push(name.toLowerCase());
    }

    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    expect(names).toEqual(sorted);
  });

  test("Сортировка по цене (min → max)", async ({ page }) => {
    await page.getByTestId("sort-selector").click();
    await page.getByTestId("sort-by-price").click();

    const cards = page.getByTestId("product-card");
    const count = await cards.count();

    const prices = [];
    for (let i = 0; i < count; i++) {
      const price = await cards.nth(i).getAttribute("data-price");
      prices.push(Number(price));
    }

    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });

  test("Сортировка By relevance возвращает дефолтный порядок", async ({ page }) => {
    const cardsDefault = page.getByTestId("product-card");
    const count = await cardsDefault.count();

    const defaultIds = [];
    for (let i = 0; i < count; i++) {
      const id = await cardsDefault.nth(i).getAttribute("data-product-id");
      defaultIds.push(Number(id));
    }

    await page.getByTestId("sort-selector").click();
    await page.getByTestId("sort-by-alphabet").click();
    await page.getByTestId("sort-selector").click();
    await page.getByTestId("sort-by-relevance").click();

    const idsAfter = [];
    for (let i = 0; i < count; i++) {
      const id = await cardsDefault.nth(i).getAttribute("data-product-id");
      idsAfter.push(Number(id));
    }

    expect(idsAfter).toEqual(defaultIds);
  });
});
