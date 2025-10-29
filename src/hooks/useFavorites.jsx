import { useState, useEffect } from 'react';

export function useFavorites() {
    const [favorites, setFavorites] = useState([]);

    // Загружаем избранное при монтировании
    useEffect(() => {
        const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        setFavorites(savedFavorites);
    }, []);

    // Обновляем избранное
    const updateFavorites = (productId) => {
        const newFavorites = favorites.includes(productId)
            ? favorites.filter(id => id !== productId)
            : [...favorites, productId];

        setFavorites(newFavorites);
        localStorage.setItem('favorites', JSON.stringify(newFavorites));
    };

    return { favorites, updateFavorites, favoritesCount: favorites.length };
}