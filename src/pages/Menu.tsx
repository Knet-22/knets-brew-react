import { useMemo, useState } from 'react'
import ProductCard from '../components/ProductCard'
import SectionHeading from '../components/SectionHeading'
import { products } from '../data/products'

export default function Menu() {
  const categories = useMemo(
    () => ['All', ...Array.from(new Set(products.map((product) => product.category)))],
    [],
  )
  const [activeCategory, setActiveCategory] = useState('All')
  const filtered = activeCategory === 'All' ? products : products.filter((product) => product.category === activeCategory)

  return (
    <div className="space-y-16">
      <section className="space-y-6">
        <SectionHeading
          eyebrow="Menu"
          title="Browse our rare and handcrafted coffee selections."
          description="From single-origin legends to our signature house blend, every option is served with the Knet’s Brew standard of elegance."
        />
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`rounded-full border px-5 py-3 text-sm uppercase tracking-[0.24em] transition ${
                activeCategory === category
                  ? 'border-gold-primary bg-gold-primary/10 text-gold-primary'
                  : 'border-white/10 bg-white/5 text-cream/80 hover:border-gold-primary hover:text-gold-primary'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <section>
        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  )
}
