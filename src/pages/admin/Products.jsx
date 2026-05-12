import { useEffect, useState } from 'react'
import { supabase, peso } from '../../lib/supabase.js'

const BLANK = {
  id: null, name: '', description: '', price: '', stock: 20,
  category: 'Espresso Collection', is_available: 1, is_featured: 0, image: ''
}

const CATEGORIES = ['Rare Origins', 'Espresso Collection', 'Matcha & Signatures', 'Pastries']

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [search, setSearch] = useState('')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [stockEdit, setStockEdit] = useState(null)

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('products').select('*').order('id', { ascending: false })
    setProducts(data || []); setLoading(false)
  }

  useEffect(() => { load() }, [])

  const filtered = search.trim()
    ? products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    : products

  const openNew = () => setEditing({ ...BLANK })
  const openEdit = (p) => setEditing({ ...p, price: p.price.toString() })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (type === 'checkbox') setEditing({ ...editing, [name]: checked ? 1 : 0 })
    else setEditing({ ...editing, [name]: value })
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const path = `${Date.now()}-${Math.random().toString(36).slice(2,8)}.${ext}`
      const { error } = await supabase.storage.from('product-images').upload(path, file)
      if (error) throw error
      const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(path)
      setEditing({ ...editing, image: publicUrl })
    } catch (err) {
      alert('Upload failed: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!editing.name.trim() || !editing.price) { alert('Name and price are required.'); return }
    setSaving(true)
    try {
      const payload = {
        name: editing.name.trim(),
        description: editing.description?.trim() || null,
        price: parseFloat(editing.price),
        stock: parseInt(editing.stock) || 0,
        category: editing.category,
        is_available: editing.is_available ? 1 : 0,
        is_featured: editing.is_featured ? 1 : 0,
        image: editing.image || null
      }
      if (editing.id) {
        await supabase.from('products').update(payload).eq('id', editing.id)
      } else {
        await supabase.from('products').insert(payload)
      }
      setEditing(null); load()
    } catch (err) {
      alert('Save failed: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (p) => {
    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return
    const { error } = await supabase.from('products').delete().eq('id', p.id)
    if (error) {
      alert("Could not delete — this product may be linked to existing orders.")
      return
    }
    load()
  }

  const toggleAvailable = async (p) => {
    await supabase.from('products').update({ is_available: p.is_available === 1 ? 0 : 1 }).eq('id', p.id)
    load()
  }

  const addStock = async () => {
    if (!stockEdit) return
    const qty = parseInt(stockEdit.qty)
    if (!qty || qty <= 0) { alert('Enter a positive quantity.'); return }
    await supabase.from('products').update({ stock: stockEdit.currentStock + qty }).eq('id', stockEdit.id)
    setStockEdit(null); load()
  }

  return (
    <>
      <div className="page-title-bar">
        <div>
          <h1>Products</h1>
          <p>{products.length} total · manage your menu</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}>
          <i className="fas fa-plus"></i> Add Product
        </button>
      </div>

      <div className="data-card">
        <div className="filter-bar">
          <input type="text" className="form-control" placeholder="Search products..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: 200 }} />
        </div>

        <div className="table-wrap">
          {loading ? <div className="loader">Loading</div> :
           filtered.length === 0 ? (
             <div className="empty-state"><i className="fas fa-box-open"></i><p>No products yet.</p></div>
           ) : (
            <table className="data-table">
              <thead>
                <tr><th></th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th></th></tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div className="prod-thumb">
                        {p.image ? <img src={p.image} alt={p.name} /> : <i className="fas fa-mug-hot"></i>}
                      </div>
                    </td>
                    <td>
                      <div style={{ color: 'var(--cream)' }}>{p.name}</div>
                      {p.is_featured === 1 && <span className="badge badge-completed" style={{ marginTop: 4 }}>Featured</span>}
                    </td>
                    <td style={{ fontSize: '.85rem' }}>{p.category || '—'}</td>
                    <td className="serif" style={{ color: 'var(--gold)' }}>{peso(p.price)}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem' }}>
                        <span style={{ color: p.stock < 10 ? 'var(--warning)' : 'var(--cream)' }}>{p.stock}</span>
                        <button className="action-icon" onClick={() => setStockEdit({ id: p.id, name: p.name, currentStock: p.stock, qty: '' })} title="Add stock">
                          <i className="fas fa-plus-circle"></i>
                        </button>
                      </div>
                    </td>
                    <td>
                      <button className={`badge ${p.is_available ? 'badge-completed' : 'badge-cancelled'}`}
                        onClick={() => toggleAvailable(p)}
                        style={{ cursor: 'pointer', background: p.is_available ? 'rgba(200,156,76,.1)' : 'rgba(217,106,82,.1)' }}>
                        {p.is_available ? 'Available' : 'Hidden'}
                      </button>
                    </td>
                    <td>
                      <button className="action-icon" onClick={() => openEdit(p)} title="Edit"><i className="fas fa-edit"></i></button>
                      <button className="action-icon danger" onClick={() => handleDelete(p)} title="Delete"><i className="fas fa-trash"></i></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add/Edit modal */}
      {editing && (
        <div className="modal-backdrop" onClick={() => setEditing(null)}>
          <form className="modal-card" onClick={e => e.stopPropagation()} onSubmit={handleSave}>
            <div className="modal-head">
              <h3><i className="fas fa-box-open"></i> {editing.id ? 'Edit Product' : 'New Product'}</h3>
              <button type="button" className="modal-close" onClick={() => setEditing(null)}><i className="fas fa-times"></i></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Name *</label>
                <input name="name" type="text" className="form-control" value={editing.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea name="description" rows="2" className="form-control" value={editing.description || ''} onChange={handleChange} />
              </div>
              <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
                <div className="form-group">
                  <label>Price *</label>
                  <input name="price" type="number" step="0.01" min="0" className="form-control" value={editing.price} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Stock</label>
                  <input name="stock" type="number" min="0" className="form-control" value={editing.stock} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select name="category" className="form-control" value={editing.category} onChange={handleChange}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Image</label>
                {editing.image && (
                  <div className="image-preview">
                    <img src={editing.image} alt="" />
                    <button type="button" className="btn btn-sm btn-outline" onClick={() => setEditing({ ...editing, image: '' })}>Remove</button>
                  </div>
                )}
                <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="form-control" />
                {uploading && <small style={{ color: 'var(--gold)' }}>Uploading...</small>}
              </div>

              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '.5rem' }}>
                <label className="check-label">
                  <input type="checkbox" name="is_available" checked={!!editing.is_available} onChange={handleChange} />
                  Available
                </label>
                <label className="check-label">
                  <input type="checkbox" name="is_featured" checked={!!editing.is_featured} onChange={handleChange} />
                  Featured
                </label>
              </div>
            </div>
            <div className="modal-foot">
              <button type="button" className="btn btn-outline" onClick={() => setEditing(null)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving || uploading}>
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Stock modal */}
      {stockEdit && (
        <div className="modal-backdrop" onClick={() => setStockEdit(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}>
            <div className="modal-head">
              <h3>Add Stock — {stockEdit.name}</h3>
              <button className="modal-close" onClick={() => setStockEdit(null)}><i className="fas fa-times"></i></button>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--text-m)', marginBottom: '1rem' }}>
                Current stock: <strong style={{ color: 'var(--gold)' }}>{stockEdit.currentStock}</strong>
              </p>
              <div className="form-group">
                <label>Add Quantity *</label>
                <input type="number" min="1" className="form-control"
                  value={stockEdit.qty}
                  onChange={e => setStockEdit({ ...stockEdit, qty: e.target.value })}
                  autoFocus />
              </div>
              {stockEdit.qty && (
                <p style={{ color: 'var(--gold)', fontSize: '.85rem' }}>
                  → New stock: {stockEdit.currentStock + (parseInt(stockEdit.qty) || 0)}
                </p>
              )}
            </div>
            <div className="modal-foot">
              <button className="btn btn-outline" onClick={() => setStockEdit(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={addStock}>Apply</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .prod-thumb {
          width: 50px; height: 50px;
          background: var(--crema);
          display: flex; align-items: center; justify-content: center;
          color: var(--gold); opacity: .85;
          overflow: hidden;
        }
        .prod-thumb img { width: 100%; height: 100%; object-fit: cover; }
        .image-preview {
          display: flex; align-items: center; gap: .8rem;
          padding: .6rem;
          background: var(--crema);
          border: 1px solid var(--border-l);
          margin-bottom: .6rem;
        }
        .image-preview img { width: 60px; height: 60px; object-fit: cover; }
      `}</style>
    </>
  )
}
