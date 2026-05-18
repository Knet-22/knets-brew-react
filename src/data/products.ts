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
export const CAFE_HOURS = 'Mon–Fri: 8AM–10PM'

export const CATEGORY_ICONS: Record<string, string> = {
  'Coffee Collection': '🌿',
  'Espresso Collection': '☕',
  'Pastries': '🥐',
  'Signature Specials & Matcha': '✨',
}

export const products: Product[] = [
  // Coffee Collection
  {
    id: 'kopi-luwak',
    name: 'Kopi Luwak',
    category: 'Coffee Collection',
    price: 650,
    description: 'The world\'s most exotic coffee — smooth, earthy, and utterly unforgettable.',
    stock: 10,
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80',
    origin: 'Indonesia',
    featured: true,
  },
  {
    id: 'black-ivory',
    name: 'Black Ivory',
    category: 'Coffee Collection',
    price: 1080,
    description: 'Ultra-rare elephant-processed coffee with a naturally sweet, chocolatey profile.',
    stock: 10,
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80',
    origin: 'Thailand',
    featured: true,
  },
  {
    id: 'panama-geisha',
    name: 'Panama Geisha',
    category: 'Coffee Collection',
    price: 470,
    description: 'An award-winning floral masterpiece bursting with jasmine and tropical fruit.',
    stock: 10,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80',
    origin: 'Panama',
    featured: true,
  },
  {
    id: 'blue-mountain',
    name: 'Blue Mountain',
    category: 'Coffee Collection',
    price: 400,
    description: 'Jamaica\'s legendary highland brew — mild, balanced, silky smooth.',
    stock: 12,
    image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=900&q=80',
    origin: 'Jamaica',
  },
  // Espresso Collection
  {
    id: 'cappuccino',
    name: 'Cappuccino',
    category: 'Espresso Collection',
    price: 180,
    description: 'Classic Italian-style cappuccino with velvety microfoam and rich espresso.',
    stock: 15,
    image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=900&q=80',
    origin: 'Italy',
  },
  {
    id: 'latte',
    name: 'Latte',
    category: 'Espresso Collection',
    price: 160,
    description: 'Smooth and creamy with a gentle espresso finish.',
    stock: 20,
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80',
    origin: 'Italy',
  },
  {
    id: 'espresso',
    name: 'Espresso',
    category: 'Espresso Collection',
    price: 120,
    description: 'Bold, intense, and pure — a single or double shot of premium craftsmanship.',
    stock: 25,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80',
    origin: 'Italy',
  },
  // Pastries
  {
    id: 'croissant',
    name: 'Croissant',
    category: 'Pastries',
    price: 120,
    description: 'Buttery, flaky, and perfectly laminated. A timeless French classic.',
    stock: 18,
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80',
    origin: 'France',
  },
  {
    id: 'chocolate-croissant',
    name: 'Chocolate Croissant',
    category: 'Pastries',
    price: 140,
    description: 'Golden croissant filled with rich dark chocolate — pure indulgence.',
    stock: 12,
    image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=900&q=80',
    origin: 'France',
  },
  {
    id: 'cheesecake',
    name: 'Cheesecake',
    category: 'Pastries',
    price: 180,
    description: 'Creamy, tangy, and perfectly balanced — a dessert lover\'s dream.',
    stock: 8,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80',
    origin: 'USA',
  },
  // Signature Specials & Matcha
  {
    id: 'matcha-latte',
    name: 'Matcha Latte',
    category: 'Signature Specials & Matcha',
    price: 200,
    description: 'Vibrant ceremonial-grade matcha blended with steamed milk. Earthy, smooth, uplifting.',
    stock: 10,
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80',
    origin: 'Japan',
  },
  {
    id: 'gold-latte',
    name: 'Gold Latte',
    category: 'Signature Specials & Matcha',
    price: 220,
    description: 'Turmeric-infused latte with warming spices. Anti-inflammatory and luxurious.',
    stock: 14,
    image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=900&q=80',
    origin: 'India',
  },
  {
    id: 'boholano-special',
    name: 'Boholano Special',
    category: 'Signature Specials & Matcha',
    price: 250,
    description: 'Our signature blend celebrating local Bohol flavors. Unique, memorable, ours alone.',
    stock: 6,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80',
    origin: 'Philippines',
  },
]
