import React from 'react';
import styles from './ContentBlock.module.css';

function ContentBlock({ children, title = "Shop", breadcrumbs = ["Home", "Shop"] }) {
    return (
        <div data-testid="content-block">
            {/* Content Header как в твоем shop.html */}
            <div className={styles.contentHeader}>
                <div className={styles.headerTitleWrapper}>
                    <div className={styles.headerTitleAndNavigation}>
                        <div className={styles.headerTitle}>{title}</div>
                        <div className={styles.headerNavigationWrapper}>
                            <div className={styles.line}></div>
                            {breadcrumbs.map((item, index) => (
                                <div
                                    key={index}
                                    className={`${styles.navigation} ${index === breadcrumbs.length - 1 ? styles.active : ''}`}
                                >
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={styles.bottomLine}></div>
                    <div className={styles.decorBubbles12}>
                        <img src="/icons/bubbles12x.svg" alt="bubbles"/>
                    </div>
                </div>
                <div className={styles.headerImage}></div>
            </div>

            {/* Основной контент */}
            <div className="margin200"></div>
            <div className="container">
                {children}
            </div>
        </div>
    );
}

export default ContentBlock;