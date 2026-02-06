'use client';

import React, { useState, useEffect } from 'react';
import { SmallStar } from './StarShape';

interface QRISPaymentProps {
    amount: number;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function QRISPayment({ amount, onConfirm, onCancel }: QRISPaymentProps) {
    const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes
    const [isConfirming, setIsConfirming] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (timeLeft <= 0 || isSuccess) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, isSuccess]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    const handleConfirm = () => {
        setIsConfirming(true);
        // Simulate payment verification
        setTimeout(() => {
            setIsSuccess(true);
            setTimeout(() => {
                onConfirm();
            }, 2000);
        }, 1500);
    };

    if (isSuccess) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '3rem',
                textAlign: 'center'
            }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--color-primary-light), var(--color-primary))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.5rem',
                    animation: 'pulse 1s ease-in-out infinite'
                }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                        <path d="M5 12l5 5L20 7" />
                    </svg>
                </div>
                <h3 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: 'var(--color-primary)',
                    marginBottom: '0.5rem'
                }}>
                    Pembayaran Berhasil!
                </h3>
                <p style={{
                    fontFamily: 'var(--font-body)',
                    color: 'var(--color-text-muted)'
                }}>
                    Terima kasih atas pesananmu
                </p>
            </div>
        );
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '2rem'
        }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <SmallStar size={20} />
                <h3 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: 'var(--color-text)',
                    marginTop: '0.5rem'
                }}>
                    Pembayaran QRIS
                </h3>
                <p style={{
                    fontFamily: 'var(--font-body)',
                    color: 'var(--color-text-muted)',
                    fontSize: '0.9rem'
                }}>
                    Scan QR code dengan aplikasi e-wallet atau mobile banking
                </p>
            </div>

            {/* QR Code */}
            <div style={{
                background: 'var(--color-white)',
                padding: '1.5rem',
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                marginBottom: '1.5rem'
            }}>
                <svg
                    width="200"
                    height="200"
                    viewBox="0 0 200 200"
                    style={{ display: 'block' }}
                >
                    {/* QR Code pattern (simplified representation) */}
                    <rect width="200" height="200" fill="white" />

                    {/* Corner markers */}
                    <rect x="10" y="10" width="50" height="50" fill="black" />
                    <rect x="17" y="17" width="36" height="36" fill="white" />
                    <rect x="24" y="24" width="22" height="22" fill="black" />

                    <rect x="140" y="10" width="50" height="50" fill="black" />
                    <rect x="147" y="17" width="36" height="36" fill="white" />
                    <rect x="154" y="24" width="22" height="22" fill="black" />

                    <rect x="10" y="140" width="50" height="50" fill="black" />
                    <rect x="17" y="147" width="36" height="36" fill="white" />
                    <rect x="24" y="154" width="22" height="22" fill="black" />

                    {/* Data pattern */}
                    {[...Array(10)].map((_, row) => (
                        [...Array(10)].map((_, col) => {
                            const shouldFill = (row + col) % 3 === 0 || (row * col) % 5 === 0;
                            if (!shouldFill) return null;
                            return (
                                <rect
                                    key={`${row}-${col}`}
                                    x={70 + col * 6}
                                    y={70 + row * 6}
                                    width="5"
                                    height="5"
                                    fill="black"
                                />
                            );
                        })
                    ))}

                    {/* Timing patterns */}
                    {[...Array(8)].map((_, i) => (
                        <rect
                            key={`timing-h-${i}`}
                            x={70 + i * 8}
                            y="40"
                            width="6"
                            height="6"
                            fill={i % 2 === 0 ? 'black' : 'white'}
                        />
                    ))}

                    {/* Center logo */}
                    <circle cx="100" cy="100" r="15" fill="var(--color-primary)" />
                    <text x="100" y="105" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">S</text>
                </svg>
            </div>

            {/* Amount */}
            <div style={{
                background: 'var(--color-bg-cream)',
                padding: '1rem 2rem',
                borderRadius: '12px',
                marginBottom: '1rem',
                textAlign: 'center'
            }}>
                <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.85rem',
                    color: 'var(--color-text-muted)',
                    marginBottom: '0.25rem'
                }}>
                    Total Pembayaran
                </p>
                <p style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.75rem',
                    fontWeight: 700,
                    color: 'var(--color-primary)'
                }}>
                    {formatPrice(amount)}
                </p>
            </div>

            {/* Timer */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1.5rem',
                color: timeLeft < 60 ? '#dc2626' : 'var(--color-text-muted)'
            }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                </svg>
                <span style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9rem'
                }}>
                    Berlaku: {formatTime(timeLeft)}
                </span>
            </div>

            {/* Action Buttons */}
            <div style={{
                display: 'flex',
                gap: '1rem',
                width: '100%'
            }}>
                <button
                    onClick={onCancel}
                    style={{
                        flex: 1,
                        padding: '0.875rem',
                        borderRadius: '12px',
                        border: '2px solid var(--color-text-muted)',
                        background: 'transparent',
                        fontFamily: 'var(--font-body)',
                        fontWeight: 600,
                        color: 'var(--color-text)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                    }}
                >
                    Batal
                </button>
                <button
                    onClick={handleConfirm}
                    disabled={isConfirming}
                    style={{
                        flex: 2,
                        padding: '0.875rem',
                        borderRadius: '12px',
                        border: 'none',
                        background: 'linear-gradient(135deg, var(--color-primary-light), var(--color-primary))',
                        fontFamily: 'var(--font-body)',
                        fontWeight: 600,
                        color: 'white',
                        cursor: isConfirming ? 'wait' : 'pointer',
                        opacity: isConfirming ? 0.7 : 1,
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                    }}
                >
                    {isConfirming ? (
                        <>
                            <span style={{
                                width: '16px',
                                height: '16px',
                                border: '2px solid white',
                                borderTopColor: 'transparent',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite'
                            }} />
                            Memverifikasi...
                        </>
                    ) : (
                        <>
                            <SmallStar size={14} />
                            Saya Sudah Bayar
                        </>
                    )}
                </button>
            </div>

            {/* Info */}
            <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.8rem',
                color: 'var(--color-text-muted)',
                textAlign: 'center',
                marginTop: '1.5rem'
            }}>
                Pembayaran akan diverifikasi otomatis setelah berhasil
            </p>

            <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
}
