import React from 'react';
import { 
  Sparkles, 
  Calendar, 
  ShoppingBag, 
  MapPin, 
  CheckCircle2, 
  Flame, 
  UtensilsCrossed,
  ArrowRight
} from 'lucide-react';
import { RESTAURANT_INFO, IMAGES } from '../data/restaurantData';
import { Language } from '../types';

interface HeroProps {
  language: Language;
  onOpenReservation: () => void;
  onOpenOrder: () => void;
  onOpenAiAssistant: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  language,
  onOpenReservation,
  onOpenOrder,
  onOpenAiAssistant
}) => {
  return (
    <section id="hero" className="relative bg-[#0c0c0c] text-white overflow-hidden py-16 sm:py-24 lg:py-28 border-b border-white/10">
      {/* Background Image Layer with Dark Overlay & Ambient Glow */}
      <div className="absolute inset-0 z-0 opacity-25 mix-blend-luminosity scale-105 transition-transform duration-1000">
        <img 
          src={IMAGES.heroPlatter} 
          alt="Authentic Ethiopian Injera Platter at Bole Atlanta" 
          className="w-full h-full object-cover object-center"
        />
      </div>
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/80 via-[#0c0c0c]/90 to-[#0c0c0c]"></div>
      
      {/* Radial Gold Ambient Glow behind hero */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          
          {/* Main Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Top Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3">
              <span className="glass px-3.5 py-1.5 rounded-full text-xs font-semibold accent-gold border-gold flex items-center gap-1.5 uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                {language === 'am' ? 'የአትላንታ ምርጥ የኢትዮጵያ ምግብ ቤት' : 'Est. 2011 • Atlanta, GA'}
              </span>
              <span className="glass px-3.5 py-1.5 rounded-full text-xs font-semibold text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 uppercase tracking-widest">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                {language === 'am' ? 'ከኤርፖርት በ5 ደቂቃ' : '5 Mins from ATL Airport'}
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <p className="accent-gold uppercase tracking-[0.3em] text-xs font-semibold">Authentic • Reimagined</p>
              <h1 className="serif text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight text-white leading-tight font-serif">
                {language === 'am' ? (
                  <span>እውነተኛውን የኢትዮጵያ ባህላዊ ጣዕም ይቅመሱ</span>
                ) : (
                  <>
                    Modern Soul,<br />
                    <span className="italic font-normal gold-gradient-text">Ancient Roots.</span>
                  </>
                )}
              </h1>
              <p className="text-lg sm:text-xl font-medium accent-gold font-serif italic">
                {RESTAURANT_INFO.nameAmharic}
              </p>
            </div>

            {/* Description Paragraph */}
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
              {language === 'am' 
                ? 'በእጅ የተዘጋጀ የጤፍ እንጀራ፣ በበርበሬና በንጥር ቅቤ የበለጸገ ዶሮ ወጥ፣ ክትፎ፣ ጥብስ እና የጾም ምግብ ማዕድ ከባህላዊ የቡና ሥነ-ሥርዓት ጋር።'
                : 'Experience the art of Ethiopian dining. Hand-crafted spongy pure teff Injera, slow-simmered Berbere stews, sizzling tender Tibs, raw seasoned Kitfo, and organic vegan platters served in a luxury lounge atmosphere.'
              }
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              <button
                onClick={onOpenOrder}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-gold hover:bg-amber-400 text-slate-950 font-extrabold text-xs uppercase tracking-widest shadow-xl transition-all transform hover:-translate-y-0.5 cursor-pointer"
                aria-label="Order online for pickup or delivery"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{language === 'am' ? 'ኦንላይን ይዘዙ' : 'Order Online'}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={onOpenReservation}
                className="w-full sm:w-auto glass glass-card-hover inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full text-white font-bold text-xs uppercase tracking-widest transition-all cursor-pointer"
                aria-label="Book a table reservation"
              >
                <Calendar className="w-4 h-4 accent-gold" />
                <span>{language === 'am' ? 'ቦታ ያስይዙ' : 'Reservations'}</span>
              </button>

              <button
                onClick={onOpenAiAssistant}
                className="w-full sm:w-auto glass-gold inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full text-amber-300 font-semibold text-xs uppercase tracking-widest transition-all cursor-pointer ai-glow"
                aria-label="Ask Selam AI assistant for food recommendations"
              >
                <Sparkles className="w-4 h-4 accent-gold" />
                <span>{language === 'am' ? 'AI ረዳት ይጠይቁ' : 'AI Concierge'}</span>
              </button>
            </div>

            {/* Quick Guarantees Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-white/10 text-slate-300 text-xs sm:text-sm font-light">
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% Halal Certified</span>
              </div>
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Gluten-Free Pure Teff</span>
              </div>
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Rich Vegan Combos</span>
              </div>
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Coffee Ceremony</span>
              </div>
            </div>

          </div>

          {/* Right Spotlight Glass Cards */}
          <div className="lg:col-span-5 relative mt-8 lg:mt-0 space-y-4">
            
            {/* AI Taste Concierge Live Prompt Box */}
            <div className="glass p-5 ai-glow border-l-4 border-l-[#d4af37] rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gold animate-pulse"></div>
                  <span className="text-[10px] uppercase tracking-widest font-bold accent-gold">AI Taste Concierge</span>
                </div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider">Live Recommendation</span>
              </div>
              <p className="text-xs italic text-slate-200 font-serif leading-relaxed">
                "Based on your preference for savory & medium spice, I recommend the Signature Bole Royal Platter paired with our house honey wine."
              </p>
              <button
                onClick={onOpenAiAssistant}
                className="text-[10px] uppercase font-bold border-b border-gold pb-0.5 accent-gold hover:text-amber-300 transition-colors cursor-pointer"
              >
                Personalize My Taste Profile &rarr;
              </button>
            </div>

            {/* Spotlight Dish Glass Container */}
            <div className="glass-card p-5 rounded-3xl space-y-4 border border-white/10">
              <div className="relative h-56 sm:h-64 rounded-2xl overflow-hidden border border-white/10 group">
                <img 
                  src={IMAGES.ambiance} 
                  alt="Bole Ethiopian Restaurant Dining Atmosphere" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 glass px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider accent-gold border-gold flex items-center gap-1.5 backdrop-blur-md">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>Chef's Spotlight</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-serif font-bold text-white">Bole Royal Platter</h3>
                  <span className="text-lg font-bold accent-gold">$46.99</span>
                </div>
                <p className="text-slate-300 text-xs line-clamp-2 font-light">
                  Doro Wat chicken stew, Special Kitfo, Sizzling Beef Tibs, and 5 vegetable stews served family-style on teff Injera.
                </p>
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-widest text-slate-400">Serves 2-3 Guests</span>
                  <button
                    onClick={onOpenOrder}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gold hover:bg-amber-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider transition-all"
                  >
                    <UtensilsCrossed className="w-3.5 h-3.5" />
                    <span>Order Dish</span>
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
