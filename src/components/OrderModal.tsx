'use client';

import React, { useState } from 'react';
import { useCart, OrderType } from '@/context/CartContext';
import { SmallStar } from './StarShape';
import QRISPayment from './QRISPayment';
import { saveOrder } from '@/lib/firebase';
import {
    Store,
    Bike,
    UtensilsCrossed,
    ShoppingCart,
    Trash2,
    X,
    Check,
    MapPin
} from 'lucide-react';

type ModalStep = 'cart' | 'details' | 'payment' | 'success';

export default function OrderModal() {
    const {
        items, orderType, customerInfo,
        updateQuantity, removeItem, clearCart,
        setOrderType, setCustomerInfo,
        subtotal, deliveryFee, total, itemCount,
        isOrderModalOpen, closeOrderModal
    } = useCart();

    const [step, setStep] = useState<ModalStep>('cart');
    const [orderId, setOrderId] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [formData, setFormData] = useState({
        name: customerInfo.name,
        phone: customerInfo.phone,
        address: '',
        notes: '',
        pickupTime: '30'
    });

    if (!isOrderModalOpen) return null;

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    const handleSubmitDetails = (e: React.FormEvent) => {
        e.preventDefault();
        setCustomerInfo({
            name: formData.name,
            phone: formData.phone,
            address: formData.address,
            notes: formData.notes
        });
        setStep('payment');
    };

    const handlePaymentConfirm = async () => {
        setIsProcessing(true);
        try {
            const newOrderId = await saveOrder({
                items: items.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    size: item.size
                })),
                orderType,
                customer: {
                    name: formData.name,
                    phone: formData.phone,
                    address: formData.address || undefined
                },
                notes: formData.notes || undefined,
                pickupTime: orderType === 'pickup' ? formData.pickupTime : undefined,
                subtotal,
                deliveryFee,
                total
            });
            setOrderId(newOrderId);
            setStep('success');
        } catch (error) {
            console.error('Error saving order:', error);
            alert('Gagal menyimpan pesanan. Silakan coba lagi.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleClose = () => {
        if (step === 'success') {
            clearCart();
        }
        setStep('cart');
        closeOrderModal();
    };

    const orderTypeOptions: { value: OrderType; label: string; icon: React.ReactNode; desc: string }[] = [
        { value: 'pickup', label: 'Pickup', icon: <Store size={24} />, desc: 'Ambil di toko' },
        { value: 'delivery', label: 'Delivery', icon: <Bike size={24} />, desc: 'Antar ke alamat (+5K)' },
        { value: 'dine-in', label: 'Dine-in', icon: <UtensilsCrossed size={24} />, desc: 'Makan di tempat' }
    ];

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
        }}>
            {/* Backdrop */}
            <div
                onClick={handleClose}
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(4px)'
                }}
            />

            {/* Modal */}
            <div style={{
                position: 'relative',
                background: 'var(--color-white)',
                borderRadius: '24px',
                width: '100%',
                maxWidth: '500px',
                maxHeight: '90vh',
                overflow: 'hidden',
                boxShadow: '0 25px 50px rgba(0,0,0,0.25)'
            }}>
                {/* Header */}
                <div style={{
                    padding: '1.5rem',
                    borderBottom: '1px solid var(--color-bg-cream)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <SmallStar size={20} />
                        <h2 style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '1.25rem',
                            fontWeight: 700,
                            color: 'var(--color-text)'
                        }}>
                            {step === 'cart' && 'Keranjang'}
                            {step === 'details' && 'Detail Pesanan'}
                            {step === 'payment' && 'Pembayaran'}
                            {step === 'success' && 'Pesanan Berhasil'}
                        </h2>
                    </div>
                    <button
                        onClick={handleClose}
                        style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            border: 'none',
                            background: 'var(--color-bg-cream)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Content */}
                <div style={{
                    maxHeight: 'calc(90vh - 140px)',
                    overflowY: 'auto',
                    padding: step === 'payment' ? 0 : '1.5rem'
                }}>
                    {/* Cart Step */}
                    {step === 'cart' && (
                        <>
                            {items.length === 0 ? (
                                <div style={{
                                    textAlign: 'center',
                                    padding: '3rem 1rem'
                                }}>
                                    <div style={{
                                        width: '80px',
                                        height: '80px',
                                        borderRadius: '50%',
                                        background: 'var(--color-bg-cream)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 1.5rem auto'
                                    }}>
                                        <ShoppingCart size={32} color="var(--color-text-muted)" />
                                    </div>
                                    <p style={{
                                        fontFamily: 'var(--font-body)',
                                        color: 'var(--color-text-muted)'
                                    }}>
                                        Keranjang masih kosong
                                    </p>
                                    <button
                                        onClick={handleClose}
                                        className="btn btn-primary"
                                        style={{ marginTop: '1.5rem' }}
                                    >
                                        Lihat Menu
                                    </button>
                                </div>
                            ) : (
                                <>
                                    {/* Cart Items */}
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        {items.map((item) => (
                                            <div
                                                key={`${item.id}-${item.size}`}
                                                style={{
                                                    display: 'flex',
                                                    gap: '1rem',
                                                    padding: '1rem',
                                                    background: 'var(--color-bg-cream)',
                                                    borderRadius: '12px',
                                                    marginBottom: '0.75rem'
                                                }}
                                            >
                                                {/* Image placeholder */}
                                                <div style={{
                                                    width: '60px',
                                                    height: '60px',
                                                    borderRadius: '8px',
                                                    background: `linear-gradient(135deg, var(--color-primary-light), var(--color-primary))`,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    flexShrink: 0,
                                                    overflow: 'hidden'
                                                }}>
                                                    {item.image ? (
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                        />
                                                    ) : (
                                                        <SmallStar size={20} />
                                                    )}
                                                </div>

                                                {/* Details */}
                                                <div style={{ flex: 1 }}>
                                                    <div style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'flex-start'
                                                    }}>
                                                        <div>
                                                            <h4 style={{
                                                                fontFamily: 'var(--font-body)',
                                                                fontWeight: 600,
                                                                fontSize: '0.95rem',
                                                                color: 'var(--color-text)'
                                                            }}>
                                                                {item.name}
                                                            </h4>
                                                            <p style={{
                                                                fontFamily: 'var(--font-body)',
                                                                fontSize: '0.8rem',
                                                                color: 'var(--color-text-muted)',
                                                                textTransform: 'capitalize'
                                                            }}>
                                                                {item.size} {item.size === 'large' && '(+3K)'}
                                                            </p>
                                                        </div>
                                                        <button
                                                            onClick={() => removeItem(item.id)}
                                                            style={{
                                                                background: 'none',
                                                                border: 'none',
                                                                cursor: 'pointer',
                                                                color: 'var(--color-text-muted)',
                                                                padding: '4px'
                                                            }}
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>

                                                    <div style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        marginTop: '0.5rem'
                                                    }}>
                                                        {/* Quantity controls */}
                                                        <div style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '0.5rem',
                                                            background: 'var(--color-white)',
                                                            borderRadius: '8px',
                                                            padding: '0.25rem'
                                                        }}>
                                                            <button
                                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                                style={{
                                                                    width: '28px',
                                                                    height: '28px',
                                                                    borderRadius: '6px',
                                                                    border: 'none',
                                                                    background: 'var(--color-bg-cream)',
                                                                    cursor: 'pointer',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center'
                                                                }}
                                                            >
                                                                −
                                                            </button>
                                                            <span style={{
                                                                fontFamily: 'var(--font-body)',
                                                                fontWeight: 600,
                                                                minWidth: '24px',
                                                                textAlign: 'center'
                                                            }}>
                                                                {item.quantity}
                                                            </span>
                                                            <button
                                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                style={{
                                                                    width: '28px',
                                                                    height: '28px',
                                                                    borderRadius: '6px',
                                                                    border: 'none',
                                                                    background: 'var(--color-primary)',
                                                                    color: 'white',
                                                                    cursor: 'pointer',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center'
                                                                }}
                                                            >
                                                                +
                                                            </button>
                                                        </div>

                                                        <span style={{
                                                            fontFamily: 'var(--font-display)',
                                                            fontWeight: 600,
                                                            color: 'var(--color-primary)'
                                                        }}>
                                                            {formatPrice((item.price + (item.size === 'large' ? 3000 : 0)) * item.quantity)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Order Type Selection */}
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <h4 style={{
                                            fontFamily: 'var(--font-body)',
                                            fontWeight: 600,
                                            marginBottom: '0.75rem',
                                            color: 'var(--color-text)'
                                        }}>
                                            Tipe Pesanan
                                        </h4>
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(3, 1fr)',
                                            gap: '0.75rem'
                                        }}>
                                            {orderTypeOptions.map((opt) => (
                                                <button
                                                    key={opt.value}
                                                    onClick={() => setOrderType(opt.value)}
                                                    style={{
                                                        padding: '1rem 0.5rem',
                                                        borderRadius: '12px',
                                                        border: orderType === opt.value
                                                            ? '2px solid var(--color-primary)'
                                                            : '2px solid var(--color-bg-cream)',
                                                        background: orderType === opt.value
                                                            ? 'rgba(45, 90, 61, 0.1)'
                                                            : 'var(--color-white)',
                                                        cursor: 'pointer',
                                                        textAlign: 'center',
                                                        transition: 'all 0.2s ease'
                                                    }}
                                                >
                                                    <div style={{
                                                        marginBottom: '0.25rem',
                                                        color: orderType === opt.value ? 'var(--color-primary)' : 'var(--color-text-muted)',
                                                        display: 'flex',
                                                        justifyContent: 'center'
                                                    }}>
                                                        {opt.icon}
                                                    </div>
                                                    <div style={{
                                                        fontFamily: 'var(--font-body)',
                                                        fontWeight: 600,
                                                        fontSize: '0.85rem',
                                                        color: 'var(--color-text)'
                                                    }}>
                                                        {opt.label}
                                                    </div>
                                                    <div style={{
                                                        fontFamily: 'var(--font-body)',
                                                        fontSize: '0.7rem',
                                                        color: 'var(--color-text-muted)'
                                                    }}>
                                                        {opt.desc}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Summary */}
                                    <div style={{
                                        background: 'var(--color-bg-cream)',
                                        borderRadius: '12px',
                                        padding: '1rem'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            marginBottom: '0.5rem',
                                            fontFamily: 'var(--font-body)',
                                            color: 'var(--color-text-light)'
                                        }}>
                                            <span>Subtotal ({itemCount} item)</span>
                                            <span>{formatPrice(subtotal)}</span>
                                        </div>
                                        {orderType === 'delivery' && (
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                marginBottom: '0.5rem',
                                                fontFamily: 'var(--font-body)',
                                                color: 'var(--color-text-light)'
                                            }}>
                                                <span>Ongkir</span>
                                                <span>{formatPrice(deliveryFee)}</span>
                                            </div>
                                        )}
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            paddingTop: '0.75rem',
                                            borderTop: '1px dashed var(--color-text-muted)',
                                            fontFamily: 'var(--font-display)',
                                            fontSize: '1.1rem',
                                            fontWeight: 700,
                                            color: 'var(--color-text)'
                                        }}>
                                            <span>Total</span>
                                            <span style={{ color: 'var(--color-primary)' }}>{formatPrice(total)}</span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </>
                    )}

                    {/* Details Step */}
                    {step === 'details' && (
                        <form onSubmit={handleSubmitDetails}>
                            <div style={{ marginBottom: '1.25rem' }}>
                                <label style={labelStyle}>Nama Lengkap *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    style={inputStyle}
                                    placeholder="Masukkan nama"
                                />
                            </div>

                            <div style={{ marginBottom: '1.25rem' }}>
                                <label style={labelStyle}>Nomor WhatsApp *</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    required
                                    style={inputStyle}
                                    placeholder="08xxxxxxxxxx"
                                />
                            </div>

                            {orderType === 'delivery' && (
                                <div style={{ marginBottom: '1.25rem' }}>
                                    <label style={labelStyle}>Alamat Pengiriman *</label>
                                    <textarea
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        required
                                        style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                                        placeholder="Alamat lengkap"
                                    />
                                </div>
                            )}

                            {orderType === 'pickup' && (
                                <div style={{ marginBottom: '1.25rem' }}>
                                    <label style={labelStyle}>Waktu Ambil</label>
                                    <select
                                        value={formData.pickupTime}
                                        onChange={(e) => setFormData({ ...formData, pickupTime: e.target.value })}
                                        style={inputStyle}
                                    >
                                        <option value="15">15 menit</option>
                                        <option value="30">30 menit</option>
                                        <option value="45">45 menit</option>
                                        <option value="60">1 jam</option>
                                    </select>
                                </div>
                            )}

                            <div style={{ marginBottom: '1.25rem' }}>
                                <label style={labelStyle}>Catatan (Opsional)</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }}
                                    placeholder="Contoh: less sugar, extra ice"
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{ width: '100%', padding: '1rem' }}
                            >
                                <SmallStar size={16} />
                                Lanjut ke Pembayaran
                            </button>
                        </form>
                    )}

                    {/* Payment Step */}
                    {step === 'payment' && (
                        <QRISPayment
                            amount={total}
                            onConfirm={handlePaymentConfirm}
                            onCancel={() => setStep('details')}
                        />
                    )}

                    {/* Success Step */}
                    {step === 'success' && (
                        <div style={{
                            textAlign: 'center',
                            padding: '2rem 1rem'
                        }}>
                            <div style={{
                                width: '100px',
                                height: '100px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, var(--color-primary-light), var(--color-primary))',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1.5rem auto'
                            }}>
                                <Check size={50} color="white" strokeWidth={2.5} />
                            </div>

                            <h3 style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: '1.75rem',
                                fontWeight: 700,
                                color: 'var(--color-text)',
                                marginBottom: '0.5rem'
                            }}>
                                Pesanan Dikonfirmasi!
                            </h3>

                            <p style={{
                                fontFamily: 'var(--font-body)',
                                color: 'var(--color-text-muted)',
                                marginBottom: '1.5rem'
                            }}>
                                Order #{orderId}
                            </p>

                            <div style={{
                                background: 'var(--color-bg-cream)',
                                borderRadius: '12px',
                                padding: '1rem',
                                marginBottom: '1.5rem',
                                textAlign: 'left'
                            }}>
                                <p style={{
                                    fontFamily: 'var(--font-body)',
                                    fontSize: '0.9rem',
                                    color: 'var(--color-text)',
                                    marginBottom: '0.5rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}>
                                    <MapPin size={16} />
                                    <strong>{orderType === 'pickup' ? 'Pickup' : orderType === 'delivery' ? 'Delivery' : 'Dine-in'}</strong>
                                </p>
                                {orderType === 'pickup' && (
                                    <p style={{
                                        fontFamily: 'var(--font-body)',
                                        fontSize: '0.85rem',
                                        color: 'var(--color-text-muted)'
                                    }}>
                                        Siap dalam {formData.pickupTime} menit
                                    </p>
                                )}
                                {orderType === 'delivery' && (
                                    <p style={{
                                        fontFamily: 'var(--font-body)',
                                        fontSize: '0.85rem',
                                        color: 'var(--color-text-muted)'
                                    }}>
                                        Akan diantar ke: {formData.address}
                                    </p>
                                )}
                            </div>

                            <p style={{
                                fontFamily: 'var(--font-body)',
                                fontSize: '0.85rem',
                                color: 'var(--color-text-muted)',
                                marginBottom: '1.5rem'
                            }}>
                                Konfirmasi pesanan akan dikirim via WhatsApp ke<br />
                                <strong>{formData.phone}</strong>
                            </p>

                            <button
                                onClick={handleClose}
                                className="btn btn-primary"
                                style={{ width: '100%', padding: '1rem' }}
                            >
                                Selesai
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer - only for cart step */}
                {step === 'cart' && items.length > 0 && (
                    <div style={{
                        padding: '1rem 1.5rem',
                        borderTop: '1px solid var(--color-bg-cream)'
                    }}>
                        <button
                            onClick={() => setStep('details')}
                            className="btn btn-primary"
                            style={{
                                width: '100%',
                                padding: '1rem',
                                fontSize: '1rem'
                            }}
                        >
                            <SmallStar size={16} />
                            Lanjut Pesan • {formatPrice(total)}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

const labelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: 'var(--font-body)',
    fontWeight: 600,
    fontSize: '0.9rem',
    color: 'var(--color-text)',
    marginBottom: '0.5rem'
};

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.875rem 1rem',
    borderRadius: '12px',
    border: '2px solid var(--color-bg-cream)',
    fontFamily: 'var(--font-body)',
    fontSize: '1rem',
    color: 'var(--color-text)',
    background: 'var(--color-white)',
    outline: 'none',
    transition: 'border-color 0.2s ease'
};
