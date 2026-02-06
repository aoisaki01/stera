import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, set, serverTimestamp } from 'firebase/database';

const firebaseConfig = {
    databaseURL: 'https://stera-a92df-default-rtdb.asia-southeast1.firebasedatabase.app/'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Order interface
interface OrderData {
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
    status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed';
    createdAt: object;
}

// Reservation interface
interface ReservationData {
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
    createdAt: object;
}

// Generate unique ID
function generateId(): string {
    return Math.random().toString(36).substr(2, 8).toUpperCase();
}

// Remove undefined values from object (Firebase doesn't accept undefined)
function removeUndefined<T extends object>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
}

// Save order to Firebase
export async function saveOrder(orderData: Omit<OrderData, 'orderId' | 'status' | 'createdAt'>): Promise<string> {
    const orderId = generateId();
    const orderRef = ref(database, `orders/${orderId}`);

    const order = removeUndefined({
        ...orderData,
        orderId,
        status: 'pending' as const,
        createdAt: serverTimestamp()
    });

    await set(orderRef, order);
    return orderId;
}

// Save reservation to Firebase
export async function saveReservation(reservationData: Omit<ReservationData, 'reservationId' | 'status' | 'createdAt'>): Promise<string> {
    const reservationId = generateId();
    const reservationRef = ref(database, `reservations/${reservationId}`);

    const reservation = removeUndefined({
        ...reservationData,
        reservationId,
        status: 'pending' as const,
        createdAt: serverTimestamp()
    });

    await set(reservationRef, reservation);
    return reservationId;
}

export { database };

// Search orders by customer name
export async function searchOrdersByName(searchName: string): Promise<Array<OrderData & { createdAt: number }>> {
    const { get, query, ref: dbRef, orderByChild } = await import('firebase/database');

    const ordersRef = dbRef(database, 'orders');
    const snapshot = await get(ordersRef);

    if (!snapshot.exists()) {
        return [];
    }

    const orders: Array<OrderData & { createdAt: number }> = [];
    const searchLower = searchName.toLowerCase().trim();

    snapshot.forEach((child) => {
        const order = child.val();
        const customerName = order.customer?.name?.toLowerCase() || '';

        // Match if the customer name contains the search term
        if (customerName.includes(searchLower)) {
            orders.push(order);
        }
    });

    // Sort by createdAt descending (newest first)
    orders.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

    return orders;
}

// Search reservations by customer name
export async function searchReservationsByName(searchName: string): Promise<Array<ReservationData & { createdAt: number }>> {
    const { get, ref: dbRef } = await import('firebase/database');

    const reservationsRef = dbRef(database, 'reservations');
    const snapshot = await get(reservationsRef);

    if (!snapshot.exists()) {
        return [];
    }

    const reservations: Array<ReservationData & { createdAt: number }> = [];
    const searchLower = searchName.toLowerCase().trim();

    snapshot.forEach((child) => {
        const reservation = child.val();
        const customerName = reservation.customer?.name?.toLowerCase() || '';

        // Match if the customer name contains the search term
        if (customerName.includes(searchLower)) {
            reservations.push(reservation);
        }
    });

    // Sort by createdAt descending (newest first)
    reservations.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

    return reservations;
}
