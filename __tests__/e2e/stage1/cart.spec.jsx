import { test, expect } from "@playwright/test";

test.describe("Stage 1 — Корзина (Shop page, счётчик)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Добавление товара в корзину отображает счётчик", async ({ page }) => {
    const firstProduct = page.getByTestId("product-card").first();
    const addBtn = firstProduct.getByTestId("add-to-cart-btn");

    await addBtn.click();
    
    const quantity = firstProduct.getByTestId("product-quantity");
    await expect(quantity).toHaveText("1");

    const cart = await page.evaluate(() => JSON.parse(localStorage.getItem("cart")));
    const added = cart.find((p) => p.id === 1);
    expect(added.quantity).toBe(1);
  });

  test("Кнопка + увеличивает количество", async ({ page }) => {
    const firstProduct = page.getByTestId("product-card").first();
    await firstProduct.getByTestId("add-to-cart-btn").click();

    await firstProduct.getByTestId("increase-qty-btn").click();

    const quantity = await firstProduct.getByTestId("product-quantity").textContent();
    expect(Number(quantity)).toBe(2);

    const cart = await page.evaluate(() => JSON.parse(localStorage.getItem("cart")));
    const added = cart.find((p) => p.id === 1);
    expect(added.quantity).toBe(2);
  });

  test("Кнопка - уменьшает количество", async ({ page }) => {
    const firstProduct = page.getByTestId("product-card").first();

    await firstProduct.getByTestId("add-to-cart-btn").click();
    await firstProduct.getByTestId("increase-qty-btn").click();

    await firstProduct.getByTestId("decrease-qty-btn").click();

    const quantity = await firstProduct.getByTestId("product-quantity").textContent();
    expect(Number(quantity)).toBe(1);

    const cart = await page.evaluate(() => JSON.parse(localStorage.getItem("cart")));
    const added = cart.find((p) => p.id === 1);
    expect(added.quantity).toBe(1);
  });

  test("При уменьшении с 1 до 0 товар удаляется из корзины", async ({ page }) => {
    const firstProduct = page.getByTestId("product-card").first();

    await firstProduct.getByTestId("add-to-cart-btn").click();
    await firstProduct.getByTestId("decrease-qty-btn").click();

    await expect(firstProduct.getByTestId("add-to-cart-btn")).toBeVisible();

    const cart = await page.evaluate(() => JSON.parse(localStorage.getItem("cart")));
    const removed = cart.find((p) => p.id === 1);
    expect(removed).toBeUndefined();
  });
});
