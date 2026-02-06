'use client';

import React from 'react';
import { SmallStar } from './StarShape';
import { useLanguage } from '@/context/LanguageContext';

export default function AboutSection() {
    const { t } = useLanguage();
    return (
        <section id="about" className="section" style={{
            background: 'var(--color-white)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Decorative background */}
            <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '50%',
                height: '100%',
                background: 'linear-gradient(135deg, transparent 0%, var(--color-bg-cream) 100%)',
                opacity: 0.5
            }} />

            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                    gap: '4rem',
                    alignItems: 'center'
                }}>
                    {/* Image placeholder - coffee cups illustration */}
                    <div style={{
                        position: 'relative',
                        aspectRatio: '4/3',
                        borderRadius: '24px',
                        overflow: 'hidden',
                        background: 'linear-gradient(135deg, var(--color-bg-cream) 0%, var(--color-bg-paper) 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
                    }}>
                        {/* Coffee cup illustration */}
                        <div style={{
                            display: 'flex',
                            gap: '1.5rem',
                            alignItems: 'flex-end'
                        }}>
                            {[1, 2, 3].map((i) => (
                                <div key={i} style={{
                                    width: `${60 + i * 10}px`,
                                    height: `${80 + i * 15}px`,
                                    background: `linear-gradient(180deg, 
                    ${i === 1 ? '#D4A574' : i === 2 ? '#C4956A' : '#B4855A'} 0%, 
                    ${i === 1 ? '#E8D4C0' : i === 2 ? '#D4C4B0' : '#C4B4A0'} 100%)`,
                                    borderRadius: '4px 4px 8px 8px',
                                    position: 'relative',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
                                }}>
                                    {/* Cup dome */}
                                    <div style={{
                                        position: 'absolute',
                                        top: '-8px',
                                        left: '-2px',
                                        right: '-2px',
                                        height: '12px',
                                        background: 'rgba(255,255,255,0.9)',
                                        borderRadius: '50%'
                                    }} />
                                    {/* Straw */}
                                    <div style={{
                                        position: 'absolute',
                                        top: '-30px',
                                        left: '50%',
                                        transform: 'translateX(-50%) rotate(-5deg)',
                                        width: '4px',
                                        height: '40px',
                                        background: 'var(--color-primary)',
                                        borderRadius: '2px'
                                    }} />
                                </div>
                            ))}
                        </div>

                        {/* Decorative stars */}
                        <div style={{ position: 'absolute', top: '20px', right: '30px' }}>
                            <SmallStar size={20} />
                        </div>
                        <div style={{ position: 'absolute', bottom: '30px', left: '30px' }}>
                            <SmallStar size={16} />
                        </div>
                    </div>

                    {/* Content */}
                    <div>
                        <SmallStar size={24} className="animate-pulse" />
                        <h2 style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: 'clamp(2rem, 4vw, 3rem)',
                            fontWeight: 700,
                            color: 'var(--color-text)',
                            marginTop: '1rem',
                            marginBottom: '1.5rem'
                        }}>
                            {t('about.title')}
                        </h2>
                        <p style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: '1.1rem',
                            lineHeight: 1.8,
                            color: 'var(--color-text-light)',
                            marginBottom: '1.5rem'
                        }}>
                            {t('about.p1')}
                        </p>
                        <p style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: '1.1rem',
                            lineHeight: 1.8,
                            color: 'var(--color-text-light)',
                            marginBottom: '2rem'
                        }}>
                            {t('about.p2')}
                        </p>

                        {/* Stats */}
                        <div style={{
                            display: 'flex',
                            gap: '3rem',
                            flexWrap: 'wrap'
                        }}>
                            {[
                                { number: '6', label: 'Drink Varieties' },
                                { number: '100%', label: 'Fresh Ingredients' },
                                { number: '♥', label: 'Made with Love' }
                            ].map((stat, idx) => (
                                <div key={idx}>
                                    <div style={{
                                        fontFamily: 'var(--font-display)',
                                        fontSize: '2.5rem',
                                        fontWeight: 700,
                                        color: 'var(--color-primary)'
                                    }}>
                                        {stat.number}
                                    </div>
                                    <div style={{
                                        fontFamily: 'var(--font-body)',
                                        fontSize: '0.9rem',
                                        color: 'var(--color-text-muted)',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.1em'
                                    }}>
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
