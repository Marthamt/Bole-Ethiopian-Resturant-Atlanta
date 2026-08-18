import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini AI client lazily/safely
  let aiClient: GoogleGenAI | null = null;
  function getGenAI() {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
        aiClient = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build'
            }
          }
        });
      }
    }
    return aiClient;
  }

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'Bole Ethiopian Restaurant API' });
  });

  // In-Memory Data Store (Backend State)
  let menuDb: any[] = [
    {
      id: 'bole-royal-feast',
      name: 'Bole Royal Platter (Combination for 2-3)',
      nameAmharic: 'ቦሌ ሮያል ማዕድ',
      description: 'Our signature ultimate feast featuring Doro Wat, Special Beef Tibs, Minced Kitfo, and 5 classic vegetarian stews served atop soft teff Injera.',
      price: 46.99,
      category: 'house_specials',
      image: '/src/assets/images/bole_hero_platter_1786025858035.jpg',
      isPopular: true,
      isChefSpecial: true,
      isSpicy: true,
      spiceLevel: 2,
      isHalal: true,
      isGlutenFree: true,
      calories: 1450,
      allergens: ['Egg (in Doro Wat)'],
      ingredients: ['Chicken', 'Beef', 'Berbere', 'Niter Kibbeh', 'Split Peas', 'Lentils', 'Gomen', 'Teff Injera']
    },
    {
      id: 'doro-wat',
      name: 'Doro Wat (National Dish of Ethiopia)',
      nameAmharic: 'ዶሮ ወጥ',
      description: 'Tender slow-simmered chicken drumstick and hard-boiled egg infused in a rich berbere chili sauce with purified spiced butter (niter kibbeh) and cardamom.',
      price: 22.99,
      category: 'poultry',
      image: '/src/assets/images/bole_doro_wat_1786025879995.jpg',
      isPopular: true,
      isChefSpecial: true,
      isSpicy: true,
      spiceLevel: 2,
      isHalal: true,
      isGlutenFree: true,
      calories: 780,
      allergens: ['Egg', 'Dairy (Spiced Butter)'],
      ingredients: ['Chicken', 'Boiled Egg', 'Red Onion', 'Berbere Spice', 'Niter Kibbeh', 'Garlic', 'Ginger']
    },
    {
      id: 'yetsom-beyaynetu',
      name: 'Yetsom Beyaynetu (Grand Vegan Combo)',
      nameAmharic: 'የጾም በያይነቱ',
      description: 'A vibrant array of 6 house-made vegan stews: Misir Wat, Kik Alicha, Gomen, Atakilt Wat, Key Sir, and Shiro Wat served on fresh Injera.',
      price: 20.99,
      category: 'vegan_veggie',
      image: '/src/assets/images/bole_veggie_combo_1786025890712.jpg',
      isPopular: true,
      isVegan: true,
      isVegetarian: true,
      isGlutenFree: true,
      isHalal: true,
      calories: 620,
      allergens: [],
      ingredients: ['Red Lentils', 'Yellow Peas', 'Collard Greens', 'Cabbage', 'Carrots', 'Beets', 'Chickpea Flour', 'Teff Injera']
    },
    {
      id: 'special-kitfo',
      name: 'Bole Special Kitfo',
      nameAmharic: 'ቦሌ ስፔሻል ክትፎ',
      description: 'Lean prime minced beef seasoned with fragrant mitmita chili powder and warm herbal niter kibbeh. Served with Ayib cottage cheese and Gomen.',
      price: 24.99,
      category: 'beef_lamb',
      image: '/src/assets/images/bole_special_kitfo_1786572817122.jpg',
      isPopular: true,
      isChefSpecial: true,
      isSpicy: true,
      spiceLevel: 3,
      isHalal: true,
      isGlutenFree: true,
      calories: 890,
      allergens: ['Dairy (Ayib & Butter)'],
      ingredients: ['Prime Tender Beef', 'Mitmita Chili', 'Niter Kibbeh', 'Ayib Cheese', 'Gomen Greens']
    },
    {
      id: 'sizzling-beef-tibs',
      name: 'Sizzling Beef Tibs (Zilzil / Shekla)',
      nameAmharic: 'የበሬ ጥብስ',
      description: 'Tender strips of beef sautéed at high heat with sliced onions, jalapenos, fresh rosemary, garlic, and tomato. Served piping hot in a clay burner.',
      price: 23.99,
      category: 'beef_lamb',
      image: '/src/assets/images/bole_sizzling_tibs_1786572586227.jpg',
      isPopular: true,
      isSpicy: true,
      spiceLevel: 1,
      isHalal: true,
      isGlutenFree: true,
      calories: 820,
      allergens: [],
      ingredients: ['Tender Beef', 'Red Onion', 'Jalapeño Pepper', 'Rosemary', 'Garlic', 'Ghee']
    },
    {
      id: 'lamb-awaze-tibs',
      name: 'Lamb Awaze Tibs',
      nameAmharic: 'የበግ አዋዜ ጥብስ',
      description: 'Succulent cubed prime lamb tossed with spicy Awaze berbere paste, red onions, garlic, and fresh herbs.',
      price: 25.99,
      category: 'beef_lamb',
      image: '/src/assets/images/bole_lamb_awaze_tibs_1787084021318.jpg',
      isChefSpecial: true,
      isSpicy: true,
      spiceLevel: 2,
      isHalal: true,
      isGlutenFree: true,
      calories: 860,
      allergens: [],
      ingredients: ['Prime Lamb', 'Awaze Berbere Sauce', 'Red Onion', 'Rosemary', 'Garlic']
    },
    {
      id: 'ethiopian-coffee-ceremony',
      name: 'Authentic Ethiopian Coffee Ceremony (Buna)',
      nameAmharic: 'የኢትዮጵያ ቡና ሥነ-ሥርዓት',
      description: 'Full traditional table-side coffee ritual using freshly roasted Yirgacheffe Arabica beans brewed in clay Jebena with frankincense smoke.',
      price: 16.99,
      category: 'beverages_wine',
      image: '/src/assets/images/bole_coffee_ceremony_1786025908713.jpg',
      isPopular: true,
      isChefSpecial: true,
      isVegan: true,
      isVegetarian: true,
      isGlutenFree: true,
      calories: 50,
      allergens: [],
      ingredients: ['Single Origin Ethiopian Coffee Beans', 'Frankincense', 'Popcorn']
    },
    {
      id: 'tej-honey-wine',
      name: 'House Tej (Ethiopian Honey Wine - Glass)',
      nameAmharic: 'ጠጅ',
      description: 'Authentic fermented honey wine crafted in-house with raw mountain honey and gesho leaf bittering agent. Smooth, floral, and semi-sweet.',
      price: 9.99,
      category: 'beverages_wine',
      image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=800',
      isPopular: true,
      isGlutenFree: true,
      calories: 180,
      allergens: [],
      ingredients: ['Pure Honey', 'Water', 'Gesho Leaves']
    }
  ];

  const RESERVATIONS_FILE = path.join(__dirname, 'reservations_store.json');

  let reservationsDb = [
    {
      id: 'RES-8921',
      customerName: 'Marcus Vance',
      email: 'marcus.vance@example.com',
      phone: '(404) 555-0192',
      guests: 4,
      date: '2026-08-10',
      time: '7:00 PM',
      seatingArea: 'Indoor Cultural Dining',
      specialRequests: 'Celebrating an anniversary. Coffee ceremony after dinner please!',
      status: 'confirmed',
      createdAt: new Date().toISOString()
    },
    {
      id: 'RES-9104',
      customerName: 'Dr. Selamawit T.',
      email: 'selam.t@example.com',
      phone: '(404) 555-0842',
      guests: 6,
      date: '2026-08-12',
      time: '6:30 PM',
      seatingArea: 'Traditional Mesob Low Seating',
      specialRequests: '3 guests require 100% Gluten-Free Teff Injera.',
      status: 'confirmed',
      createdAt: new Date().toISOString()
    }
  ];

  // Attempt to load existing stored reservations from disk
  try {
    if (fs.existsSync(RESERVATIONS_FILE)) {
      const fileData = fs.readFileSync(RESERVATIONS_FILE, 'utf-8');
      const parsed = JSON.parse(fileData);
      if (Array.isArray(parsed) && parsed.length > 0) {
        reservationsDb = parsed;
      }
    } else {
      fs.writeFileSync(RESERVATIONS_FILE, JSON.stringify(reservationsDb, null, 2));
    }
  } catch (err) {
    console.warn('Could not read reservations file:', err);
  }

  function saveReservationsToDisk() {
    try {
      fs.writeFileSync(RESERVATIONS_FILE, JSON.stringify(reservationsDb, null, 2));
    } catch (err) {
      console.warn('Could not save reservations file:', err);
    }
  }

  let cateringDb = [
    {
      id: 'CAT-102',
      name: 'Samantha Wright',
      email: 's.wright@atlcorp.com',
      phone: '(404) 555-8821',
      eventDate: '2026-09-15',
      guestCount: 45,
      packageType: 'Bole Royal Celebration Feast',
      notes: 'Corporate cultural appreciation luncheon near ATL airport. Need full coffee ceremony setup.',
      status: 'new',
      createdAt: new Date().toISOString()
    }
  ];

  let ordersDb: any[] = [];

  let kbDb = [
    {
      id: 'kb-1',
      question: 'Do you offer 100% Gluten-Free Injera?',
      answer: 'Yes! We prepare 100% pure Teff Injera on dedicated equipment upon request for guests with celiac or gluten sensitivity.',
      category: 'dietary'
    },
    {
      id: 'kb-2',
      question: 'How far is Bole Restaurant from Atlanta Airport (ATL)?',
      answer: 'We are located at 1583 Virginia Ave, Hapeville GA, which is exactly 5 minutes (2.1 miles) north of Hartsfield-Jackson Atlanta International Airport.',
      category: 'location'
    }
  ];

  // --- REST API ENDPOINTS ---

  // 1. Menu APIs
  app.get('/api/menu', (req, res) => {
    let result = [...menuDb];
    const { category, vegan, search } = req.query;

    if (category && category !== 'all') {
      result = result.filter(item => item.category === category);
    }
    if (vegan === 'true') {
      result = result.filter(item => item.isVegan);
    }
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      result = result.filter(item => 
        item.name.toLowerCase().includes(q) || 
        item.description.toLowerCase().includes(q) ||
        item.nameAmharic.includes(q)
      );
    }

    res.json({ success: true, count: result.length, items: result });
  });

  app.post('/api/menu', (req, res) => {
    const newItem = {
      id: `dish-${Date.now()}`,
      name: req.body.name || 'New Ethiopian Dish',
      nameAmharic: req.body.nameAmharic || 'አዲስ ምግብ',
      description: req.body.description || 'Delicious authentic preparation.',
      price: parseFloat(req.body.price) || 19.99,
      category: req.body.category || 'house_specials',
      image: req.body.image || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800',
      isPopular: !!req.body.isPopular,
      isChefSpecial: !!req.body.isChefSpecial,
      isVegan: !!req.body.isVegan,
      isVegetarian: !!req.body.isVegetarian,
      isGlutenFree: req.body.isGlutenFree !== false,
      isHalal: req.body.isHalal !== false,
      isSpicy: !!req.body.isSpicy,
      spiceLevel: req.body.spiceLevel || 0,
      calories: req.body.calories || 650,
      allergens: req.body.allergens || [],
      ingredients: req.body.ingredients || []
    };

    menuDb.unshift(newItem);
    res.status(201).json({ success: true, item: newItem });
  });

  app.delete('/api/menu/:id', (req, res) => {
    const { id } = req.params;
    menuDb = menuDb.filter(m => m.id !== id);
    res.json({ success: true, message: `Dish ${id} removed successfully` });
  });

  // 2. Reservation APIs
  app.get('/api/reservations', (req, res) => {
    let result = [...reservationsDb];
    const { query, phone, email, id } = req.query;

    if (id && typeof id === 'string') {
      result = result.filter(r => r.id.toLowerCase() === id.toLowerCase());
    } else if (phone && typeof phone === 'string') {
      const cleanPhone = phone.replace(/\D/g, '');
      result = result.filter(r => r.phone.replace(/\D/g, '').includes(cleanPhone));
    } else if (email && typeof email === 'string') {
      result = result.filter(r => r.email.toLowerCase() === email.toLowerCase());
    } else if (query && typeof query === 'string') {
      const q = query.toLowerCase().replace(/\D/g, '');
      const rawQ = query.toLowerCase();
      result = result.filter(r => 
        r.id.toLowerCase().includes(rawQ) ||
        r.customerName.toLowerCase().includes(rawQ) ||
        r.email.toLowerCase().includes(rawQ) ||
        (q && r.phone.replace(/\D/g, '').includes(q))
      );
    }

    res.json({ success: true, count: result.length, reservations: result });
  });

  app.post('/api/reservations', (req, res) => {
    const { customerName, email, phone, guests, date, time, seatingArea, specialRequests, specialOccasion, notes } = req.body;

    if (!customerName || !phone || !date || !time) {
      res.status(400).json({ success: false, error: 'Name, phone, date, and time are required' });
      return;
    }

    const newRes = {
      id: req.body.id || `RES-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName,
      email: email || '',
      phone,
      guests: parseInt(guests) || 2,
      date,
      time,
      seatingArea: seatingArea || 'Indoor Cultural Dining',
      specialRequests: specialRequests || specialOccasion || notes || '',
      specialOccasion: specialOccasion || '',
      notes: notes || '',
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    reservationsDb.unshift(newRes);
    saveReservationsToDisk();
    res.status(201).json({ success: true, reservation: newRes });
  });

  app.delete('/api/reservations/:id', (req, res) => {
    const { id } = req.params;
    const initialCount = reservationsDb.length;
    reservationsDb = reservationsDb.filter(r => r.id !== id);
    if (reservationsDb.length === initialCount) {
      res.status(404).json({ success: false, error: 'Reservation not found' });
      return;
    }
    saveReservationsToDisk();
    res.json({ success: true, message: `Reservation ${id} cancelled successfully` });
  });

  app.patch('/api/reservations/:id', (req, res) => {
    const { id } = req.params;
    const resIdx = reservationsDb.findIndex(r => r.id === id);
    if (resIdx === -1) {
      res.status(404).json({ success: false, error: 'Reservation not found' });
      return;
    }
    reservationsDb[resIdx] = { ...reservationsDb[resIdx], ...req.body };
    saveReservationsToDisk();
    res.json({ success: true, reservation: reservationsDb[resIdx] });
  });

  // 3. Catering APIs
  app.get('/api/catering', (req, res) => {
    res.json({ success: true, count: cateringDb.length, requests: cateringDb });
  });

  app.post('/api/catering', (req, res) => {
    const { name, email, phone, eventDate, guestCount, packageType, notes } = req.body;

    if (!name || !phone || !eventDate) {
      res.status(400).json({ success: false, error: 'Name, phone, and event date are required' });
      return;
    }

    const newCatering = {
      id: `CAT-${Math.floor(100 + Math.random() * 900)}`,
      name,
      email: email || '',
      phone,
      eventDate,
      guestCount: parseInt(guestCount) || 20,
      packageType: packageType || 'Custom Celebration',
      notes: notes || '',
      status: 'new',
      createdAt: new Date().toISOString()
    };

    cateringDb.unshift(newCatering);
    res.status(201).json({ success: true, catering: newCatering });
  });

  // 4. Order APIs
  app.post('/api/orders', (req, res) => {
    const { customerName, phone, address, type, items, subtotal, tax, deliveryFee, tip, total } = req.body;

    if (!customerName || !phone || !items || !items.length) {
      res.status(400).json({ success: false, error: 'Customer name, phone, and order items are required' });
      return;
    }

    const newOrder = {
      id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      customerName,
      phone,
      address: address || '',
      type: type || 'pickup',
      items,
      subtotal,
      tax,
      deliveryFee,
      tip,
      total,
      status: 'kitchen_preparing',
      estimatedTimeMinutes: type === 'pickup' ? 20 : 40,
      createdAt: new Date().toISOString()
    };

    ordersDb.unshift(newOrder);
    res.status(201).json({ success: true, order: newOrder });
  });

  app.get('/api/orders/:id', (req, res) => {
    const order = ordersDb.find(o => o.id === req.params.id);
    if (!order) {
      res.status(404).json({ success: false, error: 'Order not found' });
      return;
    }
    res.json({ success: true, order });
  });

  // 5. Knowledge Base APIs
  app.get('/api/kb', (req, res) => {
    res.json({ success: true, count: kbDb.length, items: kbDb });
  });

  app.post('/api/kb', (req, res) => {
    const { question, answer, category } = req.body;
    if (!question || !answer) {
      res.status(400).json({ success: false, error: 'Question and answer are required' });
      return;
    }

    const newKb = {
      id: `kb-${Date.now()}`,
      question,
      answer,
      category: category || 'custom'
    };

    kbDb.unshift(newKb);
    res.status(201).json({ success: true, kb: newKb });
  });

  // AI Chat & Assistant API Endpoint
  app.post('/api/ai/chat', async (req, res) => {
    try {
      const { message, language = 'en', history = [] } = req.body;

      if (!message || typeof message !== 'string') {
        res.status(400).json({ error: 'Message is required' });
        return;
      }

      const ai = getGenAI();

      if (ai) {
        try {
          const systemInstruction = `You are "Selam AI", the friendly, expert virtual concierge and cultural ambassador for Bole Ethiopian Restaurant in Atlanta/Hapeville, GA (1583 Virginia Ave, Atlanta GA 30354, Phone: 404-549-8583).
Key Facts about Bole Ethiopian Restaurant:
- Near Atlanta Airport (ATL) - 5 mins away.
- Menu highlights: Bole Royal Platter, Doro Wat (national chicken stew with egg), Special Kitfo (seasoned raw/medium beef with mitmita), Sizzling Beef/Lamb Tibs, Yetsom Beyaynetu (vegan 6-stew platter), Claypot Shiro Wat, Traditional Coffee Ceremony (Buna), House Tej (honey wine).
- Dietary: 100% Halal certified meats, 100% Teff Gluten-Free Injera option, rich vegan/vegetarian offerings.
- Language: You can understand and respond in English and Amharic (አማርኛ). If user speaks Amharic, reply warmly in Amharic script with English translation underneath.
- Tone: Extremely warm Habesha hospitality, helpful, appetite-inducing, respectful.
Provide concise, helpful answers in 2-4 sentences max. Recommend specific menu items when relevant.`;

          const response = await ai.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: [
              { role: 'user', parts: [{ text: `${systemInstruction}\nUser Question: ${message}` }] }
            ]
          });

          const reply = response.text || 'Welcome to Bole Ethiopian Restaurant! How may I assist you today?';
          res.json({ reply, source: 'gemini-3.6-flash' });
          return;
        } catch (geminiError) {
          console.warn('Gemini API call warning, using intelligent local fallback:', geminiError);
        }
      }

      // Intelligent Rule-Based Fallback Engine
      const lower = message.toLowerCase();
      let reply = '';

      if (lower.includes('amharic') || lower.includes('አማርኛ') || lower.includes('selam') || lower.includes('ሰላም')) {
        reply = 'ሰላም! እንኳን ወደ ቦሌ የኢትዮጵያ ምግብ ቤት በደህና መጡ። (Selam! Welcome to Bole Ethiopian Restaurant. How can I serve you today?)';
      } else if (lower.includes('airport') || lower.includes('atl') || lower.includes('location') || lower.includes('address')) {
        reply = 'We are located at 1583 Virginia Ave, Hapeville, GA 30354—just 5 minutes from Atlanta Airport (ATL) with free parking!';
      } else if (lower.includes('vegan') || lower.includes('vegetarian') || lower.includes('fasting')) {
        reply = 'Over 40% of our menu is 100% vegan! Our Yetsom Beyaynetu platter features 6 house stews (Misir Wat, Kik Alicha, Gomen, Atakilt, Key Sir, Shiro) served on fresh Injera.';
      } else if (lower.includes('gluten') || lower.includes('teff') || lower.includes('celiac')) {
        reply = 'Yes! We offer 100% pure gluten-free Teff Injera prepared upon request to ensure zero wheat cross-contamination.';
      } else if (lower.includes('spicy') || lower.includes('berbere') || lower.includes('hot')) {
        reply = 'Our dishes range from mild (Kik Alicha yellow split peas) to authentic berbere spice (Doro Wat) and fiery mitmita (Special Kitfo). We customize spice levels for every order!';
      } else if (lower.includes('hours') || lower.includes('open') || lower.includes('time')) {
        reply = 'We are open Monday–Thursday 11am–10pm, Friday–Saturday 11am–11pm, and Sunday 12pm–10pm!';
      } else {
        reply = `Welcome to Bole Ethiopian Restaurant! I recommend our signature Bole Royal Platter or Doro Wat. Would you like to reserve a table or view our online menu?`;
      }

      res.json({ reply, source: 'smart-fallback' });
    } catch (error) {
      console.error('Error handling AI chat:', error);
      res.status(500).json({ error: 'Failed to process chat request' });
    }
  });

  // Serve Vite in development mode or dist static assets in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Bole Ethiopian Restaurant server listening on http://localhost:${PORT}`);
  });
}

startServer();
