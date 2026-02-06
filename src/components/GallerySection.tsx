'use client';

import React from 'react';
import { SmallStar } from './StarShape';
import { useLanguage } from '@/context/LanguageContext';

export default function GallerySection() {
    const { t } = useLanguage();
    const galleryItems = [
        { title: 'Lemon Tea', color: '#E8C547', image: '/images/drinks/lemon-tea.png' },
        { title: 'Thai Tea', color: '#D4A574', image: '/images/drinks/thai-tea.png' },
        { title: 'Moccachino', color: '#8B6B4A', image: '/images/drinks/moccachino.png' },
        { title: 'Caramel Macchiato', color: '#A67B5B', image: '/images/drinks/caramel-latte.png' },
        { title: 'Es Kopi Susu', color: '#9E7B5B', image: '/images/drinks/es-kopi-susu.png' },
        { title: 'Matcha Latte', color: '#7BA05B', image: '/images/drinks/matcha-latte.png' }
    ];

    return (
        <section id="gallery" className="section" style={{
            background: 'var(--color-bg-cream)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div className="container">
                {/* Section Header */}
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <SmallStar size={24} className="animate-pulse" />
                    <h2 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(2rem, 4vw, 3rem)',
                        fontWeight: 700,
                        color: 'var(--color-text)',
                        marginTop: '1rem',
                        marginBottom: '0.5rem'
                    }}>
                        {t('gallery.title')}
                    </h2>
                    <p style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '1.1rem',
                        color: 'var(--color-text-muted)',
                        maxWidth: '500px',
                        margin: '0 auto'
                    }}>
                        {t('gallery.subtitle')}
                    </p>
                </div>

                {/* Gallery Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '1.5rem'
                }}>
                    {galleryItems.map((item, idx) => (
                        <div
                            key={idx}
                            style={{
                                position: 'relative',
                                aspectRatio: '4/5',
                                borderRadius: '20px',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-8px)';
                                e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.15)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
                            }}
                        >
                            {/* Gradient Background */}
                            <div style={{
                                position: 'absolute',
                                inset: 0,
                                background: `linear-gradient(160deg, ${item.color}40 0%, ${item.color}80 50%, ${item.color} 100%)`
                            }} />

                            {/* Product Image */}
                            <div style={{
                                position: 'absolute',
                                bottom: '30%',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '140px',
                                height: '180px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '100%',
                                        objectFit: 'contain',
                                        filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))'
                                    }}
                                />
                            </div>

                            {/* Title Overlay */}
                            <div style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                padding: '2rem',
                                background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.5) 100%)'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}>
                                    <SmallStar size={14} />
                                    <h3 style={{
                                        fontFamily: 'var(--font-display)',
                                        fontSize: '1.25rem',
                                        fontWeight: 600,
                                        color: 'var(--color-white)',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em'
                                    }}>
                                        {item.title}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
