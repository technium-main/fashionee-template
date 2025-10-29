import React, { useState } from 'react';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Shop from './pages/Shop/Shop';
import Cart from './pages/Cart/Cart';
import './styles/commons.css';

function App() {
    // Состояние текущей страницы
    const [currentPage, setCurrentPage] = useState('shop');

    // Функция для смены страниц
    const navigateTo = (page) => {
        console.log('Navigating to:', page); // Для отладки
        setCurrentPage(page);
    };

    return (
        <div className="App">
            {/* Передаем функцию навигации в Header */}
            <Header onNavigate={navigateTo} />

            {/* Условный рендеринг страниц */}
            {currentPage === 'shop' && <Shop />}
            {currentPage === 'cart' && <Cart />}

            <Footer />
        </div>
    );
}

export default App;