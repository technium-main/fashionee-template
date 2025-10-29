import React, { useState, useEffect } from 'react';
import styles from './ProductCard.module.css';

function ProductCard({ product, cart, onUpdateCart, favorites, onUpdateFavorites }) {
    const [isFavorite, setIsFavorite] = useState(false);
    const [cartQuantity, setCartQuantity] = useState(0);

    // Синхронизируем состояние с пропсами
    useEffect(() => {
        setIsFavorite(favorites.includes(product.id));
        setCartQuantity(cart[product.id] || 0);
    }, [favorites, cart, product.id]);

    const handleFavoriteClick = () => {
        onUpdateFavorites(product.id);
    };

    const handleAddToCart = () => {
        onUpdateCart(product.id, 1);
    };

    const handleIncrease = () => {
        onUpdateCart(product.id, cartQuantity + 1);
    };

    const handleDecrease = () => {
        onUpdateCart(product.id, cartQuantity - 1);
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
                        {product.isSale && (
                            <div className={styles.labelSale}>sale</div>
                        )}
                        {product.isNew && (
                            <div className={styles.labelNew}>new</div>
                        )}
                    </div>
                    <button
                        data-testid="favorite-btn"
                        data-active={isFavorite}
                        className={styles.favoriteBtn}
                        onClick={handleFavoriteClick}
                    >
                        <img
                            src={isFavorite ? "/icons/heart-active.svg" : "/icons/heart.svg"}
                            alt="favorites"
                            className={styles.heartIcon}
                        />
                    </button>
                </div>
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
                    {product.oldPrice && (
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