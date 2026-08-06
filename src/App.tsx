import React, { useState, useEffect } from 'react';
import { SeoHead } from './components/SeoHead';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { MenuSection } from './components/MenuSection';
import { AiAssistantModal } from './components/AiAssistantModal';
import { ReservationModal } from './components/ReservationModal';
import { OrderDrawer } from './components/OrderDrawer';
import { CulturalStorySection } from './components/CulturalStorySection';
import { EventsCateringSection } from './components/EventsCateringSection';
import { ReviewsGallerySection } from './components/ReviewsGallerySection';
import { LocationHoursSection } from './components/LocationHoursSection';
import { AdminDashboard } from './components/AdminDashboard';
import { AnalysisReportModal } from './components/AnalysisReportModal';
import { Footer } from './components/Footer';

import { MenuItem, CartItem, Reservation, CateringRequest, Language } from './types';
import { INITIAL_RESERVATIONS, INITIAL_CATERING_REQUESTS } from './data/restaurantData';

export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Modals state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  // App data state
  const [reservations, setReservations] = useState<Reservation[]>(INITIAL_RESERVATIONS);
  const [cateringRequests, setCateringRequests] = useState<CateringRequest[]>(INITIAL_CATERING_REQUESTS);
  const [activeSection, setActiveSection] = useState('hero');

  // Fetch real data from server API on mount
  useEffect(() => {
    fetch('/api/reservations')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.reservations)) {
          setReservations(data.reservations);
        }
      })
      .catch((err) => console.warn('Could not fetch reservations:', err));
  }, []);

  // Handle adding items to cart
  const handleAddToCart = (
    item: MenuItem, 
    quantity: number, 
    spice: string, 
    injera: string, 
    notes: string
  ) => {
    const extraPrice = injera.includes('100%') ? 2.00 : 0;
    const unitPrice = item.price + extraPrice;
    const cartItemId = `${item.id}-${spice}-${injera}`.replace(/\s+/g, '-');

    setCart((prevCart) => {
      const existing = prevCart.find((c) => c.id === cartItemId);
      if (existing) {
        return prevCart.map((c) =>
          c.id === cartItemId
            ? { ...c, quantity: c.quantity + quantity, totalPrice: (c.quantity + quantity) * unitPrice }
            : c
        );
      }
      return [
        ...prevCart,
        {
          id: cartItemId,
          menuItem: item,
          quantity,
          spicePreference: spice as any,
          injeraType: injera as any,
          specialInstructions: notes,
          totalPrice: unitPrice * quantity
        }
      ];
    });
  };

  const handleUpdateCartQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) => {
          if (c.id === id) {
            const newQty = c.quantity + delta;
            if (newQty <= 0) return null;
            const extra = c.injeraType?.includes('100%') ? 2 : 0;
            const unit = c.menuItem.price + extra;
            return { ...c, quantity: newQty, totalPrice: newQty * unit };
          }
          return c;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCart((prev) => prev.filter((c) => c.id !== id));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleAddReservation = (res: Reservation) => {
    setReservations((prev) => [res, ...prev]);
  };

  const handleAddCateringRequest = (req: CateringRequest) => {
    setCateringRequests((prev) => [req, ...prev]);
  };

  // Active section scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'menu', 'culture', 'events', 'reviews', 'location'];
      const scrollPos = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-slate-100 font-sans selection:bg-amber-500/30 selection:text-amber-200">
      <SeoHead />

      {/* Navigation Header */}
      <Header
        language={language}
        onLanguageChange={setLanguage}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenReservation={() => setIsReservationOpen(true)}
        onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenReport={() => setIsReportOpen(true)}
        activeSection={activeSection}
      />

      {/* Main Page Sections */}
      <main>
        <Hero
          language={language}
          onOpenReservation={() => setIsReservationOpen(true)}
          onOpenOrder={() => {
            const el = document.getElementById('menu');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
        />

        <MenuSection
          language={language}
          onAddToCart={handleAddToCart}
          onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
        />

        <CulturalStorySection
          language={language}
          onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
        />

        <EventsCateringSection
          language={language}
          onAddCateringRequest={handleAddCateringRequest}
        />

        <ReviewsGallerySection
          language={language}
        />

        <LocationHoursSection
          language={language}
          onOpenReservation={() => setIsReservationOpen(true)}
        />
      </main>

      {/* Footer */}
      <Footer
        language={language}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenReport={() => setIsReportOpen(true)}
      />

      {/* Modals & Slide-overs */}
      <AiAssistantModal
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
        language={language}
        onAddToCart={(item, qty, spice, injera, notes) => {
          handleAddToCart(item, qty, spice, injera, notes);
          setIsCartOpen(true);
        }}
      />

      <ReservationModal
        isOpen={isReservationOpen}
        onClose={() => setIsReservationOpen(false)}
        language={language}
        onAddReservation={handleAddReservation}
        existingReservations={reservations}
      />

      <OrderDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        language={language}
      />

      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />

      <AnalysisReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />
    </div>
  );
}
