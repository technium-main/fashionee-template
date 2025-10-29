import React, { useState, useEffect } from 'react';
import ContentBlock from '../../components/ContentBlock/ContentBlock';
import Showcase from './components/Showcase/Showcase';
import styles from './Shop.module.css';

function Shop({ cart, onUpdateCart, favorites, onUpdateFavorites }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                setLoading(true);
                const response = await fetch('/products.json');

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                if (data.products && Array.isArray(data.products)) {
                    setProducts(data.products);
                } else {
                    setProducts([]);
                }

            } catch (err) {
                console.error('Error loading products:', err);
                setError('Failed to load products');
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, []);

    if (error) {
        return (
            <ContentBlock title="Shop" breadcrumbs={['Home', 'Shop']}>
                <div className={styles.error}>Error: {error}</div>
            </ContentBlock>
        );
    }

    return (
        <div className={styles.shop}>
            <ContentBlock title="Shop" breadcrumbs={['Home', 'Shop']}>
                {loading ? (
                    <div className={styles.loading}>Loading products...</div>
                ) : (
                    <Showcase
                        products={products}
                        cart={cart}
                        onUpdateCart={onUpdateCart}
                        favorites={favorites}
                        onUpdateFavorites={onUpdateFavorites}
                    />
                )}
            </ContentBlock>
        </div>
    );
}

export default Shop;