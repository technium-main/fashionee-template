// context/AppContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [currentPage, setCurrentPage] = useState('shop');
  const [cartCount, setCartCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);

  // Функция для обновления счётчика избранного
  const updateFavoritesCount = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavoritesCount(favorites.length);
  };

  // Функция для обновления счётчика корзины
  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '{}');
    const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
    setCartCount(totalItems);
  };

  // Загрузка избранного и корзины при запуске
  useEffect(() => {
    updateFavoritesCount();
    updateCartCount();
  }, []);

  const value = {
    currentPage,
    setCurrentPage,
    cartCount,
    setCartCount,
    favoritesCount,
    setFavoritesCount,
    updateFavoritesCount,
    updateCartCount // не забудь экспортировать эту функцию
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};