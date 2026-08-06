import express from 'express';
import path from 'path';
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
        aiClient = new GoogleGenAI({ apiKey });
      }
    }
    return aiClient;
  }

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'Bole Ethiopian Restaurant API' });
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
            model: 'gemini-2.5-flash',
            contents: [
              { role: 'user', parts: [{ text: `${systemInstruction}\nUser Question: ${message}` }] }
            ]
          });

          const reply = response.text || 'Welcome to Bole Ethiopian Restaurant! How may I assist you today?';
          res.json({ reply, source: 'gemini-2.5-flash' });
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
