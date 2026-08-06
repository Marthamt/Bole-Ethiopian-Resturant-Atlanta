import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Mic, 
  Sparkles, 
  Flame, 
  Leaf, 
  Check, 
  Plus, 
  Filter, 
  Info, 
  X, 
  Utensils, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { MENU_ITEMS } from '../data/restaurantData';
import { MenuItem, Category, Language } from '../types';

interface MenuSectionProps {
  language: Language;
  onAddToCart: (
    item: MenuItem, 
    quantity: number, 
    spice: string, 
    injera: string, 
    notes: string
  ) => void;
  onOpenAiAssistant: () => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  language,
  onAddToCart,
  onOpenAiAssistant
}) => {
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVegan, setFilterVegan] = useState(false);
  const [filterGlutenFree, setFilterGlutenFree] = useState(false);
  const [filterHalal, setFilterHalal] = useState(false);
  const [filterSpicyOnly, setFilterSpicyOnly] = useState(false);

  // Selected Item for Detail & Customization Modal
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [spicePref, setSpicePref] = useState<string>('Medium');
  const [injeraType, setInjeraType] = useState<string>('Standard Mixed Teff');
  const [specialNotes, setSpecialNotes] = useState<string>('');
  const [addedToast, setAddedToast] = useState<string | null>(null);

  // Categories config
  const categories: { id: Category; labelEn: string; labelAm: string }[] = [
    { id: 'all', labelEn: 'All Dishes', labelAm: 'ሁሉንም' },
    { id: 'house_specials', labelEn: 'House Specials', labelAm: 'የቤት ልዩ' },
    { id: 'beef_lamb', labelEn: 'Beef & Lamb', labelAm: 'የበሬና የበግ' },
    { id: 'poultry', labelEn: 'Poultry', labelAm: 'የዶሮ ወጥ' },
    { id: 'vegan_veggie', labelEn: 'Vegan & Veggie', labelAm: 'የጾም ምግብ' },
    { id: 'beverages_wine', labelEn: 'Beverages & Tej', labelAm: 'መጠጦችና ጠጅ' },
    { id: 'desserts', labelEn: 'Desserts', labelAm: 'ጣፋጭ' }
  ];

  // Filter Logic
  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      // Category check
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      // Search query check
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q) || item.nameAmharic.includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesIng = item.ingredients?.some(i => i.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesIng) return false;
      }
      // Dietary toggles
      if (filterVegan && !item.isVegan) return false;
      if (filterGlutenFree && !item.isGlutenFree) return false;
      if (filterHalal && !item.isHalal) return false;
      if (filterSpicyOnly && !item.isSpicy) return false;

      return true;
    });
  }, [selectedCategory, searchQuery, filterVegan, filterGlutenFree, filterHalal, filterSpicyOnly]);

  const openCustomizeModal = (item: MenuItem) => {
    setSelectedItem(item);
    setQuantity(1);
    setSpicePref(item.isSpicy ? 'Medium' : 'Mild');
    setInjeraType('Standard Mixed Teff');
    setSpecialNotes('');
  };

  const handleConfirmAddToCart = () => {
    if (!selectedItem) return;
    onAddToCart(selectedItem, quantity, spicePref, injeraType, specialNotes);
    setAddedToast(`Added ${quantity}x ${selectedItem.name} to your order!`);
    setTimeout(() => setAddedToast(null), 3500);
    setSelectedItem(null);
  };

  // Voice Search simulation/handler
  const handleVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      try {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = language === 'am' ? 'am-ET' : 'en-US';
        recognition.start();
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setSearchQuery(transcript);
        };
      } catch (err) {
        onOpenAiAssistant();
      }
    } else {
      onOpenAiAssistant();
    }
  };

  return (
    <section id="menu" className="py-16 sm:py-24 bg-[#0c0c0c] text-slate-100 relative border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="glass px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest accent-gold border-gold inline-flex items-center gap-1.5 mb-3">
            <Utensils className="w-3.5 h-3.5" />
            {language === 'am' ? 'የእኛ ሜኑ' : 'Authentic Habesha Menu'}
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-light text-white tracking-tight">
            {language === 'am' ? 'ጣፋጭ የኢትዮጵያ ምግቦች' : 'Hand-Prepared Culinary Delights'}
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base font-light">
            All entrees served on traditional sourdough Injera. 100% Gluten-free pure teff available upon request.
          </p>
        </div>

        {/* Added Toast Notification */}
        {addedToast && (
          <div className="fixed bottom-6 right-6 z-50 glass-gold text-amber-200 px-6 py-4 rounded-2xl shadow-2xl font-medium flex items-center gap-3 animate-bounce border border-amber-500/40">
            <Check className="w-5 h-5 bg-amber-500 text-slate-950 rounded-full p-0.5" />
            <span>{addedToast}</span>
          </div>
        )}

        {/* Search & AI Recommendation Banner */}
        <div className="glass-card rounded-3xl p-4 sm:p-6 mb-8 space-y-4">
          <div className="grid md:grid-cols-12 gap-4 items-center">
            
            {/* Search Input */}
            <div className="md:col-span-8 relative">
              <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'am' ? 'ምግብ ይፈልጉ... (ለምሳሌ፡ ዶሮ ወጥ፣ ክትፎ፣ የጾም)' : 'Search menu... (e.g., Doro Wat, Kitfo, Vegan, Gluten-Free)'}
                className="w-full pl-11 pr-12 py-3 rounded-2xl glass-input text-sm text-white placeholder-slate-400"
              />
              <button
                onClick={handleVoiceSearch}
                className="absolute right-3 top-2.5 p-1.5 text-slate-400 hover:text-amber-300 hover:bg-white/10 rounded-xl transition-colors"
                title="Voice Search / ድምፅ ፍለጋ"
                aria-label="Activate voice search"
              >
                <Mic className="w-4 h-4" />
              </button>
            </div>

            {/* AI Recommendation Trigger */}
            <div className="md:col-span-4">
              <button
                onClick={onOpenAiAssistant}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl glass-gold text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-amber-500/20 transition-all cursor-pointer"
                aria-label="Open AI Dietary Recommendation quiz"
              >
                <Sparkles className="w-4 h-4 accent-gold" />
                <span>AI Dietary Matchmaker</span>
              </button>
            </div>

          </div>

          {/* Dietary Toggle Filters */}
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-white/10 text-xs">
            <span className="text-slate-400 font-medium flex items-center gap-1 mr-2 uppercase tracking-wider text-[10px]">
              <Filter className="w-3.5 h-3.5 accent-gold" /> Filters:
            </span>

            <button
              onClick={() => setFilterVegan(!filterVegan)}
              className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 font-medium border ${
                filterVegan 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-md' 
                  : 'glass text-slate-300 border-white/10 hover:border-emerald-500/30'
              }`}
            >
              <Leaf className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% Vegan</span>
            </button>

            <button
              onClick={() => setFilterGlutenFree(!filterGlutenFree)}
              className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 font-medium border ${
                filterGlutenFree 
                  ? 'bg-amber-500/20 accent-gold border-amber-500/50 shadow-md' 
                  : 'glass text-slate-300 border-white/10 hover:border-amber-500/30'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 accent-gold" />
              <span>Gluten-Free Pure Teff</span>
            </button>

            <button
              onClick={() => setFilterHalal(!filterHalal)}
              className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 font-medium border ${
                filterHalal 
                  ? 'bg-blue-500/20 text-blue-300 border-blue-500/50 shadow-md' 
                  : 'glass text-slate-300 border-white/10 hover:border-blue-500/30'
              }`}
            >
              <span>Halal Certified</span>
            </button>

            <button
              onClick={() => setFilterSpicyOnly(!filterSpicyOnly)}
              className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 font-medium border ${
                filterSpicyOnly 
                  ? 'bg-red-500/20 text-red-300 border-red-500/50 shadow-md' 
                  : 'glass text-slate-300 border-white/10 hover:border-red-500/30'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-red-400" />
              <span>Berbere Spicy</span>
            </button>

            {(filterVegan || filterGlutenFree || filterHalal || filterSpicyOnly || searchQuery) && (
              <button
                onClick={() => {
                  setFilterVegan(false);
                  setFilterGlutenFree(false);
                  setFilterHalal(false);
                  setFilterSpicyOnly(false);
                  setSearchQuery('');
                }}
                className="text-xs accent-gold underline font-semibold ml-auto hover:text-amber-300"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Category Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full text-xs uppercase font-bold tracking-wider whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-gold text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'glass text-slate-300 hover:text-white hover:bg-white/10 border-white/10'
              }`}
            >
              {language === 'am' ? cat.labelAm : cat.labelEn}
            </button>
          ))}
        </div>

        {/* Menu Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 glass-card rounded-3xl p-8 space-y-4">
            <Info className="w-12 h-12 accent-gold mx-auto" />
            <h3 className="text-lg font-bold text-white">No matching menu items found</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto font-light">
              Try adjusting your search terms or dietary filters. Our AI assistant can also help craft a custom dish order.
            </p>
            <button
              onClick={onOpenAiAssistant}
              className="px-6 py-2.5 rounded-full bg-gold text-slate-950 font-bold text-xs uppercase tracking-widest"
            >
              Ask Selam AI Assistant
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div 
                key={item.id}
                className="glass-card glass-card-hover rounded-3xl overflow-hidden flex flex-col justify-between group border border-white/10"
              >
                {/* Image & Badges Container */}
                <div className="relative h-52 sm:h-56 overflow-hidden bg-slate-900">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    {item.isChefSpecial && (
                      <span className="glass bg-amber-500/20 accent-gold border-gold text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full backdrop-blur-md">
                        Chef Special
                      </span>
                    )}
                    {item.isPopular && (
                      <span className="glass bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full backdrop-blur-md">
                        Popular
                      </span>
                    )}
                    {item.isVegan && (
                      <span className="glass bg-emerald-950/80 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border-emerald-500/30">
                        <Leaf className="w-3 h-3 text-emerald-400" /> Vegan
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 right-3 glass px-3 py-1 rounded-xl text-white font-serif font-bold text-base border-gold">
                    ${item.price.toFixed(2)}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-serif font-bold text-white text-lg leading-snug group-hover:text-amber-300 transition-colors">
                        {item.name}
                      </h3>
                    </div>
                    <p className="text-xs font-semibold accent-gold font-serif mb-2">
                      {item.nameAmharic}
                    </p>
                    <p className="text-slate-300 text-xs line-clamp-3 leading-relaxed font-light">
                      {item.description}
                    </p>
                  </div>

                  {/* Allergen & Dietary Tags */}
                  <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-1">
                    <div className="flex items-center gap-2">
                      {item.isSpicy && (
                        <span className="text-red-400 font-bold flex items-center gap-0.5" title={`Spice level: ${item.spiceLevel}/3`}>
                          <Flame className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                          <span>Spicy</span>
                        </span>
                      )}
                      {item.isGlutenFree && (
                        <span className="accent-gold font-semibold" title="Gluten free options available">
                          GF Teff
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => openCustomizeModal(item)}
                      className="inline-flex items-center gap-1 font-bold accent-gold hover:text-amber-300 hover:underline text-xs"
                    >
                      <span>Customize & Add</span>
                      <Plus className="w-3.5 h-3.5 bg-gold text-slate-950 rounded-full p-0.5" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* Item Detail & Customization Modal */}
        {selectedItem && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="glass-card rounded-3xl max-w-lg w-full overflow-hidden border border-white/20 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              
              {/* Modal Header */}
              <div className="relative h-48 bg-slate-950">
                <img 
                  src={selectedItem.image} 
                  alt={selectedItem.name} 
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-3 right-3 bg-black/70 text-white p-2 rounded-full hover:bg-black transition-colors"
                  aria-label="Close dish customization modal"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-3 left-3 glass px-3 py-1 rounded-full text-xs font-bold accent-gold border-gold">
                  {selectedItem.nameAmharic}
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-serif font-bold text-white">{selectedItem.name}</h3>
                    <span className="text-xl font-bold accent-gold">${selectedItem.price.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed font-light">
                    {selectedItem.description}
                  </p>
                </div>

                {/* Allergen Warning Box if present */}
                {selectedItem.allergens && selectedItem.allergens.length > 0 && (
                  <div className="p-3 rounded-xl glass bg-amber-950/30 border-amber-500/30 text-xs text-amber-200 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Allergen Notice: </span>
                      <span>Contains {selectedItem.allergens.join(', ')}.</span>
                    </div>
                  </div>
                )}

                {/* Spice Preference */}
                {selectedItem.isSpicy && (
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                      Spice Level Preference
                    </label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {['Mild', 'Medium', 'Authentic Hot', 'Extra Berbere'].map((sp) => (
                        <button
                          key={sp}
                          type="button"
                          onClick={() => setSpicePref(sp)}
                          className={`p-2.5 rounded-xl border text-center font-medium transition-all ${
                            spicePref === sp 
                              ? 'bg-gold text-slate-950 border-amber-300 font-bold shadow-md' 
                              : 'glass text-slate-300 border-white/10 hover:border-amber-500/40'
                          }`}
                        >
                          {sp}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Injera Selection */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                    Injera Bread Selection
                  </label>
                  <div className="space-y-2 text-xs">
                    {[
                      { id: 'Standard Mixed Teff', label: 'Standard Mixed Teff Injera (Traditional Soft Blend)', extra: 0 },
                      { id: '100% Gluten-Free Pure Teff', label: '100% Pure Teff Injera (Gluten-Free Certified)', extra: 2.00 }
                    ].map((inj) => (
                      <button
                        key={inj.id}
                        type="button"
                        onClick={() => setInjeraType(inj.id)}
                        className={`w-full p-3 rounded-2xl border text-left font-medium transition-all flex items-center justify-between ${
                          injeraType === inj.id 
                            ? 'glass-gold text-amber-200 border-amber-500/50 font-bold' 
                            : 'glass text-slate-300 border-white/10 hover:border-white/20'
                        }`}
                      >
                        <span>{inj.label}</span>
                        {inj.extra > 0 && <span className="accent-gold font-bold">+${inj.extra.toFixed(2)}</span>}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Special Instructions */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Special Preparation Notes
                  </label>
                  <input
                    type="text"
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    placeholder="e.g. Extra onions, sauce on the side, no butter"
                    className="w-full px-3.5 py-2.5 rounded-2xl glass-input text-xs text-white"
                  />
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs uppercase font-bold text-slate-300 tracking-wider">Quantity</span>
                  <div className="flex items-center gap-3 glass p-1.5 rounded-2xl border-white/10">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="font-bold text-sm text-white w-6 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-slate-950/80 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="block text-[10px] text-slate-400 font-medium uppercase tracking-wider">Total Amount</span>
                  <span className="text-xl font-bold accent-gold font-serif">
                    ${((selectedItem.price + (injeraType.includes('100%') ? 2 : 0)) * quantity).toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={handleConfirmAddToCart}
                  className="px-6 py-3 rounded-full bg-gold hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-widest shadow-xl transition-all"
                >
                  Add To Order
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
