import React, { useState, useEffect } from 'react';
import styles from './ProductCard.module.css';

function ProductCard({ product }) {
    const [isFavorite, setIsFavorite] = useState(false);
    const [cartQuantity, setCartQuantity] = useState(0);

    // Загружаем состояние избранного из localStorage
    useEffect(() => {
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        setIsFavorite(favorites.includes(product.id));
    }, [product.id]);

    // Загружаем состояние корзины из localStorage
    useEffect(() => {
        const cart = JSON.parse(localStorage.getItem('cart') || '{}');
        setCartQuantity(cart[product.id] || 0);
    }, [product.id]);

    // Обработчик избранного
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

    // Обработчики корзины
    const handleAddToCart = () => {
        const newQuantity = 1;
        setCartQuantity(newQuantity);

        const cart = JSON.parse(localStorage.getItem('cart') || '{}');
        cart[product.id] = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
    };

    const handleIncrease = () => {
        const newQuantity = cartQuantity + 1;
        setCartQuantity(newQuantity);

        const cart = JSON.parse(localStorage.getItem('cart') || '{}');
        cart[product.id] = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
    };

    const handleDecrease = () => {
        const newQuantity = cartQuantity - 1;

        if (newQuantity === 0) {
            setCartQuantity(0);
            const cart = JSON.parse(localStorage.getItem('cart') || '{}');
            delete cart[product.id];
            localStorage.setItem('cart', JSON.stringify(cart));
        } else {
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
            <div className={styles.photo}>
                <div className={styles.topBar}>
                    <div className={styles.labels}>
                        {product.oldPrice && (
                            <div className={styles.labelSale}>sale</div>
                        )}
                        {product.isNew && (
                            <div className={styles.labelNew}>new</div>
                        )}
                    </div>
                    <button
                        data-testid="favorite-btn"
                        data-active={isFavorite}
                        className={`${styles.favoriteBtn} ${isFavorite ? styles.active : ''}`}
                        onClick={handleFavoriteClick}
                    >
                        <img src="../../icons/heart.svg" alt="favorites" />
                    </button>
                </div>
                {/* Добавляем изображение */}
                <img
                    src={product.image}
                    alt={product.name}
                    className={styles.productImage}
                />
            </div>

            <div className={styles.info}>
                <div className={styles.name}>{product.name}</div>
                <div className={styles.prices}>
                    <div className={styles.currentPrice}>${product.price}</div>
                    {product.oldPrice && product.oldPrice > product.price && (
                        <div className={styles.oldPrice}>${product.oldPrice}</div>
                    )}
                </div>

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
        </div>
    );
}

export default ProductCard;