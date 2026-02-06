'use client';

import React from 'react';
import StarShape, { SmallStar } from './StarShape';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';

export default function Navbar() {
    const { itemCount, openOrderModal } = useCart();
    const { lang, setLang, t } = useLanguage();
    const [scrolled, setScrolled] = React.useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            padding: scrolled ? '0.75rem 0' : '1.25rem 0',
            background: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
            backdropFilter: scrolled ? 'blur(10px)' : 'none',
            boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.08)' : 'none',
            transition: 'all 0.3s ease'
        }}>
            <div className="container" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                {/* Logo */}
                <a href="#" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    textDecoration: 'none'
                }}>
                    <StarShape size={32} />
                    <span style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.75rem',
                        fontWeight: 600,
                        color: 'var(--color-text)',
                        letterSpacing: '-0.02em'
                    }}>
                        stéra
                    </span>
                </a>

                {/* Desktop Menu */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2rem'
                }} className="desktop-menu">
                    <a href="#menu" style={navLinkStyle}>{t('nav.menu')}</a>
                    <a href="#about" style={navLinkStyle}>{t('nav.about')}</a>
                    <a href="#reservation" style={navLinkStyle}>{t('nav.reservation')}</a>

                    {/* Language Toggle */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        background: 'var(--color-bg-cream)',
                        borderRadius: '20px',
                        padding: '4px'
                    }}>
                        <button
                            onClick={() => setLang('id')}
                            style={{
                                padding: '0.35rem 0.75rem',
                                borderRadius: '16px',
                                border: 'none',
                                background: lang === 'id' ? 'var(--color-primary)' : 'transparent',
                                color: lang === 'id' ? 'white' : 'var(--color-text-muted)',
                                fontFamily: 'var(--font-body)',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            ID
                        </button>
                        <button
                            onClick={() => setLang('en')}
                            style={{
                                padding: '0.35rem 0.75rem',
                                borderRadius: '16px',
                                border: 'none',
                                background: lang === 'en' ? 'var(--color-primary)' : 'transparent',
                                color: lang === 'en' ? 'white' : 'var(--color-text-muted)',
                                fontFamily: 'var(--font-body)',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            EN
                        </button>
                    </div>

                    {/* Cart Button */}
                    <button
                        onClick={openOrderModal}
                        style={{
                            position: 'relative',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '0.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-text)" strokeWidth="2">
                            <circle cx="9" cy="21" r="1" />
                            <circle cx="20" cy="21" r="1" />
                            <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
                        </svg>
                        {itemCount > 0 && (
                            <span style={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                width: '18px',
                                height: '18px',
                                borderRadius: '50%',
                                background: 'var(--color-primary)',
                                color: 'white',
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {itemCount}
                            </span>
                        )}
                    </button>

                    <a href="#menu" className="btn btn-primary" style={{ padding: '0.6rem 1.5rem' }}>
                        {t('nav.orderNow')}
                    </a>
                </div>

                {/* Mobile Menu Button */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} className="mobile-controls">
                    {/* Mobile Language Toggle */}
                    <div style={{
                        display: 'none',
                        alignItems: 'center',
                        gap: '0.25rem',
                        background: 'var(--color-bg-cream)',
                        borderRadius: '16px',
                        padding: '2px'
                    }} className="mobile-lang-toggle">
                        <button
                            onClick={() => setLang('id')}
                            style={{
                                padding: '0.25rem 0.5rem',
                                borderRadius: '14px',
                                border: 'none',
                                background: lang === 'id' ? 'var(--color-primary)' : 'transparent',
                                color: lang === 'id' ? 'white' : 'var(--color-text-muted)',
                                fontFamily: 'var(--font-body)',
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                cursor: 'pointer'
                            }}
                        >
                            ID
                        </button>
                        <button
                            onClick={() => setLang('en')}
                            style={{
                                padding: '0.25rem 0.5rem',
                                borderRadius: '14px',
                                border: 'none',
                                background: lang === 'en' ? 'var(--color-primary)' : 'transparent',
                                color: lang === 'en' ? 'white' : 'var(--color-text-muted)',
                                fontFamily: 'var(--font-body)',
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                cursor: 'pointer'
                            }}
                        >
                            EN
                        </button>
                    </div>

                    {/* Mobile Cart */}
                    <button
                        onClick={openOrderModal}
                        style={{
                            position: 'relative',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '0.5rem',
                            display: 'none'
                        }}
                        className="mobile-cart-btn"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-text)" strokeWidth="2">
                            <circle cx="9" cy="21" r="1" />
                            <circle cx="20" cy="21" r="1" />
                            <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
                        </svg>
                        {itemCount > 0 && (
                            <span style={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                width: '18px',
                                height: '18px',
                                borderRadius: '50%',
                                background: 'var(--color-primary)',
                                color: 'white',
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {itemCount}
                            </span>
                        )}
                    </button>

                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        style={{
                            display: 'none',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '0.5rem'
                        }}
                        className="mobile-menu-btn"
                        aria-label="Toggle menu"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            {mobileMenuOpen ? (
                                <path d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path d="M3 12h18M3 6h18M3 18h18" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    background: 'var(--color-white)',
                    padding: '1rem',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                }} className="mobile-menu">
                    <a href="#menu" style={navLinkStyle} onClick={() => setMobileMenuOpen(false)}>{t('nav.menu')}</a>
                    <a href="#about" style={navLinkStyle} onClick={() => setMobileMenuOpen(false)}>{t('nav.about')}</a>
                    <a href="#reservation" style={navLinkStyle} onClick={() => setMobileMenuOpen(false)}>{t('nav.reservation')}</a>
                    <a href="#menu" className="btn btn-primary" onClick={() => setMobileMenuOpen(false)}>
                        {t('nav.orderNow')}
                    </a>
                </div>
            )}

            <style jsx global>{`
        @media (max-width: 768px) {
          .desktop-menu { display: none !important; }
          .mobile-menu-btn { display: block !important; }
          .mobile-cart-btn { display: block !important; }
          .mobile-lang-toggle { display: flex !important; }
        }
      `}</style>
        </nav>
    );
}

const navLinkStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body)',
    fontSize: '0.95rem',
    fontWeight: 500,
    color: 'var(--color-text)',
    textDecoration: 'none',
    transition: 'color 0.2s ease',
    position: 'relative'
};

