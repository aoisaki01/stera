'use client';

import React, { useState } from 'react';
import { SmallStar } from './StarShape';
import { useCart } from '@/context/CartContext';

interface MenuItem {
    id: string;
    name: string;
    price: number;
    featured?: boolean;
    description?: string;
    image?: string;
}

interface MenuCategory {
    title: string;
    items: MenuItem[];
}

const menuData: MenuCategory[] = [
    {
        title: 'Tea',
        items: [
            { id: 'lemon-tea', name: 'Lemon Tea', price: 6000, image: '/images/drinks/lemon-tea.png' },
            { id: 'thai-tea', name: 'Thai Tea', price: 8000, featured: true, image: '/images/drinks/thai-tea.png' }
        ]
    },
    {
        title: 'Coffee',
        items: [
            { id: 'moccachino', name: 'Moccachino', price: 9000, featured: true, image: '/images/drinks/moccachino.png' },
            { id: 'caramel-macchiato', name: 'Caramel Macchiato', price: 10000, image: '/images/drinks/caramel-latte.png' },
            { id: 'es-kopi-susu', name: 'Es Kopi Susu', price: 8000, image: '/images/drinks/es-kopi-susu.png' }
        ]
    },
    {
        title: 'Non-Coffee',
        items: [
            { id: 'matcha-latte', name: 'Matcha Latte', price: 9000, featured: true, image: '/images/drinks/matcha-latte.png' }
        ]
    }
];


export default function MenuSection() {
    const { addItem, openOrderModal, itemCount } = useCart();
    const [addedItems, setAddedItems] = useState<Set<string>>(new Set());

    const formatPrice = (price: number) => {
        return `${price / 1000}K`;
    };

    const handleAddToCart = (item: MenuItem, category: string) => {
        addItem({
            id: item.id,
            name: item.name,
            price: item.price,
            size: 'regular',
            image: item.image,
            category
        });

        // Show added animation
        setAddedItems(prev => new Set(prev).add(item.id));
        setTimeout(() => {
            setAddedItems(prev => {
                const next = new Set(prev);
                next.delete(item.id);
                return next;
            });
        }, 1000);
    };

    return (
        <section id="menu" className="section noise-bg" style={{
            paddingTop: '6rem',
            paddingBottom: '6rem',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Decorative leaves */}
            <div style={{
                position: 'absolute',
                top: '10%',
                left: '-5%',
                width: '200px',
                height: '200px',
                opacity: 0.05,
                transform: 'rotate(-15deg)'
            }}>
                <svg viewBox="0 0 100 100" fill="var(--color-primary)">
                    <ellipse cx="50" cy="50" rx="20" ry="45" />
                </svg>
            </div>
            <div style={{
                position: 'absolute',
                bottom: '10%',
                right: '-5%',
                width: '250px',
                height: '250px',
                opacity: 0.05,
                transform: 'rotate(30deg)'
            }}>
                <svg viewBox="0 0 100 100" fill="var(--color-primary)">
                    <ellipse cx="50" cy="50" rx="20" ry="45" />
                </svg>
            </div>

            <div className="container">
                {/* Section Header */}
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <SmallStar size={24} className="animate-pulse" />
                    <h2 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                        fontWeight: 700,
                        color: 'var(--color-text)',
                        marginTop: '1rem',
                        marginBottom: '0.5rem'
                    }}>
                        Our Menu
                    </h2>
                    <p style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '1.1rem',
                        color: 'var(--color-text-muted)',
                        maxWidth: '500px',
                        margin: '0 auto'
                    }}>
                        Crafted with love, served with passion
                    </p>
                </div>

                {/* Menu Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                    gap: '2rem',
                    maxWidth: '1100px',
                    margin: '0 auto'
                }}>
                    {menuData.map((category, idx) => (
                        <div key={idx} style={{
                            background: 'rgba(255, 255, 255, 0.85)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: '20px',
                            padding: '1.75rem',
                            boxShadow: '0 4px 25px rgba(0,0,0,0.06)'
                        }}>
                            <h3 style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: '1.5rem',
                                fontWeight: 700,
                                color: 'var(--color-primary)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                marginBottom: '1.25rem',
                                paddingBottom: '0.75rem',
                                borderBottom: '2px solid var(--color-primary)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                <SmallStar size={16} />
                                {category.title}
                            </h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {category.items.map((item) => (
                                    <div
                                        key={item.id}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            padding: '0.75rem',
                                            borderRadius: '12px',
                                            background: addedItems.has(item.id)
                                                ? 'rgba(45, 90, 61, 0.1)'
                                                : 'transparent',
                                            transition: 'all 0.3s ease',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => handleAddToCart(item, category.title)}
                                    >
                                        {/* Image */}
                                        <div style={{
                                            width: '50px',
                                            height: '50px',
                                            borderRadius: '10px',
                                            overflow: 'hidden',
                                            marginRight: '0.75rem',
                                            background: item.image
                                                ? 'var(--color-bg-cream)'
                                                : 'linear-gradient(135deg, var(--color-primary-light), var(--color-primary))',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0
                                        }}>
                                            {item.image ? (
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover'
                                                    }}
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = 'none';
                                                    }}
                                                />
                                            ) : (
                                                <SmallStar size={16} />
                                            )}
                                        </div>

                                        {/* Star for featured */}
                                        <span style={{ width: '18px', flexShrink: 0 }}>
                                            {item.featured && <SmallStar size={12} />}
                                        </span>

                                        {/* Item name */}
                                        <span style={{
                                            fontFamily: 'var(--font-body)',
                                            fontSize: '0.95rem',
                                            fontWeight: 600,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em',
                                            color: 'var(--color-text)'
                                        }}>
                                            {item.name}
                                        </span>

                                        {/* Dotted line */}
                                        <span style={{
                                            flex: 1,
                                            borderBottom: '2px dotted var(--color-text-muted)',
                                            margin: '0 0.5rem',
                                            opacity: 0.4,
                                            transform: 'translateY(-2px)'
                                        }} />

                                        {/* Price */}
                                        <span style={{
                                            fontFamily: 'var(--font-display)',
                                            fontSize: '1rem',
                                            fontWeight: 600,
                                            color: 'var(--color-primary)',
                                            marginRight: '0.5rem'
                                        }}>
                                            {formatPrice(item.price)}
                                        </span>

                                        {/* Add button */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleAddToCart(item, category.title);
                                            }}
                                            style={{
                                                width: '32px',
                                                height: '32px',
                                                borderRadius: '8px',
                                                border: 'none',
                                                background: addedItems.has(item.id)
                                                    ? 'var(--color-primary)'
                                                    : 'var(--color-bg-cream)',
                                                color: addedItems.has(item.id) ? 'white' : 'var(--color-primary)',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                transition: 'all 0.2s ease',
                                                flexShrink: 0
                                            }}
                                        >
                                            {addedItems.has(item.id) ? (
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                                    <path d="M5 12l5 5L20 7" />
                                                </svg>
                                            ) : (
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M12 5v14M5 12h14" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* View Cart Button */}
                {itemCount > 0 && (
                    <div style={{
                        position: 'fixed',
                        bottom: '2rem',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 1000
                    }}>
                        <button
                            onClick={openOrderModal}
                            className="btn btn-primary"
                            style={{
                                padding: '1rem 2.5rem',
                                fontSize: '1rem',
                                boxShadow: '0 10px 30px rgba(45, 90, 61, 0.4)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem'
                            }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="9" cy="21" r="1" />
                                <circle cx="20" cy="21" r="1" />
                                <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
                            </svg>
                            Lihat Keranjang
                            <span style={{
                                background: 'rgba(255,255,255,0.3)',
                                padding: '0.25rem 0.6rem',
                                borderRadius: '20px',
                                fontSize: '0.85rem',
                                fontWeight: 700
                            }}>
                                {itemCount}
                            </span>
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
