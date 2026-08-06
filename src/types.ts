export type Language = 'en' | 'am';

export type Category = 
  | 'all'
  | 'house_specials'
  | 'beef_lamb'
  | 'poultry'
  | 'vegan_veggie'
  | 'beverages_wine'
  | 'desserts';

export interface MenuItem {
  id: string;
  name: string;
  nameAmharic: string;
  description: string;
  descriptionAmharic?: string;
  price: number;
  category: Category;
  image: string;
  isSpicy?: boolean;
  spiceLevel?: 0 | 1 | 2 | 3; // 0=Mild, 1=Medium, 2=Hot, 3=Extra Hot
  isVegan?: boolean;
  isVegetarian?: boolean;
  isGlutenFree?: boolean; // 100% Teff option
  isPopular?: boolean;
  isChefSpecial?: boolean;
  isHalal?: boolean;
  calories?: number;
  allergens?: string[];
  ingredients?: string[];
}

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  spicePreference?: 'Mild' | 'Medium' | 'Authentic Hot' | 'Extra Berbere';
  injeraType?: 'Standard Mixed Teff' | '100% Gluten-Free Pure Teff';
  specialInstructions?: string;
  totalPrice: number;
}

export interface Reservation {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  seatingArea: 'indoor' | 'patio' | 'mesob_traditional';
  specialOccasion?: string;
  notes?: string;
  specialRequests?: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: string;
}

export interface CateringRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  eventDate: string;
  guestCount: number;
  eventType: string;
  packageType: string;
  notes?: string;
  status: 'new' | 'contacted' | 'booked';
  createdAt: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  text: string;
  dishMentioned?: string;
  verified: boolean;
  avatar?: string;
}

export interface EventItem {
  id: string;
  title: string;
  titleAmharic: string;
  date: string;
  time: string;
  description: string;
  image: string;
  tag: string;
}

export interface KnowledgeBaseItem {
  id: string;
  question: string;
  answer: string;
  category: 'menu' | 'hours' | 'parking' | 'dietary' | 'culture' | 'catering';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  recommendations?: MenuItem[];
  language?: Language;
}

export interface GiftCardOrder {
  recipientName: string;
  recipientEmail: string;
  senderName: string;
  amount: number;
  customMessage: string;
}

export interface OrderStatus {
  id: string;
  customerName: string;
  type: 'pickup' | 'delivery';
  address?: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  tip: number;
  total: number;
  status: 'received' | 'preparing' | 'ready' | 'completed';
  estimatedTimeMinutes: number;
  createdAt: string;
}
