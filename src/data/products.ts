export interface Product {
  id: string
  name: string
  category: string
  price: number
  description: string
  stock: number
  image: string
  origin?: string
  featured?: boolean
}

export const CAFE_NAME = "Knet's Brew"
export const CAFE_ADDRESS = 'Ulbujan, Calape, Bohol'
export const CAFE_PHONE = '09663640516'
export const CAFE_HOURS = 'Mon–Sun: 8:00 AM – 10:00 PM'

export const CATEGORY_ICONS: Record<string, string> = {
  'Coffee Collection': '🌿',
  'Espresso Collection': '☕',
  'Pastries': '🥐',
  'Signature Specials & Matcha': '✨',
}

export const CATEGORY_GRADIENTS: Record<string, string> = {
  'Coffee Collection': 'from-amber-950 via-stone-800 to-stone-900',
  'Espresso Collection': 'from-zinc-900 via-stone-800 to-amber-950',
  'Pastries': 'from-orange-950 via-amber-900 to-stone-900',
  'Signature Specials & Matcha': 'from-emerald-950 via-stone-800 to-zinc-900',
}

export const products: Product[] = [
  // ── Coffee Collection ──────────────────────────────────────────────────────
  {
    id: 'kopi-luwak',
    name: 'Kopi Luwak',
    category: 'Coffee Collection',
    price: 650,
    description: "The world's most exotic coffee — smooth, earthy, and utterly unforgettable.",
    stock: 10,
    image: '',
    origin: 'Indonesia',
    featured: true,
  },
  {
    id: 'black-ivory',
    name: 'Black Ivory',
    category: 'Coffee Collection',
    price: 1080,
    description: 'Ultra-rare elephant-processed coffee with a naturally sweet, chocolatey profile.',
    stock: 8,
    image: '',
    origin: 'Thailand',
    featured: true,
  },
  {
    id: 'panama-geisha',
    name: 'Panama Geisha',
    category: 'Coffee Collection',
    price: 470,
    description: 'An award-winning floral masterpiece bursting with jasmine and tropical fruit.',
    stock: 12,
    image: '',
    origin: 'Panama',
    featured: true,
  },
  {
    id: 'blue-mountain',
    name: 'Blue Mountain',
    category: 'Coffee Collection',
    price: 400,
    description: "Jamaica's legendary highland brew — mild, balanced, silky smooth.",
    stock: 10,
    image: '',
    origin: 'Jamaica',
  },

  // ── Espresso Collection ────────────────────────────────────────────────────
  {
    id: 'house-espresso',
    name: 'House Espresso',
    category: 'Espresso Collection',
    price: 180,
    description: 'Our signature espresso blend — rich and bold, with a smooth caramel finish.',
    stock: 30,
    image: '',
  },
  {
    id: 'flat-white',
    name: 'Flat White',
    category: 'Espresso Collection',
    price: 220,
    description: 'Velvety microfoam poured over a ristretto shot for a perfectly balanced cup.',
    stock: 25,
    image: '',
  },
  {
    id: 'cafe-latte',
    name: 'Café Latte',
    category: 'Espresso Collection',
    price: 200,
    description: 'Silky steamed milk layered over a double shot of our premium house espresso.',
    stock: 25,
    image: '',
  },
  {
    id: 'cappuccino',
    name: 'Cappuccino',
    category: 'Espresso Collection',
    price: 195,
    description: 'Perfectly proportioned espresso, steamed milk, and velvety foam — the classic.',
    stock: 20,
    image: '',
  },

  // ── Signature Specials & Matcha ────────────────────────────────────────────
  {
    id: 'gold-cold-brew',
    name: 'Gold Cold Brew',
    category: 'Signature Specials & Matcha',
    price: 260,
    description: 'Slow-steeped 18 hours for a naturally sweet, ultra-smooth cold brew experience.',
    stock: 15,
    image: '',
  },
  {
    id: 'boholano-special',
    name: 'Boholano Special',
    category: 'Signature Specials & Matcha',
    price: 240,
    description: 'Our signature local pride — a Bohol-inspired blend with a warm tropical twist.',
    stock: 15,
    image: '',
  },
  {
    id: 'matcha-latte',
    name: 'Matcha Latte',
    category: 'Signature Specials & Matcha',
    price: 230,
    description: 'Ceremonial-grade Japanese matcha with oat milk for a calming, earthy indulgence.',
    stock: 18,
    image: '',
  },

  // ── Pastries ───────────────────────────────────────────────────────────────
  {
    id: 'butter-croissant',
    name: 'Butter Croissant',
    category: 'Pastries',
    price: 120,
    description: 'Perfectly laminated, golden flaky, and richly buttery through every layer.',
    stock: 20,
    image: '',
  },
  {
    id: 'dark-choco-cake',
    name: 'Dark Chocolate Cake',
    category: 'Pastries',
    price: 160,
    description: 'Rich Belgian dark chocolate ganache layered over a moist chocolate sponge.',
    stock: 12,
    image: '',
  },
  {
    id: 'classic-cheesecake',
    name: 'Classic Cheesecake',
    category: 'Pastries',
    price: 150,
    description: 'Velvety New York-style cheesecake with a buttery graham cracker crust.',
    stock: 10,
    image: '',
  },
]
