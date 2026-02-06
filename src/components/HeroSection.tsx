'use client';

import React from 'react';
import StarShape, { SmallStar } from './StarShape';
import { useLanguage } from '@/context/LanguageContext';

export default function HeroSection() {
    const { t } = useLanguage();
    return (
        <section style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(180deg, var(--color-bg) 0%, var(--color-bg-cream) 100%)'
        }}>
            {/* Decorative Stars */}
            <div style={{ position: 'absolute', top: '15%', left: '10%' }} className="animate-float">
                <SmallStar size={20} />
            </div>
            <div style={{ position: 'absolute', top: '25%', right: '15%', animationDelay: '0.5s' }} className="animate-float">
                <SmallStar size={16} />
            </div>
            <div style={{ position: 'absolute', bottom: '30%', left: '20%', animationDelay: '1s' }} className="animate-float">
                <SmallStar size={14} />
            </div>
            <div style={{ position: 'absolute', bottom: '20%', right: '10%', animationDelay: '1.5s' }} className="animate-float">
                <SmallStar size={18} />
            </div>

            {/* Decorative leaf shapes */}
            <svg style={{
                position: 'absolute',
                top: '20%',
                right: '5%',
                width: '150px',
                opacity: 0.08,
                transform: 'rotate(45deg)'
            }} viewBox="0 0 100 100">
                <ellipse cx="50" cy="50" rx="15" ry="45" fill="var(--color-primary)" />
            </svg>
            <svg style={{
                position: 'absolute',
                bottom: '15%',
                left: '8%',
                width: '120px',
                opacity: 0.06,
                transform: 'rotate(-30deg)'
            }} viewBox="0 0 100 100">
                <ellipse cx="50" cy="50" rx="15" ry="45" fill="var(--color-primary)" />
            </svg>

            {/* Main Content */}
            <div className="container" style={{
                textAlign: 'center',
                zIndex: 1
            }}>
                {/* Logo */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    marginBottom: '2rem'
                }} className="animate-fadeIn">
                    <StarShape size={80} animated />
                    <h1 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(4rem, 12vw, 8rem)',
                        fontWeight: 700,
                        color: 'var(--color-text)',
                        letterSpacing: '-0.02em',
                        lineHeight: 1
                    }}>
                        stéra
                    </h1>
                </div>

                {/* Tagline */}
                <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
                    fontWeight: 400,
                    color: 'var(--color-text-light)',
                    marginBottom: '0.5rem',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase'
                }} className="animate-fadeIn" >
                    Coffee & Tea Bar
                </p>

                <p style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
                    fontWeight: 400,
                    fontStyle: 'italic',
                    color: 'var(--color-text-muted)',
                    marginBottom: '3rem',
                    maxWidth: '500px',
                    margin: '0 auto 3rem auto'
                }} className="animate-fadeIn">
                    Dari sudut kecil, untuk hari yang besar
                </p>

                {/* CTA Buttons */}
                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    justifyContent: 'center',
                    flexWrap: 'wrap'
                }} className="animate-fadeIn">
                    <a href="#menu" className="btn btn-primary" style={{
                        fontSize: '1rem',
                        padding: '1rem 2.5rem'
                    }}>
                        <SmallStar size={16} />
                        {t('hero.cta')}
                    </a>
                    <a href="#about" className="btn btn-outline" style={{
                        fontSize: '1rem',
                        padding: '1rem 2.5rem'
                    }}>
                        {t('about.cta')}
                    </a>
                </div>

                {/* Scroll indicator */}
                <div style={{
                    position: 'absolute',
                    bottom: '2rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem',
                    opacity: 0.5
                }} className="animate-float">

                </div>
            </div>
        </section>
    );
}
