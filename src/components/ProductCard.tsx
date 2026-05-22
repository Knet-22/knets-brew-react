import { useState } from 'react'
import type { Product } from '../data/products'
import { CATEGORY_GRADIENTS, CATEGORY_ICONS } from '../data/products'
import { formatCurrency } from '../lib/format'
import { useCart } from '../context/CartContext'

interface ProductCardProps {
  product: Product
}

function ProductImagePlaceholder({ category }: { category: string }) {
  const gradient = CATEGORY_GRADIENTS[category] ?? 'from-stone-900 via-stone-800 to-zinc-900'
  const icon = CATEGORY_ICONS[category] ?? '☕'

  return (
    <div className={`flex h-full w-full flex-col items-center justify-center bg-gradient-to-br ${gradient} gap-3`}>
      <span className="text-4xl opacity-60">{icon}</span>
      <p className="text-[0.65rem] uppercase tracking-[0.3em] text-cream/30">No image yet</p>
    </div>
  )
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      image: product.image,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-bg-surface/90 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-gold-primary/30 hover:shadow-glow">
      <div className="relative h-56 overflow-hidden bg-white/5 sm:h-64">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <ProductImagePlaceholder category={product.category} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <span className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-[0.65rem] uppercase tracking-[0.28em] text-cream backdrop-blur-sm">
          {product.category}
        </span>
        {product.origin && (
          <span className="absolute right-4 top-4 rounded-full bg-gold-primary/20 border border-gold-primary/30 px-3 py-1 text-[0.65rem] uppercase tracking-[0.28em] text-gold-primary backdrop-blur-sm">
            {product.origin}
          </span>
        )}
        {product.stock <= 5 && product.stock > 0 && (
          <span className="absolute bottom-4 left-4 rounded-full bg-amber-500/20 border border-amber-500/30 px-3 py-1 text-[0.65rem] uppercase tracking-[0.28em] text-amber-400">
            Only {product.stock} left
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <span className="rounded-full border border-white/20 bg-black/60 px-5 py-2 text-xs uppercase tracking-[0.3em] text-cream/60">
              Sold out
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col space-y-4 p-5 sm:p-6">
        <div>
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-xl font-semibold leading-tight text-cream">{product.name}</h3>
            <div className="shrink-0 text-lg font-semibold text-gold-primary">{formatCurrency(product.price)}</div>
          </div>
          <p className="mt-2 text-sm leading-6 text-cream/60">{product.description}</p>
        </div>

        <div className="mt-auto pt-2">
          <button
            type="button"
            disabled={product.stock === 0}
            onClick={handleAddToCart}
            className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.2em] transition disabled:cursor-not-allowed disabled:opacity-40 ${
              added
                ? 'bg-green-500/20 border border-green-500/40 text-green-400'
                : 'bg-gold-primary text-bg-main hover:bg-gold-light'
            }`}
          >
            {added ? (
              <>
                <i className="fa-solid fa-check text-xs" />
                Added to cart
              </>
            ) : (
              <>
                <i className="fa-solid fa-bag-shopping text-xs" />
                Add to cart
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  )
}
