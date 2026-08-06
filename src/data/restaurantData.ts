import { MenuItem, Review, EventItem, KnowledgeBaseItem, CateringRequest, Reservation } from '../types';

export const RESTAURANT_INFO = {
  name: 'Bole Ethiopian Restaurant',
  nameAmharic: 'ቦሌ የኢትዮጵያ ምግብ ቤት',
  tagline: 'Authentic Habesha Culinary Heritage in Atlanta',
  address: '1583 Virginia Ave',
  city: 'Hapeville',
  state: 'GA',
  zip: '30354',
  fullAddress: '1583 Virginia Ave, Atlanta/Hapeville, GA 30354',
  phone: '(404) 549-8583',
  phoneFormatted: '+14045498583',
  email: 'info@boleethiopianrestaurantatlanta.com',
  hours: [
    { days: 'Monday - Thursday', time: '11:00 AM - 10:00 PM' },
    { days: 'Friday - Saturday', time: '11:00 AM - 11:00 PM' },
    { days: 'Sunday', time: '12:00 PM - 10:00 PM' }
  ],
  proximityNote: 'Located just 5 minutes from Hartsfield-Jackson Atlanta International Airport (ATL). Free parking available behind building.',
  googleMapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3319.49757656641!2d-84.41094052345863!3d33.66014383820252!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88f4fd24b0a4dfeb%3A0x86b039cb01c8bb9e!2s1583%20Virginia%20Ave%2C%20Hapeville%2C%20GA%2030354!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus',
  social: {
    instagram: 'https://instagram.com/bole_ethiopian_atlanta',
    facebook: 'https://facebook.com/boleethiopianrestaurantatlanta',
    yelp: 'https://yelp.com/biz/bole-ethiopian-restaurant-hapeville'
  }
};

// Generated images paths in app
export const IMAGES = {
  heroPlatter: '/src/assets/images/bole_hero_platter_1786025858035.jpg',
  ambiance: '/src/assets/images/bole_restaurant_ambiance_1786025869406.jpg',
  doroWat: '/src/assets/images/bole_doro_wat_1786025879995.jpg',
  veggieCombo: '/src/assets/images/bole_veggie_combo_1786025890712.jpg',
  coffeeCeremony: '/src/assets/images/bole_coffee_ceremony_1786025908713.jpg',
  // Fallback high quality food stock images for extra menu items
  kitfo: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800',
  tibs: 'https://images.unsplash.com/photo-1514944288352-fffac99f0bdf?auto=format&fit=crop&q=80&w=800',
  tejWine: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=800',
  baklava: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&q=80&w=800'
};

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'bole-royal-feast',
    name: 'Bole Royal Platter (Combination for 2-3)',
    nameAmharic: 'ቦሌ ሮያል ማዕድ',
    description: 'Our signature ultimate feast featuring Doro Wat, Special Beef Tibs, Minced Kitfo, and 5 classic vegetarian stews served atop soft teff Injera.',
    price: 46.99,
    category: 'house_specials',
    image: IMAGES.heroPlatter,
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
    image: IMAGES.doroWat,
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
    description: 'A vibrant array of 6 house-made vegan stews: Misir Wat (spicy lentils), Kik Alicha (yellow split peas), Gomen (collard greens), Atakilt Wat (cabbage & carrots), Key Sir (beetroot & potatoes), and Shiro Wat.',
    price: 20.99,
    category: 'vegan_veggie',
    image: IMAGES.veggieCombo,
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
    description: 'Lean prime minced beef seasoned with fragrant mitmita chili powder and warm herbal niter kibbeh. Served with Ayib (cottage cheese) and Gomen (chopped collards). Raw, medium, or cooked upon request.',
    price: 24.99,
    category: 'beef_lamb',
    image: IMAGES.kitfo,
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
    image: IMAGES.tibs,
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
    image: IMAGES.tibs,
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
    id: 'shiro-wat-claypot',
    name: 'Claypot Shiro Wat',
    nameAmharic: 'ሽሮ ወጥ',
    description: 'Slow-simmered velvety roasted chickpea and yellow split pea puree seasoned with garlic, ginger, berbere, and herbs served bubbling in a traditional clay pot.',
    price: 18.99,
    category: 'vegan_veggie',
    image: IMAGES.veggieCombo,
    isVegan: true,
    isVegetarian: true,
    isGlutenFree: true,
    isHalal: true,
    calories: 510,
    allergens: [],
    ingredients: ['Roasted Chickpea Flour', 'Berbere', 'Garlic', 'Ginger', 'Olive Oil']
  },
  {
    id: 'ethiopian-coffee-ceremony',
    name: 'Authentic Ethiopian Coffee Ceremony (Buna)',
    nameAmharic: 'የኢትዮጵያ ቡና ሥነ-ሥርዓት',
    description: 'Full traditional table-side coffee ritual using freshly roasted Yirgacheffe Arabica beans roasted in pan, brewed in clay Jebena, accompanied by fragrant frankincense smoke & popcorn.',
    price: 16.99,
    category: 'beverages_wine',
    image: IMAGES.coffeeCeremony,
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
    description: 'Authentic fermented honey wine crafted in-house with raw mountain honey and gesho (buckthorn leaf bittering agent). Smooth, floral, and semi-sweet.',
    price: 9.99,
    category: 'beverages_wine',
    image: IMAGES.tejWine,
    isPopular: true,
    isGlutenFree: true,
    calories: 180,
    allergens: [],
    ingredients: ['Pure Honey', 'Water', 'Gesho Leaves']
  },
  {
    id: 'baklava-honey-cardamom',
    name: 'Cardamom Honey Baklava',
    nameAmharic: 'ባክላቫ',
    description: 'Crisp layered filo pastry filled with roasted crushed walnuts and pistachios, drizzled with homemade cardamom and honey syrup.',
    price: 7.99,
    category: 'desserts',
    image: IMAGES.baklava,
    isVegetarian: true,
    calories: 340,
    allergens: ['Tree Nuts (Walnuts, Pistachios)', 'Wheat / Gluten', 'Dairy'],
    ingredients: ['Filo Dough', 'Walnuts', 'Pistachios', 'Honey', 'Cardamom', 'Butter']
  }
];

export const REVIEWS: Review[] = [
  {
    id: 'r1',
    author: 'Marcus Vance',
    rating: 5,
    date: '2 weeks ago',
    text: 'Hands down the best Ethiopian food in the entire Atlanta metro area! The Bole Royal Platter was unbelievable, and the 100% teff Injera was light and delicious. The coffee ceremony was unforgettable.',
    dishMentioned: 'Bole Royal Platter',
    verified: true
  },
  {
    id: 'r2',
    author: 'Dr. Selamawit T.',
    rating: 5,
    date: '1 month ago',
    text: 'As an Ethiopian living in Atlanta for 10 years, Bole tastes exactly like my grandmother’s kitchen in Addis Ababa. The Doro Wat berbere ratio is perfection and the Special Kitfo is unmatched.',
    dishMentioned: 'Doro Wat & Special Kitfo',
    verified: true
  },
  {
    id: 'r3',
    author: 'Jessica & David L.',
    rating: 5,
    date: '3 weeks ago',
    text: 'We stopped here right after landing at ATL airport—only 5 minutes away! The staff treated us like family, helped us pick vegan stews, and served delicious honey Tej.',
    dishMentioned: 'Yetsom Beyaynetu',
    verified: true
  }
];

export const EVENTS: EventItem[] = [
  {
    id: 'e1',
    title: 'Friday Night Live Ethio-Jazz & Strings',
    titleAmharic: 'የዓርብ ምሽት የቀጥታ ሙዚቃ',
    date: 'Every Friday',
    time: '7:30 PM - 10:30 PM',
    description: 'Enjoy smooth acoustic Ethio-Jazz music paired with authentic Tej honey wine and family-style dinner platters.',
    image: IMAGES.ambiance,
    tag: 'Live Entertainment'
  },
  {
    id: 'e2',
    title: 'Traditional Buna & Cultural Appreciation Workshop',
    titleAmharic: 'የቡናና የባህል ምሽት',
    date: 'First Sunday of Every Month',
    time: '3:00 PM - 5:00 PM',
    description: 'Learn the history of Ethiopian coffee origins, bean roasting techniques, and traditional Habesha etiquette from master coffee artisans.',
    image: IMAGES.coffeeCeremony,
    tag: 'Cultural Event'
  }
];

export const KNOWLEDGE_BASE: KnowledgeBaseItem[] = [
  {
    id: 'kb1',
    question: 'How do you eat Ethiopian food with Injera?',
    answer: 'Ethiopian food is traditionally eaten family-style using your right hand! Tear off a small piece of spongy Injera bread, wrap it lightly around your favorite stew or tibs, and bring it to your mouth. We also provide forks and spoons upon request.',
    category: 'culture'
  },
  {
    id: 'kb2',
    question: 'Do you offer 100% gluten-free Teff Injera?',
    answer: 'Yes! While our standard Injera uses a traditional blend, we offer 100% Pure Gluten-Free Teff Injera prepared in dedicated gluten-free containers upon request.',
    category: 'dietary'
  },
  {
    id: 'kb3',
    question: 'Is Bole Ethiopian Restaurant close to Atlanta Airport (ATL)?',
    answer: 'Yes! We are located at 1583 Virginia Ave, Hapeville, GA 30354—exactly 5 minutes from Atlanta Hartsfield-Jackson Airport (ATL), making us the perfect dining destination before or after flights.',
    category: 'hours'
  },
  {
    id: 'kb4',
    question: 'Are your meat items Halal certified?',
    answer: 'Yes, all beef, lamb, and chicken served at Bole Ethiopian Restaurant are 100% Halal certified.',
    category: 'dietary'
  },
  {
    id: 'kb5',
    question: 'Do you have vegan options?',
    answer: 'Ethiopia has a rich tradition of vegan fasting dishes (Yetsom). Over 40% of our menu is naturally plant-based, including Yetsom Beyaynetu, Misir Wat, Kik Alicha, and Claypot Shiro Wat.',
    category: 'dietary'
  }
];

export const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: 'res-101',
    customerName: 'Abebe Bikila',
    email: 'abebe@example.com',
    phone: '(404) 555-0192',
    date: '2026-08-08',
    time: '07:00 PM',
    guests: 4,
    seatingArea: 'mesob_traditional',
    specialOccasion: 'Birthday Celebration',
    status: 'confirmed',
    createdAt: '2026-08-05'
  },
  {
    id: 'res-102',
    customerName: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    phone: '(404) 555-0144',
    date: '2026-08-09',
    time: '06:30 PM',
    guests: 2,
    seatingArea: 'patio',
    specialOccasion: 'Anniversary',
    status: 'confirmed',
    createdAt: '2026-08-06'
  }
];

export const INITIAL_CATERING_REQUESTS: CateringRequest[] = [
  {
    id: 'cat-201',
    name: 'Emory Cultural Association',
    email: 'events@emory.edu',
    phone: '(404) 727-6123',
    eventDate: '2026-08-20',
    guestCount: 65,
    eventType: 'University Gala & Dinner',
    packageType: 'Royal Buffet Experience',
    notes: 'Require 30% vegan combo options and 100% teff gluten-free injera.',
    status: 'new',
    createdAt: '2026-08-04'
  }
];
