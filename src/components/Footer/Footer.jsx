import React from 'react';
import styles from './Footer.module.css';

function Footer() {
    return (
        <footer className={styles.footer} data-testid="footer">
            <div className="container">
                <div className={styles.footerInfo}>
                    <div className={`${styles.column} ${styles.column1}`}>
                        <div className={styles.logo}>
                            <img src="/icons/logo.svg" alt="logo"/>
                        </div>
                        <div className={styles.aboutBrand}>
                            Cillum eu id enim aliquip aute ullamco anim. Culpa deserunt nostrud excepteur voluptate.
                        </div>
                        <div className={styles.findUs}>
                            <div className={styles.findUsText}>Find us here:</div>
                            <div className={styles.findUsLinks}>
                                <div className={styles.findUsLink}>
                                    <a href="">FB</a>
                                </div>
                                <div className={styles.line}></div>
                                <div className={styles.findUsLink}>
                                    <a href="">TW</a>
                                </div>
                                <div className={styles.line}></div>
                                <div className={styles.findUsLink}>
                                    <a href="">INS</a>
                                </div>
                                <div className={styles.line}></div>
                                <div className={styles.findUsLink}>
                                    <a href="">PT</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`${styles.column} ${styles.column2}`}>
                        <div className={styles.title}>About</div>
                        <ul className="custom-list">
                            <li className="item"><a href="">About us</a></li>
                            <li className="item"><a href="">Collections</a></li>
                            <li className="item"><a href="">Shop</a></li>
                            <li className="item"><a href="">Blog</a></li>
                            <li className="item"><a href="">Contact us</a></li>
                        </ul>
                    </div>
                    <div className={`${styles.column} ${styles.column3}`}>
                        <div className={styles.title}>Useful links</div>
                        <ul className="custom-list">
                            <li className="item"><a href="">Privacy Policy</a></li>
                            <li className="item"><a href="">Terms of use</a></li>
                            <li className="item"><a href="">Support</a></li>
                            <li className="item"><a href="">Shipping details</a></li>
                            <li className="item"><a href="">FAQs</a></li>
                        </ul>
                    </div>
                    <div className={`${styles.column} ${styles.column4}`}>
                        <div className={styles.title}>Newsletter</div>
                        <div className={styles.newsletterText}>
                            Subscribe to be the first to hear about deals, offers and upcoming collections.
                        </div>
                        <div className={styles.newsletterForm}>
                            <form action="">
                                <label>
                                    <input type="text" placeholder="Enter your email" className="input"/>
                                    <img src="/icons/send.svg" alt="send" className={styles.sendIcon}/>
                                </label>
                            </form>
                        </div>
                    </div>
                </div>
                <div className={styles.copyright}>
                    <div>© All right reserved. Fashionee 2020</div>
                    <div className={styles.paymentMethodsContainer}>
                        <div>Payment methods:</div>
                        <div className={styles.paymentMethods}>
                            <div className={styles.paymentMethod}>
                                <img src="/icons/visa.svg" alt="visa"/>
                            </div>
                            <div className={styles.paymentMethod}>
                                <img src="/icons/master-card.svg" alt="master card"/>
                            </div>
                            <div className={styles.paymentMethod}>
                                <img src="/icons/paypal.svg" alt="paypal"/>
                            </div>
                            <div className={styles.paymentMethod}>
                                <img src="/icons/payoneer.svg" alt="payoneer"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.decorBubbles}>
                <div className={styles.decorBubbles5}>
                    <img src="/icons/bubbles5x.svg" alt="bubbles"/>
                </div>
                <div className={styles.decorBubbles10}>
                    <img src="/icons/bubbles10x.svg" alt="bubbles"/>
                </div>
            </div>
        </footer>
    );
}

export default Footer;