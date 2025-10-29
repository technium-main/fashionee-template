import React, { useState, useEffect } from 'react';
import ContentBlock from '../../components/ContentBlock/ContentBlock';
import Showcase from './components/Showcase/Showcase';
import styles from './Shop.module.css';

function Shop() {
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

                // Проверяем, что data - массив
                if (Array.isArray(data)) {
                    setProducts(data);
                } else {
                    // Если data объект с полем products
                    setProducts(data.products || []);
                }

            } catch (err) {
                console.error('Error loading products:', err);
                setError('Failed to load products');
                setProducts([]); // Устанавливаем пустой массив при ошибке
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
                    <Showcase products={products} />
                )}
            </ContentBlock>
        </div>
    );
}

export default Shop;