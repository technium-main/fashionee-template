import React from 'react';
import styles from './Header.module.css';

function Header({ onNavigate, cartItemsCount, favoritesCount }) {
    const handleShopClick = () => {
        onNavigate('shop');
    };

    const handleCartClick = () => {
        onNavigate('cart');
    };

    return (
        <header className={styles.header} data-testid="header">
            <div className={styles.leftSide}>
                <div className={styles.logoContainer}>
                    <div className={styles.burgerMenu}>
                        <input type="checkbox" id="burger-checkbox" className={styles.burgerCheckbox}/>
                        <label className={styles.burger} htmlFor="burger-checkbox"></label>
                    </div>
                    <div className={styles.logo}>
                        <img src="/icons/logo.svg" alt="logo"/>
                    </div>
                </div>
                <div className={styles.menu}>
                    <div className={styles.menuItem} onClick={handleShopClick}>
                        <span>Home</span>
                    </div>
                    <div className={styles.menuItem}>
                        <span>Pages</span>
                        <img src="/icons/arrow.svg" alt="arrow" className={styles.arrowDefault}/>
                        <img src="/icons/arrow-red.svg" alt="arrow-red" className={styles.arrowHover}/>
                    </div>
                    <div className={`${styles.menuItem} ${styles.active}`} onClick={handleShopClick}>
                        <span>Shop</span>
                        <img src="/icons/arrow.svg" alt="arrow" className={styles.arrowDefault}/>
                        <img src="/icons/arrow-red.svg" alt="arrow-red" className={styles.arrowHover}/>
                    </div>
                    <div className={styles.menuItem}>
                        <span>Blog</span>
                    </div>
                    <div className={styles.menuItem}>
                        <span>Contact</span>
                    </div>
                </div>
            </div>
            <div className={styles.rightSide}>
                <div className={styles.headerIcon}>
                    <img src="/icons/search.svg" alt="search"/>
                </div>
                <div className={styles.headerIcon}>
                    <img src="/icons/profile.svg" alt="profile"/>
                </div>
                <div className={styles.headerIcon} data-testid="favorite-btn">
                    <img src="/icons/heart.svg" alt="favorites"/>
                    {favoritesCount > 0 && (
                        <div className={styles.counter}>{favoritesCount}</div>
                    )}
                </div>
                <div
                    className={styles.headerIcon}
                    data-testid="cart-btn"
                    onClick={handleCartClick}
                    style={{ cursor: 'pointer' }}
                >
                    <img src="/icons/cart.svg" alt="cart"/>
                    {cartItemsCount > 0 && (
                        <div className={styles.counter}>{cartItemsCount}</div>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;