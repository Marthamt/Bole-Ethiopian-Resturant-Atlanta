import React, { useState } from 'react';
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
  User 
} from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantData';
import { Reservation, Language } from '../types';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onAddReservation: (res: Reservation) => void;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({
  isOpen,
  onClose,
  language,
  onAddReservation
}) => {
  if (!isOpen) return null;

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

  const timeSlots = [
    '12:00 PM', '01:00 PM', '02:00 PM', '05:00 PM', 
    '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM', '09:00 PM'
  ];

  const handleConfirmReservation = async () => {
    if (!customerName || !phone) return;

    const newRes: Reservation = {
      id: `RES-${Math.floor(100000 + Math.random() * 900000)}`,
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

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-card rounded-3xl max-w-lg w-full overflow-hidden border border-white/15 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="glass-gold text-white p-5 flex items-center justify-between border-b border-amber-500/30">
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

        {/* STEP 1: DATE, TIME & GUESTS */}
        {step === 1 && (
          <div className="p-6 space-y-5">
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
              Next: Guest Information
            </button>
          </div>
        )}

        {/* STEP 2: CONTACT DETAILS */}
        {step === 2 && (
          <div className="p-6 space-y-4">
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
              <p className="text-xs accent-gold font-bold font-mono mt-1">
                Code: #{createdReservation.id}
              </p>
            </div>

            <div className="glass p-5 rounded-2xl border border-white/10 text-xs text-slate-300 space-y-2.5 text-left font-light">
              <div className="flex justify-between">
                <span className="text-slate-400">Guest:</span>
                <span className="font-bold text-white">{createdReservation.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Date & Time:</span>
                <span className="font-bold text-white">{createdReservation.date} at {createdReservation.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Party Size:</span>
                <span className="font-bold text-white">{createdReservation.guests} People</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Seating:</span>
                <span className="font-bold text-white capitalize">{createdReservation.seatingArea.replace('_', ' ')}</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 font-light">
              An SMS confirmation was sent to {createdReservation.phone}. We look forward to serving you!
            </p>

            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-full bg-gold text-slate-950 font-bold text-xs uppercase tracking-widest"
            >
              Close & Return to Menu
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
