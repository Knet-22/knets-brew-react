import { products } from '../../data/products'
import { useState } from 'react'

export default function AdminProducts() {
  const [filter, setFilter] = useState('All')
  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))]
  const filtered = filter === 'All' ? products : products.filter((p) => p.category === filter)

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-cream-muted">Management</p>
        <h1 className="mt-2 text-4xl font-semibold text-cream">Products</h1>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setFilter(cat)}
            className={`rounded-full border px-4 py-2 text-sm uppercase tracking-[0.24em] transition ${
              filter === cat
                ? 'border-gold-primary bg-gold-primary/10 text-gold-primary'
                : 'border-white/10 bg-white/5 text-cream/70 hover:border-gold-primary hover:text-gold-primary'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="surface-glow rounded-[2rem] border border-white/10 bg-bg-surface/90 p-8 shadow-soft">
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((product) => (
            <div key={product.id} className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
              <img src={product.image} alt={product.name} className="h-40 w-full object-cover" />
              <div className="p-5 space-y-3">
                <div>
                  <h3 className="font-semibold text-cream">{product.name}</h3>
                  <p className="text-xs text-cream-muted uppercase tracking-[0.28em]">{product.origin}</p>
                </div>
                <p className="text-sm text-cream-muted leading-6">{product.description}</p>
                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <p className="text-lg font-semibold text-gold-primary">₱{product.price}</p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-white/10 text-cream transition hover:border-gold-primary hover:text-gold-primary"
                    >
                      <i className="fa-solid fa-pencil text-sm" />
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-white/10 text-cream transition hover:border-red-500 hover:text-red-400"
                    >
                      <i className="fa-solid fa-trash text-sm" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
