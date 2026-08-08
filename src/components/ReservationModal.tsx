import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  CheckCircle2, 
  Sparkles, 
  Heart, 
  Phone, 
  Mail, 
  User,
  Search,
  AlertCircle,
  Trash2,
  Copy,
  Check
} from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantData';
import { Reservation, Language } from '../types';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onAddReservation: (res: Reservation) => void;
  existingReservations?: Reservation[];
}

export const ReservationModal: React.FC<ReservationModalProps> = ({
  isOpen,
  onClose,
  language,
  onAddReservation,
  existingReservations = []
}) => {
  if (!isOpen) return null;

  // Main Mode: 'book' or 'find'
  const [modalMode, setModalMode] = useState<'book' | 'find'>('book');

  // Booking state
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState<string>('07:00 PM');
  const [guests, setGuests] = useState<number>(2);
  const [seatingArea, setSeatingArea] = useState<'indoor' | 'patio' | 'mesob_traditional'>('mesob_traditional');
  
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [specialOccasion, setSpecialOccasion] = useState('');
  const [notes, setNotes] = useState('');

  const [createdReservation, setCreatedReservation] = useState<Reservation | null>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Reservation[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [cancelSuccessMsg, setCancelSuccessMsg] = useState<string | null>(null);

  const timeSlots = [
    '12:00 PM', '01:00 PM', '02:00 PM', '05:00 PM', 
    '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM', '09:00 PM'
  ];

  // Auto search when opening 'find' tab or when search query changes
  const handleSearchReservations = async (queryToSearch?: string) => {
    const q = queryToSearch !== undefined ? queryToSearch : searchQuery;
    setIsSearching(true);
    setCancelSuccessMsg(null);

    try {
      const url = q.trim() 
        ? `/api/reservations?query=${encodeURIComponent(q.trim())}` 
        : '/api/reservations';
      const response = await fetch(url);
      const data = await response.json();

      if (data.success && Array.isArray(data.reservations)) {
        // Merge server search results with local reservations matching the query
        const map = new Map<string, Reservation>();
        data.reservations.forEach((r: Reservation) => map.set(r.id, r));

        const cleanQ = q.trim().toLowerCase();
        const cleanPhone = q.replace(/\D/g, '');

        existingReservations.forEach((r) => {
          const matchId = r.id.toLowerCase().includes(cleanQ);
          const matchName = r.customerName.toLowerCase().includes(cleanQ);
          const matchEmail = r.email.toLowerCase().includes(cleanQ);
          const matchPhone = cleanPhone && r.phone.replace(/\D/g, '').includes(cleanPhone);

          if (!cleanQ || matchId || matchName || matchEmail || matchPhone) {
            if (!map.has(r.id)) {
              map.set(r.id, r);
            }
          }
        });

        setSearchResults(Array.from(map.values()));
      } else {
        // Fallback to searching local state
        const filtered = existingReservations.filter(r => 
          r.phone.includes(q) || 
          r.customerName.toLowerCase().includes(q.toLowerCase()) || 
          r.id.toLowerCase().includes(q.toLowerCase())
        );
        setSearchResults(filtered);
      }
    } catch (err) {
      console.warn('Error querying reservations:', err);
      // Fallback local filter
      const filtered = existingReservations.filter(r => 
        r.phone.includes(q) || 
        r.customerName.toLowerCase().includes(q.toLowerCase()) || 
        r.id.toLowerCase().includes(q.toLowerCase())
      );
      setSearchResults(filtered);
    } finally {
      setIsSearching(false);
      setHasSearched(true);
    }
  };

  // Perform initial search when switching to 'find' tab
  useEffect(() => {
    if (modalMode === 'find') {
      handleSearchReservations(searchQuery);
    }
  }, [modalMode]);

  const handleConfirmReservation = async () => {
    if (!customerName || !phone) return;

    const newRes: Reservation = {
      id: `RES-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName,
      email,
      phone,
      date,
      time,
      guests,
      seatingArea,
      specialOccasion,
      notes,
      status: 'confirmed',
      createdAt: new Date().toISOString().split('T')[0]
    };

    try {
      await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRes)
      });
    } catch (err) {
      console.warn('API sync warning:', err);
    }

    onAddReservation(newRes);
    setCreatedReservation(newRes);
    setStep(3);
  };

  const handleCancelReservation = async (id: string) => {
    if (!window.confirm('Are you sure you want to cancel this table reservation?')) return;

    try {
      await fetch(`/api/reservations/${id}`, { method: 'DELETE' });
      setCancelSuccessMsg(`Reservation #${id} has been cancelled.`);
      setSearchResults((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.warn('Error cancelling reservation:', err);
      setSearchResults((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const copyCode = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="glass-card rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden border border-white/15 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="glass-gold text-white p-4 sm:p-5 flex items-center justify-between border-b border-amber-500/30 shrink-0">
          <div>
            <h3 className="font-serif font-bold text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 accent-gold" />
              <span>Table Reservation</span>
            </h3>
            <p className="text-xs text-slate-300 font-serif font-light">
              {RESTAURANT_INFO.name} • {RESTAURANT_INFO.city}, GA
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 glass text-slate-300 hover:text-white rounded-full transition-colors border border-white/10 cursor-pointer"
            aria-label="Close reservation modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Book vs Find */}
        <div className="flex border-b border-white/10 bg-black/40 p-1 text-xs font-bold uppercase tracking-wider shrink-0">
          <button
            onClick={() => {
              setModalMode('book');
              setStep(1);
            }}
            className={`flex-1 py-2.5 rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              modalMode === 'book'
                ? 'bg-gold text-slate-950 font-extrabold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Book A Table</span>
          </button>
          <button
            onClick={() => setModalMode('find')}
            className={`flex-1 py-2.5 rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              modalMode === 'find'
                ? 'bg-gold text-slate-950 font-extrabold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Find My Reservation</span>
          </button>
        </div>

        {/* MODE 1: BOOK A TABLE */}
        {modalMode === 'book' && (
          <div className="flex-1 overflow-y-auto">
            {/* STEP 1: DATE, TIME & GUESTS */}
            {step === 1 && (
              <div className="p-5 sm:p-6 space-y-5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-2">
                    Number of Guests
                  </label>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGuests(g)}
                        className={`px-3.5 py-2 rounded-2xl text-xs font-bold border transition-all shrink-0 ${
                          guests === g 
                            ? 'bg-gold text-slate-950 border-amber-300 font-extrabold shadow-md' 
                            : 'glass text-slate-300 border-white/10 hover:border-amber-400'
                        }`}
                      >
                        {g} {g === 1 ? 'Guest' : 'Guests'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-2">
                    Reservation Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl glass-input text-white text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-2">
                    Preferred Time
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 text-xs">
                    {timeSlots.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTime(t)}
                        className={`p-2.5 rounded-2xl border text-center font-semibold transition-all ${
                          time === t 
                            ? 'bg-gold text-slate-950 border-amber-300 font-bold shadow-md' 
                            : 'glass text-slate-300 border-white/10 hover:border-amber-400'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-2">
                    Seating Atmosphere
                  </label>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {[
                      { id: 'mesob_traditional', label: 'Mesob Traditional' },
                      { id: 'indoor', label: 'Main Dining Room' },
                      { id: 'patio', label: 'Outdoor Patio' }
                    ].map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSeatingArea(s.id as any)}
                        className={`p-2.5 rounded-2xl border text-center font-medium transition-all ${
                          seatingArea === s.id 
                            ? 'bg-gold text-slate-950 border-amber-300 font-bold shadow-md' 
                            : 'glass text-slate-300 border-white/10 hover:border-white/20'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setStep(2)}
                  className="w-full py-3.5 rounded-full bg-gold hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-widest shadow-xl transition-all cursor-pointer"
                >
                  Next: Guest Details
                </button>
              </div>
            )}

            {/* STEP 2: CONTACT DETAILS */}
            {step === 2 && (
              <div className="p-5 sm:p-6 space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Selamawit Alemu"
                    className="w-full px-4 py-3 rounded-2xl glass-input text-white text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(404) 555-0123"
                      className="w-full px-4 py-3 rounded-2xl glass-input text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@domain.com"
                      className="w-full px-4 py-3 rounded-2xl glass-input text-white text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-1">
                    Special Occasion (Optional)
                  </label>
                  <input
                    type="text"
                    value={specialOccasion}
                    onChange={(e) => setSpecialOccasion(e.target.value)}
                    placeholder="e.g. Birthday, Anniversary, Business Dinner"
                    className="w-full px-4 py-3 rounded-2xl glass-input text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-1">
                    Dietary & Allergy Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                    placeholder="e.g. Request 100% teff gluten-free injera or high chair"
                    className="w-full px-4 py-3 rounded-2xl glass-input text-white text-xs"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-5 py-3 rounded-full glass border border-white/15 text-slate-300 font-bold text-xs uppercase tracking-wider hover:bg-white/10"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    disabled={!customerName || !phone}
                    onClick={handleConfirmReservation}
                    className="flex-1 py-3.5 rounded-full bg-gold hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs uppercase tracking-widest shadow-xl transition-all cursor-pointer"
                  >
                    Confirm Reservation
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: CONFIRMATION */}
            {step === 3 && createdReservation && (
              <div className="p-6 text-center space-y-5">
                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-300 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div>
                  <h4 className="text-2xl font-serif font-bold text-white">Reservation Confirmed!</h4>
                  <p className="text-xs accent-gold font-bold font-mono mt-1 flex items-center justify-center gap-1">
                    <span>Code: #{createdReservation.id}</span>
                    <button 
                      onClick={() => copyCode(createdReservation.id)}
                      className="p-1 text-slate-400 hover:text-white"
                      title="Copy Reservation Code"
                    >
                      {copiedId === createdReservation.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </p>
                </div>

                <div className="glass p-5 rounded-2xl border border-white/10 text-xs text-slate-300 space-y-2.5 text-left font-light">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Guest Name:</span>
                    <span className="font-bold text-white">{createdReservation.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Phone:</span>
                    <span className="font-bold text-white">{createdReservation.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Date & Time:</span>
                    <span className="font-bold text-white">{createdReservation.date} at {createdReservation.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Party Size:</span>
                    <span className="font-bold text-white">{createdReservation.guests} Guests</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Seating:</span>
                    <span className="font-bold text-white capitalize">{createdReservation.seatingArea.replace('_', ' ')}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSearchQuery(createdReservation.phone || createdReservation.id);
                      setModalMode('find');
                    }}
                    className="flex-1 py-3 rounded-full glass border border-amber-500/40 text-amber-200 font-bold text-xs uppercase tracking-wider hover:bg-amber-500/10"
                  >
                    View in My Reservations
                  </button>
                  <button
                    onClick={onClose}
                    className="flex-1 py-3.5 rounded-full bg-gold text-slate-950 font-bold text-xs uppercase tracking-widest"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* MODE 2: FIND MY RESERVATION */}
        {modalMode === 'find' && (
          <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-1.5">
                Search Your Reservation
              </label>
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSearchReservations();
                }}
                className="flex gap-2"
              >
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter phone number, email, or code (e.g. RES-8921)"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl glass-input text-white text-xs font-medium"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSearching}
                  className="px-5 py-3 rounded-2xl bg-gold hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider shrink-0 cursor-pointer shadow-md"
                >
                  {isSearching ? 'Searching...' : 'Search'}
                </button>
              </form>
              <p className="text-[10px] text-slate-400 mt-1 font-light">
                Tip: Enter the phone number or confirmation code used when booking your table.
              </p>
            </div>

            {cancelSuccessMsg && (
              <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{cancelSuccessMsg}</span>
              </div>
            )}

            {/* Results List */}
            <div className="space-y-3 pt-1">
              <h4 className="text-xs font-serif font-bold text-amber-200 uppercase tracking-wider flex items-center justify-between">
                <span>Matching Reservations ({searchResults.length})</span>
                {searchQuery && (
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      handleSearchReservations('');
                    }}
                    className="text-[10px] text-slate-400 hover:text-white underline font-sans"
                  >
                    View All
                  </button>
                )}
              </h4>

              {isSearching ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <span>Looking up reservation records...</span>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="p-6 rounded-2xl glass border border-white/10 text-center space-y-3">
                  <AlertCircle className="w-8 h-8 text-amber-400/80 mx-auto" />
                  <div>
                    <h5 className="font-serif font-bold text-white text-sm">No Reservation Found</h5>
                    <p className="text-xs text-slate-400 font-light mt-0.5">
                      {hasSearched && searchQuery 
                        ? `We couldn't find any reservation for "${searchQuery}". Please check your phone number or confirmation code.`
                        : 'No upcoming reservations found in the system.'}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setModalMode('book');
                      setStep(1);
                    }}
                    className="px-5 py-2.5 rounded-full bg-gold text-slate-950 font-bold text-xs uppercase tracking-wider inline-block"
                  >
                    Book A Table Now
                  </button>
                </div>
              ) : (
                searchResults.map((res) => (
                  <div key={res.id} className="glass-card p-4 rounded-2xl border border-white/15 shadow-xl space-y-3 text-xs">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-amber-300 glass px-2 py-0.5 rounded border border-amber-500/30">
                          #{res.id}
                        </span>
                        <button 
                          onClick={() => copyCode(res.id)}
                          className="text-slate-400 hover:text-white"
                          title="Copy Code"
                        >
                          {copiedId === res.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        res.status === 'confirmed' 
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      }`}>
                        {res.status || 'Confirmed'}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="grid grid-cols-2 gap-2 text-slate-300 font-light">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase tracking-wider">Guest Name</span>
                        <strong className="text-white text-sm font-serif">{res.customerName}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase tracking-wider">Phone</span>
                        <strong className="text-white">{res.phone}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase tracking-wider">Date & Time</span>
                        <strong className="text-white">{res.date} at {res.time}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase tracking-wider">Party Size & Seating</span>
                        <strong className="text-white">{res.guests} Guests ({res.seatingArea?.replace('_', ' ') || 'Indoor'})</strong>
                      </div>
                    </div>

                    {(res.specialRequests || res.specialOccasion || res.notes) && (
                      <div className="bg-black/30 p-2.5 rounded-xl border border-white/5 text-[11px] text-amber-200/90 font-light">
                        <span className="font-bold">Notes: </span>
                        {res.specialRequests || res.specialOccasion || res.notes}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-1 border-t border-white/10">
                      <span className="text-[10px] text-slate-400 font-light">
                        Booked for {RESTAURANT_INFO.name}
                      </span>
                      <button
                        onClick={() => handleCancelReservation(res.id)}
                        className="px-3 py-1.5 rounded-xl glass border border-red-500/30 text-red-300 hover:bg-red-500/20 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Cancel Booking</span>
                      </button>
                    </div>

                  </div>
                ))
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
