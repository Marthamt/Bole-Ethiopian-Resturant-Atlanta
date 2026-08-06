import React, { useState } from 'react';
import { 
  Calendar, 
  Users, 
  CheckCircle2, 
  Sparkles, 
  Send, 
  Music, 
  ChefHat, 
  ArrowRight 
} from 'lucide-react';
import { EVENTS, RESTAURANT_INFO } from '../data/restaurantData';
import { CateringRequest, Language } from '../types';

interface EventsCateringSectionProps {
  language: Language;
  onAddCateringRequest: (req: CateringRequest) => void;
}

export const EventsCateringSection: React.FC<EventsCateringSectionProps> = ({
  language,
  onAddCateringRequest
}) => {
  const [guestCount, setGuestCount] = useState<number>(35);
  const [packageType, setPackageType] = useState<string>('Royal Feast Buffet');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Per person estimate logic
  const perPersonPrice = packageType.includes('Royal') ? 24 : packageType.includes('Vegan') ? 18 : 22;
  const estimatedCost = guestCount * perPersonPrice;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    const req: CateringRequest = {
      id: `CAT-${Math.floor(1000 + Math.random() * 9000)}`,
      name,
      email,
      phone,
      eventDate: eventDate || 'TBD',
      guestCount,
      eventType: 'Corporate / Celebration Catering',
      packageType,
      notes,
      status: 'new',
      createdAt: new Date().toISOString().split('T')[0]
    };

    try {
      await fetch('/api/catering', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req)
      });
    } catch (err) {
      console.warn('Catering API warning:', err);
    }

    onAddCateringRequest(req);
    setSubmitted(true);
  };

  return (
    <section id="events" className="py-20 sm:py-28 bg-[#0c0c0c] text-white relative overflow-hidden border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="glass px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest accent-gold border-gold inline-flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            {language === 'am' ? 'ዝግጅቶችና ኬተሪንግ' : 'Catering & Cultural Events'}
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-light text-white tracking-tight">
            Celebrate & Dine with Authentic Habesha Flavor
          </h2>
          <p className="text-slate-400 text-sm sm:text-base font-light">
            From university galas and weddings to corporate airport lunches, we cater full-service buffet spreads across Greater Atlanta.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Upcoming Cultural Events */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="text-xl font-serif font-bold text-white flex items-center gap-2">
              <Music className="w-5 h-5 accent-gold" />
              <span>Upcoming Live Events</span>
            </h3>

            <div className="space-y-4">
              {EVENTS.map((evt) => (
                <div 
                  key={evt.id}
                  className="glass-card glass-card-hover rounded-2xl p-4 flex gap-4 items-center border border-white/10"
                >
                  <img src={evt.image} alt={evt.title} className="w-20 h-20 rounded-xl object-cover shrink-0" />
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest glass px-2 py-0.5 rounded-full border border-emerald-500/30">
                      {evt.tag}
                    </span>
                    <h4 className="font-serif font-bold text-white text-sm">{evt.title}</h4>
                    <p className="text-xs accent-gold font-serif">{evt.titleAmharic}</p>
                    <p className="text-xs text-slate-400 flex items-center gap-1 font-light">
                      <Calendar className="w-3 h-3 accent-gold" /> {evt.date} • {evt.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-5 rounded-2xl glass-gold text-xs text-slate-200 space-y-2 border-amber-500/30">
              <span className="font-bold font-serif text-white block text-sm">Private Dining Room</span>
              <p className="font-light">
                Host up to 40 guests in our semi-private Mesob dining hall. Features dedicated service staff, traditional coffee ceremony setup, and customized buffet menus.
              </p>
            </div>
          </div>

          {/* Right Column: Catering Request Form & Calculator */}
          <div className="lg:col-span-7 glass-card rounded-3xl p-6 sm:p-8 border border-white/15 shadow-2xl">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-300 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="text-2xl font-serif font-bold text-white">Catering Inquiry Received!</h4>
                <p className="text-xs text-slate-300 max-w-md mx-auto font-light">
                  Our catering director will contact you within 2 hours to finalize menu items, teff injera ratios, and scheduling.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-3 rounded-full bg-gold text-slate-950 font-bold text-xs uppercase tracking-widest"
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h3 className="text-xl font-serif font-bold text-white flex items-center gap-2">
                    <ChefHat className="w-5 h-5 accent-gold" />
                    <span>Request Catering & Get Live Estimate</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5 font-light">Instant estimate based on guest count and package type.</p>
                </div>

                <div className="space-y-4">
                  {/* Guest Count Slider */}
                  <div>
                    <div className="flex justify-between items-center text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      <span>Estimated Guest Count:</span>
                      <span className="accent-gold text-sm font-serif">{guestCount} People</span>
                    </div>
                    <input
                      type="range"
                      min={15}
                      max={200}
                      step={5}
                      value={guestCount}
                      onChange={(e) => setGuestCount(parseInt(e.target.value))}
                      className="w-full accent-amber-400 cursor-pointer"
                    />
                  </div>

                  {/* Package Selector */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                      Catering Package Type
                    </label>
                    <div className="grid sm:grid-cols-3 gap-2 text-xs">
                      {[
                        { id: 'Royal Feast Buffet', label: 'Royal Feast Buffet', rate: '$24/person' },
                        { id: 'Grand Vegan Spread', label: 'Grand Vegan Spread', rate: '$18/person' },
                        { id: 'Classic Habesha Platter', label: 'Classic Combo', rate: '$22/person' }
                      ].map((pkg) => (
                        <button
                          key={pkg.id}
                          type="button"
                          onClick={() => setPackageType(pkg.id)}
                          className={`p-3 rounded-2xl border text-left transition-all ${
                            packageType === pkg.id 
                              ? 'bg-gold text-slate-950 border-amber-300 font-bold shadow-md' 
                              : 'glass text-slate-300 border-white/10 hover:border-amber-500/30'
                          }`}
                        >
                          <span className="block font-bold">{pkg.label}</span>
                          <span className="text-[10px] opacity-80">{pkg.rate}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Your Name *"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="px-4 py-3 rounded-2xl glass-input text-xs text-white"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="Phone Number *"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="px-4 py-3 rounded-2xl glass-input text-xs text-white"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="px-4 py-3 rounded-2xl glass-input text-xs text-white"
                    />
                    <input
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="px-4 py-3 rounded-2xl glass-input text-xs text-white"
                    />
                  </div>

                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Event details, location, dietary requirements (e.g., 100% teff, gluten-free, halal)..."
                    className="w-full px-4 py-3 rounded-2xl glass-input text-xs text-white"
                  />

                  {/* Live Estimate Footer */}
                  <div className="p-4 rounded-2xl glass-gold border-amber-500/30 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-300 font-medium block uppercase tracking-wider">Estimated Catering Total:</span>
                      <span className="text-2xl font-serif font-extrabold text-white">${estimatedCost.toLocaleString()}</span>
                    </div>

                    <button
                      type="submit"
                      disabled={!name || !phone}
                      className="px-6 py-3.5 rounded-full bg-gold hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs uppercase tracking-widest shadow-xl transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>Submit Proposal</span>
                    </button>
                  </div>

                </div>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
