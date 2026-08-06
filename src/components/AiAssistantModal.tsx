import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Mic, 
  MicOff, 
  Bot, 
  User, 
  Plus, 
  Check, 
  Globe, 
  HelpCircle,
  Flame,
  Leaf,
  ShieldCheck
} from 'lucide-react';
import { ChatMessage, MenuItem, Language } from '../types';
import { MENU_ITEMS, KNOWLEDGE_BASE } from '../data/restaurantData';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onAddToCart: (item: MenuItem, quantity: number, spice: string, injera: string, notes: string) => void;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  language,
  onAddToCart
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'chat' | 'quiz'>('chat');
  
  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: language === 'am'
        ? 'ሰላም! እኔ "ሰላም ኤአይ" ነኝ። የቦሌ የኢትዮጵያ ምግብ ቤት ዲጂታል አስተናጋጅ ነኝ። በምግብ ምርጫ፣ በሃላል ወይም በጾም ምግብ እንዴት ልረዳዎት?'
        : 'Selam! I am Selam AI, your digital Habesha concierge for Bole Ethiopian Restaurant Atlanta. Ask me about our dishes, allergens, 100% Halal meats, or teff Injera!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Dietary Matchmaker Quiz State
  const [quizSpice, setQuizSpice] = useState<'Mild' | 'Medium' | 'Hot'>('Medium');
  const [quizDiet, setQuizDiet] = useState<'Vegan' | 'Halal Meat' | 'Gluten-Free Only' | 'Any'>('Any');
  const [quizGroup, setQuizGroup] = useState<'Solo' | 'Couple (2)' | 'Group (3+)'>('Couple (2)');
  const [quizResult, setQuizResult] = useState<MenuItem[] | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, language })
      });
      const data = await res.json();

      // Check if message matches any menu items for recommendation cards
      const lower = text.toLowerCase();
      const matchedItems = MENU_ITEMS.filter(
        item => lower.includes(item.name.toLowerCase().split(' ')[0]) || lower.includes(item.id)
      );

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.reply || 'Thank you for reaching out to Bole Ethiopian Restaurant!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommendations: matchedItems.length > 0 ? matchedItems : undefined
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      // Local fallback in case network error
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: 'Bole Ethiopian Restaurant is located at 1583 Virginia Ave, Atlanta GA 30354 (5 mins from ATL airport). We offer 100% Halal meats, Gluten-Free Teff Injera, and Vegan Platters!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeechToggle = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser. Please type your message.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'am' ? 'am-ET' : 'en-US';
      recognition.start();
      setIsListening(true);

      recognition.onresult = (e: any) => {
        const transcript = e.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
    } catch (err) {
      setIsListening(false);
    }
  };

  const runDietaryQuiz = () => {
    let matches = [...MENU_ITEMS];

    if (quizDiet === 'Vegan') {
      matches = matches.filter(i => i.isVegan);
    } else if (quizDiet === 'Halal Meat') {
      matches = matches.filter(i => i.category === 'beef_lamb' || i.category === 'poultry');
    } else if (quizDiet === 'Gluten-Free Only') {
      matches = matches.filter(i => i.isGlutenFree);
    }

    if (quizGroup === 'Group (3+)' || quizGroup === 'Couple (2)') {
      const platter = matches.find(i => i.id === 'bole-royal-feast' || i.id === 'yetsom-beyaynetu');
      if (platter) {
        matches = [platter, ...matches.filter(m => m.id !== platter.id)];
      }
    }

    setQuizResult(matches.slice(0, 3));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="glass-card rounded-3xl max-w-xl w-full h-[600px] flex flex-col overflow-hidden border border-white/15 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="glass-gold text-white p-4 flex items-center justify-between border-b border-amber-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full glass flex items-center justify-center font-bold accent-gold border border-amber-400/40">
              <Sparkles className="w-5 h-5 accent-gold" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base flex items-center gap-2">
                <span>Selam AI Concierge</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-extrabold px-2 py-0.5 rounded-full uppercase border border-emerald-500/30">
                  Bilingual
                </span>
              </h3>
              <p className="text-xs text-slate-300 font-serif font-light">
                ቦሌ የኢትዮጵያ ምግብ ቤት ዲጂታል ረዳት
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 glass text-slate-300 hover:text-white rounded-full transition-colors border border-white/10 cursor-pointer"
            aria-label="Close Selam AI modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-white/10 glass text-xs font-semibold">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-3 text-center transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'chat'
                ? 'bg-gold text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>AI Concierge Chat</span>
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex-1 py-3 text-center transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'quiz'
                ? 'bg-gold text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Dietary & Dish Matchmaker</span>
          </button>
        </div>

        {/* TAB 1: AI CHAT */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col justify-between overflow-hidden bg-transparent">
            
            {/* Quick Prompts Bar */}
            <div className="p-2.5 glass border-b border-white/10 flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
              <span className="accent-gold font-bold shrink-0">Ask:</span>
              {[
                'I am vegan & celiac',
                'What is Doro Wat?',
                'Are meats 100% Halal?',
                'አማርኛ፡ የቤቱ ልዩ'
              ].map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(p)}
                  className="px-3 py-1 rounded-full glass border border-white/15 text-slate-200 whitespace-nowrap hover:border-amber-400 font-medium shrink-0 cursor-pointer"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 max-w-[85%] ${
                    msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      msg.sender === 'user' 
                        ? 'bg-gold text-slate-950 font-bold' 
                        : 'glass-gold text-amber-200 border border-amber-500/40'
                    }`}
                  >
                    {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div className="space-y-2">
                    <div
                      className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-gold text-slate-950 font-medium rounded-tr-none'
                          : 'glass-card text-slate-200 border border-white/10 rounded-tl-none'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <span className="block text-[10px] opacity-60 text-right mt-1">
                        {msg.timestamp}
                      </span>
                    </div>

                    {/* Recommendation Card Attachments */}
                    {msg.recommendations && msg.recommendations.length > 0 && (
                      <div className="space-y-2 pt-1">
                        {msg.recommendations.map((rec) => (
                          <div
                            key={rec.id}
                            className="glass-card p-2.5 rounded-2xl border border-white/15 flex items-center justify-between text-xs gap-2"
                          >
                            <div className="flex items-center gap-2">
                              <img src={rec.image} alt={rec.name} className="w-10 h-10 rounded-xl object-cover" />
                              <div>
                                <span className="font-serif font-bold text-white block">{rec.name}</span>
                                <span className="accent-gold font-bold">${rec.price.toFixed(2)}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => onAddToCart(rec, 1, 'Medium', 'Standard Mixed Teff', '')}
                              className="px-3 py-1 rounded-full bg-gold text-slate-950 font-bold hover:bg-amber-400 flex items-center gap-1 cursor-pointer"
                            >
                              <Plus className="w-3 h-3" /> Add
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-2 text-xs text-slate-300 glass p-3 rounded-2xl border border-white/10 w-fit">
                  <Sparkles className="w-4 h-4 accent-gold animate-spin" />
                  <span>Selam AI is crafting response...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 glass border-t border-white/10">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={
                    language === 'am' 
                      ? 'ጥያቄዎን እዚህ ይፃፉ... (Write query in Amharic/English)' 
                      : 'Ask Selam AI about menu, allergens, reservations...'
                  }
                  className="flex-1 px-4 py-3 rounded-2xl glass-input text-white text-xs sm:text-sm"
                />
                
                <button
                  type="button"
                  onClick={handleSpeechToggle}
                  className={`p-3 rounded-2xl border transition-colors cursor-pointer ${
                    isListening
                      ? 'bg-red-600 text-white border-red-600 animate-pulse'
                      : 'glass text-slate-300 hover:bg-white/10 border-white/10'
                  }`}
                  title="Voice Input"
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                <button
                  type="submit"
                  disabled={!inputText.trim() || loading}
                  className="p-3 rounded-2xl bg-gold hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

          </div>
        )}

        {/* TAB 2: DIETARY & DISH MATCHMAKER QUIZ */}
        {activeTab === 'quiz' && (
          <div className="flex-1 p-5 overflow-y-auto space-y-5 bg-transparent">
            <div className="text-center max-w-md mx-auto space-y-1">
              <h4 className="font-serif font-bold text-white text-lg">Find Your Perfect Habesha Feast</h4>
              <p className="text-xs text-slate-400 font-light">Select your preferences and our AI engine will generate the ideal customized dining plan.</p>
            </div>

            <div className="space-y-4">
              {/* Dietary Requirement */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Dietary Need
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {['Any', 'Vegan', 'Halal Meat', 'Gluten-Free Only'].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setQuizDiet(d as any)}
                      className={`p-2.5 rounded-2xl border text-center font-medium transition-all ${
                        quizDiet === d 
                          ? 'bg-gold text-slate-950 font-bold border-amber-300' 
                          : 'glass text-slate-300 border-white/10 hover:border-white/20'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Spice Tolerance */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Spice Tolerance
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {['Mild', 'Medium', 'Hot'].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setQuizSpice(s as any)}
                      className={`p-2.5 rounded-2xl border text-center font-medium transition-all ${
                        quizSpice === s 
                          ? 'bg-gold text-slate-950 font-bold border-amber-300' 
                          : 'glass text-slate-300 border-white/10 hover:border-white/20'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Group Size */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Party Size
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {['Solo', 'Couple (2)', 'Group (3+)'].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setQuizGroup(g as any)}
                      className={`p-2.5 rounded-2xl border text-center font-medium transition-all ${
                        quizGroup === g 
                          ? 'bg-gold text-slate-950 font-bold border-amber-300' 
                          : 'glass text-slate-300 border-white/10 hover:border-white/20'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={runDietaryQuiz}
                className="w-full py-3.5 rounded-full bg-gold hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Recommendations</span>
              </button>
            </div>

            {/* Quiz Results */}
            {quizResult && (
              <div className="pt-4 border-t border-white/10 space-y-3">
                <h5 className="font-serif font-bold text-white text-xs uppercase tracking-wider">
                  AI Recommended Items ({quizResult.length})
                </h5>

                <div className="space-y-2">
                  {quizResult.map((item) => (
                    <div key={item.id} className="p-3 glass-card rounded-2xl border border-white/15 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover" />
                        <div>
                          <h6 className="font-serif font-bold text-white text-xs">{item.name}</h6>
                          <span className="accent-gold font-bold text-xs">${item.price.toFixed(2)}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => onAddToCart(item, 1, quizSpice, 'Standard Mixed Teff', '')}
                        className="px-3.5 py-1.5 rounded-full bg-gold text-slate-950 text-xs font-bold hover:bg-amber-400 flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> Order
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
