import React, { useState } from 'react';
import { 
  Phone, 
  MapPin, 
  Mail, 
  Instagram, 
  Facebook, 
  Send, 
  Check, 
  ShieldAlert, 
  FileText 
} from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantData';
import { Language } from '../types';

interface FooterProps {
  language: Language;
  onOpenAdmin: () => void;
  onOpenReport: () => void;
}

export const Footer: React.FC<FooterProps> = ({ language, onOpenAdmin, onOpenReport }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
  };

  return (
    <footer className="bg-[#080808] text-slate-300 border-t border-white/10 text-xs pt-20 pb-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Col 1: Brand & Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full glass-gold text-amber-200 flex items-center justify-center font-serif font-bold text-lg border border-amber-500/40 shadow-md">
                <span>ቦ</span>
              </div>
              <div>
                <span className="block font-serif font-bold text-lg text-white tracking-tight">
                  {RESTAURANT_INFO.name}
                </span>
                <span className="block text-xs font-semibold accent-gold font-serif">
                  {RESTAURANT_INFO.nameAmharic}
                </span>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed font-light">
              Authentic Habesha culinary traditions, 100% teff gluten-free Injera, slow-simmered Berbere stews, and traditional coffee ceremonies in Atlanta, GA.
            </p>

            <div className="pt-1 accent-gold font-serif font-bold text-xs uppercase tracking-widest">
              እንኳን ደህና መጡ (Welcome!)
            </div>
          </div>

          {/* Col 2: Quick Sitemap */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-white text-sm uppercase tracking-wider">Navigation & Sitemap</h4>
            <ul className="space-y-2 text-slate-400 font-light">
              <li><a href="#hero" className="hover:text-amber-400 transition-colors">Home</a></li>
              <li><a href="#menu" className="hover:text-amber-400 transition-colors">Menu & Dietary Engine</a></li>
              <li><a href="#culture" className="hover:text-amber-400 transition-colors">Coffee Ceremony & Culture</a></li>
              <li><a href="#events" className="hover:text-amber-400 transition-colors">Events & Catering</a></li>
              <li><a href="#reviews" className="hover:text-amber-400 transition-colors">Reviews & Gift Cards</a></li>
              <li><a href="#location" className="hover:text-amber-400 transition-colors">Location & Hours</a></li>
            </ul>
          </div>

          {/* Col 3: Contact & Airport Proximity */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-white text-sm uppercase tracking-wider">Contact & Location</h4>
            <div className="space-y-2 text-slate-400 font-light">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 accent-gold shrink-0 mt-0.5" />
                <span>{RESTAURANT_INFO.fullAddress}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 accent-gold shrink-0" />
                <a href={`tel:${RESTAURANT_INFO.phoneFormatted}`} className="hover:text-white font-bold accent-gold">
                  {RESTAURANT_INFO.phone}
                </a>
              </p>
              <p className="text-[11px] text-emerald-400 pt-1 font-medium">
                • 5 Minutes from Atlanta Hartsfield-Jackson Airport (ATL)
              </p>
            </div>
          </div>

          {/* Col 4: VIP Newsletter & Social Links */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-white text-sm uppercase tracking-wider">Habesha Culinary Club</h4>
            <p className="text-slate-400 text-xs font-light">
              Subscribe for exclusive secret menu pop-ups, Ethio-Jazz night invitations, and 10% off your first order.
            </p>

            {subscribed ? (
              <div className="p-3 glass text-emerald-300 border-emerald-500/40 rounded-2xl flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Subscribed! Welcome to the family.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  required
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl glass-input text-white text-xs"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 bg-gold hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-full flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-all"
                >
                  <Send className="w-3.5 h-3.5" /> Subscribe
                </button>
              </form>
            )}

            <div className="flex items-center gap-3 pt-2">
              <a href={RESTAURANT_INFO.social.instagram} target="_blank" rel="noreferrer" className="p-2.5 glass rounded-full hover:text-amber-400 transition-colors border border-white/10" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href={RESTAURANT_INFO.social.facebook} target="_blank" rel="noreferrer" className="p-2.5 glass rounded-full hover:text-amber-400 transition-colors border border-white/10" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px] font-light">
          <p>© {new Date().getFullYear()} Bole Ethiopian Restaurant Atlanta. All Rights Reserved.</p>
          
          <div className="flex items-center gap-6">
            <button
              onClick={onOpenAdmin}
              className="hover:text-amber-400 font-medium flex items-center gap-1 text-slate-400 cursor-pointer"
            >
              <ShieldAlert className="w-3.5 h-3.5" /> Manager Portal
            </button>
            <button
              onClick={onOpenReport}
              className="hover:text-amber-400 flex items-center gap-1 accent-gold font-bold cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" /> Modernization Audit Report
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
