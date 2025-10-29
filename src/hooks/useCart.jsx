import { useState, useEffect } from 'react';

export function useCart() {
    const [cart, setCart] = useState({});

    // Загружаем корзину при монтировании
    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem('cart') || '{}');
        setCart(savedCart);
    }, []);

    // Обновляем корзину
    const updateCart = (productId, quantity) => {
        const newCart = { ...cart };

        if (quantity === 0) {
            delete newCart[productId];
        } else {
            newCart[productId] = quantity;
        }

        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
    };

    // Получаем общее количество товаров
    const getTotalItems = () => {
        return Object.values(cart).reduce((total, quantity) => total + quantity, 0);
    };

    return { cart, updateCart, totalItems: getTotalItems() };
}