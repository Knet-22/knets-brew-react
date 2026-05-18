import { Link } from 'react-router-dom'
import type { Product } from '../data/products'
import { formatCurrency } from '../lib/format'
import { useCart } from '../context/CartContext'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()

  return (
    <article className="group overflow-hidden rounded-[2rem] border border-white/10 bg-bg-surface/90 shadow-soft transition hover:-translate-y-1 hover:shadow-glow">
      <div className="relative h-64 overflow-hidden bg-white/5">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-[0.7rem] uppercase tracking-[0.30em] text-cream text-opacity-90">
          {product.category}
        </span>
      </div>
      <div className="space-y-4 p-6">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-xl font-semibold text-cream">{product.name}</h3>
          <div className="text-right text-lg font-semibold text-gold-primary">{formatCurrency(product.price)}</div>
        </div>
        <p className="text-sm leading-6 text-cream-muted">{product.description}</p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <Link
            to="/order"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm uppercase tracking-[0.25em] text-cream transition hover:border-gold-primary hover:text-gold-primary"
          >
            Reserve now
          </Link>
          <button
            type="button"
            onClick={() => addItem({
              id: product.id,
              name: product.name,
              category: product.category,
              price: product.price,
              image: product.image,
            })}
            className="inline-flex items-center justify-center rounded-full bg-gold-primary px-5 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-bg-main transition hover:bg-gold-light"
          >
            Add
          </button>
        </div>
      </div>
    </article>
  )
}
