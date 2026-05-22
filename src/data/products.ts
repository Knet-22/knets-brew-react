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
    image: '/luwak.jpg',
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
    image: '/ivory.jpg',
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
    image: '/geisha.jpg',
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
    image: '/blue.jpg',
    origin: 'Jamaica',
    featured: true,
  },

  // ── Espresso Collection ────────────────────────────────────────────────────
  {
    id: 'caramel-gold-latte',
    name: 'Caramel Gold Latte',
    category: 'Espresso Collection',
    price: 220,
    description: 'Velvety espresso kissed with rich caramel and steamed milk — warm, indulgent, golden.',
    stock: 25,
    image: '/caramel.jpg',
  },
  {
    id: 'vanilla-bean-latte',
    name: 'Vanilla Bean Latte',
    category: 'Espresso Collection',
    price: 215,
    description: 'Real vanilla bean steeped into silky steamed milk over a smooth double espresso shot.',
    stock: 25,
    image: '/vanilla.jpg',
  },
  {
    id: 'velvet-cappuccino',
    name: 'Velvet Cappuccino',
    category: 'Espresso Collection',
    price: 195,
    description: 'Perfectly balanced espresso, steamed milk, and a thick velvety foam crown.',
    stock: 20,
    image: '/velvet.jpg',
  },

  // ── Signature Specials & Matcha ────────────────────────────────────────────
  {
    id: 'gold-leaf-latte',
    name: 'Gold Leaf Latte',
    category: 'Signature Specials & Matcha',
    price: 280,
    description: "Our signature luxury latte adorned with edible gold leaf — the crown jewel of Knet's Brew.",
    stock: 15,
    image: '/goldlatte.jpg',
  },
  {
    id: 'matcha-latte',
    name: 'Matcha Latte',
    category: 'Signature Specials & Matcha',
    price: 230,
    description: 'Ceremonial-grade Japanese matcha with oat milk for a calming, earthy indulgence.',
    stock: 18,
    image: '/matchalatte.jpg',
  },
  {
    id: 'golden-matcha-latte',
    name: 'Golden Matcha Latte',
    category: 'Signature Specials & Matcha',
    price: 260,
    description: 'Premium matcha meets golden turmeric and steamed milk — earthy, warm, and beautifully hued.',
    stock: 15,
    image: '/goldmatcha.jpg',
  },

  // ── Pastries ───────────────────────────────────────────────────────────────
  {
    id: 'almond-croissant',
    name: 'Almond Croissant',
    category: 'Pastries',
    price: 135,
    description: 'Flaky butter croissant filled with rich almond cream and topped with toasted slivered almonds.',
    stock: 18,
    image: '/almond.jpg',
  },
  {
    id: 'butter-croissant',
    name: 'Butter Croissant',
    category: 'Pastries',
    price: 120,
    description: 'Perfectly laminated, golden flaky, and richly buttery through every layer.',
    stock: 20,
    image: '/croissant.jpg',
  },
  {
    id: 'pain-au-chocolat',
    name: 'Pain au Chocolat',
    category: 'Pastries',
    price: 145,
    description: 'Crisp, buttery pastry wrapped around two bars of dark Belgian chocolate — a Parisian classic.',
    stock: 15,
    image: '/pain.jpg',
  },
  {
    id: 'matcha-cheesecake',
    name: 'Matcha Cheesecake',
    category: 'Pastries',
    price: 160,
    description: 'Velvety ceremonial matcha cheesecake with a buttery graham crust and a silky green finish.',
    stock: 10,
    image: '/cheesecake.jpg',
  },
]
