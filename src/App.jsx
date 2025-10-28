import React, { useState } from 'react';
import Header from './components/Header/Header';
import ContentBlock from './components/ContentBlock/ContentBlock';
import Footer from './components/Footer/Footer';

function App() {
    const [currentPage, setCurrentPage] = useState('shop');

    return (
        <div className="App">
            <Header />
            <ContentBlock
                title={currentPage === 'shop' ? 'Shop' : 'Cart'}
                breadcrumbs={currentPage === 'shop' ? ['Home', 'Shop'] : ['Home', 'Shop', 'Cart']}
            >
                {currentPage === 'shop' ? (
                    <div>
                        <h2>Страница магазина будет здесь</h2>
                        <button onClick={() => setCurrentPage('cart')}>
                            Перейти в корзину
                        </button>
                    </div>
                ) : (
                    <div>
                        <h2>Страница корзины будет здесь</h2>
                        <button onClick={() => setCurrentPage('shop')}>
                            Вернуться в магазин
                        </button>
                    </div>
                )}
            </ContentBlock>
            <Footer />
        </div>
    );
}

export default App;