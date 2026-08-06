import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Truck, 
  Store, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { CartItem, OrderStatus, Language } from '../types';
import { RESTAURANT_INFO } from '../data/restaurantData';

interface OrderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  language: Language;
}

export const OrderDrawer: React.FC<OrderDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  language
}) => {
  if (!isOpen) return null;

  const [orderType, setOrderType] = useState<'pickup' | 'delivery'>('pickup');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [tipPercentage, setTipPercentage] = useState(18);
  const [activeOrder, setActiveOrder] = useState<OrderStatus | null>(null);

  const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const tax = subtotal * 0.089; // GA state + local sales tax ~8.9%
  const tip = (subtotal * tipPercentage) / 100;
  const deliveryFee = orderType === 'delivery' ? 4.99 : 0;
  const grandTotal = subtotal + tax + tip + deliveryFee;

  const handleCheckout = async () => {
    if (!customerName || !phone) return;

    const newOrder: OrderStatus = {
      id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      customerName,
      type: orderType,
      address: orderType === 'delivery' ? address : RESTAURANT_INFO.fullAddress,
      items: [...cart],
      subtotal,
      tax,
      tip,
      total: grandTotal,
      status: 'preparing',
      estimatedTimeMinutes: orderType === 'pickup' ? 20 : 35,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          phone,
          address: orderType === 'delivery' ? address : RESTAURANT_INFO.fullAddress,
          type: orderType,
          items: cart,
          subtotal,
          tax,
          deliveryFee,
          tip,
          total: grandTotal
        })
      });
    } catch (err) {
      console.warn('Order API warning:', err);
    }

    setActiveOrder(newOrder);
    onClearCart();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-end">
      <div className="glass-card w-full max-w-md h-full flex flex-col shadow-2xl border-l border-white/15 animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="glass-gold text-white p-4 flex items-center justify-between border-b border-amber-500/30">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 accent-gold" />
            <h3 className="font-serif font-bold text-base">
              {activeOrder ? 'Live Order Status' : 'Your Order Bag'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 glass text-slate-300 hover:text-white rounded-full transition-colors border border-white/10 cursor-pointer"
            aria-label="Close order drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ACTIVE LIVE ORDER TRACKER VIEW */}
        {activeOrder ? (
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            <div className="text-center glass p-6 rounded-3xl border border-amber-500/30 space-y-3">
              <div className="w-12 h-12 glass-gold text-amber-200 rounded-full flex items-center justify-center mx-auto border border-amber-400/40">
                <Clock className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-bold accent-gold uppercase tracking-widest block">Order #{activeOrder.id}</span>
                <h4 className="text-xl font-serif font-bold text-white">Preparing Fresh in Kitchen</h4>
              </div>
              <p className="text-xs text-slate-300 font-light">
                Estimated {activeOrder.type === 'pickup' ? 'Pickup' : 'Delivery'} Time: <span className="font-bold text-white">{activeOrder.estimatedTimeMinutes} mins</span>
              </p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-300">
                <span>Received</span>
                <span className="accent-gold font-bold">Kitchen Preparing</span>
                <span className="text-slate-500">Ready</span>
              </div>
              <div className="w-full glass h-2.5 rounded-full overflow-hidden border border-white/10">
                <div className="bg-gold h-full w-2/3 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Order Items Summary */}
            <div className="glass-card rounded-2xl p-4 text-xs space-y-2 border border-white/10">
              <h5 className="font-serif font-bold text-white border-b border-white/10 pb-2">Order Items ({activeOrder.items.length})</h5>
              {activeOrder.items.map((it) => (
                <div key={it.id} className="flex justify-between text-slate-300 font-light">
                  <span>{it.quantity}x {it.menuItem.name}</span>
                  <span className="font-bold text-white">${it.totalPrice.toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t border-white/10 pt-2 flex justify-between font-bold text-sm text-white">
                <span>Total Paid</span>
                <span className="accent-gold">${activeOrder.total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => setActiveOrder(null)}
              className="w-full py-3.5 rounded-full bg-gold text-slate-950 font-bold text-xs uppercase tracking-widest cursor-pointer"
            >
              Start New Order
            </button>
          </div>
        ) : (
          /* CART ITEMS & CHECKOUT FORM */
          <div className="flex-1 flex flex-col justify-between overflow-hidden">
            
            {cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
                <ShoppingBag className="w-16 h-16 text-slate-500" />
                <h4 className="text-lg font-serif font-bold text-white">Your bag is currently empty</h4>
                <p className="text-xs text-slate-400 font-light max-w-xs">
                  Browse our authentic Ethiopian menu and add delicious entrees or honey Tej!
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-3 rounded-full bg-gold text-slate-950 font-bold text-xs uppercase tracking-widest cursor-pointer"
                >
                  Explore Menu
                </button>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                
                {/* Order Mode Toggle */}
                <div className="grid grid-cols-2 gap-2 p-1.5 glass rounded-2xl border border-white/10">
                  <button
                    type="button"
                    onClick={() => setOrderType('pickup')}
                    className={`py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      orderType === 'pickup' 
                        ? 'bg-gold text-slate-950 shadow-md' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Store className="w-3.5 h-3.5" /> Pickup (5m from ATL)
                  </button>

                  <button
                    type="button"
                    onClick={() => setOrderType('delivery')}
                    className={`py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      orderType === 'delivery' 
                        ? 'bg-gold text-slate-950 shadow-md' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Truck className="w-3.5 h-3.5" /> Delivery ($4.99)
                  </button>
                </div>

                {/* Cart Items List */}
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div 
                      key={item.id}
                      className="glass-card p-3 rounded-2xl border border-white/10 flex gap-3 text-xs justify-between"
                    >
                      <img 
                        src={item.menuItem.image} 
                        alt={item.menuItem.name} 
                        className="w-14 h-14 rounded-xl object-cover"
                      />

                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-start">
                          <h5 className="font-serif font-bold text-white">{item.menuItem.name}</h5>
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="text-slate-400 hover:text-red-400 p-0.5 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <p className="text-[11px] accent-gold font-medium">
                          {item.injeraType} • {item.spicePreference}
                        </p>

                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center gap-2 glass px-2 py-0.5 rounded-lg border border-white/10">
                            <button 
                              onClick={() => onUpdateQuantity(item.id, -1)}
                              className="font-bold text-slate-300 hover:text-white cursor-pointer"
                            >
                              -
                            </button>
                            <span className="font-bold text-white">{item.quantity}</span>
                            <button 
                              onClick={() => onUpdateQuantity(item.id, 1)}
                              className="font-bold text-slate-300 hover:text-white cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                          <span className="font-extrabold text-white">${item.totalPrice.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Checkout Inputs */}
                <div className="pt-3 border-t border-white/10 space-y-3 text-xs">
                  <h5 className="font-serif font-bold text-white uppercase tracking-wider">Contact & Delivery Details</h5>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Name *"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="px-3.5 py-2.5 rounded-2xl glass-input text-white text-xs"
                    />
                    <input
                      type="tel"
                      placeholder="Phone *"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="px-3.5 py-2.5 rounded-2xl glass-input text-white text-xs"
                    />
                  </div>

                  {orderType === 'delivery' && (
                    <input
                      type="text"
                      placeholder="Delivery Address *"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-2xl glass-input text-white text-xs"
                    />
                  )}

                  {/* Tip Selector */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Kitchen & Courier Tip</label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[15, 18, 20, 25].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setTipPercentage(t)}
                          className={`py-2 rounded-xl border text-center font-bold text-xs transition-all cursor-pointer ${
                            tipPercentage === t 
                              ? 'bg-gold text-slate-950 border-amber-300' 
                              : 'glass text-slate-300 border-white/10 hover:border-white/20'
                          }`}
                        >
                          {t}%
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* Footer Calculation & Checkout CTA */}
            {cart.length > 0 && (
              <div className="p-4 glass border-t border-white/10 space-y-3 text-xs">
                <div className="space-y-1 text-slate-300 font-light">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-white">${subtotal.toFixed(2)}</span>
                  </div>
                  {orderType === 'delivery' && (
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span className="font-semibold text-white">${deliveryFee.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Sales Tax (GA 8.9%)</span>
                    <span className="font-semibold text-white">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tip ({tipPercentage}%)</span>
                    <span className="font-semibold text-white">${tip.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base font-extrabold text-white border-t border-white/10 pt-2">
                    <span>Total</span>
                    <span className="accent-gold">${grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  disabled={!customerName || !phone}
                  onClick={handleCheckout}
                  className="w-full py-3.5 rounded-full bg-gold hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Checkout & Pay (${grandTotal.toFixed(2)})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
