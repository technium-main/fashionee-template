import React, { useState, useEffect } from 'react';
import ContentBlock from '../../components/ContentBlock/ContentBlock';
import styles from './Cart.module.css';

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [products, setProducts] = useState([]);

    // Загружаем товары и корзину
    useEffect(() => {
        // Загружаем товары
        fetch('/products.json')
            .then(response => response.json())
            .then(data => {
                setProducts(data.products || []);
            });

        // Загружаем корзину из localStorage
        const cart = JSON.parse(localStorage.getItem('cart') || '{}');
        setCartItems(cart);
    }, []);

    // Получаем товары из корзины с полной информацией
    const getCartProducts = () => {
        return Object.entries(cartItems)
            .map(([productId, quantity]) => {
                const product = products.find(p => p.id === parseInt(productId));
                return product ? { ...product, quantity } : null;
            })
            .filter(Boolean);
    };

    // Обновляем количество товара
    const updateQuantity = (productId, newQuantity) => {
        const newCart = { ...cartItems };

        if (newQuantity === 0) {
            delete newCart[productId];
        } else {
            newCart[productId] = newQuantity;
        }

        setCartItems(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
    };

    // Удаляем товар из корзины
    const removeFromCart = (productId) => {
        updateQuantity(productId, 0);
    };

    // Рассчитываем общую стоимость
    const calculateTotal = () => {
        return getCartProducts().reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    };

    const cartProducts = getCartProducts();
    const total = calculateTotal();

    return (
        <div data-testid="cart-page" className={styles.cart}>
            <ContentBlock title="Cart" breadcrumbs={['Home', 'Shop', 'Cart']}>
                {cartProducts.length === 0 ? (
                    <div className={styles.emptyCart}>
                        <h2>Your cart is empty</h2>
                        <p>Add some products from the shop!</p>
                    </div>
                ) : (
                    <div className={styles.cartContent}>
                        <div className={styles.cartItems}>
                            {cartProducts.map(item => (
                                <div key={item.id} className={styles.cartItem}>
                                    <div className={styles.itemImage}>
                                        <img src={item.image} alt={item.name} />
                                    </div>
                                    <div className={styles.itemInfo}>
                                        <h3 className={styles.itemName}>{item.name}</h3>
                                        <div className={styles.itemPrice}>${item.price}</div>
                                        <div className={styles.quantityControls}>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className={styles.quantityBtn}
                                            >
                                                -
                                            </button>
                                            <span className={styles.quantity}>{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className={styles.quantityBtn}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    <div className={styles.itemTotal}>
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className={styles.removeBtn}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className={styles.cartSummary}>
                            <h3>Order Summary</h3>
                            <div className={styles.summaryRow}>
                                <span>Subtotal:</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                            <div className={styles.summaryRow}>
                                <span>Shipping:</span>
                                <span>$16.00</span>
                            </div>
                            <div className={styles.summaryRow}>
                                <span>Total:</span>
                                <span className={styles.totalPrice}>${(total + 16).toFixed(2)}</span>
                            </div>
                            <button className={styles.checkoutBtn}>
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                )}
            </ContentBlock>
        </div>
    );
}

export default Cart;