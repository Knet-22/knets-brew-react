import { useEffect, useMemo, useState } from 'react'
import { supabase, peso } from '../lib/supabase.js'
import { useCart } from '../context/CartContext.jsx'

export default function Menu() {
  const [products, setProducts] = useState([])
  const [activeCat, setActiveCat] = useState('all')
  const [loading, setLoading] = useState(true)
  const [addedId, setAddedId] = useState(null)
  const { addItem } = useCart()

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('is_available', 1)
        .order('category')
        .order('price', { ascending: false })
      setProducts(data || [])
      setLoading(false)
    }
    load()
  }, [])

  const categories = useMemo(() => {
    return [...new Set(products.map(p => p.category).filter(Boolean))]
  }, [products])

  const filtered = useMemo(() => {
    if (activeCat === 'all') return products
    return products.filter(p => p.category === activeCat)
  }, [products, activeCat])

  const handleAdd = (product) => {
    if (product.stock === 0) return
    addItem(product)
    setAddedId(product.id)
    setTimeout(() => setAddedId(null), 1200)
  }

  return (
    <div className="page">
      <div className="page-hero">
        <span className="label-text">The Collection</span>
        <h1>The <em>Menu</em></h1>
        <div className="gold-divider" style={{ maxWidth: 160, margin: '.75rem auto' }}>
          <i className="fas fa-coffee"></i>
        </div>
        <p>From rare origins to house favorites — crafted with the same patience and care.</p>
      </div>

      <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
        <div className="cat-tabs">
          <button
            className={`tab-btn ${activeCat === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCat('all')}
          >
            All Items
          </button>
          {categories.map(c => (
            <button
              key={c}
              className={`tab-btn ${activeCat === c ? 'active' : ''}`}
              onClick={() => setActiveCat(c)}
            >
              {c}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loader">Loading menu</div>
        ) : filtered.length === 0 ? (
          <div className="menu-empty">
            <i className="fas fa-mug-hot"></i>
            <p>No items in this category right now.</p>
          </div>
        ) : (
          <div className="menu-grid">
            {filtered.map(p => {
              const lowStock = p.stock > 0 && p.stock <= 5
              const outOfStock = p.stock === 0
              const isRare = Number(p.price) >= 400
              return (
                <article key={p.id} className={`menu-card ${outOfStock ? 'out' : ''}`}>
                  <div className="menu-card-img">
                    {p.image ? <img src={p.image} alt={p.name} /> : <i className="fas fa-mug-hot"></i>}
                    {isRare && <span className="rare-badge">Rare</span>}
                    {p.is_featured === 1 && !isRare && <span className="rare-badge feat">Featured</span>}
                  </div>
                  <div className="menu-card-body">
                    <div className="card-cat">
                      <span className="label-text">{p.category}</span>
                      {lowStock && <span className="low-stock">Only {p.stock} left</span>}
                      {outOfStock && <span className="out-stock">Out of stock</span>}
                    </div>
                    <h3>{p.name}</h3>
                    <p>{p.description}</p>
                    <div className="menu-card-foot">
                      <span className="price serif">{peso(p.price)}</span>
                      <button
                        className={`btn btn-primary btn-add ${addedId === p.id ? 'added' : ''}`}
                        onClick={() => handleAdd(p)}
                        disabled={outOfStock}
                      >
                        {addedId === p.id ? (
                          <><i className="fas fa-check"></i> Added</>
                        ) : outOfStock ? 'Sold Out' : (
                          <><i className="fas fa-plus"></i> Add</>
                        )}
                      </button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>

      <style>{css}</style>
    </div>
  )
}

const css = `
.cat-tabs {
  display: flex; flex-wrap: wrap; gap: .6rem;
  justify-content: center;
  margin-bottom: 3rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-l);
}
.tab-btn {
  font-family: 'Inter', sans-serif;
  font-size: .68rem;
  font-weight: 500;
  letter-spacing: .22em;
  text-transform: uppercase;
  padding: .7rem 1.5rem;
  color: var(--text-m);
  border: 1px solid var(--border);
  background: transparent;
  transition: all .25s;
}
.tab-btn:hover { color: var(--gold); border-color: var(--gold); }
.tab-btn.active {
  background: var(--gold);
  color: var(--espresso);
  border-color: var(--gold);
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
  gap: 1.5rem;
}
.menu-card {
  background: var(--bean);
  border: 1px solid var(--border);
  display: flex; flex-direction: column;
  transition: all .3s;
  overflow: hidden;
}
.menu-card:hover {
  border-color: var(--gold);
  transform: translateY(-5px);
  box-shadow: var(--shadow-sm);
}
.menu-card.out { opacity: .65; }
.menu-card-img {
  position: relative;
  height: 190px;
  background: linear-gradient(135deg, var(--crema), var(--mahogany));
  display: flex; align-items: center; justify-content: center;
  color: var(--gold);
  font-size: 2.8rem;
  overflow: hidden;
}
.menu-card-img img { width: 100%; height: 100%; object-fit: cover; }
.rare-badge {
  position: absolute; top: 12px; right: 12px;
  background: var(--gold);
  color: var(--espresso);
  font-family: 'Inter', sans-serif;
  font-size: .58rem; font-weight: 500;
  letter-spacing: .2em;
  text-transform: uppercase;
  padding: .25rem .65rem;
}
.rare-badge.feat { background: var(--copper); color: var(--cream); }
.menu-card-body { padding: 1.4rem; flex: 1; display: flex; flex-direction: column; }
.card-cat {
  display: flex; justify-content: space-between; align-items: center;
  gap: .5rem; flex-wrap: wrap;
  margin-bottom: .4rem;
}
.low-stock {
  color: var(--warning);
  font-family: 'Inter', sans-serif;
  font-size: .62rem;
  font-weight: 500;
  letter-spacing: .14em;
  text-transform: uppercase;
}
.out-stock {
  color: var(--danger);
  font-family: 'Inter', sans-serif;
  font-size: .62rem;
  font-weight: 500;
  letter-spacing: .14em;
  text-transform: uppercase;
}
.menu-card-body h3 {
  margin: .25rem 0 .55rem;
  color: var(--cream);
  font-size: 1.45rem;
}
.menu-card-body p {
  font-size: .87rem;
  line-height: 1.65;
  flex: 1;
  color: var(--text-m);
}
.menu-card-foot {
  display: flex; justify-content: space-between; align-items: center;
  margin-top: 1.2rem; padding-top: 1rem;
  border-top: 1px solid var(--border-l);
}
.menu-card-foot .price {
  color: var(--gold);
  font-size: 1.4rem;
}
.btn-add { padding: .55rem 1.1rem; font-size: .6rem; }
.btn-add.added { background: var(--success); border-color: var(--success); color: white; }

.menu-empty {
  text-align: center;
  padding: 4rem 1rem;
  color: var(--text-l);
}
.menu-empty i { font-size: 3rem; color: var(--gold); opacity: .4; margin-bottom: 1rem; }
`
