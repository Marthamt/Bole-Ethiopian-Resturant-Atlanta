import React from 'react';
import { X, FileText, CheckCircle2, Sparkles, Server, ShieldCheck, Code2, Globe } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantData';

interface AnalysisReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AnalysisReportModal: React.FC<AnalysisReportModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="glass-card rounded-3xl max-w-4xl w-full h-[650px] flex flex-col overflow-hidden border border-white/15 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="glass-gold text-white p-5 flex items-center justify-between border-b border-amber-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full glass flex items-center justify-center text-amber-200 border border-amber-400/40">
              <FileText className="w-5 h-5 accent-gold" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg">Website Audit & Modernization Architecture Report</h3>
              <p className="text-xs text-slate-300 font-serif font-light">Bole Ethiopian Restaurant Atlanta (2026 Platform)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 glass text-slate-300 hover:text-white rounded-full transition-colors border border-white/10 cursor-pointer"
            aria-label="Close report modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-8 text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
          
          {/* STEP 1 ANALYSIS SUMMARY */}
          <div className="space-y-3 border-b border-white/10 pb-6">
            <h4 className="text-base font-serif font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>1. Current Website Analysis (http://www.boleethiopianrestaurantatlanta.com/)</span>
            </h4>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl glass-card border border-amber-500/30 space-y-1">
                <span className="font-bold accent-gold block text-xs uppercase tracking-wider">What Was Preserved</span>
                <ul className="list-disc list-inside space-y-1 text-slate-300 text-xs font-light">
                  <li>Original restaurant branding, Habesha hospitality identity & warm tone.</li>
                  <li>Core business address: 1583 Virginia Ave, Atlanta/Hapeville GA 30354.</li>
                  <li>Direct phone line: (404) 549-8583.</li>
                  <li>Authentic culinary names: Doro Wat, Special Kitfo, Sizzling Tibs, Yetsom Beyaynetu, Teff Injera, House Tej.</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl glass-card border border-white/15 space-y-1">
                <span className="font-bold text-white block text-xs uppercase tracking-wider">What Was Redesigned & Modernized</span>
                <ul className="list-disc list-inside space-y-1 text-slate-300 text-xs font-light">
                  <li>Outdated desktop layout converted to mobile-first responsive design.</li>
                  <li>Static text menu converted to interactive dietary & allergen filter engine.</li>
                  <li>Phone-only reservations converted to real-time online booking wizard.</li>
                  <li>Added practical AI Concierge ("Selam AI") with English + Amharic bilingual support.</li>
                  <li>Added full Online Ordering system with live order status progress bar.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* STEP 5 & 6 AI & MODERN FEATURES */}
          <div className="space-y-3 border-b border-white/10 pb-6">
            <h4 className="text-base font-serif font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 accent-gold" />
              <span>2. AI & Modern Restaurant Features</span>
            </h4>
            <div className="grid sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 glass-card rounded-2xl border border-white/15 space-y-1">
                <span className="font-bold text-white block">Selam AI Chatbot</span>
                <p className="text-slate-400 font-light">Bilingual English + Amharic (አማርኛ) AI concierge powered by Gemini 2.5 Flash.</p>
              </div>
              <div className="p-3.5 glass-card rounded-2xl border border-white/15 space-y-1">
                <span className="font-bold text-white block">Dietary & Allergen Engine</span>
                <p className="text-slate-400 font-light">Filters 100% Teff Gluten-Free, Vegan fasting dishes, Halal meats, and spice levels.</p>
              </div>
              <div className="p-3.5 glass-card rounded-2xl border border-white/15 space-y-1">
                <span className="font-bold text-white block">Airport Proximity Callout</span>
                <p className="text-slate-400 font-light">Highlights 5-minute distance from Atlanta Airport (ATL) with luggage accommodation.</p>
              </div>
            </div>
          </div>

          {/* STEP 8 RECOMMENDED CMS */}
          <div className="space-y-3 border-b border-white/10 pb-6">
            <h4 className="text-base font-serif font-bold text-white flex items-center gap-2">
              <Server className="w-5 h-5 accent-gold" />
              <span>3. Recommended CMS & Architectural Stack</span>
            </h4>
            <div className="p-4 rounded-2xl glass border border-amber-500/30 space-y-2">
              <span className="font-bold accent-gold block text-xs uppercase tracking-wider">
                Recommended CMS: Payload CMS / Sanity.io
              </span>
              <p className="text-slate-300 text-xs leading-relaxed font-light">
                <strong className="text-white">Why Payload / Sanity is best for Bole Ethiopian Restaurant:</strong>
                <br />
                1. <strong className="text-white">Native TypeScript Type-Safety:</strong> Ensures menu items, daily specials, and teff injera options mirror our data schemas perfectly without runtime drift.
                <br />
                2. <strong className="text-white">Bilingual Localization Support:</strong> Effortlessly manages English and Amharic (አማርኛ) translations side-by-side.
                <br />
                3. <strong className="text-white">Instant Webhooks:</strong> Webhooks automatically invalidate cache and update the AI Knowledge Base whenever new menu items or seasonal events are published.
              </p>
            </div>
          </div>

          {/* STEP 9 SEO & DEPLOYMENT */}
          <div className="space-y-3">
            <h4 className="text-base font-serif font-bold text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-emerald-400" />
              <span>4. SEO & Deployment Readiness</span>
            </h4>
            <ul className="list-disc list-inside space-y-1 text-xs text-slate-300 font-light">
              <li><strong className="text-white">Schema.org Restaurant JSON-LD:</strong> Automatically generated and injected into document head for local Google Search indexing.</li>
              <li><strong className="text-white">Lighthouse Score Optimization:</strong> Fast loading, responsive images, clean component code splitting, and zero unused dependencies.</li>
              <li><strong className="text-white">Deployment Platforms:</strong> Containerized for Cloud Run, Vercel, Netlify, or Docker deployment.</li>
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
};
