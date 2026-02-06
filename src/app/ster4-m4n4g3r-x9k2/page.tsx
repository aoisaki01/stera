'use client';

import React, { useState, useEffect } from 'react';
import { database } from '@/lib/firebase';
import { ref, onValue, update, set } from 'firebase/database';
import { SmallStar } from '@/components/StarShape';
import {
    ShoppingBag,
    Calendar,
    Clock,
    User,
    Phone,
    MapPin,
    Check,
    X,
    Package,
    Coffee,
    LogOut,
    RefreshCw,
    Plus
} from 'lucide-react';

// Admin credentials (in production, use proper auth like Firebase Auth)
const ADMIN_EMAIL = 'igno@ayamsayur.com';
const ADMIN_PASSWORD = 'NEETgamer.';

interface Order {
    orderId: string;
    items: Array<{
        id: string;
        name: string;
        price: number;
        quantity: number;
        size: string;
    }>;
    orderType: 'pickup' | 'delivery' | 'dine-in';
    customer: {
        name: string;
        phone: string;
        address?: string;
    };
    notes?: string;
    pickupTime?: string;
    subtotal: number;
    deliveryFee: number;
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

export default function AdminDashboard() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [activeTab, setActiveTab] = useState<'orders' | 'reservations'>('orders');
    const [orders, setOrders] = useState<Order[]>([]);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Manual Order Modal State
    const [showManualOrderModal, setShowManualOrderModal] = useState(false);
    const [manualOrder, setManualOrder] = useState({
        customerName: '',
        customerPhone: '',
        orderType: 'dine-in' as 'pickup' | 'delivery' | 'dine-in',
        itemName: '',
        itemPrice: '',
        itemQuantity: '1',
        notes: ''
    });

    // Check session
    useEffect(() => {
        const session = sessionStorage.getItem('admin_session');
        if (session === 'authenticated') {
            setIsLoggedIn(true);
        }
    }, []);

    // Fetch data from Firebase
    useEffect(() => {
        if (!isLoggedIn) return;

        setIsLoading(true);

        // Listen to orders
        const ordersRef = ref(database, 'orders');
        const unsubOrders = onValue(ordersRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const ordersList = Object.values(data) as Order[];
                // Sort by createdAt descending
                ordersList.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
                setOrders(ordersList);
            } else {
                setOrders([]);
            }
        });

        // Listen to reservations
        const reservationsRef = ref(database, 'reservations');
        const unsubReservations = onValue(reservationsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const reservationsList = Object.values(data) as Reservation[];
                // Sort by date and time
                reservationsList.sort((a, b) => {
                    const dateA = new Date(`${a.date} ${a.time}`);
                    const dateB = new Date(`${b.date} ${b.time}`);
                    return dateB.getTime() - dateA.getTime();
                });
                setReservations(reservationsList);
            } else {
                setReservations([]);
            }
            setIsLoading(false);
        });

        return () => {
            unsubOrders();
            unsubReservations();
        };
    }, [isLoggedIn]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            sessionStorage.setItem('admin_session', 'authenticated');
            setIsLoggedIn(true);
            setLoginError('');
        } else {
            setLoginError('Email atau password salah');
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('admin_session');
        setIsLoggedIn(false);
        setEmail('');
        setPassword('');
    };

    const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
        try {
            const orderRef = ref(database, `orders/${orderId}`);
            await update(orderRef, { status: newStatus });
        } catch (error) {
            console.error('Error updating order:', error);
        }
    };

    const updateReservationStatus = async (reservationId: string, newStatus: Reservation['status']) => {
        try {
            const reservationRef = ref(database, `reservations/${reservationId}`);
            await update(reservationRef, { status: newStatus });
        } catch (error) {
            console.error('Error updating reservation:', error);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    const formatDate = (timestamp: number) => {
        if (!timestamp) return '-';
        return new Date(timestamp).toLocaleString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return '#F59E0B';
            case 'confirmed': return '#3B82F6';
            case 'preparing': return '#8B5CF6';
            case 'ready': return '#10B981';
            case 'completed': return '#6B7280';
            case 'cancelled': return '#EF4444';
            default: return '#6B7280';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'pending': return 'Menunggu';
            case 'confirmed': return 'Dikonfirmasi';
            case 'preparing': return 'Diproses';
            case 'ready': return 'Siap';
            case 'completed': return 'Selesai';
            case 'cancelled': return 'Dibatalkan';
            default: return status;
        }
    };

    // Generate unique ID
    const generateId = () => {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    };

    // Handle Manual Order Submit
    const handleManualOrderSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const orderId = generateId();
        const price = parseInt(manualOrder.itemPrice) || 0;
        const quantity = parseInt(manualOrder.itemQuantity) || 1;
        const total = price * quantity;

        const orderData: Order = {
            orderId,
            items: [{
                id: `manual-${orderId}`,
                name: manualOrder.itemName,
                price: price,
                quantity: quantity,
                size: 'Regular'
            }],
            orderType: manualOrder.orderType,
            customer: {
                name: manualOrder.customerName,
                phone: manualOrder.customerPhone
            },
            notes: manualOrder.notes || undefined,
            subtotal: total,
            deliveryFee: 0,
            total: total,
            status: 'pending',
            createdAt: Date.now()
        };

        try {
            const orderRef = ref(database, `orders/${orderId}`);
            // Remove undefined fields
            const cleanData = JSON.parse(JSON.stringify(orderData));
            await set(orderRef, cleanData);

            // Reset form
            setManualOrder({
                customerName: '',
                customerPhone: '',
                orderType: 'dine-in',
                itemName: '',
                itemPrice: '',
                itemQuantity: '1',
                notes: ''
            });
            setShowManualOrderModal(false);
        } catch (error) {
            console.error('Error creating manual order:', error);
        }
    };

    // Login Page
    if (!isLoggedIn) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f8fafc',
                padding: '1rem'
            }}>
                <div style={{
                    background: 'white',
                    borderRadius: '24px',
                    padding: '3rem',
                    width: '100%',
                    maxWidth: '400px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                    border: '1px solid #e2e8f0'
                }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <SmallStar size={40} />
                        <h1 style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '1.75rem',
                            fontWeight: 700,
                            color: 'var(--color-text)',
                            marginTop: '1rem'
                        }}>
                            Admin Dashboard
                        </h1>
                        <p style={{
                            fontFamily: 'var(--font-body)',
                            color: '#64748b',
                            marginTop: '0.5rem'
                        }}>
                            Stéra Cafe Management
                        </p>
                    </div>

                    <form onSubmit={handleLogin}>
                        <div style={{ marginBottom: '1.25rem' }}>
                            <label style={{
                                display: 'block',
                                fontFamily: 'var(--font-body)',
                                color: '#334155',
                                marginBottom: '0.5rem',
                                fontSize: '0.9rem'
                            }}>
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{
                                    width: '100%',
                                    padding: '0.875rem 1rem',
                                    borderRadius: '12px',
                                    border: '1px solid #e2e8f0',
                                    background: '#f8fafc',
                                    color: 'var(--color-text)',
                                    fontFamily: 'var(--font-body)',
                                    fontSize: '1rem',
                                    outline: 'none'
                                }}
                                placeholder="admin@example.com"
                            />
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{
                                display: 'block',
                                fontFamily: 'var(--font-body)',
                                color: '#334155',
                                marginBottom: '0.5rem',
                                fontSize: '0.9rem'
                            }}>
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{
                                    width: '100%',
                                    padding: '0.875rem 1rem',
                                    borderRadius: '12px',
                                    border: '1px solid #e2e8f0',
                                    background: '#f8fafc',
                                    color: 'var(--color-text)',
                                    fontFamily: 'var(--font-body)',
                                    fontSize: '1rem',
                                    outline: 'none'
                                }}
                                placeholder="••••••••"
                            />
                        </div>

                        {loginError && (
                            <p style={{
                                color: '#EF4444',
                                fontFamily: 'var(--font-body)',
                                fontSize: '0.875rem',
                                marginBottom: '1rem',
                                textAlign: 'center'
                            }}>
                                {loginError}
                            </p>
                        )}

                        <button
                            type="submit"
                            style={{
                                width: '100%',
                                padding: '1rem',
                                borderRadius: '12px',
                                border: 'none',
                                background: 'linear-gradient(135deg, var(--color-primary-light), var(--color-primary))',
                                color: 'white',
                                fontFamily: 'var(--font-body)',
                                fontSize: '1rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            Masuk
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // Dashboard
    return (
        <div style={{
            minHeight: '100vh',
            background: '#f8fafc'
        }}>
            {/* Header */}
            <header style={{
                background: 'white',
                borderBottom: '1px solid #e2e8f0',
                padding: '1rem 2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'sticky',
                top: 0,
                zIndex: 100
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <SmallStar size={28} />
                    <h1 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        color: 'var(--color-text)'
                    }}>
                        Stéra Admin
                    </h1>
                </div>

                <button
                    onClick={handleLogout}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        background: 'white',
                        color: '#64748b',
                        fontFamily: 'var(--font-body)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                    }}
                >
                    <LogOut size={18} />
                    Keluar
                </button>
            </header>

            {/* Stats */}
            <div style={{
                padding: '2rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
                <div style={{
                    background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    color: 'white'
                }}>
                    <ShoppingBag size={28} />
                    <div style={{ fontSize: '2rem', fontWeight: 700, marginTop: '0.5rem' }}>
                        {orders.length}
                    </div>
                    <div style={{ opacity: 0.8, fontSize: '0.9rem' }}>Total Orders</div>
                </div>

                <div style={{
                    background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    color: 'white'
                }}>
                    <Calendar size={28} />
                    <div style={{ fontSize: '2rem', fontWeight: 700, marginTop: '0.5rem' }}>
                        {reservations.length}
                    </div>
                    <div style={{ opacity: 0.8, fontSize: '0.9rem' }}>Total Reservations</div>
                </div>

                <div style={{
                    background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    color: 'white'
                }}>
                    <Clock size={28} />
                    <div style={{ fontSize: '2rem', fontWeight: 700, marginTop: '0.5rem' }}>
                        {orders.filter(o => o.status === 'pending').length}
                    </div>
                    <div style={{ opacity: 0.8, fontSize: '0.9rem' }}>Pending Orders</div>
                </div>

                <div style={{
                    background: 'linear-gradient(135deg, #10B981, #059669)',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    color: 'white'
                }}>
                    <Coffee size={28} />
                    <div style={{ fontSize: '2rem', fontWeight: 700, marginTop: '0.5rem' }}>
                        {formatPrice(orders.reduce((sum, o) => sum + (o.total || 0), 0))}
                    </div>
                    <div style={{ opacity: 0.8, fontSize: '0.9rem' }}>Total Revenue</div>
                </div>
            </div>

            {/* Tabs */}
            <div style={{
                padding: '0 2rem',
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
                <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    marginBottom: '1rem',
                    flexWrap: 'wrap',
                    alignItems: 'center'
                }}>
                    <button
                        onClick={() => setActiveTab('orders')}
                        style={{
                            padding: '0.75rem 1.5rem',
                            borderRadius: '10px',
                            border: 'none',
                            background: activeTab === 'orders' ? 'var(--color-primary)' : 'white',
                            color: activeTab === 'orders' ? 'white' : 'var(--color-text)',
                            fontFamily: 'var(--font-body)',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                        }}
                    >
                        <ShoppingBag size={18} />
                        Orders ({orders.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('reservations')}
                        style={{
                            padding: '0.75rem 1.5rem',
                            borderRadius: '10px',
                            border: 'none',
                            background: activeTab === 'reservations' ? 'var(--color-primary)' : 'white',
                            color: activeTab === 'reservations' ? 'white' : 'var(--color-text)',
                            fontFamily: 'var(--font-body)',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                        }}
                    >
                        <Calendar size={18} />
                        Reservations ({reservations.length})
                    </button>

                    {/* Add Order Button */}
                    <button
                        onClick={() => setShowManualOrderModal(true)}
                        style={{
                            marginLeft: 'auto',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '10px',
                            border: 'none',
                            background: 'linear-gradient(135deg, #10B981, #059669)',
                            color: 'white',
                            fontFamily: 'var(--font-body)',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}
                    >
                        <Plus size={18} />
                        Tambah Order
                    </button>
                </div>
            </div>

            {/* Content */}
            <div style={{
                padding: '0 2rem 2rem',
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
                {isLoading ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '4rem',
                        color: '#64748b'
                    }}>
                        <RefreshCw size={32} style={{ animation: 'spin 1s linear infinite' }} />
                        <p style={{ marginTop: '1rem' }}>Memuat data...</p>
                    </div>
                ) : activeTab === 'orders' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {orders.length === 0 ? (
                            <div style={{
                                background: 'white',
                                borderRadius: '16px',
                                padding: '4rem',
                                textAlign: 'center',
                                color: '#64748b'
                            }}>
                                <Package size={48} style={{ opacity: 0.5 }} />
                                <p style={{ marginTop: '1rem' }}>Belum ada order</p>
                            </div>
                        ) : (
                            orders.map((order) => (
                                <div
                                    key={order.orderId}
                                    style={{
                                        background: 'white',
                                        borderRadius: '16px',
                                        padding: '1.5rem',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                                    }}
                                >
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start',
                                        marginBottom: '1rem',
                                        flexWrap: 'wrap',
                                        gap: '1rem'
                                    }}>
                                        <div>
                                            <div style={{
                                                fontFamily: 'var(--font-display)',
                                                fontSize: '1.1rem',
                                                fontWeight: 700,
                                                color: 'var(--color-text)'
                                            }}>
                                                Order #{order.orderId}
                                            </div>
                                            <div style={{
                                                fontFamily: 'var(--font-body)',
                                                fontSize: '0.85rem',
                                                color: '#64748b',
                                                marginTop: '0.25rem'
                                            }}>
                                                {formatDate(order.createdAt)}
                                            </div>
                                        </div>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}>
                                            <span style={{
                                                padding: '0.35rem 0.75rem',
                                                borderRadius: '20px',
                                                background: `${getStatusColor(order.status)}20`,
                                                color: getStatusColor(order.status),
                                                fontFamily: 'var(--font-body)',
                                                fontSize: '0.8rem',
                                                fontWeight: 600
                                            }}>
                                                {getStatusLabel(order.status)}
                                            </span>
                                            <span style={{
                                                padding: '0.35rem 0.75rem',
                                                borderRadius: '20px',
                                                background: '#f1f5f9',
                                                color: '#64748b',
                                                fontFamily: 'var(--font-body)',
                                                fontSize: '0.8rem',
                                                fontWeight: 600,
                                                textTransform: 'capitalize'
                                            }}>
                                                {order.orderType}
                                            </span>
                                        </div>
                                    </div>

                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                                        gap: '1.5rem'
                                    }}>
                                        {/* Customer Info */}
                                        <div>
                                            <h4 style={{
                                                fontFamily: 'var(--font-body)',
                                                fontWeight: 600,
                                                marginBottom: '0.5rem',
                                                color: '#334155'
                                            }}>
                                                Customer
                                            </h4>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.9rem' }}>
                                                    <User size={14} />
                                                    {order.customer?.name || '-'}
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.9rem' }}>
                                                    <Phone size={14} />
                                                    {order.customer?.phone || '-'}
                                                </div>
                                                {order.customer?.address && (
                                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: '#64748b', fontSize: '0.9rem' }}>
                                                        <MapPin size={14} style={{ marginTop: '2px', flexShrink: 0 }} />
                                                        {order.customer.address}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Items */}
                                        <div>
                                            <h4 style={{
                                                fontFamily: 'var(--font-body)',
                                                fontWeight: 600,
                                                marginBottom: '0.5rem',
                                                color: '#334155'
                                            }}>
                                                Items
                                            </h4>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                                {order.items?.map((item, idx) => (
                                                    <div key={idx} style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        color: '#64748b',
                                                        fontSize: '0.9rem'
                                                    }}>
                                                        <span>{item.quantity}x {item.name} ({item.size})</span>
                                                        <span>{formatPrice(item.price * item.quantity)}</span>
                                                    </div>
                                                ))}
                                                {order.notes && (
                                                    <div style={{
                                                        marginTop: '0.5rem',
                                                        padding: '0.5rem',
                                                        background: '#fef3c7',
                                                        borderRadius: '6px',
                                                        color: '#92400e',
                                                        fontSize: '0.85rem'
                                                    }}>
                                                        Note: {order.notes}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Total & Actions */}
                                        <div>
                                            <div style={{
                                                fontFamily: 'var(--font-display)',
                                                fontSize: '1.5rem',
                                                fontWeight: 700,
                                                color: 'var(--color-primary)',
                                                marginBottom: '1rem'
                                            }}>
                                                {formatPrice(order.total)}
                                            </div>

                                            {order.status !== 'completed' && order.status !== 'cancelled' && (
                                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                    {order.status === 'pending' && (
                                                        <button
                                                            onClick={() => updateOrderStatus(order.orderId, 'confirmed')}
                                                            style={{
                                                                padding: '0.5rem 1rem',
                                                                borderRadius: '8px',
                                                                border: 'none',
                                                                background: '#3B82F6',
                                                                color: 'white',
                                                                fontFamily: 'var(--font-body)',
                                                                fontSize: '0.85rem',
                                                                cursor: 'pointer',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '0.25rem'
                                                            }}
                                                        >
                                                            <Check size={14} /> Konfirmasi
                                                        </button>
                                                    )}
                                                    {order.status === 'confirmed' && (
                                                        <button
                                                            onClick={() => updateOrderStatus(order.orderId, 'preparing')}
                                                            style={{
                                                                padding: '0.5rem 1rem',
                                                                borderRadius: '8px',
                                                                border: 'none',
                                                                background: '#8B5CF6',
                                                                color: 'white',
                                                                fontFamily: 'var(--font-body)',
                                                                fontSize: '0.85rem',
                                                                cursor: 'pointer'
                                                            }}
                                                        >
                                                            Proses
                                                        </button>
                                                    )}
                                                    {order.status === 'preparing' && (
                                                        <button
                                                            onClick={() => updateOrderStatus(order.orderId, 'ready')}
                                                            style={{
                                                                padding: '0.5rem 1rem',
                                                                borderRadius: '8px',
                                                                border: 'none',
                                                                background: '#10B981',
                                                                color: 'white',
                                                                fontFamily: 'var(--font-body)',
                                                                fontSize: '0.85rem',
                                                                cursor: 'pointer'
                                                            }}
                                                        >
                                                            Siap
                                                        </button>
                                                    )}
                                                    {order.status === 'ready' && (
                                                        <button
                                                            onClick={() => updateOrderStatus(order.orderId, 'completed')}
                                                            style={{
                                                                padding: '0.5rem 1rem',
                                                                borderRadius: '8px',
                                                                border: 'none',
                                                                background: '#6B7280',
                                                                color: 'white',
                                                                fontFamily: 'var(--font-body)',
                                                                fontSize: '0.85rem',
                                                                cursor: 'pointer'
                                                            }}
                                                        >
                                                            Selesai
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {reservations.length === 0 ? (
                            <div style={{
                                background: 'white',
                                borderRadius: '16px',
                                padding: '4rem',
                                textAlign: 'center',
                                color: '#64748b'
                            }}>
                                <Calendar size={48} style={{ opacity: 0.5 }} />
                                <p style={{ marginTop: '1rem' }}>Belum ada reservasi</p>
                            </div>
                        ) : (
                            reservations.map((reservation) => (
                                <div
                                    key={reservation.reservationId}
                                    style={{
                                        background: 'white',
                                        borderRadius: '16px',
                                        padding: '1.5rem',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                                    }}
                                >
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start',
                                        marginBottom: '1rem',
                                        flexWrap: 'wrap',
                                        gap: '1rem'
                                    }}>
                                        <div>
                                            <div style={{
                                                fontFamily: 'var(--font-display)',
                                                fontSize: '1.1rem',
                                                fontWeight: 700,
                                                color: 'var(--color-text)'
                                            }}>
                                                Reservation #{reservation.reservationId}
                                            </div>
                                            <div style={{
                                                fontFamily: 'var(--font-body)',
                                                fontSize: '0.85rem',
                                                color: '#64748b',
                                                marginTop: '0.25rem'
                                            }}>
                                                Created: {formatDate(reservation.createdAt)}
                                            </div>
                                        </div>
                                        <span style={{
                                            padding: '0.35rem 0.75rem',
                                            borderRadius: '20px',
                                            background: `${getStatusColor(reservation.status)}20`,
                                            color: getStatusColor(reservation.status),
                                            fontFamily: 'var(--font-body)',
                                            fontSize: '0.8rem',
                                            fontWeight: 600
                                        }}>
                                            {getStatusLabel(reservation.status)}
                                        </span>
                                    </div>

                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                        gap: '1.5rem'
                                    }}>
                                        {/* Date & Time */}
                                        <div>
                                            <h4 style={{
                                                fontFamily: 'var(--font-body)',
                                                fontWeight: 600,
                                                marginBottom: '0.5rem',
                                                color: '#334155'
                                            }}>
                                                Jadwal
                                            </h4>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                color: '#64748b',
                                                fontSize: '0.9rem'
                                            }}>
                                                <Calendar size={14} />
                                                {reservation.date} • {reservation.time}
                                            </div>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                color: '#64748b',
                                                fontSize: '0.9rem',
                                                marginTop: '0.25rem'
                                            }}>
                                                <User size={14} />
                                                {reservation.guests} tamu
                                            </div>
                                        </div>

                                        {/* Customer */}
                                        <div>
                                            <h4 style={{
                                                fontFamily: 'var(--font-body)',
                                                fontWeight: 600,
                                                marginBottom: '0.5rem',
                                                color: '#334155'
                                            }}>
                                                Customer
                                            </h4>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.9rem' }}>
                                                    <User size={14} />
                                                    {reservation.customer?.name || '-'}
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.9rem' }}>
                                                    <Phone size={14} />
                                                    {reservation.customer?.phone || '-'}
                                                </div>
                                            </div>
                                            {reservation.notes && (
                                                <div style={{
                                                    marginTop: '0.5rem',
                                                    padding: '0.5rem',
                                                    background: '#fef3c7',
                                                    borderRadius: '6px',
                                                    color: '#92400e',
                                                    fontSize: '0.85rem'
                                                }}>
                                                    Note: {reservation.notes}
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div>
                                            {reservation.status === 'pending' && (
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <button
                                                        onClick={() => updateReservationStatus(reservation.reservationId, 'confirmed')}
                                                        style={{
                                                            padding: '0.5rem 1rem',
                                                            borderRadius: '8px',
                                                            border: 'none',
                                                            background: '#10B981',
                                                            color: 'white',
                                                            fontFamily: 'var(--font-body)',
                                                            fontSize: '0.85rem',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '0.25rem'
                                                        }}
                                                    >
                                                        <Check size={14} /> Konfirmasi
                                                    </button>
                                                    <button
                                                        onClick={() => updateReservationStatus(reservation.reservationId, 'cancelled')}
                                                        style={{
                                                            padding: '0.5rem 1rem',
                                                            borderRadius: '8px',
                                                            border: 'none',
                                                            background: '#EF4444',
                                                            color: 'white',
                                                            fontFamily: 'var(--font-body)',
                                                            fontSize: '0.85rem',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '0.25rem'
                                                        }}
                                                    >
                                                        <X size={14} /> Batalkan
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Manual Order Modal */}
            {showManualOrderModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '1rem'
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '20px',
                        width: '100%',
                        maxWidth: '500px',
                        maxHeight: '90vh',
                        overflow: 'auto',
                        padding: '2rem'
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '1.5rem'
                        }}>
                            <h2 style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: '1.5rem',
                                fontWeight: 700,
                                color: 'var(--color-text)'
                            }}>
                                Tambah Order Manual
                            </h2>
                            <button
                                onClick={() => setShowManualOrderModal(false)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '0.5rem'
                                }}
                            >
                                <X size={24} color="#64748b" />
                            </button>
                        </div>

                        <form onSubmit={handleManualOrderSubmit}>
                            {/* Customer Name */}
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{
                                    display: 'block',
                                    fontFamily: 'var(--font-body)',
                                    fontWeight: 600,
                                    marginBottom: '0.5rem',
                                    color: '#334155'
                                }}>
                                    Nama Customer *
                                </label>
                                <input
                                    type="text"
                                    value={manualOrder.customerName}
                                    onChange={(e) => setManualOrder({ ...manualOrder, customerName: e.target.value })}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 1rem',
                                        borderRadius: '10px',
                                        border: '1px solid #e2e8f0',
                                        fontFamily: 'var(--font-body)',
                                        fontSize: '1rem'
                                    }}
                                    placeholder="Nama customer"
                                />
                            </div>

                            {/* Customer Phone */}
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{
                                    display: 'block',
                                    fontFamily: 'var(--font-body)',
                                    fontWeight: 600,
                                    marginBottom: '0.5rem',
                                    color: '#334155'
                                }}>
                                    No. WhatsApp *
                                </label>
                                <input
                                    type="tel"
                                    value={manualOrder.customerPhone}
                                    onChange={(e) => setManualOrder({ ...manualOrder, customerPhone: e.target.value })}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 1rem',
                                        borderRadius: '10px',
                                        border: '1px solid #e2e8f0',
                                        fontFamily: 'var(--font-body)',
                                        fontSize: '1rem'
                                    }}
                                    placeholder="08xxxxxxxxxx"
                                />
                            </div>

                            {/* Order Type */}
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{
                                    display: 'block',
                                    fontFamily: 'var(--font-body)',
                                    fontWeight: 600,
                                    marginBottom: '0.5rem',
                                    color: '#334155'
                                }}>
                                    Tipe Order
                                </label>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    {(['dine-in', 'pickup', 'delivery'] as const).map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setManualOrder({ ...manualOrder, orderType: type })}
                                            style={{
                                                flex: 1,
                                                padding: '0.75rem',
                                                borderRadius: '10px',
                                                border: manualOrder.orderType === type ? '2px solid var(--color-primary)' : '1px solid #e2e8f0',
                                                background: manualOrder.orderType === type ? 'var(--color-primary-light)' : 'white',
                                                color: manualOrder.orderType === type ? 'var(--color-primary)' : '#64748b',
                                                fontFamily: 'var(--font-body)',
                                                fontWeight: 600,
                                                cursor: 'pointer',
                                                textTransform: 'capitalize'
                                            }}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Item Name */}
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{
                                    display: 'block',
                                    fontFamily: 'var(--font-body)',
                                    fontWeight: 600,
                                    marginBottom: '0.5rem',
                                    color: '#334155'
                                }}>
                                    Nama Item *
                                </label>
                                <input
                                    type="text"
                                    value={manualOrder.itemName}
                                    onChange={(e) => setManualOrder({ ...manualOrder, itemName: e.target.value })}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 1rem',
                                        borderRadius: '10px',
                                        border: '1px solid #e2e8f0',
                                        fontFamily: 'var(--font-body)',
                                        fontSize: '1rem'
                                    }}
                                    placeholder="Contoh: Es Kopi Susu, Matcha Latte"
                                />
                            </div>

                            {/* Price and Quantity */}
                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                                <div style={{ flex: 2 }}>
                                    <label style={{
                                        display: 'block',
                                        fontFamily: 'var(--font-body)',
                                        fontWeight: 600,
                                        marginBottom: '0.5rem',
                                        color: '#334155'
                                    }}>
                                        Harga (Rp) *
                                    </label>
                                    <input
                                        type="number"
                                        value={manualOrder.itemPrice}
                                        onChange={(e) => setManualOrder({ ...manualOrder, itemPrice: e.target.value })}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem 1rem',
                                            borderRadius: '10px',
                                            border: '1px solid #e2e8f0',
                                            fontFamily: 'var(--font-body)',
                                            fontSize: '1rem'
                                        }}
                                        placeholder="25000"
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{
                                        display: 'block',
                                        fontFamily: 'var(--font-body)',
                                        fontWeight: 600,
                                        marginBottom: '0.5rem',
                                        color: '#334155'
                                    }}>
                                        Jumlah
                                    </label>
                                    <input
                                        type="number"
                                        value={manualOrder.itemQuantity}
                                        onChange={(e) => setManualOrder({ ...manualOrder, itemQuantity: e.target.value })}
                                        min="1"
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem 1rem',
                                            borderRadius: '10px',
                                            border: '1px solid #e2e8f0',
                                            fontFamily: 'var(--font-body)',
                                            fontSize: '1rem'
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Notes */}
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{
                                    display: 'block',
                                    fontFamily: 'var(--font-body)',
                                    fontWeight: 600,
                                    marginBottom: '0.5rem',
                                    color: '#334155'
                                }}>
                                    Catatan (Opsional)
                                </label>
                                <textarea
                                    value={manualOrder.notes}
                                    onChange={(e) => setManualOrder({ ...manualOrder, notes: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 1rem',
                                        borderRadius: '10px',
                                        border: '1px solid #e2e8f0',
                                        fontFamily: 'var(--font-body)',
                                        fontSize: '1rem',
                                        minHeight: '80px',
                                        resize: 'vertical'
                                    }}
                                    placeholder="Less sugar, extra ice, dll"
                                />
                            </div>

                            {/* Total Preview */}
                            <div style={{
                                background: '#f8fafc',
                                borderRadius: '12px',
                                padding: '1rem',
                                marginBottom: '1.5rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <span style={{
                                    fontFamily: 'var(--font-body)',
                                    color: '#64748b'
                                }}>
                                    Total
                                </span>
                                <span style={{
                                    fontFamily: 'var(--font-display)',
                                    fontSize: '1.5rem',
                                    fontWeight: 700,
                                    color: 'var(--color-primary)'
                                }}>
                                    {formatPrice((parseInt(manualOrder.itemPrice) || 0) * (parseInt(manualOrder.itemQuantity) || 1))}
                                </span>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    borderRadius: '12px',
                                    border: 'none',
                                    background: 'linear-gradient(135deg, var(--color-primary-light), var(--color-primary))',
                                    color: 'white',
                                    fontFamily: 'var(--font-body)',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                <Plus size={20} />
                                Simpan Order
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <style jsx global>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
