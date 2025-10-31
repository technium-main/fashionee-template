import React, { useState, useEffect, useCallback } from "react";
import { useApp } from "../../context/AppContext";
import "./Shop.css";

const Shop = ({ products = [] }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });
  const PRODUCTS_PER_PAGE = 12;

  const [tempFilters, setTempFilters] = useState({
    category: "",
    colors: [],
    price: { min: "", max: "" },
  });

  const [filtersActive, setFiltersActive] = useState(false);

  const gatherFilterData = useCallback((products) => {
    if (!products.length) return;

    const allCategories = products.flatMap(
      (product) => product.categories || []
    );
    const uniqueCategories = [...new Set(allCategories)].filter(Boolean);
    setCategories(uniqueCategories);

    const allColors = products.map((product) => product.color).filter(Boolean);
    const uniqueColors = [...new Set(allColors)].filter(Boolean);
    setColors(uniqueColors);

    const prices = products.map((product) => product.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    setPriceRange({ min: minPrice, max: maxPrice });
    setTempFilters((prev) => ({
      ...prev,
      price: { min: minPrice, max: maxPrice },
    }));
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      gatherFilterData(products);
    }
  }, [products, gatherFilterData]);

  // 👇 ФУНКЦИЯ ТОЛЬКО ДЛЯ ПОИСКА (с debounce)
  const applySearch = useCallback((products, search) => {
    if (!search.trim()) return products;

    const lowerSearch = search.toLowerCase();
    return products.filter((product) =>
      product.name.toLowerCase().includes(lowerSearch)
    );
  }, []);

  // 👇 ФУНКЦИЯ ДЛЯ ФИЛЬТРОВ (только по кнопке)
  const applyAllFilters = useCallback(() => {
    let result = products;

    // Фильтр по поиску
    if (searchTerm.trim()) {
      result = applySearch(result, searchTerm);
    }

    // Фильтр по категории
    if (tempFilters.category) {
      result = result.filter((product) =>
        product.categories?.includes(tempFilters.category)
      );
    }

    // Фильтр по цвету
    if (tempFilters.colors.length > 0) {
      result = result.filter((product) =>
        tempFilters.colors.includes(product.color)
      );
    }

    // Фильтр по цене
    const minPrice =
      tempFilters.price.min !== ""
        ? Number(tempFilters.price.min)
        : priceRange.min;
    const maxPrice =
      tempFilters.price.max !== ""
        ? Number(tempFilters.price.max)
        : priceRange.max;

    result = result.filter(
      (product) => product.price >= minPrice && product.price <= maxPrice
    );

    // Если пользователь очистил поля — вернуть диапазон в inputs
    if (tempFilters.price.min === "" || tempFilters.price.max === "") {
      setTempFilters((prev) => ({
        ...prev,
        price: {
          min: prev.price.min === "" ? priceRange.min : prev.price.min,
          max: prev.price.max === "" ? priceRange.max : prev.price.max,
        },
      }));
    }

    setFilteredProducts(result);
    setFiltersActive(true);
  }, [products, searchTerm, tempFilters, priceRange, applySearch]);

  // 👇 DEBOUNCE ДЛЯ ПОИСКА
  const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);

    return debouncedValue;
  };

  const debouncedSearchTerm = useDebounce(searchTerm, 400);

  // 👇 ПРИМЕНЯЕМ ТОЛЬКО ПОИСК (без фильтров)
  useEffect(() => {
    // поиск всегда обновляется независимо от фильтров,
    // но если фильтры активны — не трогаем результат вручную
    if (!filtersActive) {
      const result = applySearch(products, debouncedSearchTerm);
      setFilteredProducts(result);
    }
  }, [debouncedSearchTerm, products, applySearch, filtersActive]);

  // 👇 ФУНКЦИЯ ДЛЯ РУЧНОГО ПРИМЕНЕНИЯ ФИЛЬТРОВ
  const handleApplyFilters = () => {
    setFiltersActive(true);
    applyAllFilters();
  };

  return (
    <div className="container">
      <div className="shop">
        <div className="sidebar">
          <div className="search">
            <div className="search-row">
              <input
                type="text"
                placeholder="Search..."
                className="input"
                data-testid="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <img
              src="/icons/search.svg"
              className="search-icon"
              alt="search"
            ></img>
          </div>

          <div className="sidebar-item">
            <div className="sidebar-title">Categories</div>
            <div className="sidebar-content">
              <ul className="custom-list">
                <li
                  className={`item ${
                    tempFilters.category === "" ? "active" : ""
                  }`}
                  onClick={() =>
                    setTempFilters((prev) => ({ ...prev, category: "" }))
                  }
                  style={{ cursor: "pointer" }}
                  data-testid="filter-category-all"
                >
                  All
                </li>
                {categories.map((category) => (
                  <li
                    key={category}
                    className={`item ${
                      tempFilters.category === category ? "active" : ""
                    }`}
                    onClick={() =>
                      setTempFilters((prev) => ({
                        ...prev,
                        category: category,
                      }))
                    }
                    style={{ cursor: "pointer" }}
                    data-testid={`filter-category-${category.toLowerCase()}`}
                  >
                    {category}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="sidebar-item">
            <div className="sidebar-title">Price</div>
            <div className="sidebar-content">
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexDirection: "column",
                }}
              >
                <input
                  type="number"
                  placeholder={`Min: $${priceRange.min}`}
                  className="input"
                  data-testid="price-min-input"
                  value={tempFilters.price.min}
                  onChange={(e) =>
                    setTempFilters((prev) => ({
                      ...prev,
                      price: { ...prev.price, min: e.target.value },
                    }))
                  }
                />
                <input
                  type="number"
                  placeholder={`Max: $${priceRange.max}`}
                  className="input"
                  data-testid="price-max-input"
                  value={tempFilters.price.max}
                  onChange={(e) =>
                    setTempFilters((prev) => ({
                      ...prev,
                      price: { ...prev.price, max: e.target.value },
                    }))
                  }
                />
              </div>
            </div>
          </div>

          <div className="sidebar-item">
            <div className="sidebar-title">Colors</div>
            <div className="sidebar-content">
              <div className="colors">
                {colors.map((color) => (
                  <div key={color} className="color">
                    <input
                      type="checkbox"
                      id={color}
                      className="color-checkbox"
                      checked={tempFilters.colors.includes(color)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setTempFilters((prev) => ({
                            ...prev,
                            colors: [...prev.colors, color],
                          }));
                        } else {
                          setTempFilters((prev) => ({
                            ...prev,
                            colors: prev.colors.filter((c) => c !== color),
                          }));
                        }
                      }}
                    />
                    <label
                      htmlFor={color}
                      className="color-name"
                      data-testid={`filter-color-${color.toLowerCase()}`}
                    >
                      {color}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            className="sidebar-item"
            style={{ display: "flex", gap: "10px" }}
          >
            <button
              className="button"
              data-testid="apply-filter-btn"
              onClick={handleApplyFilters}
              style={{ flex: 1, padding: "15px" }}
            >
              Apply Filters
            </button>
          </div>
        </div>

        {/* ОСНОВНАЯ ЧАСТЬ С ТОВАРАМИ */}
        <div className="products-wrapper">
          <div className="sort-and-count">
            <div className="count">
              {filteredProducts.length === 0 ? (
                <span>No products found</span>
              ) : (
                <>
                  There are{" "}
                  <span className="bold" data-testid="products-count">
                    {filteredProducts.length}
                  </span>{" "}
                  products in this category.
                </>
              )}
            </div>
            <div className="sort">
              <select className="input">
                <option>Default sorting</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* ВИТРИНА ТОВАРОВ */}
          <div data-testid="showcase" className="showcase">
            {filteredProducts.length === 0 ? (
              <p>No products found</p>
            ) : (
              filteredProducts
                .slice(0, PRODUCTS_PER_PAGE)
                .map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
            )}
          </div>

          {/* ПАГИНАЦИЯ */}
          <div className="pagination">
            <div className="pages">
              {[1, 2, 3, 4, 5].map((page) => (
                <div
                  key={page}
                  className={`page ${page === 1 ? "active" : ""}`}
                >
                  {page}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// КОМПОНЕНТ КАРТОЧКИ ТОВАРА С КОРЗИНОЙ
const ProductCard = ({ product }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const { updateFavoritesCount, updateCartCount } = useApp();

  // Загрузка состояния избранного и корзины из localStorage
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsFavorite(favorites.includes(product.id));

    // Загружаем количество из корзины
    const cartData = localStorage.getItem("cart");
    let quantity = 0;

    if (cartData) {
      try {
        const cart = JSON.parse(cartData);

        if (Array.isArray(cart)) {
          const cartItem = cart.find((item) => item.id === product.id);
          quantity = cartItem ? cartItem.quantity : 0;
        } else if (typeof cart === "object" && cart !== null) {
          quantity = cart[product.id] || 0;
        }
      } catch (error) {
        //console.error("Error parsing cart:", error);
      }
    }

    setQuantity(quantity);
  }, [product.id]);

  // Обработчик клика по кнопке избранного
  const handleFavoriteClick = () => {
    const newFavoriteState = !isFavorite;
    setIsFavorite(newFavoriteState);

    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

    if (newFavoriteState) {
      const updatedFavorites = [...favorites, product.id];
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    } else {
      const updatedFavorites = favorites.filter((id) => id !== product.id);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    }

    updateFavoritesCount();
  };

  // Функции для работы с корзиной
  const updateCartInLocalStorage = (productId, qty) => {
    const cartData = localStorage.getItem("cart");
    let cart = [];

    if (cartData) {
      try {
        const parsedCart = JSON.parse(cartData);

        // Конвертируем старый формат в новый
        if (Array.isArray(parsedCart)) {
          cart = parsedCart;
        } else if (typeof parsedCart === "object" && parsedCart !== null) {
          // Конвертируем объект в массив
          cart = Object.entries(parsedCart).map(([id, quantity]) => ({
            id: parseInt(id),
            quantity: quantity,
          }));
        }
      } catch (error) {
        //console.error("Error parsing cart:", error);
      }
    }

    // Обновляем корзину
    const existingItemIndex = cart.findIndex((item) => item.id === productId);

    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity = qty;
    } else {
      cart.push({ id: productId, quantity: qty });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
  };

  const removeFromCartInLocalStorage = (productId) => {
    const cartData = localStorage.getItem("cart");
    let cart = [];

    if (cartData) {
      try {
        const parsedCart = JSON.parse(cartData);

        if (Array.isArray(parsedCart)) {
          cart = parsedCart;
        } else if (typeof parsedCart === "object" && parsedCart !== null) {
          cart = Object.entries(parsedCart).map(([id, quantity]) => ({
            id: parseInt(id),
            quantity: quantity,
          }));
        }
      } catch (error) {
        //console.error("Error parsing cart:", error);
      }
    }

    const updatedCart = cart.filter((item) => item.id !== productId);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    updateCartCount();
  };

  // Обработчики для кнопок корзины
  const handleAddToCart = () => {
    const newQuantity = 1;
    setQuantity(newQuantity);
    updateCartInLocalStorage(product.id, newQuantity);
  };

  const handleIncrease = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    updateCartInLocalStorage(product.id, newQuantity);
  };

  const handleDecrease = () => {
    const newQuantity = quantity - 1;
    if (newQuantity === 0) {
      setQuantity(0);
      removeFromCartInLocalStorage(product.id);
    } else {
      setQuantity(newQuantity);
      updateCartInLocalStorage(product.id, newQuantity);
    }
  };

  return (
    <div
      data-testid="product-card"
      data-product-id={product.id}
      data-categories={product.categories?.join(",") || ""}
      data-color={product.color || ""}
      data-price={product.price}
      className="product-card"
    >
      <div className="photo">
        <div className="top-bar">
          <div className="labels">
            {product.oldPrice && <div className="label sale">Sale</div>}
            <div className="label new">New</div>
          </div>

          {/* БЛОК ИЗБРАННОГО */}
          <div className="favorites">
            <button
              data-testid="favorite-btn"
              data-active={isFavorite}
              onClick={handleFavoriteClick}
              className="favorite-btn"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "5px",
              }}
            >
              <img
                src="/icons/heart.svg"
                alt="favorites"
                className="favorite-icon"
                style={{
                  filter: isFavorite
                    ? "brightness(0) saturate(100%) invert(60%) sepia(90%) saturate(500%) hue-rotate(300deg) brightness(100%) contrast(100%)"
                    : "none",
                }}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="info">
        <div className="name">{product.name}</div>
        <div className="price">
          <span className="current-price">${product.price}</span>
          {product.oldPrice && (
            <span className="old-price">${product.oldPrice}</span>
          )}
        </div>

        {/* КНОПКА КОРЗИНЫ / СЧЁТЧИК */}
        <div className="button-wrapper">
          {quantity === 0 ? (
            // КНОПКА "ADD TO CART" - показывается когда товара нет в корзине
            <button
              data-testid="add-to-cart-btn"
              className="button"
              onClick={handleAddToCart}
              style={{ padding: "10px 20px", fontSize: "14px" }}
            >
              Add to Cart
            </button>
          ) : (
            // СЧЁТЧИК - показывается когда товар в корзине
            <div
              className="quantity-counter"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                justifyContent: "center",
              }}
            >
              <button
                data-testid="decrease-qty-btn"
                onClick={handleDecrease}
                style={{
                  padding: "8px 12px",
                  border: "1px solid #ccc",
                  background: "white",
                  cursor: "pointer",
                  borderRadius: "4px",
                }}
              >
                -
              </button>

              <span
                data-testid="product-quantity"
                style={{
                  minWidth: "20px",
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "16px",
                }}
              >
                {quantity}
              </span>

              <button
                data-testid="increase-qty-btn"
                onClick={handleIncrease}
                style={{
                  padding: "8px 12px",
                  border: "1px solid #ccc",
                  background: "white",
                  cursor: "pointer",
                  borderRadius: "4px",
                }}
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
