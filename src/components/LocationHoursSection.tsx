import React from 'react';
import { 
  MapPin, 
  Clock, 
  Phone, 
  MessageSquare, 
  Navigation, 
  Car, 
  Plane, 
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantData';
import { Language } from '../types';

interface LocationHoursSectionProps {
  language: Language;
  onOpenReservation: () => void;
}

export const LocationHoursSection: React.FC<LocationHoursSectionProps> = ({
  language,
  onOpenReservation
}) => {
  // Determine if currently open based on local hour
  const currentHour = new Date().getHours();
  const isOpenNow = currentHour >= 11 && currentHour < 22;

  return (
    <section id="location" className="py-20 sm:py-28 bg-[#0c0c0c] text-white relative border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="glass px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest accent-gold border-gold inline-flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            {language === 'am' ? 'አድራሻና ሰዓታት' : 'Location & Business Hours'}
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-light text-white tracking-tight">
            Visit Us in Atlanta / Hapeville, GA
          </h2>
          <p className="text-slate-400 text-sm sm:text-base font-light">
            Conveniently located 5 minutes from Atlanta Hartsfield-Jackson Airport (ATL) with ample free private parking.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left: Contact, Hours & Airport Proximity */}
          <div className="lg:col-span-5 glass-card p-6 sm:p-8 rounded-3xl border border-white/10 flex flex-col justify-between space-y-6">
            
            <div className="space-y-6">
              
              {/* Address Header */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold accent-gold uppercase tracking-widest">Address</span>
                  <span className={`px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    isOpenNow ? 'glass text-emerald-300 border-emerald-500/40' : 'glass text-red-300 border-red-500/40'
                  }`}>
                    {isOpenNow ? '• Open Now' : '• Closed Now'}
                  </span>
                </div>
                <h3 className="text-xl font-serif font-bold text-white">{RESTAURANT_INFO.address}</h3>
                <p className="text-xs text-slate-300 font-light">{RESTAURANT_INFO.city}, {RESTAURANT_INFO.state} {RESTAURANT_INFO.zip}</p>
              </div>

              {/* Airport Callout Banner */}
              <div className="p-4 rounded-2xl glass-gold border-amber-500/30 text-amber-200 text-xs space-y-1">
                <div className="font-bold font-serif flex items-center gap-1.5 text-sm text-white">
                  <Plane className="w-4 h-4 accent-gold" />
                  <span>5 Minutes from Atlanta Airport (ATL)</span>
                </div>
                <p className="leading-relaxed font-light text-slate-300">
                  Ideal layover dining spot! Free high-speed Wi-Fi, spacious luggage accommodation, and quick 20-minute table service.
                </p>
              </div>

              {/* Hours Table */}
              <div className="space-y-2">
                <h4 className="font-bold text-white text-xs uppercase tracking-widest flex items-center gap-1.5 font-serif">
                  <Clock className="w-4 h-4 accent-gold" /> Hours of Operation
                </h4>
                <div className="divide-y divide-white/10 text-xs text-slate-300">
                  {RESTAURANT_INFO.hours.map((h, i) => (
                    <div key={i} className="py-2.5 flex justify-between font-light">
                      <span>{h.days}</span>
                      <span className="font-bold text-white">{h.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Parking & Amenities */}
              <div className="pt-2 text-xs text-slate-400 space-y-1 font-light">
                <div className="flex items-center gap-1.5 font-bold text-white">
                  <Car className="w-4 h-4 text-slate-300" /> Free On-Site Private Parking
                </div>
                <p className="text-[11px] text-slate-400">
                  Dedicated parking lot behind the building + street parking along Virginia Ave. Wheelchair accessible entrance.
                </p>
              </div>

            </div>

            {/* Quick Action Buttons: Click to Call & Click to Text */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10">
              <a
                href={`tel:${RESTAURANT_INFO.phoneFormatted}`}
                className="py-3 px-3 rounded-full bg-gold hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md"
                aria-label="Call Bole Ethiopian Restaurant directly"
              >
                <Phone className="w-4 h-4" />
                <span>Click-to-Call</span>
              </a>

              <a
                href={`sms:${RESTAURANT_INFO.phoneFormatted}?body=Hi%20Bole%20Ethiopian%20Restaurant,%20I%20have%20a%20question%20about...`}
                className="py-3 px-3 rounded-full glass hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all border border-white/15"
                aria-label="Text Bole Ethiopian Restaurant directly"
              >
                <MessageSquare className="w-4 h-4 accent-gold" />
                <span>Click-to-Text</span>
              </a>
            </div>

          </div>

          {/* Right: Embedded Google Maps Iframe & Directions */}
          <div className="lg:col-span-7 glass-card rounded-3xl overflow-hidden shadow-2xl border border-white/10 relative min-h-[380px] flex flex-col">
            <iframe
              title="Bole Ethiopian Restaurant Atlanta Map Location"
              src={RESTAURANT_INFO.googleMapsEmbedUrl}
              className="w-full h-full min-h-[380px] border-0 flex-1 opacity-90 contrast-125"
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>

            <div className="p-4 glass border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="font-serif font-bold text-white flex items-center gap-1.5">
                <Navigation className="w-4 h-4 accent-gold" />
                1583 Virginia Ave, Atlanta/Hapeville, GA 30354
              </span>
              <a
                href="https://maps.google.com/?q=1583+Virginia+Ave,+Hapeville,+GA+30354"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full bg-gold text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-400 transition-colors"
              >
                Get Driving Directions
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
