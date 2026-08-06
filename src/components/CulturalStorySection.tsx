import React from 'react';
import { Sparkles, Flame, Heart, Coffee, ShieldCheck } from 'lucide-react';
import { IMAGES } from '../data/restaurantData';
import { Language } from '../types';

interface CulturalStorySectionProps {
  language: Language;
  onOpenAiAssistant: () => void;
}

export const CulturalStorySection: React.FC<CulturalStorySectionProps> = ({
  language,
  onOpenAiAssistant
}) => {
  return (
    <section id="culture" className="py-20 sm:py-28 bg-[#0c0c0c] text-slate-100 relative border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="glass px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest accent-gold border-gold inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            {language === 'am' ? 'ባህልና ታሪክ' : 'Habesha Heritage & Hospitality'}
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-light text-white tracking-tight">
            The Art of Shared Dining & Coffee Rituals
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-light">
            In Ethiopian culture, dining is a communal celebration of unity, love, and hospitality. Every meal is shared on a single large Injera platter with family and friends.
          </p>
        </div>

        {/* 2-Column Story Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          
          {/* Left Column: Traditional Coffee Ceremony Image & Story */}
          <div className="relative">
            <div className="relative h-80 sm:h-96 rounded-3xl overflow-hidden glass-card border border-white/15">
              <img 
                src={IMAGES.coffeeCeremony} 
                alt="Traditional Ethiopian Coffee Ceremony Buna at Bole Atlanta" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                <span className="text-[10px] accent-gold font-bold uppercase tracking-widest block">Ancient Tradition</span>
                <h3 className="text-2xl font-bold font-serif">Ethiopian Coffee Ceremony (Buna)</h3>
                <p className="text-xs text-slate-300 font-light">Freshly roasted Yirgacheffe coffee beans brewed in a clay Jebena pot with frankincense smoke.</p>
              </div>
            </div>
          </div>

          {/* Right Column: Culinary Principles */}
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold accent-gold uppercase tracking-widest">Ancient Superfood</span>
              <h3 className="text-2xl sm:text-4xl font-serif font-light text-white">
                Pure Teff Injera & Organic Fermentation
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light">
                Injera is Ethiopia’s sourdough flatbread made from Teff—an ancient, iron-rich, gluten-free supergrain cultivated in the Horn of Africa for over 3,000 years. Naturally fermented for 3 days to achieve its signature spongy texture and probiotic tartness.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-1">
                <div className="flex items-center gap-2 font-serif font-bold text-white text-base">
                  <Heart className="w-4 h-4 text-red-400" />
                  <span>The Tradition of Gursha</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-light">
                  Feeding a morsel of Injera directly into the mouth of a dining partner as a gesture of deep friendship and respect.
                </p>
              </div>

              <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-1">
                <div className="flex items-center gap-2 font-serif font-bold text-white text-base">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>Berbere & Niter Kibbeh</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-light">
                  Sun-dried red peppers blended with ginger, garlic, korarima, and fenugreek, cooked in herbal clarified butter.
                </p>
              </div>
            </div>

            <button
              onClick={onOpenAiAssistant}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full glass-gold text-amber-200 font-bold text-xs uppercase tracking-widest transition-all ai-glow cursor-pointer"
            >
              <Coffee className="w-4 h-4 accent-gold" />
              <span>Ask AI About Ethiopian Food Etiquette & Spices</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
