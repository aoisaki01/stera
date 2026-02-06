'use client';

import React from 'react';
import StarShape, { SmallStar } from './StarShape';

export default function Footer() {
    return (
        <footer id="contact" style={{
            background: 'var(--color-text)',
            color: 'var(--color-white)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Decorative element */}
            <div style={{
                position: 'absolute',
                top: '-50px',
                left: '50%',
                transform: 'translateX(-50%)'
            }}>
                <StarShape size={100} />
            </div>

            {/* Main footer content */}
            <div className="container" style={{ paddingTop: '6rem', paddingBottom: '2rem' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '3rem',
                    marginBottom: '4rem'
                }}>
                    {/* Brand */}
                    <div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            marginBottom: '1.5rem'
                        }}>
                            <StarShape size={36} />
                            <span style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: '2rem',
                                fontWeight: 600
                            }}>
                                stéra
                            </span>
                        </div>
                        <p style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: '1rem',
                            lineHeight: 1.7,
                            opacity: 0.8,
                            marginBottom: '1.5rem'
                        }}>
                            Coffee & Tea Bar<br />
                            Dari sudut kecil, untuk hari yang besar
                        </p>
                        <div style={{
                            display: 'flex',
                            gap: '1rem'
                        }}>
                            {/* Social Icons */}
                            <a href="https://www.instagram.com/stera.drinks/" target="_blank" rel="noopener noreferrer" style={socialLinkStyle}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                            </a>
                            <a href="https://wa.me/6283197498693" target="_blank" rel="noopener noreferrer" style={socialLinkStyle}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '1.25rem',
                            fontWeight: 600,
                            marginBottom: '1.5rem'
                        }}>
                            Quick Links
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {['Home', 'Menu', 'About', 'Gallery', 'Contact'].map((link) => (
                                <li key={link} style={{ marginBottom: '0.75rem' }}>
                                    <a href={`#${link.toLowerCase()}`} style={{
                                        fontFamily: 'var(--font-body)',
                                        fontSize: '1rem',
                                        opacity: 0.8,
                                        transition: 'opacity 0.2s ease',
                                        textDecoration: 'none',
                                        color: 'inherit'
                                    }}>
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '1.25rem',
                            fontWeight: 600,
                            marginBottom: '1.5rem'
                        }}>
                            Visit Us
                        </h4>
                        <div style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: '1rem',
                            lineHeight: 1.8,
                            opacity: 0.8
                        }}>
                            <p style={{ marginBottom: '1rem' }}>
                                <strong>Address:</strong><br />
                                Jl. Qyu Lite Hi Tham<br />
                                Kediri, Indonesia
                            </p>
                            <p style={{ marginBottom: '1rem' }}>
                                <strong>Hours:</strong><br />
                                Mon - Sat: 08:00 - 22:00<br />
                                Sunday: 10:00 - 20:00
                            </p>
                            <p>
                                <strong>Phone:</strong><br />
                                +62 831-9749-8693
                            </p>
                        </div>
                    </div>

                    {/* Instagram Feed Placeholder */}
                    <div>
                        <h4 style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '1.25rem',
                            fontWeight: 600,
                            marginBottom: '1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            <SmallStar size={16} />
                            @stera.drinks
                        </h4>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: '0.5rem'
                        }}>
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} style={{
                                    aspectRatio: '1',
                                    background: `linear-gradient(${45 + i * 30}deg, rgba(45, 90, 61, ${0.3 + i * 0.1}), rgba(74, 139, 92, ${0.2 + i * 0.1}))`,
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    opacity: 0.6,
                                    transition: 'opacity 0.2s ease',
                                    cursor: 'pointer'
                                }}>
                                    <SmallStar size={12} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div style={{
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    paddingTop: '2rem',
                    textAlign: 'center'
                }}>
                    <p style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.9rem',
                        opacity: 0.6
                    }}>
                        © 2026 Stéra Coffee & Tea Bar. All rights reserved.
                    </p>
                    <p style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.85rem',
                        opacity: 0.4,
                        marginTop: '0.5rem'
                    }}>
                        Instagram @stera.drinks
                    </p>
                </div>
            </div>
        </footer>
    );
}

const socialLinkStyle: React.CSSProperties = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    color: 'inherit'
};
