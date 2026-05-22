import { useMemo, useState } from 'react'
import ProductCard from '../components/ProductCard'
import SectionHeading from '../components/SectionHeading'
import { useProducts } from '../context/ProductsContext'

export default function Menu() {
  const { products } = useProducts()
  const categories = useMemo(
    () => ['All', ...Array.from(new Set(products.map((p) => p.category)))],
    [products],
  )
  const [activeCategory, setActiveCategory] = useState('All')
  const filtered =
    activeCategory === 'All' ? products : products.filter((p) => p.category === activeCategory)

  return (
    <div className="space-y-12 sm:space-y-16">
      <section className="space-y-6">
        <SectionHeading
          eyebrow="Menu"
          title="Browse our rare and handcrafted coffee selections."
          description="From single-origin legends to our signature house blend, every option is served with the Knet's Brew standard of elegance."
        />

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {categories.map((category) => {
            const count =
              category === 'All'
                ? products.length
                : products.filter((p) => p.category === category).length
            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm uppercase tracking-[0.2em] transition sm:px-5 sm:py-3 ${
                  activeCategory === category
                    ? 'border-gold-primary bg-gold-primary/10 text-gold-primary'
                    : 'border-white/10 bg-white/5 text-cream/70 hover:border-gold-primary hover:text-gold-primary'
                }`}
              >
                {category}
                <span
                  className={`inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1 text-[0.6rem] font-bold ${
                    activeCategory === category
                      ? 'bg-gold-primary text-bg-main'
                      : 'bg-white/10 text-cream/50'
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      <section>
        {filtered.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-white/10 bg-white/5 p-16 text-center">
            <i className="fa-solid fa-mug-hot text-3xl text-gold-primary/30" />
            <p className="mt-4 text-lg font-semibold text-cream">No items in this category</p>
            <p className="mt-2 text-sm text-cream/50">
              Check back soon — our menu is always growing.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
