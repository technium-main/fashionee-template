import React from 'react';
import ContentBlock from '../../components/ContentBlock/ContentBlock';
import styles from './Cart.module.css';

function Cart() {
    return (
        <div data-testid="cart-page" className={styles.cart}>
            <ContentBlock title="Cart" breadcrumbs={['Home', 'Shop', 'Cart']}>
                <div className={styles.cartContent}>
                    <h2>Cart Page</h2>
                    <p>Корзина будет реализована на следующем этапе</p>
                    <p>Здесь будут товары, добавленные в корзину</p>
                </div>
            </ContentBlock>
        </div>
    );
}

export default Cart;