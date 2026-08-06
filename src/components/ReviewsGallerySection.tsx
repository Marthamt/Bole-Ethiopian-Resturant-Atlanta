import React, { useState } from 'react';
import { 
  Star, 
  Quote, 
  CheckCircle2, 
  Gift, 
  Instagram, 
  Send, 
  Sparkles,
  Camera
} from 'lucide-react';
import { REVIEWS, IMAGES } from '../data/restaurantData';
import { Language, GiftCardOrder } from '../types';

interface ReviewsGallerySectionProps {
  language: Language;
}

export const ReviewsGallerySection: React.FC<ReviewsGallerySectionProps> = ({ language }) => {
  const [galleryFilter, setGalleryFilter] = useState<'all' | 'food' | 'ambiance' | 'coffee'>('all');
  
  // Gift Card State
  const [giftAmount, setGiftAmount] = useState<number>(50);
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [senderName, setSenderName] = useState('');
  const [customMsg, setCustomMsg] = useState('');
  const [giftPurchased, setGiftPurchased] = useState<GiftCardOrder | null>(null);

  const galleryItems = [
    { id: 'g1', category: 'food', title: 'Bole Royal Platter', img: IMAGES.heroPlatter },
    { id: 'g2', category: 'ambiance', title: 'Modern Dining Room', img: IMAGES.ambiance },
    { id: 'g3', category: 'food', title: 'Doro Wat Chicken Stew', img: IMAGES.doroWat },
    { id: 'g4', category: 'food', title: 'Yetsom Beyaynetu Vegan Platter', img: IMAGES.veggieCombo },
    { id: 'g5', category: 'coffee', title: 'Traditional Coffee Ceremony', img: IMAGES.coffeeCeremony },
    { id: 'g6', category: 'food', title: 'Special Beef Kitfo', img: IMAGES.kitfo }
  ];

  const filteredGallery = galleryItems.filter(
    item => galleryFilter === 'all' || item.category === galleryFilter
  );

  const handlePurchaseGiftCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName || !recipientEmail || !senderName) return;

    setGiftPurchased({
      recipientName,
      recipientEmail,
      senderName,
      amount: giftAmount,
      customMessage: customMsg
    });
  };

  return (
    <section id="reviews" className="py-20 sm:py-28 bg-[#0c0c0c] text-white relative border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        
        {/* REVIEWS SECTION */}
        <div>
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="glass px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest accent-gold border-gold inline-flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> Verified Customer Reviews
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-light text-white tracking-tight">
              Loved by Locals, Travelers & Food Critics
            </h2>
            <p className="text-sm text-slate-400 font-light">Rated 4.8★ on Google & Yelp with over 1,200+ verified reviews.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {REVIEWS.map((rev) => (
              <div 
                key={rev.id}
                className="glass-card glass-card-hover p-6 rounded-3xl border border-white/10 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] text-slate-400 font-light">{rev.date}</span>
                  </div>

                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed italic font-serif">
                    "{rev.text}"
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-serif font-bold text-white block">{rev.author}</span>
                    {rev.dishMentioned && (
                      <span className="text-[10px] accent-gold font-medium">Favorite: {rev.dishMentioned}</span>
                    )}
                  </div>
                  {rev.verified && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-300 glass px-2.5 py-0.5 rounded-full border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Verified
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* INSTAGRAM GALLERY SECTION */}
        <div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            <div>
              <h3 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
                <Camera className="w-5 h-5 accent-gold" />
                <span>Culinary & Cultural Gallery</span>
              </h3>
              <p className="text-xs text-slate-400 font-light">Explore authentic food photos from Bole Ethiopian Restaurant Atlanta.</p>
            </div>

            {/* Gallery Filters */}
            <div className="flex items-center gap-1.5 glass p-1.5 rounded-full border-white/10 text-xs">
              {[
                { id: 'all', label: 'All Photos' },
                { id: 'food', label: 'Dishes' },
                { id: 'ambiance', label: 'Ambiance' },
                { id: 'coffee', label: 'Coffee Ceremony' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setGalleryFilter(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all ${
                    galleryFilter === tab.id 
                      ? 'bg-gold text-slate-950 shadow-md' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {filteredGallery.map((g) => (
              <div 
                key={g.id}
                className="relative h-48 sm:h-64 rounded-3xl overflow-hidden group glass-card border border-white/10"
              >
                <img 
                  src={g.img} 
                  alt={g.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-xs font-serif font-bold text-white flex items-center gap-1.5">
                    <Instagram className="w-4 h-4 accent-gold" /> {g.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DIGITAL GIFT CARD SECTION */}
        <div className="glass-gold text-white rounded-3xl p-6 sm:p-10 border border-amber-500/40 shadow-2xl ai-glow">
          <div className="grid md:grid-cols-12 gap-8 items-center">
            
            <div className="md:col-span-6 space-y-4">
              <span className="glass px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest accent-gold border-gold inline-flex items-center gap-1.5">
                <Gift className="w-3.5 h-3.5" /> Instant E-Gift Cards
              </span>
              <h3 className="text-3xl sm:text-4xl font-serif font-light text-white leading-tight">
                Give the Gift of Authentic Habesha Dining
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                Send a digital Bole Ethiopian Restaurant gift voucher instantly via email. Valid for dine-in, coffee ceremonies, or takeout orders!
              </p>

              {/* Gift Amount Buttons */}
              <div>
                <label className="block text-[10px] font-bold accent-gold uppercase tracking-widest mb-2">Select Gift Amount</label>
                <div className="flex flex-wrap gap-2 text-xs font-bold">
                  {[25, 50, 75, 100, 150].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setGiftAmount(amt)}
                      className={`px-4 py-2 rounded-full border transition-all ${
                        giftAmount === amt 
                          ? 'bg-gold text-slate-950 border-amber-300 font-extrabold shadow-md' 
                          : 'glass text-slate-200 border-white/15 hover:border-amber-400'
                      }`}
                    >
                      ${amt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Form or Result */}
            <div className="md:col-span-6 glass-card rounded-3xl p-6 border border-white/15">
              {giftPurchased ? (
                <div className="text-center space-y-4 py-4">
                  <div className="w-12 h-12 bg-gold text-slate-950 rounded-full flex items-center justify-center mx-auto shadow-md">
                    <Gift className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-serif font-bold text-white">E-Gift Card Sent!</h4>
                  <p className="text-xs text-slate-300 font-light">
                    A ${giftPurchased.amount} voucher code <span className="font-mono font-bold accent-gold">#BOLE-GIFT-8821</span> was delivered to <span className="font-bold text-white">{giftPurchased.recipientEmail}</span>.
                  </p>
                  <button
                    onClick={() => setGiftPurchased(null)}
                    className="px-6 py-2.5 bg-gold text-slate-950 text-xs font-bold rounded-full uppercase tracking-wider"
                  >
                    Purchase Another Gift Card
                  </button>
                </div>
              ) : (
                <form onSubmit={handlePurchaseGiftCard} className="space-y-3 text-xs">
                  <h4 className="font-serif font-bold text-white text-sm border-b border-white/10 pb-2">
                    Digital Gift Voucher Details
                  </h4>

                  <input
                    type="text"
                    required
                    placeholder="Recipient Full Name *"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl glass-input text-xs text-white"
                  />

                  <input
                    type="email"
                    required
                    placeholder="Recipient Email Address *"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl glass-input text-xs text-white"
                  />

                  <input
                    type="text"
                    required
                    placeholder="Your Name (Sender) *"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl glass-input text-xs text-white"
                  />

                  <textarea
                    rows={2}
                    placeholder="Personalized Gift Note (Optional)"
                    value={customMsg}
                    onChange={(e) => setCustomMsg(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl glass-input text-xs text-white"
                  />

                  <button
                    type="submit"
                    disabled={!recipientName || !recipientEmail || !senderName}
                    className="w-full py-3.5 rounded-full bg-gold hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Purchase ${giftAmount} Digital Gift Card</span>
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
