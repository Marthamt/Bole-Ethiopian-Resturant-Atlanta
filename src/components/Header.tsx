import React, { useState } from 'react';
import { 
  Phone, 
  ShoppingBag, 
  Calendar, 
  Sparkles, 
  Menu as MenuIcon, 
  X, 
  Globe, 
  ShieldAlert,
  FileText
} from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantData';
import { Language } from '../types';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenReservation: () => void;
  onOpenAiAssistant: () => void;
  onOpenAdmin: () => void;
  onOpenReport: () => void;
  activeSection: string;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  cartCount,
  onOpenCart,
  onOpenReservation,
  onOpenAiAssistant,
  onOpenAdmin,
  onOpenReport,
  activeSection
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'hero', label: language === 'am' ? 'መነሻ' : 'Home' },
    { id: 'menu', label: language === 'am' ? 'ሜኑ' : 'Menu' },
    { id: 'culture', label: language === 'am' ? 'ባህልና ቡና' : 'Culture & Coffee' },
    { id: 'events', label: language === 'am' ? 'ዝግጅቶች' : 'Events & Catering' },
    { id: 'reviews', label: language === 'am' ? 'ግምገማዎች' : 'Reviews' },
    { id: 'location', label: language === 'am' ? 'አድራሻ' : 'Location' }
  ];

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-black/60 backdrop-blur-xl border-b border-white/10 shadow-2xl transition-all">
      {/* Top Banner Notice */}
      <div className="bg-amber-950/70 text-amber-200 text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2 border-b border-amber-500/20 backdrop-blur-md">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>
          {language === 'am' 
            ? 'ከአትላንታ ኤርፖርት (ATL) በ5 ደቂቃ ርቀት ላይ እንገኛለን! ነፃ የመኪና ማቆሚያ አለ።' 
            : '5 Minutes from Atlanta Airport (ATL)! Free Private Parking Available.'}
        </span>
        <a 
          href={`tel:${RESTAURANT_INFO.phoneFormatted}`}
          className="underline hover:text-amber-300 ml-2 font-bold hidden sm:inline"
          aria-label="Call restaurant directly"
        >
          {RESTAURANT_INFO.phone}
        </a>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo Identity */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => scrollToSection('hero')}
              className="flex items-center gap-3 text-left focus:outline-hidden focus:ring-2 focus:ring-amber-500 rounded-lg p-1"
              aria-label="Bole Ethiopian Restaurant Home"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gold text-slate-950 flex items-center justify-center font-bold text-lg shadow-lg shadow-amber-500/20 border-2 border-amber-300">
                <span>ቦ</span>
              </div>
              <div>
                <span className="block font-serif font-bold text-lg sm:text-xl text-white tracking-wider leading-tight uppercase">
                  {RESTAURANT_INFO.name}
                </span>
                <span className="block text-[10px] sm:text-xs font-semibold text-amber-400 tracking-widest">
                  {RESTAURANT_INFO.nameAmharic} • ATLANTA
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-slate-300">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className={`transition-all py-1.5 px-3 rounded-full ${
                  activeSection === link.id 
                    ? 'accent-gold font-bold bg-amber-500/10 border border-amber-500/30' 
                    : 'hover:text-amber-300 hover:bg-white/5'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Action Tools */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Language Switcher */}
            <button
              onClick={() => onLanguageChange(language === 'en' ? 'am' : 'en')}
              className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-full border border-white/15 text-slate-200 bg-white/5 hover:bg-white/10 transition-all focus:ring-2 focus:ring-amber-500"
              title="Toggle Language / ቋንቋ ቀይር"
              aria-label="Toggle language between English and Amharic"
            >
              <Globe className="w-3.5 h-3.5 accent-gold" />
              <span>{language === 'en' ? 'EN' : 'አማ'}</span>
            </button>

            {/* AI Assistant Button */}
            <button
              onClick={onOpenAiAssistant}
              className="relative flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full glass-gold text-white font-medium text-xs sm:text-sm shadow-lg hover:shadow-amber-500/20 transition-all group"
              aria-label="Open Selam AI Concierge"
            >
              <Sparkles className="w-4 h-4 accent-gold animate-spin-slow" />
              <span className="hidden sm:inline">Ask</span>
              <span className="accent-gold font-bold">Selam AI</span>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400"></span>
              </span>
            </button>

            {/* Reservation Button */}
            <button
              onClick={onOpenReservation}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full bg-gold hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md"
              aria-label="Book a table reservation"
            >
              <Calendar className="w-4 h-4" />
              <span>Reserve</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 text-slate-200 hover:text-amber-300 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              aria-label={`View cart with ${cartCount} items`}
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold text-slate-950 text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border border-slate-950 shadow-md">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Admin Dashboard Trigger */}
            <button
              onClick={onOpenAdmin}
              className="p-2.5 text-slate-400 hover:text-amber-300 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors hidden md:block"
              title="Admin Manager Portal"
              aria-label="Open Admin Management Dashboard"
            >
              <ShieldAlert className="w-4 h-4" />
            </button>

            {/* Website Audit Report Modal Trigger */}
            <button
              onClick={onOpenReport}
              className="p-2.5 text-slate-400 hover:text-amber-300 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors hidden md:block"
              title="View Modernization Audit & Analysis Report"
              aria-label="View Modernization Audit Report"
            >
              <FileText className="w-4 h-4" />
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-200 hover:bg-white/10"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950/95 backdrop-blur-2xl border-b border-white/10 px-4 pt-3 pb-6 space-y-3">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="text-left py-2.5 px-3 rounded-xl text-sm font-medium text-slate-200 hover:bg-white/10 hover:text-amber-300 transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenReservation(); }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gold text-slate-950 font-bold text-xs uppercase tracking-wider"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Table Reservation</span>
            </button>

            <a
              href={`tel:${RESTAURANT_INFO.phoneFormatted}`}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/10 text-slate-100 font-semibold text-xs border border-white/15 hover:bg-white/20"
            >
              <Phone className="w-4 h-4 accent-gold" />
              <span>Call Us: {RESTAURANT_INFO.phone}</span>
            </a>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenAdmin(); }}
                className="text-xs text-slate-400 underline hover:text-slate-200"
              >
                Manager Portal
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenReport(); }}
                className="text-xs accent-gold font-semibold underline"
              >
                Website Audit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
