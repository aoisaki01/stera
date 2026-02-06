'use client';

import { CartProvider } from '@/context/CartContext';
import { LanguageProvider } from '@/context/LanguageContext';
import OrderModal from '@/components/OrderModal';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import MenuSection from '@/components/MenuSection';
import AboutSection from '@/components/AboutSection';
import GallerySection from '@/components/GallerySection';
import ReservationSection from '@/components/ReservationSection';
import OrderTracker from '@/components/OrderTracker';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <LanguageProvider>
      <CartProvider>
        <main>
          <Navbar />
          <HeroSection />
          <MenuSection />
          <AboutSection />
          <GallerySection />
          <ReservationSection />
          <OrderTracker />
          <Footer />
          <OrderModal />
        </main>
      </CartProvider>
    </LanguageProvider>
  );
}
