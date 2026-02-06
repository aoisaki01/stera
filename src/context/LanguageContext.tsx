'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'id' | 'en';

interface LanguageContextType {
    lang: Language;
    setLang: (lang: Language) => void;
    t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
    id: {
        // Navbar
        'nav.home': 'Beranda',
        'nav.menu': 'Menu',
        'nav.about': 'Tentang',
        'nav.reservation': 'Reservasi',
        'nav.orderNow': 'Pesan Sekarang',

        // Hero Section
        'hero.tagline': 'Didirikan tahun 2024',
        'hero.title': 'Hadir untuk melayani dengan penuh rasa',
        'hero.description': 'Di Stéra, setiap cangkir adalah perjalanan. Kami fokus menghadirkan keseimbangan sempurna dari kopi pilihan dan teh berkualitas, disajikan dengan keramahan dan cinta.',
        'hero.cta': 'Jelajahi Menu',
        'hero.secondary': 'Reservasi Meja',

        // Menu Section
        'menu.title': 'Menu Kami',
        'menu.subtitle': 'Dibuat dengan cinta, disajikan dengan passion',
        'menu.tea': 'Tea',
        'menu.coffee': 'Coffee',
        'menu.nonCoffee': 'Non-Coffee',
        'menu.viewCart': 'Lihat Keranjang',

        // About Section
        'about.title': 'Pengalaman Stéra',
        'about.p1': 'Lebih dari sekadar kafe, Stéra adalah tempat di mana setiap momen menjadi istimewa. Kami percaya bahwa secangkir kopi atau teh yang sempurna dapat mengubah hari Anda.',
        'about.p2': 'Dengan bahan-bahan pilihan dan teknik penyajian terbaik, kami berkomitmen menghadirkan pengalaman yang tak terlupakan untuk setiap tamu.',
        'about.cta': 'Pelajari Lebih Lanjut',

        // Gallery Section
        'gallery.title': 'Favorit Kami',
        'gallery.subtitle': 'Sekilas kreasi signature kami',

        // Reservation Section
        'reservation.title': 'Reservasi Meja',
        'reservation.description': 'Ingin suasana yang lebih nyaman? Reservasi meja terlebih dahulu dan nikmati pengalaman ngopi yang tak terlupakan di Stéra.',
        'reservation.feature1.title': 'Ruang Nyaman',
        'reservation.feature1.desc': 'Area indoor & outdoor tersedia',
        'reservation.feature2.title': 'Working Space',
        'reservation.feature2.desc': 'Colokan & WiFi kencang',
        'reservation.feature3.title': 'Private Event',
        'reservation.feature3.desc': 'Untuk acara spesial & birthday',
        'reservation.form.title': 'Booking Form',
        'reservation.form.date': 'Tanggal',
        'reservation.form.time': 'Waktu',
        'reservation.form.selectTime': 'Pilih jam',
        'reservation.form.guests': 'Jumlah Tamu',
        'reservation.form.name': 'Nama',
        'reservation.form.namePlaceholder': 'Nama untuk reservasi',
        'reservation.form.phone': 'WhatsApp',
        'reservation.form.phonePlaceholder': '08xxxxxxxxxx',
        'reservation.form.notes': 'Catatan (Opsional)',
        'reservation.form.notesPlaceholder': 'Contoh: meja di outdoor, ulang tahun, dsb',
        'reservation.form.submit': 'Kirim via WhatsApp',
        'reservation.form.confirmation': 'Reservasi akan dikonfirmasi oleh tim kami',
        'reservation.success.title': 'Reservasi Terkirim!',
        'reservation.success.message': 'Kami akan konfirmasi via WhatsApp',

        // Order Modal
        'order.cart': 'Keranjang',
        'order.details': 'Detail Pesanan',
        'order.payment': 'Pembayaran',
        'order.success': 'Pesanan Berhasil',
        'order.emptyCart': 'Keranjang masih kosong',
        'order.viewMenu': 'Lihat Menu',
        'order.orderType': 'Tipe Pesanan',
        'order.pickup': 'Pickup',
        'order.pickupDesc': 'Ambil di toko',
        'order.delivery': 'Delivery',
        'order.deliveryDesc': 'Antar ke alamat (+5K)',
        'order.dineIn': 'Dine-in',
        'order.dineInDesc': 'Makan di tempat',
        'order.subtotal': 'Subtotal',
        'order.deliveryFee': 'Ongkir',
        'order.total': 'Total',
        'order.continue': 'Lanjut Pesan',
        'order.fullName': 'Nama Lengkap',
        'order.enterName': 'Masukkan nama',
        'order.whatsapp': 'Nomor WhatsApp',
        'order.address': 'Alamat Pengiriman',
        'order.addressPlaceholder': 'Alamat lengkap',
        'order.pickupTime': 'Waktu Ambil',
        'order.notes': 'Catatan (Opsional)',
        'order.notesPlaceholder': 'Contoh: less sugar, extra ice',
        'order.toPayment': 'Lanjut ke Pembayaran',
        'order.confirmed': 'Pesanan Dikonfirmasi!',
        'order.readyIn': 'Siap dalam',
        'order.minutes': 'menit',
        'order.deliverTo': 'Akan diantar ke:',
        'order.confirmationSent': 'Konfirmasi pesanan akan dikirim via WhatsApp ke',
        'order.done': 'Selesai',

        // Footer
        'footer.tagline': 'Dibuat dengan ❤️ di Indonesia',
        'footer.copyright': '© 2024 Stéra. Semua hak dilindungi.',

        // Order Tracker
        'tracker.title': 'Cek Status',
        'tracker.description': 'Masukkan nama untuk melihat status pesanan atau reservasi kamu',
        'tracker.placeholder': 'Nama kamu...',
        'tracker.search': 'Cari',
        'tracker.searching': 'Mencari...',
        'tracker.noResults': 'Tidak ada pesanan/reservasi dengan nama',
        'tracker.orders': 'Pesanan',
        'tracker.reservations': 'Reservasi',
        'tracker.noOrders': 'Tidak ada pesanan',
        'tracker.noReservations': 'Tidak ada reservasi',
        'tracker.order': 'Order',
        'tracker.reservation': 'Reservasi',
        'tracker.created': 'Dibuat',
        'tracker.date': 'Tanggal',
        'tracker.time': 'Jam',
        'tracker.guests': 'Tamu',
        'tracker.guestsUnit': 'orang',
        'tracker.notes': 'Catatan',
        'tracker.total': 'Total',
        'tracker.status.pending': 'Menunggu Konfirmasi',
        'tracker.status.confirmed': 'Dikonfirmasi',
        'tracker.status.preparing': 'Sedang Diproses',
        'tracker.status.ready': 'Siap Diambil',
        'tracker.status.completed': 'Selesai',
        'tracker.status.cancelled': 'Dibatalkan',
    },
    en: {
        // Navbar
        'nav.home': 'Home',
        'nav.menu': 'Menu',
        'nav.about': 'About',
        'nav.reservation': 'Reservation',
        'nav.orderNow': 'Order Now',

        // Hero Section
        'hero.tagline': 'Established 2024',
        'hero.title': 'Here to serve with full flavor',
        'hero.description': 'At Stéra, every cup is a journey. We focus on bringing the perfect balance of premium coffee and quality tea, served with warmth and love.',
        'hero.cta': 'Explore Menu',
        'hero.secondary': 'Book a Table',

        // Menu Section
        'menu.title': 'Our Menu',
        'menu.subtitle': 'Crafted with love, served with passion',
        'menu.tea': 'Tea',
        'menu.coffee': 'Coffee',
        'menu.nonCoffee': 'Non-Coffee',
        'menu.viewCart': 'View Cart',

        // About Section
        'about.title': 'The Stéra Experience',
        'about.p1': 'More than just a cafe, Stéra is a place where every moment becomes special. We believe that a perfect cup of coffee or tea can transform your day.',
        'about.p2': 'With selected ingredients and the best brewing techniques, we are committed to delivering an unforgettable experience for every guest.',
        'about.cta': 'Learn More',

        // Gallery Section
        'gallery.title': 'Our Favorites',
        'gallery.subtitle': 'A glimpse of our signature creations',

        // Reservation Section
        'reservation.title': 'Book a Table',
        'reservation.description': 'Want a more comfortable atmosphere? Book your table in advance and enjoy an unforgettable coffee experience at Stéra.',
        'reservation.feature1.title': 'Cozy Space',
        'reservation.feature1.desc': 'Indoor & outdoor areas available',
        'reservation.feature2.title': 'Working Space',
        'reservation.feature2.desc': 'Power outlets & fast WiFi',
        'reservation.feature3.title': 'Private Event',
        'reservation.feature3.desc': 'For special occasions & birthdays',
        'reservation.form.title': 'Booking Form',
        'reservation.form.date': 'Date',
        'reservation.form.time': 'Time',
        'reservation.form.selectTime': 'Select time',
        'reservation.form.guests': 'Number of Guests',
        'reservation.form.name': 'Name',
        'reservation.form.namePlaceholder': 'Name for reservation',
        'reservation.form.phone': 'WhatsApp',
        'reservation.form.phonePlaceholder': '08xxxxxxxxxx',
        'reservation.form.notes': 'Notes (Optional)',
        'reservation.form.notesPlaceholder': 'e.g., outdoor table, birthday, etc.',
        'reservation.form.submit': 'Send via WhatsApp',
        'reservation.form.confirmation': 'Reservation will be confirmed by our team',
        'reservation.success.title': 'Reservation Sent!',
        'reservation.success.message': 'We will confirm via WhatsApp',

        // Order Modal
        'order.cart': 'Cart',
        'order.details': 'Order Details',
        'order.payment': 'Payment',
        'order.success': 'Order Confirmed',
        'order.emptyCart': 'Your cart is empty',
        'order.viewMenu': 'View Menu',
        'order.orderType': 'Order Type',
        'order.pickup': 'Pickup',
        'order.pickupDesc': 'Pick up at store',
        'order.delivery': 'Delivery',
        'order.deliveryDesc': 'Deliver to address (+5K)',
        'order.dineIn': 'Dine-in',
        'order.dineInDesc': 'Eat at cafe',
        'order.subtotal': 'Subtotal',
        'order.deliveryFee': 'Delivery Fee',
        'order.total': 'Total',
        'order.continue': 'Continue Order',
        'order.fullName': 'Full Name',
        'order.enterName': 'Enter name',
        'order.whatsapp': 'WhatsApp Number',
        'order.address': 'Delivery Address',
        'order.addressPlaceholder': 'Complete address',
        'order.pickupTime': 'Pickup Time',
        'order.notes': 'Notes (Optional)',
        'order.notesPlaceholder': 'e.g., less sugar, extra ice',
        'order.toPayment': 'Continue to Payment',
        'order.confirmed': 'Order Confirmed!',
        'order.readyIn': 'Ready in',
        'order.minutes': 'minutes',
        'order.deliverTo': 'Will be delivered to:',
        'order.confirmationSent': 'Order confirmation will be sent via WhatsApp to',
        'order.done': 'Done',

        // Footer
        'footer.tagline': 'Made with ❤️ in Indonesia',
        'footer.copyright': '© 2024 Stéra. All rights reserved.',

        // Order Tracker
        'tracker.title': 'Check Status',
        'tracker.description': 'Enter your name to check your order or reservation status',
        'tracker.placeholder': 'Your name...',
        'tracker.search': 'Search',
        'tracker.searching': 'Searching...',
        'tracker.noResults': 'No orders/reservations found for',
        'tracker.orders': 'Orders',
        'tracker.reservations': 'Reservations',
        'tracker.noOrders': 'No orders found',
        'tracker.noReservations': 'No reservations found',
        'tracker.order': 'Order',
        'tracker.reservation': 'Reservation',
        'tracker.created': 'Created',
        'tracker.date': 'Date',
        'tracker.time': 'Time',
        'tracker.guests': 'Guests',
        'tracker.guestsUnit': 'people',
        'tracker.notes': 'Notes',
        'tracker.total': 'Total',
        'tracker.status.pending': 'Awaiting Confirmation',
        'tracker.status.confirmed': 'Confirmed',
        'tracker.status.preparing': 'Preparing',
        'tracker.status.ready': 'Ready for Pickup',
        'tracker.status.completed': 'Completed',
        'tracker.status.cancelled': 'Cancelled',
    }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [lang, setLangState] = useState<Language>('id');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem('stera_lang') as Language | null;
        if (saved && (saved === 'id' || saved === 'en')) {
            setLangState(saved);
        }
    }, []);

    const setLang = (newLang: Language) => {
        setLangState(newLang);
        localStorage.setItem('stera_lang', newLang);
    };

    const t = (key: string): string => {
        // Always use 'id' until mounted to prevent hydration mismatch
        const currentLang = mounted ? lang : 'id';
        return translations[currentLang][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ lang, setLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
