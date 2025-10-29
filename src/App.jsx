import React, { useState } from 'react';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Shop from './pages/Shop/Shop';
import Cart from './pages/Cart/Cart';
import { useCart } from './hooks/useCart';
import { useFavorites } from './hooks/useFavorites';
import './styles/commons.css';

function App() {
    const [currentPage, setCurrentPage] = useState('shop');
    const { cart, updateCart, totalItems } = useCart();
    const { favorites, updateFavorites, favoritesCount } = useFavorites();

    const navigateTo = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="App">
            <Header
                onNavigate={navigateTo}
                cartItemsCount={totalItems}
                favoritesCount={favoritesCount}
            />

            {currentPage === 'shop' && (
                <Shop
                    cart={cart}
                    onUpdateCart={updateCart}
                    favorites={favorites}
                    onUpdateFavorites={updateFavorites}
                />
            )}
            {currentPage === 'cart' && (
                <Cart
                    cart={cart}
                    onUpdateCart={updateCart}
                />
            )}

            <Footer />
        </div>
    );
}

export default App;