import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  Utensils, 
  Calendar, 
  Users, 
  Bot, 
  TrendingUp, 
  Plus, 
  Check, 
  Trash2, 
  Edit, 
  Lock, 
  Unlock,
  DollarSign
} from 'lucide-react';
import { MenuItem, Reservation, CateringRequest, KnowledgeBaseItem } from '../types';
import { MENU_ITEMS, KNOWLEDGE_BASE, INITIAL_RESERVATIONS, INITIAL_CATERING_REQUESTS } from '../data/restaurantData';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [isAuthenticated, setIsAuthenticated] = useState(true); // Default unlocked for easy user evaluation
  const [pinInput, setPinInput] = useState('');
  const [activeTab, setActiveTab] = useState<'menu' | 'reservations' | 'catering' | 'ai_kb' | 'analytics'>('menu');

  // Admin Data State
  const [menuList, setMenuList] = useState<MenuItem[]>(MENU_ITEMS);
  const [reservations, setReservations] = useState<Reservation[]>(INITIAL_RESERVATIONS);
  const [cateringLeads, setCateringLeads] = useState<CateringRequest[]>(INITIAL_CATERING_REQUESTS);
  const [kbList, setKbList] = useState<KnowledgeBaseItem[]>(KNOWLEDGE_BASE);

  // New Menu Item Form State
  const [showAddMenuModal, setShowAddMenuModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newNameAmharic, setNewNameAmharic] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPrice, setNewPrice] = useState('19.99');
  const [newCategory, setNewCategory] = useState<any>('house_specials');
  const [newIsVegan, setNewIsVegan] = useState(false);
  const [newIsSpicy, setNewIsSpicy] = useState(false);

  // New Knowledge Base Q&A Form State
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '1234' || pinInput === 'bole') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid Manager Pin. Use "1234" to unlock.');
    }
  };

  const handleCreateMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;

    const newItem: MenuItem = {
      id: `item-${Date.now()}`,
      name: newName,
      nameAmharic: newNameAmharic || newName,
      description: newDesc || 'Delicious freshly prepared entree.',
      price: parseFloat(newPrice) || 19.99,
      category: newCategory,
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800',
      isVegan: newIsVegan,
      isSpicy: newIsSpicy,
      isGlutenFree: true,
      isHalal: true
    };

    try {
      await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      });
    } catch (err) {
      console.warn('API sync warning:', err);
    }

    setMenuList([newItem, ...menuList]);
    setShowAddMenuModal(false);
    setNewName('');
    setNewDesc('');
  };

  const handleDeleteMenuItem = async (id: string) => {
    try {
      await fetch(`/api/menu/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('API sync warning:', err);
    }
    setMenuList(menuList.filter(item => item.id !== id));
  };

  const handleCreateKbItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion || !newAnswer) return;

    const newKb: KnowledgeBaseItem = {
      id: `kb-${Date.now()}`,
      question: newQuestion,
      answer: newAnswer,
      category: 'menu'
    };

    try {
      await fetch('/api/kb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newKb)
      });
    } catch (err) {
      console.warn('API sync warning:', err);
    }

    setKbList([...kbList, newKb]);
    setNewQuestion('');
    setNewAnswer('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="glass-card rounded-3xl max-w-5xl w-full h-[650px] flex flex-col overflow-hidden border border-white/15 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="glass-gold text-white p-4 sm:p-5 flex items-center justify-between border-b border-amber-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full glass flex items-center justify-center font-bold text-amber-200 border border-amber-400/40">
              <ShieldAlert className="w-5 h-5 accent-gold" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base flex items-center gap-2">
                <span>Bole Admin Manager Dashboard</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-extrabold px-2 py-0.5 rounded-full uppercase border border-emerald-500/30">
                  Live System
                </span>
              </h3>
              <p className="text-xs text-slate-300 font-serif font-light">Manage Menu, AI Knowledge Base, Reservations & Analytics</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 glass text-slate-300 hover:text-white rounded-full transition-colors border border-white/10 cursor-pointer"
            aria-label="Close admin dashboard"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isAuthenticated ? (
          /* UNLOCK SCREEN */
          <div className="flex-1 flex items-center justify-center p-8 bg-transparent">
            <form onSubmit={handleUnlock} className="max-w-xs w-full glass-card p-6 rounded-3xl border border-white/15 shadow-2xl text-center space-y-4">
              <Lock className="w-12 h-12 accent-gold mx-auto" />
              <h4 className="font-serif font-bold text-white text-lg">Manager Security Access</h4>
              <p className="text-xs text-slate-400 font-light">Enter PIN <code className="glass px-2 py-0.5 rounded font-mono font-bold text-amber-300">1234</code> to access restaurant controls.</p>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Enter 4-digit PIN"
                className="w-full text-center py-3 rounded-2xl glass-input font-mono text-lg tracking-widest text-white"
              />
              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-gold text-slate-950 font-bold text-xs uppercase tracking-widest"
              >
                Unlock Dashboard
              </button>
            </form>
          </div>
        ) : (
          /* MAIN DASHBOARD CONTENT */
          <div className="flex-1 flex flex-col overflow-hidden bg-transparent">
            
            {/* Top Navigation Bar */}
            <div className="glass border-b border-white/10 px-4 flex items-center gap-2 overflow-x-auto text-xs font-bold scrollbar-none">
              {[
                { id: 'menu', label: `Menu Items (${menuList.length})`, icon: Utensils },
                { id: 'reservations', label: `Reservations (${reservations.length})`, icon: Calendar },
                { id: 'catering', label: `Catering Leads (${cateringLeads.length})`, icon: Users },
                { id: 'ai_kb', label: `AI Knowledge Base (${kbList.length})`, icon: Bot },
                { id: 'analytics', label: 'Analytics & Sales', icon: TrendingUp }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-3.5 px-3 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                      activeTab === tab.id
                        ? 'bg-gold text-slate-950 rounded-t-xl font-bold shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB 1: MENU MANAGEMENT */}
            {activeTab === 'menu' && (
              <div className="flex-1 p-5 overflow-y-auto space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-white text-sm uppercase tracking-wider">Restaurant Menu Items</h4>
                  <button
                    onClick={() => setShowAddMenuModal(true)}
                    className="px-4 py-2.5 rounded-full bg-gold text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-400 flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Dish</span>
                  </button>
                </div>

                <div className="glass-card rounded-2xl border border-white/15 overflow-hidden shadow-xl">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="glass text-amber-200 font-serif font-bold uppercase text-[10px] border-b border-white/10">
                      <tr>
                        <th className="p-3">Dish Name</th>
                        <th className="p-3">Amharic</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Price</th>
                        <th className="p-3">Tags</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-light">
                      {menuList.map((item) => (
                        <tr key={item.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-3 font-serif font-bold text-white flex items-center gap-2">
                            <img src={item.image} alt={item.name} className="w-8 h-8 rounded-lg object-cover" />
                            <span>{item.name}</span>
                          </td>
                          <td className="p-3 font-serif accent-gold font-bold">{item.nameAmharic}</td>
                          <td className="p-3 capitalize">{item.category.replace('_', ' ')}</td>
                          <td className="p-3 font-bold text-white">${item.price.toFixed(2)}</td>
                          <td className="p-3">
                            <div className="flex gap-1 text-[10px]">
                              {item.isVegan && <span className="glass border border-emerald-500/40 text-emerald-300 px-1.5 py-0.5 rounded font-bold">Vegan</span>}
                              {item.isSpicy && <span className="glass border border-red-500/40 text-red-300 px-1.5 py-0.5 rounded font-bold">Spicy</span>}
                            </div>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => setMenuList(menuList.filter(m => m.id !== item.id))}
                              className="text-red-400 hover:text-red-300 p-1 cursor-pointer"
                              title="Delete Item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 2: TABLE RESERVATIONS */}
            {activeTab === 'reservations' && (
              <div className="flex-1 p-5 overflow-y-auto space-y-4">
                <h4 className="font-serif font-bold text-white text-sm uppercase tracking-wider">Upcoming Dining Reservations</h4>

                <div className="grid sm:grid-cols-2 gap-4">
                  {reservations.map((res) => (
                    <div key={res.id} className="glass-card p-4 rounded-2xl border border-white/15 shadow-lg space-y-2 text-xs">
                      <div className="flex justify-between items-start">
                        <span className="font-mono font-bold accent-gold glass px-2 py-0.5 rounded border border-amber-500/30">#{res.id}</span>
                        <span className="glass border border-emerald-500/40 text-emerald-300 font-bold px-2 py-0.5 rounded uppercase text-[10px]">
                          {res.status}
                        </span>
                      </div>
                      <div>
                        <h5 className="font-serif font-bold text-white text-sm">{res.customerName}</h5>
                        <p className="text-slate-400 font-light">{res.phone} • {res.email}</p>
                      </div>
                      <div className="pt-2 border-t border-white/10 grid grid-cols-2 gap-1 text-slate-300 font-light">
                        <span>Date: <strong className="text-white">{res.date}</strong></span>
                        <span>Time: <strong className="text-white">{res.time}</strong></span>
                        <span>Guests: <strong className="text-white">{res.guests}</strong></span>
                        <span>Seating: <strong className="text-white">{res.seatingArea}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: CATERING LEADS */}
            {activeTab === 'catering' && (
              <div className="flex-1 p-5 overflow-y-auto space-y-4">
                <h4 className="font-serif font-bold text-white text-sm uppercase tracking-wider">Catering Inquiries & Proposals</h4>

                <div className="space-y-3">
                  {cateringLeads.map((cat) => (
                    <div key={cat.id} className="glass-card p-4 rounded-2xl border border-white/15 shadow-lg space-y-2 text-xs">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-serif font-bold text-white text-sm">{cat.name}</h5>
                          <span className="text-slate-400 font-light">{cat.phone} • {cat.email}</span>
                        </div>
                        <span className="glass border border-amber-500/40 text-amber-200 font-bold px-2 py-0.5 rounded uppercase text-[10px]">
                          {cat.packageType}
                        </span>
                      </div>
                      <p className="text-slate-300 font-light">Guest Count: <strong className="text-white">{cat.guestCount} Guests</strong> | Date: <strong className="text-white">{cat.eventDate}</strong></p>
                      {cat.notes && <p className="text-slate-400 italic">"{cat.notes}"</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: AI KNOWLEDGE BASE MANAGEMENT */}
            {activeTab === 'ai_kb' && (
              <div className="flex-1 p-5 overflow-y-auto space-y-5">
                <div className="glass p-4 rounded-2xl border border-amber-500/30 space-y-3">
                  <h4 className="font-serif font-bold accent-gold text-xs uppercase tracking-wider">
                    Train "Selam AI" Chatbot Knowledge Base
                  </h4>
                  <form onSubmit={handleCreateKbItem} className="space-y-2 text-xs">
                    <input
                      type="text"
                      required
                      placeholder="Question / Customer Query (e.g. Do you serve Ethiopian Honey Wine?)"
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-2xl glass-input text-white text-xs"
                    />
                    <textarea
                      rows={2}
                      required
                      placeholder="Official Restaurant Answer to train AI assistant..."
                      value={newAnswer}
                      onChange={(e) => setNewAnswer(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-2xl glass-input text-white text-xs"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 rounded-full bg-gold text-slate-950 font-bold hover:bg-amber-400 cursor-pointer text-xs uppercase tracking-wider"
                    >
                      Add Custom AI Rule
                    </button>
                  </form>
                </div>

                <div className="space-y-3">
                  {kbList.map((kb) => (
                    <div key={kb.id} className="glass-card p-4 rounded-2xl border border-white/15 text-xs space-y-1">
                      <h5 className="font-serif font-bold text-white">{kb.question}</h5>
                      <p className="text-slate-300 leading-relaxed font-light">{kb.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: ANALYTICS & OVERVIEW */}
            {activeTab === 'analytics' && (
              <div className="flex-1 p-5 overflow-y-auto space-y-6">
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="glass-card p-5 rounded-2xl border border-white/15 text-center space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Estimated Monthly Orders</span>
                    <span className="text-3xl font-serif font-bold accent-gold block">1,840</span>
                  </div>
                  <div className="glass-card p-5 rounded-2xl border border-white/15 text-center space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Most Popular Dish</span>
                    <span className="text-xl font-serif font-bold text-white block">Bole Royal Platter</span>
                  </div>
                  <div className="glass-card p-5 rounded-2xl border border-white/15 text-center space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Customer Rating</span>
                    <span className="text-3xl font-serif font-bold text-emerald-400 block">4.8 / 5.0★</span>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

      </div>

      {/* Add Dish Modal */}
      {showAddMenuModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card p-6 rounded-3xl max-w-md w-full space-y-4 border border-white/15 shadow-2xl">
            <h4 className="font-serif font-bold text-lg text-white">Add New Menu Dish</h4>
            <form onSubmit={handleCreateMenuItem} className="space-y-3 text-xs">
              <input
                type="text"
                required
                placeholder="Dish Name (English) *"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl glass-input text-white"
              />
              <input
                type="text"
                placeholder="Amharic Script Name (e.g. ዶሮ ወጥ)"
                value={newNameAmharic}
                onChange={(e) => setNewNameAmharic(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl glass-input text-white"
              />
              <input
                type="text"
                placeholder="Description"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl glass-input text-white"
              />
              <input
                type="number"
                step="0.01"
                placeholder="Price ($)"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl glass-input text-white"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddMenuModal(false)}
                  className="px-4 py-2.5 glass rounded-full text-slate-300 font-bold border border-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-gold text-slate-950 rounded-full font-bold uppercase tracking-wider text-xs cursor-pointer"
                >
                  Save Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
