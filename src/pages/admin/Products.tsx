import { useState, type ChangeEvent } from 'react'
import Modal from '../../components/ui/Modal'
import type { Product } from '../../data/products'
import { CATEGORY_GRADIENTS, CATEGORY_ICONS } from '../../data/products'
import { useProducts } from '../../context/ProductsContext'

const EMPTY_FORM = { name: '', category: '', description: '', price: '', stock: '', image: '' }

function ProductPlaceholder({ category }: { category: string }) {
  const gradient = CATEGORY_GRADIENTS[category] ?? 'from-stone-900 via-stone-800 to-zinc-900'
  const icon = CATEGORY_ICONS[category] ?? '☕'
  return (
    <div className={`flex h-full w-full flex-col items-center justify-center bg-gradient-to-br ${gradient} gap-2`}>
      <span className="text-3xl opacity-50">{icon}</span>
      <p className="text-[0.6rem] uppercase tracking-[0.3em] text-cream/25">No image</p>
    </div>
  )
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
        checked ? 'bg-gold-primary' : 'bg-white/20'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${
          checked ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  )
}

export default function AdminProducts() {
  const { products, addProduct, updateProduct, deleteProduct, toggleAvailable } = useProducts()
  const [filter, setFilter] = useState('All')
  const [editing, setEditing] = useState<Product | null>(null)
  const [addingNew, setAddingNew] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [newForm, setNewForm] = useState(EMPTY_FORM)

  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))]
  const filtered = filter === 'All' ? products : products.filter((p) => p.category === filter)
  const lowStockItems = products.filter((p) => p.stock > 0 && p.stock <= 5)
  const outOfStockItems = products.filter((p) => p.stock === 0)

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

  const closeEditor = () => setEditing(null)

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>, target: 'edit' | 'new') => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        if (target === 'edit') setForm((p) => ({ ...p, image: reader.result as string }))
        else setNewForm((p) => ({ ...p, image: reader.result as string }))
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSave = () => {
    if (!editing) return
    updateProduct(editing.id, {
      name: form.name.trim() || editing.name,
      category: form.category.trim() || editing.category,
      description: form.description.trim() || editing.description,
      price: form.price !== '' ? Number(form.price) : editing.price,
      stock: form.stock !== '' ? Number(form.stock) : editing.stock,
      image: form.image,
    })
    closeEditor()
  }

  const handleAddProduct = () => {
    if (!newForm.name.trim() || !newForm.category.trim()) return
    addProduct({
      name: newForm.name.trim(),
      category: newForm.category.trim(),
      description: newForm.description.trim(),
      price: newForm.price !== '' ? Number(newForm.price) : 0,
      stock: newForm.stock !== '' ? Number(newForm.stock) : 0,
      image: newForm.image,
      available: true,
    })
    setNewForm(EMPTY_FORM)
    setAddingNew(false)
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-cream-muted">Management</p>
          <h1 className="mt-2 text-4xl font-semibold text-cream">Products</h1>
          <p className="mt-2 text-sm text-cream-muted">{products.length} items · Changes are saved automatically.</p>
        </div>
        <button
          type="button"
          onClick={() => setAddingNew(true)}
          className="inline-flex items-center gap-2 rounded-full bg-gold-light px-5 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-bg-main shadow-[0_0_14px_rgba(196,154,108,0.3)] transition hover:bg-gold-primary"
        >
          <i className="fa-solid fa-plus text-xs" />
          Add product
        </button>
      </div>

      {/* Stock alerts */}
      {(lowStockItems.length > 0 || outOfStockItems.length > 0) && (
        <div className="space-y-2">
          {outOfStockItems.length > 0 && (
            <div className="flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
              <i className="fa-solid fa-circle-xmark shrink-0" />
              <span>
                <strong>{outOfStockItems.length} item{outOfStockItems.length > 1 ? 's' : ''} out of stock:</strong>{' '}
                {outOfStockItems.map((p) => p.name).join(', ')}
              </span>
            </div>
          )}
          {lowStockItems.length > 0 && (
            <div className="flex items-center gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-sm text-amber-400">
              <i className="fa-solid fa-triangle-exclamation shrink-0" />
              <span>
                <strong>{lowStockItems.length} item{lowStockItems.length > 1 ? 's' : ''} running low:</strong>{' '}
                {lowStockItems.map((p) => `${p.name} (${p.stock} left)`).join(', ')}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setFilter(cat)}
            className={`rounded-full border px-4 py-2 text-sm uppercase tracking-[0.22em] transition ${
              filter === cat
                ? 'border-gold-primary bg-gold-primary/10 text-gold-primary'
                : 'border-white/10 bg-white/5 text-cream/70 hover:border-gold-primary hover:text-gold-primary'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product grid */}
      <div className="surface-glow rounded-[2rem] border border-white/10 bg-bg-surface/90 p-6 shadow-soft sm:p-8">
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((product) => {
            const isAvailable = product.available !== false
            return (
              <div
                key={product.id}
                className={`overflow-hidden rounded-2xl border transition ${
                  isAvailable ? 'border-white/10 bg-white/5' : 'border-white/5 bg-white/[0.02] opacity-60'
                }`}
              >
                <div className="relative h-36 overflow-hidden bg-bg-main">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                  ) : (
                    <ProductPlaceholder category={product.category} />
                  )}
                  {/* Upload overlay */}
                  <label className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-1 bg-black/0 text-transparent transition hover:bg-black/60 hover:text-cream">
                    <i className="fa-solid fa-camera text-xl" />
                    <span className="text-xs uppercase tracking-[0.25em]">Upload image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (!file) return
                        const reader = new FileReader()
                        reader.onload = () => {
                          if (typeof reader.result === 'string') {
                            updateProduct(product.id, { image: reader.result })
                          }
                        }
                        reader.readAsDataURL(file)
                      }}
                    />
                  </label>
                  {!isAvailable && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <span className="rounded-full border border-white/20 bg-black/60 px-3 py-1 text-xs uppercase tracking-[0.25em] text-cream/50">
                        Unavailable
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-cream">{product.name}</h3>
                    {product.origin && (
                      <p className="text-xs text-cream-muted uppercase tracking-[0.28em]">{product.origin}</p>
                    )}
                  </div>
                  <p className="text-xs text-cream-muted leading-5 line-clamp-2">{product.description}</p>
                  <div className="space-y-3 border-t border-white/10 pt-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-base font-semibold text-gold-primary">₱{product.price}</p>
                        <p className={`text-xs ${product.stock === 0 ? 'text-red-400' : product.stock <= 5 ? 'text-amber-400' : 'text-cream-muted'}`}>
                          {product.stock === 0 ? 'Out of stock' : `Stock: ${product.stock}${product.stock <= 5 ? ' ⚠' : ''}`}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => openEditor(product)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-cream transition hover:border-gold-primary hover:text-gold-primary"
                          aria-label={`Edit ${product.name}`}
                        >
                          <i className="fa-solid fa-pencil text-xs" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteProduct(product.id)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-cream transition hover:border-red-500 hover:text-red-400"
                          aria-label={`Delete ${product.name}`}
                        >
                          <i className="fa-solid fa-trash text-xs" />
                        </button>
                      </div>
                    </div>
                    {/* Availability toggle */}
                    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                      <span className="text-xs uppercase tracking-[0.22em] text-cream-muted">
                        {isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                      <Toggle checked={isAvailable} onChange={() => toggleAvailable(product.id)} />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Edit modal */}
      <Modal open={Boolean(editing)} eyebrow="Products" title={editing ? `Edit ${editing.name}` : ''} onClose={closeEditor}>
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-2 block text-cream">Name</span>
              <input type="text" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-cream outline-none transition focus:border-gold-primary" />
            </label>
            <label className="block text-sm">
              <span className="mb-2 block text-cream">Category</span>
              <input type="text" value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-cream outline-none transition focus:border-gold-primary" />
            </label>
          </div>
          <label className="block text-sm">
            <span className="mb-2 block text-cream">Description</span>
            <textarea rows={3} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              className="w-full rounded-[1.5rem] border border-white/10 bg-white/5 px-4 py-3 text-cream outline-none transition focus:border-gold-primary" />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-2 block text-cream">Price (₱)</span>
              <input type="number" min="0" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-cream outline-none transition focus:border-gold-primary" />
            </label>
            <label className="block text-sm">
              <span className="mb-2 block text-cream">Stock</span>
              <input type="number" min="0" value={form.stock} onChange={(e) => setForm((p) => ({ ...p, stock: e.target.value }))}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-cream outline-none transition focus:border-gold-primary" />
            </label>
          </div>
          <label className="block text-sm">
            <span className="mb-2 block text-cream">Upload image</span>
            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'edit')}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-cream outline-none transition file:cursor-pointer file:rounded-full file:border-0 file:bg-gold-primary file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-bg-main hover:border-gold-primary/50" />
            <p className="mt-1.5 text-xs text-cream-muted">Or paste an image URL in the field below.</p>
          </label>
          <label className="block text-sm">
            <span className="mb-2 block text-cream">Image URL</span>
            <input type="text" value={form.image} onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))}
              placeholder="https://... or leave empty"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-cream outline-none transition focus:border-gold-primary" />
          </label>
          {form.image && (
            <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5">
              <p className="px-4 pb-2 pt-4 text-xs text-cream-muted">Preview</p>
              <img src={form.image} alt="Preview" className="h-44 w-full object-cover" />
            </div>
          )}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button type="button" onClick={closeEditor}
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-cream transition hover:border-gold-primary hover:text-gold-primary">
              Cancel
            </button>
            <button type="button" onClick={handleSave}
              className="inline-flex items-center justify-center rounded-2xl bg-gold-light px-5 py-3 text-sm font-semibold uppercase tracking-[0.24em] text-bg-main shadow-[0_0_20px_rgba(196,154,108,0.35)] transition hover:bg-gold-primary">
              Save changes
            </button>
          </div>
        </div>
      </Modal>

      {/* Add new product modal */}
      <Modal open={addingNew} eyebrow="Products" title="Add new product" onClose={() => { setAddingNew(false); setNewForm(EMPTY_FORM) }}>
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-2 block text-cream">Name <span className="text-red-400">*</span></span>
              <input type="text" value={newForm.name} onChange={(e) => setNewForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Hazelnut Latte"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-cream outline-none transition focus:border-gold-primary" />
            </label>
            <label className="block text-sm">
              <span className="mb-2 block text-cream">Category <span className="text-red-400">*</span></span>
              <input type="text" value={newForm.category} onChange={(e) => setNewForm((p) => ({ ...p, category: e.target.value }))}
                placeholder="e.g. Espresso Collection"
                list="category-options"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-cream outline-none transition focus:border-gold-primary" />
              <datalist id="category-options">
                {Array.from(new Set(products.map((p) => p.category))).map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </label>
          </div>
          <label className="block text-sm">
            <span className="mb-2 block text-cream">Description</span>
            <textarea rows={3} value={newForm.description} onChange={(e) => setNewForm((p) => ({ ...p, description: e.target.value }))}
              placeholder="Brief product description"
              className="w-full rounded-[1.5rem] border border-white/10 bg-white/5 px-4 py-3 text-cream outline-none transition focus:border-gold-primary" />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-2 block text-cream">Price (₱)</span>
              <input type="number" min="0" value={newForm.price} onChange={(e) => setNewForm((p) => ({ ...p, price: e.target.value }))}
                placeholder="0"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-cream outline-none transition focus:border-gold-primary" />
            </label>
            <label className="block text-sm">
              <span className="mb-2 block text-cream">Stock</span>
              <input type="number" min="0" value={newForm.stock} onChange={(e) => setNewForm((p) => ({ ...p, stock: e.target.value }))}
                placeholder="0"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-cream outline-none transition focus:border-gold-primary" />
            </label>
          </div>
          <label className="block text-sm">
            <span className="mb-2 block text-cream">Upload image</span>
            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'new')}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-cream outline-none transition file:cursor-pointer file:rounded-full file:border-0 file:bg-gold-primary file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-bg-main hover:border-gold-primary/50" />
            <p className="mt-1.5 text-xs text-cream-muted">Or paste an image URL below.</p>
          </label>
          <label className="block text-sm">
            <span className="mb-2 block text-cream">Image URL</span>
            <input type="text" value={newForm.image} onChange={(e) => setNewForm((p) => ({ ...p, image: e.target.value }))}
              placeholder="https://..."
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-cream outline-none transition focus:border-gold-primary" />
          </label>
          {newForm.image && (
            <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5">
              <p className="px-4 pb-2 pt-4 text-xs text-cream-muted">Preview</p>
              <img src={newForm.image} alt="Preview" className="h-44 w-full object-cover" />
            </div>
          )}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button type="button" onClick={() => { setAddingNew(false); setNewForm(EMPTY_FORM) }}
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-cream transition hover:border-gold-primary hover:text-gold-primary">
              Cancel
            </button>
            <button type="button" onClick={handleAddProduct} disabled={!newForm.name.trim() || !newForm.category.trim()}
              className="inline-flex items-center justify-center rounded-2xl bg-gold-light px-5 py-3 text-sm font-semibold uppercase tracking-[0.24em] text-bg-main shadow-[0_0_20px_rgba(196,154,108,0.35)] transition hover:bg-gold-primary disabled:cursor-not-allowed disabled:opacity-40">
              <i className="fa-solid fa-plus mr-2 text-xs" />
              Add product
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
