'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    size: 'regular' | 'large';
    image?: string;
    category: string;
}

export interface CustomerInfo {
    name: string;
    phone: string;
    address?: string;
    notes?: string;
}

export type OrderType = 'pickup' | 'delivery' | 'dine-in';

interface CartContextType {
    items: CartItem[];
    orderType: OrderType;
    customerInfo: CustomerInfo;
    isCartOpen: boolean;
    isOrderModalOpen: boolean;

    // Cart actions
    addItem: (item: Omit<CartItem, 'quantity'>) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    updateSize: (id: string, size: 'regular' | 'large') => void;
    clearCart: () => void;

    // Order actions
    setOrderType: (type: OrderType) => void;
    setCustomerInfo: (info: CustomerInfo) => void;

    // Modal actions
    openCart: () => void;
    closeCart: () => void;
    openOrderModal: () => void;
    closeOrderModal: () => void;

    // Calculations
    subtotal: number;
    deliveryFee: number;
    total: number;
    itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const DELIVERY_FEE = 5000; // 5K delivery fee

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [orderType, setOrderType] = useState<OrderType>('pickup');
    const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({ name: '', phone: '' });
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('stera-cart');
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (e) {
                console.error('Failed to load cart:', e);
            }
        }
    }, []);

    // Save cart to localStorage on change
    useEffect(() => {
        localStorage.setItem('stera-cart', JSON.stringify(items));
    }, [items]);

    const addItem = (item: Omit<CartItem, 'quantity'>) => {
        setItems(prev => {
            const existingItem = prev.find(i => i.id === item.id && i.size === item.size);
            if (existingItem) {
                return prev.map(i =>
                    i.id === item.id && i.size === item.size
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                );
            }
            return [...prev, { ...item, quantity: 1 }];
        });
    };

    const removeItem = (id: string) => {
        setItems(prev => prev.filter(i => i.id !== id));
    };

    const updateQuantity = (id: string, quantity: number) => {
        if (quantity <= 0) {
            removeItem(id);
            return;
        }
        setItems(prev => prev.map(i => (i.id === id ? { ...i, quantity } : i)));
    };

    const updateSize = (id: string, size: 'regular' | 'large') => {
        setItems(prev => prev.map(i => (i.id === id ? { ...i, size } : i)));
    };

    const clearCart = () => {
        setItems([]);
        localStorage.removeItem('stera-cart');
    };

    const subtotal = items.reduce((sum, item) => {
        const sizeExtra = item.size === 'large' ? 3000 : 0;
        return sum + (item.price + sizeExtra) * item.quantity;
    }, 0);

    const deliveryFee = orderType === 'delivery' ? DELIVERY_FEE : 0;
    const total = subtotal + deliveryFee;
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                orderType,
                customerInfo,
                isCartOpen,
                isOrderModalOpen,
                addItem,
                removeItem,
                updateQuantity,
                updateSize,
                clearCart,
                setOrderType,
                setCustomerInfo,
                openCart: () => setIsCartOpen(true),
                closeCart: () => setIsCartOpen(false),
                openOrderModal: () => setIsOrderModalOpen(true),
                closeOrderModal: () => setIsOrderModalOpen(false),
                subtotal,
                deliveryFee,
                total,
                itemCount,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
