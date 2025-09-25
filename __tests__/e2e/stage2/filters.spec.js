import { test, expect } from "@playwright/test";
test.describe("Stage 2 — Фильтрация по категориям", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  const categories = [
    { name: "all", expectedCount: 24 },
    { name: "accessories", expectedCount: 8 },
    { name: "men", expectedCount: 8 },
    { name: "women", expectedCount: 14 },
  ];

  for (const cat of categories) {
    test(`Фильтрация по категории "${cat.name.toUpperCase()}"`, async ({ page }) => {
      await page.getByTestId(`filter-category-${cat.name}`).click();
      await page.getByTestId("apply-filter-btn").click();

      const cards = page.getByTestId("product-card");
      const countOnPage = await cards.count();

      const counterText = await page.getByTestId("products-count").textContent();
      const counterValue = Number(counterText);

      expect(counterValue).toBe(cat.expectedCount);

      expect(countOnPage).toBeLessThanOrEqual(Math.min(cat.expectedCount, 12));

      if (cat.name !== "all") {
        for (let i = 0; i < countOnPage; i++) {
          const categoriesAttr = await cards.nth(i).getAttribute("data-categories");
          expect(categoriesAttr?.toLowerCase()).toContain(cat.name);
        }
      }
    });
  }
});

test.describe("Stage 2 — Фильтрация по цветам", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  const colors = ["brown", "black", "white", "red", "blue"];

  test("Если ни один цвет не выбран → показываются все товары", async ({ page }) => {
    await page.getByTestId("apply-filter-btn").click();

    const counterText = await page.getByTestId("products-count").textContent();
    const counter = Number(counterText);

    expect(counter).toBe(24); // все товары
  });

  for (const color of colors) {
    test(`Фильтрация по одному цвету (${color})`, async ({ page }) => {
      await page.getByTestId(`filter-color-${color}`).click();
      await page.getByTestId("apply-filter-btn").click();

      const cards = page.getByTestId("product-card");
      const countOnPage = await cards.count();
      expect(countOnPage).toBeGreaterThan(0);

      for (let i = 0; i < countOnPage; i++) {
        const productColor = await cards.nth(i).getAttribute("data-color");
        expect(productColor?.toLowerCase()).toBe(color);
      }
    });
  }

  test("Фильтрация по нескольким цветам", async ({ page }) => {
    await page.getByTestId("filter-color-red").click();
    await page.getByTestId("filter-color-blue").click();
    await page.getByTestId("apply-filter-btn").click();

    const cards = page.getByTestId("product-card");
    const countOnPage = await cards.count();
    expect(countOnPage).toBeGreaterThan(0);

    for (let i = 0; i < countOnPage; i++) {
      const productColor = await cards.nth(i).getAttribute("data-color");
      expect(["red", "blue"]).toContain(productColor?.toLowerCase());
    }
  });

  test("Если выбраны все цвета, то показываются все товары", async ({ page }) => {
    for (const color of colors) {
      await page.getByTestId(`filter-color-${color}`).click();
    }
    await page.getByTestId("apply-filter-btn").click();

    const counterText = await page.getByTestId("products-count").textContent();
    const counter = Number(counterText);

    expect(counter).toBe(24);
  });
});

test.describe("Stage 2 — Фильтр по цене", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  const priceCases = [
    { name: "min", min: "100", max: "", expectedCount: 5 },
    { name: "max", min: "", max: "50", expectedCount: 14 },
    { name: "min,max", min: "30", max: "100", expectedCount: 15 },
  ];

  for (const { name, min, max, expectedCount } of priceCases) {
    test(`Фильтрация по цене (${name})`, async ({ page }) => {
      if (min !== "") {
        await page.getByTestId("price-min-input").fill(min);
      }
      if (max !== "") {
        await page.getByTestId("price-max-input").fill(max);
      }

      await page.getByTestId("apply-filter-btn").click();

      const cards = page.getByTestId("product-card");
      const visibleCount = await cards.count();
      expect(visibleCount).toBe(Math.min(expectedCount, 12));

      const counterText = await page.getByTestId("products-count").textContent();
      expect(Number(counterText)).toBe(expectedCount);
    });
  }

  test("Очистка полей сбрасывает фильтр и показывает все товары", async ({ page }) => {
    const minInput = page.getByTestId("price-min-input");
    const maxInput = page.getByTestId("price-max-input");

    await minInput.fill("");
    await maxInput.fill("");
    await page.getByTestId("apply-filter-btn").click();

    await expect(minInput).toHaveValue("20.99");
    await expect(maxInput).toHaveValue("210.99");

    const cards = page.getByTestId("product-card");
    const visibleCount = await cards.count();
    expect(visibleCount).toBe(12);

    const counterText = await page.getByTestId("products-count").textContent();
    expect(Number(counterText)).toBe(24);
  });
});

test.describe("Stage 2 — Комбинированная фильтрация", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  const comboCases = [
    {
      name: "Категория 'Women' + цвет 'Black'",
      category: "women",
      colors: ["black"],
      min: "",
      max: "",
      expectedCount: 4,
    },
    {
      name: "Категория 'Men' + min:30",
      category: "men",
      colors: [],
      min: "30",
      max: "",
      expectedCount: 6,
    },
    {
      name: "Цвет 'Red' + max:50",
      category: "",
      colors: ["red"],
      min: "",
      max: "50",
      expectedCount: 2,
    },
    {
      name: "Категория 'Accessories' + цвета 'Brown, Black, White' + 30–180",
      category: "accessories",
      colors: ["brown", "black", "white"],
      min: "30",
      max: "180",
      expectedCount: 5
    },
  ];

  for (const { name, category, colors, min, max, expectedCount } of comboCases) {
    test(name, async ({ page }) => {
      if (category) {
        await page.getByTestId(`filter-category-${category}`).click();
      }
      for (const color of colors) {
        await page.getByTestId(`filter-color-${color}`).click();
      }
      if (min !== "") {
        await page.getByTestId("price-min-input").fill(min);
      }
      if (max !== "") {
        await page.getByTestId("price-max-input").fill(max);
      }

      await page.getByTestId("apply-filter-btn").click();

      const cards = page.getByTestId("product-card");
      const count = await cards.count();

      // карточки на странице (макс. 12)
      expect(count).toBe(Math.min(expectedCount, 12));

      // products-count всегда полный
      const counterText = await page.getByTestId("products-count").textContent();
      expect(Number(counterText)).toBe(expectedCount);

      // проверка каждой карточки
      for (let i = 0; i < count; i++) {
        if (category) {
          const categories = await cards.nth(i).getAttribute("data-categories");
          expect(categories.toLowerCase()).toContain(category);
        }
        if (colors.length > 0) {
          const color = await cards.nth(i).getAttribute("data-color");
          expect(colors).toContain(color.toLowerCase());
        }
        if (min !== "" || max !== "") {
          const price = Number(await cards.nth(i).getAttribute("data-price"));
          if (min !== "") expect(price).toBeGreaterThanOrEqual(Number(min));
          if (max !== "") expect(price).toBeLessThanOrEqual(Number(max));
        }
      }
    });
  }
});

