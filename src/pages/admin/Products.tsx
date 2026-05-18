import { products } from '../../data/products'
import { useState } from 'react'
import Modal from '../../components/ui/Modal'
import type { Product } from '../../data/products'

export default function AdminProducts() {
  const [filter, setFilter] = useState('All')
  const [productList, setProductList] = useState<Product[]>(products)
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    stock: '',
    image: '',
  })

  const categories = ['All', ...Array.from(new Set(productList.map((p) => p.category)))]
  const filtered = filter === 'All' ? productList : productList.filter((p) => p.category === filter)

  const openEditor = (product: Product) => {
    setEditing(product)
    setForm({
      name: product.name,
      category: product.category,
      description: product.description,
      price: String(product.price),
      stock: String(product.stock),
      image: product.image,
    })
  }

  const closeEditor = () => {
    setEditing(null)
  }

  const handleSave = () => {
    if (!editing) return
    setProductList((current) =>
      current.map((product) =>
        product.id === editing.id
          ? {
              ...product,
              name: form.name.trim() || product.name,
              category: form.category.trim() || product.category,
              description: form.description.trim() || product.description,
              price: Number(form.price) || product.price,
              stock: Number(form.stock) || product.stock,
              image: form.image.trim() || product.image,
            }
          : product,
      ),
    )
    closeEditor()
  }

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
                  {product.origin && (
                    <p className="text-xs text-cream-muted uppercase tracking-[0.28em]">{product.origin}</p>
                  )}
                </div>
                <p className="text-sm text-cream-muted leading-6">{product.description}</p>
                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <div>
                    <p className="text-lg font-semibold text-gold-primary">₱{product.price}</p>
                    <p className="text-xs text-cream-muted">Stock: {product.stock}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => openEditor(product)}
                      className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-white/10 text-cream transition hover:border-gold-primary hover:text-gold-primary"
                      aria-label={`Edit ${product.name}`}
                    >
                      <i className="fa-solid fa-pencil text-sm" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setProductList((current) => current.filter((item) => item.id !== product.id))}
                      className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-white/10 text-cream transition hover:border-red-500 hover:text-red-400"
                      aria-label={`Remove ${product.name}`}
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

      <Modal open={Boolean(editing)} title={editing ? `Edit ${editing.name}` : ''} onClose={closeEditor}>
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-2 block text-cream">Name</span>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-cream outline-none transition focus:border-gold-primary"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-2 block text-cream">Category</span>
              <input
                type="text"
                value={form.category}
                onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-cream outline-none transition focus:border-gold-primary"
              />
            </label>
          </div>

          <label className="block text-sm">
            <span className="mb-2 block text-cream">Description</span>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              className="w-full rounded-[1.5rem] border border-white/10 bg-white/5 px-4 py-3 text-cream outline-none transition focus:border-gold-primary"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block text-sm">
              <span className="mb-2 block text-cream">Price</span>
              <input
                type="number"
                min="0"
                value={form.price}
                onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-cream outline-none transition focus:border-gold-primary"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-2 block text-cream">Stock</span>
              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => setForm((prev) => ({ ...prev, stock: e.target.value }))}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-cream outline-none transition focus:border-gold-primary"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-2 block text-cream">Image URL</span>
              <input
                type="text"
                value={form.image}
                onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-cream outline-none transition focus:border-gold-primary"
              />
            </label>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={closeEditor}
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-cream transition hover:border-gold-primary hover:text-gold-primary"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center justify-center rounded-2xl bg-gold-primary px-5 py-3 text-sm font-semibold uppercase tracking-[0.24em] text-bg-main transition hover:bg-gold-light"
            >
              Save changes
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
