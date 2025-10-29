import React from 'react';
import ProductCard from '../ProductCard/ProductCard';
import styles from './Showcase.module.css';

function Showcase({ products }) {
    // Добавляем проверку
    if (!products || !Array.isArray(products)) {
        return (
            <div data-testid="showcase" className={styles.showcase}>
                <div className={styles.error}>No products available</div>
            </div>
        );
    }

    return (
        <div data-testid="showcase" className={styles.showcase}>
            <div className={styles.productsGrid}>
                {products.map(product => (
                    <ProductCard
                        key={product.id}
                        product={product}
                    />
                ))}
            </div>
        </div>
    );
}

export default Showcase;