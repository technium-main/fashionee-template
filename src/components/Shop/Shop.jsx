import React, { useState, useEffect } from "react";
import { useApp } from '../../context/AppContext';
import "./Shop.css";

const Shop = ({ products = [] }) => {
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
              />
            </div>
            <img src="/icons/search.svg" className="search-icon" alt="search"></img>
          </div>

          <div className="sidebar-item">
            <div className="sidebar-title">Categories</div>
            <div className="sidebar-content">
              <ul className="custom-list">
                <li className="item">All</li>
                <li className="item">Women</li>
                <li className="item">Men</li>
                <li className="item">Kids</li>
              </ul>
            </div>
          </div>

          <div className="sidebar-item">
            <div className="sidebar-title">Price</div>
            <div className="sidebar-content">
              <div className="price-bar">
                <span>$0</span>
                <span>$500</span>
              </div>
            </div>
          </div>

          <div className="sidebar-item">
            <div className="sidebar-title">Colors</div>
            <div className="sidebar-content">
              <div className="colors">
                {["Black", "White", "Red", "Blue", "Green"].map((color) => (
                  <div key={color} className="color">
                    <input
                      type="checkbox"
                      id={color}
                      className="color-checkbox"
                    />
                    <label htmlFor={color} className="color-name">
                      {color}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ОСНОВНАЯ ЧАСТЬ С ТОВАРАМИ */}
        <div className="products-wrapper">
          <div className="sort-and-count">
            <div className="count">
              Showing <span className="bold">1–{products.length}</span> of{" "}
              <span className="bold">{products.length}</span> results
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
            {products.length === 0 ? (
              <p>Загрузка товаров...</p>
            ) : (
              products.map((product) => (
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
  const [quantity, setQuantity] = useState(0); // состояние для количества товара
  const { updateFavoritesCount, updateCartCount } = useApp();

  // Загрузка состояния избранного и корзины из localStorage
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorite(favorites.includes(product.id));
    
    // Загружаем количество из корзины
    const cart = JSON.parse(localStorage.getItem('cart') || '{}');
    setQuantity(cart[product.id] || 0);
  }, [product.id]);

  // Обработчик клика по кнопке избранного
  const handleFavoriteClick = () => {
    const newFavoriteState = !isFavorite;
    setIsFavorite(newFavoriteState);
    
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    if (newFavoriteState) {
      const updatedFavorites = [...favorites, product.id];
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    } else {
      const updatedFavorites = favorites.filter(id => id !== product.id);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    }
    
    updateFavoritesCount();
  };

  // Функции для работы с корзиной
  const updateCartInLocalStorage = (productId, qty) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '{}');
    cart[productId] = qty;
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount(); // обновляем счетчик в хедере
  };

  const removeFromCartInLocalStorage = (productId) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '{}');
    delete cart[productId];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount(); // обновляем счетчик в хедере
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
      className="product-card"
    >
      <div className="photo">
        <div className="top-bar">
          <div className="labels">
            {product.oldPrice && (
              <div className="label sale">Sale</div>
            )}
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
                  filter: isFavorite ? 
                    'brightness(0) saturate(100%) invert(60%) sepia(90%) saturate(500%) hue-rotate(300deg) brightness(100%) contrast(100%)' 
                    : 'none'
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
            <div className="quantity-counter" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px',
              justifyContent: 'center'
            }}>
              <button
                data-testid="decrease-qty-btn"
                onClick={handleDecrease}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #ccc',
                  background: 'white',
                  cursor: 'pointer',
                  borderRadius: '4px'
                }}
              >
                -
              </button>
              
              <span 
                data-testid="product-quantity"
                style={{ 
                  minWidth: '20px', 
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: '16px'
                }}
              >
                {quantity}
              </span>
              
              <button
                data-testid="increase-qty-btn"
                onClick={handleIncrease}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #ccc',
                  background: 'white',
                  cursor: 'pointer',
                  borderRadius: '4px'
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