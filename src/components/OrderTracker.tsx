'use client';

import React, { useState } from 'react';
import { SmallStar } from './StarShape';
import { searchOrdersByName, searchReservationsByName } from '@/lib/firebase';
import { useLanguage } from '@/context/LanguageContext';
import { Search, Package, Clock, CheckCircle, XCircle, Coffee, Loader2, Calendar, Users } from 'lucide-react';

interface Order {
    orderId: string;
    items: Array<{
        name: string;
        quantity: number;
        size: string;
        price: number;
    }>;
    orderType: string;
    customer: {
        name: string;
        phone: string;
    };
    total: number;
    status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
    createdAt: number;
}

interface Reservation {
    reservationId: string;
    date: string;
    time: string;
    guests: number;
    customer: {
        name: string;
        phone: string;
    };
    notes?: string;
    status: 'pending' | 'confirmed' | 'cancelled';
    createdAt: number;
}

export default function OrderTracker() {
    const { t } = useLanguage();
    const [searchName, setSearchName] = useState('');
    const [orders, setOrders] = useState<Order[]>([]);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [activeTab, setActiveTab] = useState<'orders' | 'reservations'>('orders');

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchName.trim()) return;

        setIsLoading(true);
        setHasSearched(true);

        try {
            const [orderResults, reservationResults] = await Promise.all([
                searchOrdersByName(searchName),
                searchReservationsByName(searchName)
            ]);
            setOrders(orderResults as Order[]);
            setReservations(reservationResults as Reservation[]);
        } catch (error) {
            console.error('Error searching:', error);
            setOrders([]);
            setReservations([]);
        } finally {
            setIsLoading(false);
        }
    };

    const getOrderStatusInfo = (status: Order['status']) => {
        switch (status) {
            case 'pending':
                return { icon: <Clock size={18} />, label: t('tracker.status.pending'), color: '#F59E0B', bg: '#FEF3C7' };
            case 'confirmed':
                return { icon: <CheckCircle size={18} />, label: t('tracker.status.confirmed'), color: '#3B82F6', bg: '#DBEAFE' };
            case 'preparing':
                return { icon: <Coffee size={18} />, label: t('tracker.status.preparing'), color: '#8B5CF6', bg: '#EDE9FE' };
            case 'ready':
                return { icon: <Package size={18} />, label: t('tracker.status.ready'), color: '#10B981', bg: '#D1FAE5' };
            case 'completed':
                return { icon: <CheckCircle size={18} />, label: t('tracker.status.completed'), color: '#6B7280', bg: '#F3F4F6' };
            case 'cancelled':
                return { icon: <XCircle size={18} />, label: t('tracker.status.cancelled'), color: '#EF4444', bg: '#FEE2E2' };
            default:
                return { icon: <Clock size={18} />, label: status, color: '#6B7280', bg: '#F3F4F6' };
        }
    };

    const getReservationStatusInfo = (status: Reservation['status']) => {
        switch (status) {
            case 'pending':
                return { icon: <Clock size={18} />, label: t('tracker.status.pending'), color: '#F59E0B', bg: '#FEF3C7' };
            case 'confirmed':
                return { icon: <CheckCircle size={18} />, label: t('tracker.status.confirmed'), color: '#10B981', bg: '#D1FAE5' };
            case 'cancelled':
                return { icon: <XCircle size={18} />, label: t('tracker.status.cancelled'), color: '#EF4444', bg: '#FEE2E2' };
            default:
                return { icon: <Clock size={18} />, label: status, color: '#6B7280', bg: '#F3F4F6' };
        }
    };

    const formatDate = (timestamp: number) => {
        if (!timestamp) return '-';
        const date = new Date(timestamp);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    return (
        <section id="track-order" className="section" style={{
            background: 'linear-gradient(180deg, var(--color-bg) 0%, var(--color-bg-cream) 100%)',
            position: 'relative'
        }}>
            <div className="container">
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <SmallStar size={24} className="animate-pulse" />
                    <h2 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                        fontWeight: 700,
                        color: 'var(--color-text)',
                        marginTop: '0.75rem',
                        marginBottom: '0.5rem'
                    }}>
                        {t('tracker.title')}
                    </h2>
                    <p style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '1rem',
                        color: 'var(--color-text-muted)',
                        maxWidth: '500px',
                        margin: '0 auto'
                    }}>
                        {t('tracker.description')}
                    </p>
                </div>

                {/* Search Form */}
                <form onSubmit={handleSearch} style={{
                    maxWidth: '500px',
                    margin: '0 auto 2rem auto'
                }}>
                    <div style={{
                        display: 'flex',
                        gap: '0.5rem',
                        background: 'var(--color-white)',
                        borderRadius: '16px',
                        padding: '0.5rem',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                    }}>
                        <div style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0 1rem'
                        }}>
                            <Search size={20} color="var(--color-text-muted)" />
                            <input
                                type="text"
                                value={searchName}
                                onChange={(e) => setSearchName(e.target.value)}
                                placeholder={t('tracker.placeholder')}
                                style={{
                                    flex: 1,
                                    border: 'none',
                                    outline: 'none',
                                    fontFamily: 'var(--font-body)',
                                    fontSize: '1rem',
                                    color: 'var(--color-text)',
                                    background: 'transparent'
                                }}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading || !searchName.trim()}
                            style={{
                                padding: '0.875rem 1.5rem',
                                borderRadius: '12px',
                                border: 'none',
                                background: 'linear-gradient(135deg, var(--color-primary-light), var(--color-primary))',
                                color: 'white',
                                fontFamily: 'var(--font-body)',
                                fontWeight: 600,
                                cursor: searchName.trim() ? 'pointer' : 'not-allowed',
                                opacity: searchName.trim() ? 1 : 0.6,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            {isLoading ? (
                                <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                            ) : (
                                <Search size={18} />
                            )}
                            {t('tracker.search')}
                        </button>
                    </div>
                </form>

                {/* Results */}
                {hasSearched && (
                    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                        {isLoading ? (
                            <div style={{
                                textAlign: 'center',
                                padding: '3rem',
                                color: 'var(--color-text-muted)'
                            }}>
                                <Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} />
                                <p style={{ marginTop: '1rem' }}>{t('tracker.searching')}</p>
                            </div>
                        ) : (orders.length === 0 && reservations.length === 0) ? (
                            <div style={{
                                textAlign: 'center',
                                padding: '3rem',
                                background: 'var(--color-white)',
                                borderRadius: '16px',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                            }}>
                                <Package size={48} color="var(--color-text-muted)" style={{ opacity: 0.5 }} />
                                <p style={{
                                    marginTop: '1rem',
                                    fontFamily: 'var(--font-body)',
                                    color: 'var(--color-text-muted)'
                                }}>
                                    {t('tracker.noResults')} "{searchName}"
                                </p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {/* Tabs */}
                                <div style={{
                                    display: 'flex',
                                    gap: '0.5rem',
                                    justifyContent: 'center'
                                }}>
                                    <button
                                        onClick={() => setActiveTab('orders')}
                                        style={{
                                            padding: '0.625rem 1.25rem',
                                            borderRadius: '10px',
                                            border: 'none',
                                            background: activeTab === 'orders' ? 'var(--color-primary)' : 'var(--color-white)',
                                            color: activeTab === 'orders' ? 'white' : 'var(--color-text)',
                                            fontFamily: 'var(--font-body)',
                                            fontWeight: 600,
                                            fontSize: '0.9rem',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                                        }}
                                    >
                                        <Package size={16} />
                                        {t('tracker.orders')} ({orders.length})
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('reservations')}
                                        style={{
                                            padding: '0.625rem 1.25rem',
                                            borderRadius: '10px',
                                            border: 'none',
                                            background: activeTab === 'reservations' ? 'var(--color-primary)' : 'var(--color-white)',
                                            color: activeTab === 'reservations' ? 'white' : 'var(--color-text)',
                                            fontFamily: 'var(--font-body)',
                                            fontWeight: 600,
                                            fontSize: '0.9rem',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                                        }}
                                    >
                                        <Calendar size={16} />
                                        {t('tracker.reservations')} ({reservations.length})
                                    </button>
                                </div>

                                {/* Orders Tab */}
                                {activeTab === 'orders' && (
                                    orders.length === 0 ? (
                                        <div style={{
                                            textAlign: 'center',
                                            padding: '2rem',
                                            background: 'var(--color-white)',
                                            borderRadius: '16px',
                                            color: 'var(--color-text-muted)'
                                        }}>
                                            {t('tracker.noOrders')}
                                        </div>
                                    ) : (
                                        orders.map((order) => {
                                            const statusInfo = getOrderStatusInfo(order.status);
                                            return (
                                                <div
                                                    key={order.orderId}
                                                    style={{
                                                        background: 'var(--color-white)',
                                                        borderRadius: '16px',
                                                        padding: '1.25rem',
                                                        boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                                                    }}
                                                >
                                                    <div style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'flex-start',
                                                        marginBottom: '1rem',
                                                        flexWrap: 'wrap',
                                                        gap: '0.5rem'
                                                    }}>
                                                        <div>
                                                            <div style={{
                                                                fontFamily: 'var(--font-display)',
                                                                fontSize: '1.1rem',
                                                                fontWeight: 700,
                                                                color: 'var(--color-text)'
                                                            }}>
                                                                {t('tracker.order')} #{order.orderId}
                                                            </div>
                                                            <div style={{
                                                                fontFamily: 'var(--font-body)',
                                                                fontSize: '0.8rem',
                                                                color: 'var(--color-text-muted)',
                                                                marginTop: '0.25rem'
                                                            }}>
                                                                {formatDate(order.createdAt)}
                                                            </div>
                                                        </div>
                                                        <div style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '0.5rem',
                                                            padding: '0.5rem 0.875rem',
                                                            borderRadius: '20px',
                                                            background: statusInfo.bg,
                                                            color: statusInfo.color,
                                                            fontFamily: 'var(--font-body)',
                                                            fontSize: '0.85rem',
                                                            fontWeight: 600
                                                        }}>
                                                            {statusInfo.icon}
                                                            {statusInfo.label}
                                                        </div>
                                                    </div>

                                                    <div style={{
                                                        borderTop: '1px solid var(--color-bg-cream)',
                                                        paddingTop: '1rem'
                                                    }}>
                                                        {order.items?.map((item, idx) => (
                                                            <div key={idx} style={{
                                                                display: 'flex',
                                                                justifyContent: 'space-between',
                                                                fontFamily: 'var(--font-body)',
                                                                fontSize: '0.9rem',
                                                                color: 'var(--color-text-light)',
                                                                marginBottom: '0.25rem'
                                                            }}>
                                                                <span>{item.quantity}x {item.name} ({item.size})</span>
                                                                <span>{formatPrice(item.price * item.quantity)}</span>
                                                            </div>
                                                        ))}
                                                        <div style={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            fontFamily: 'var(--font-display)',
                                                            fontSize: '1.1rem',
                                                            fontWeight: 700,
                                                            color: 'var(--color-primary)',
                                                            marginTop: '0.75rem',
                                                            paddingTop: '0.75rem',
                                                            borderTop: '1px dashed var(--color-bg-cream)'
                                                        }}>
                                                            <span>{t('tracker.total')}</span>
                                                            <span>{formatPrice(order.total)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )
                                )}

                                {/* Reservations Tab */}
                                {activeTab === 'reservations' && (
                                    reservations.length === 0 ? (
                                        <div style={{
                                            textAlign: 'center',
                                            padding: '2rem',
                                            background: 'var(--color-white)',
                                            borderRadius: '16px',
                                            color: 'var(--color-text-muted)'
                                        }}>
                                            {t('tracker.noReservations')}
                                        </div>
                                    ) : (
                                        reservations.map((reservation) => {
                                            const statusInfo = getReservationStatusInfo(reservation.status);
                                            return (
                                                <div
                                                    key={reservation.reservationId}
                                                    style={{
                                                        background: 'var(--color-white)',
                                                        borderRadius: '16px',
                                                        padding: '1.25rem',
                                                        boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                                                    }}
                                                >
                                                    <div style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'flex-start',
                                                        marginBottom: '1rem',
                                                        flexWrap: 'wrap',
                                                        gap: '0.5rem'
                                                    }}>
                                                        <div>
                                                            <div style={{
                                                                fontFamily: 'var(--font-display)',
                                                                fontSize: '1.1rem',
                                                                fontWeight: 700,
                                                                color: 'var(--color-text)'
                                                            }}>
                                                                {t('tracker.reservation')} #{reservation.reservationId}
                                                            </div>
                                                            <div style={{
                                                                fontFamily: 'var(--font-body)',
                                                                fontSize: '0.8rem',
                                                                color: 'var(--color-text-muted)',
                                                                marginTop: '0.25rem'
                                                            }}>
                                                                {t('tracker.created')}: {formatDate(reservation.createdAt)}
                                                            </div>
                                                        </div>
                                                        <div style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '0.5rem',
                                                            padding: '0.5rem 0.875rem',
                                                            borderRadius: '20px',
                                                            background: statusInfo.bg,
                                                            color: statusInfo.color,
                                                            fontFamily: 'var(--font-body)',
                                                            fontSize: '0.85rem',
                                                            fontWeight: 600
                                                        }}>
                                                            {statusInfo.icon}
                                                            {statusInfo.label}
                                                        </div>
                                                    </div>

                                                    <div style={{
                                                        borderTop: '1px solid var(--color-bg-cream)',
                                                        paddingTop: '1rem',
                                                        display: 'grid',
                                                        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                                                        gap: '1rem'
                                                    }}>
                                                        <div>
                                                            <div style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '0.5rem',
                                                                fontFamily: 'var(--font-body)',
                                                                fontSize: '0.8rem',
                                                                color: 'var(--color-text-muted)',
                                                                marginBottom: '0.25rem'
                                                            }}>
                                                                <Calendar size={14} />
                                                                {t('tracker.date')}
                                                            </div>
                                                            <div style={{
                                                                fontFamily: 'var(--font-body)',
                                                                fontWeight: 600,
                                                                color: 'var(--color-text)'
                                                            }}>
                                                                {reservation.date}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '0.5rem',
                                                                fontFamily: 'var(--font-body)',
                                                                fontSize: '0.8rem',
                                                                color: 'var(--color-text-muted)',
                                                                marginBottom: '0.25rem'
                                                            }}>
                                                                <Clock size={14} />
                                                                {t('tracker.time')}
                                                            </div>
                                                            <div style={{
                                                                fontFamily: 'var(--font-body)',
                                                                fontWeight: 600,
                                                                color: 'var(--color-text)'
                                                            }}>
                                                                {reservation.time}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '0.5rem',
                                                                fontFamily: 'var(--font-body)',
                                                                fontSize: '0.8rem',
                                                                color: 'var(--color-text-muted)',
                                                                marginBottom: '0.25rem'
                                                            }}>
                                                                <Users size={14} />
                                                                {t('tracker.guests')}
                                                            </div>
                                                            <div style={{
                                                                fontFamily: 'var(--font-body)',
                                                                fontWeight: 600,
                                                                color: 'var(--color-text)'
                                                            }}>
                                                                {reservation.guests} {t('tracker.guestsUnit')}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {reservation.notes && (
                                                        <div style={{
                                                            marginTop: '1rem',
                                                            padding: '0.75rem',
                                                            background: '#FEF3C7',
                                                            borderRadius: '8px',
                                                            fontFamily: 'var(--font-body)',
                                                            fontSize: '0.85rem',
                                                            color: '#92400E'
                                                        }}>
                                                            {t('tracker.notes')}: {reservation.notes}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })
                                    )
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </section>
    );
}
