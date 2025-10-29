import React, { useState, useEffect } from 'react';
import styles from './ProductCard.module.css';

function ProductCard({ product }) {
    const [isFavorite, setIsFavorite] = useState(false);
    const [cartQuantity, setCartQuantity] = useState(0);

    // 1️⃣ ЗАГРУЗКА из localStorage при монтировании
    useEffect(() => {
        // Загружаем избранное
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        setIsFavorite(favorites.includes(product.id));

        // Загружаем корзину
        const cart = JSON.parse(localStorage.getItem('cart') || '{}');
        setCartQuantity(cart[product.id] || 0);
    }, [product.id]);

    // 2️⃣ ИЗБРАННОЕ - переключение сердечка
    const handleFavoriteClick = () => {
        const newFavoriteState = !isFavorite;
        setIsFavorite(newFavoriteState);

        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        let newFavorites;

        if (newFavoriteState) {
            newFavorites = [...favorites, product.id];
        } else {
            newFavorites = favorites.filter(id => id !== product.id);
        }

        localStorage.setItem('favorites', JSON.stringify(newFavorites));
    };

    // 3️⃣ ДОБАВЛЕНИЕ в корзину (первый клик)
    const handleAddToCart = () => {
        const newQuantity = 1;
        setCartQuantity(newQuantity);

        const cart = JSON.parse(localStorage.getItem('cart') || '{}');
        cart[product.id] = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
    };

    // 4️⃣ УВЕЛИЧЕНИЕ количества
    const handleIncrease = () => {
        const newQuantity = cartQuantity + 1;
        setCartQuantity(newQuantity);

        const cart = JSON.parse(localStorage.getItem('cart') || '{}');
        cart[product.id] = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
    };

    // 5️⃣ УМЕНЬШЕНИЕ количества
    const handleDecrease = () => {
        const newQuantity = cartQuantity - 1;

        if (newQuantity === 0) {
            // Если количество 0 - удаляем товар
            setCartQuantity(0);
            const cart = JSON.parse(localStorage.getItem('cart') || '{}');
            delete cart[product.id];
            localStorage.setItem('cart', JSON.stringify(cart));
        } else {
            // Иначе обновляем количество
            setCartQuantity(newQuantity);
            const cart = JSON.parse(localStorage.getItem('cart') || '{}');
            cart[product.id] = newQuantity;
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    };

    return (
        <div
            data-testid="product-card"
            data-product-id={product.id}
            className={styles.productCard}
        >
            {/* ... остальная верстка ... */}

            {/* Условный рендеринг кнопки/счетчика */}
            {cartQuantity === 0 ? (
                <button
                    data-testid="add-to-cart-btn"
                    className={styles.addToCartBtn}
                    onClick={handleAddToCart}
                >
                    Add to Cart
                </button>
            ) : (
                <div className={styles.quantityControls}>
                    <button
                        data-testid="decrease-qty-btn"
                        className={styles.quantityBtn}
                        onClick={handleDecrease}
                    >
                        -
                    </button>
                    <span
                        data-testid="product-quantity"
                        className={styles.quantity}
                    >
            {cartQuantity}
          </span>
                    <button
                        data-testid="increase-qty-btn"
                        className={styles.quantityBtn}
                        onClick={handleIncrease}
                    >
                        +
                    </button>
                </div>
            )}
        </div>
    );
}

export default ProductCard;