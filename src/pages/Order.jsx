import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { supabase, generateCode, peso } from '../lib/supabase.js'

export default function Order() {
  const navigate = useNavigate()
  const { items, subtotal, updateQuantity, removeItem, clearCart } = useCart()
  const [showCheckout, setShowCheckout] = useState(false)
  const [form, setForm] = useState({
    customer_name: '', customer_phone: '', customer_email: '',
    delivery_type: 'pickup', delivery_address: '',
    payment_method: 'cash', special_requests: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const deliveryFee = form.delivery_type === 'delivery' ? 50 : 0
  // Happy hour 2-5pm weekday = 15% off; student handled at checkout (we'll just apply none for now and let staff apply at order in real life)
  const total = subtotal + deliveryFee

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.customer_name.trim() || !form.customer_phone.trim()) {
      setError('Name and phone are required.')
      return
    }
    if (form.delivery_type === 'delivery' && !form.delivery_address.trim()) {
      setError('Please enter a delivery address.')
      return
    }

    setSubmitting(true)
    try {
      const orderCode = generateCode('KB')
      const { data: order, error: orderErr } = await supabase
        .from('orders')
        .insert({
          order_code: orderCode,
          customer_name: form.customer_name.trim(),
          customer_phone: form.customer_phone.trim(),
          customer_email: form.customer_email.trim() || null,
          delivery_type: form.delivery_type,
          delivery_address: form.delivery_address.trim() || null,
          payment_method: form.payment_method,
          special_requests: form.special_requests.trim() || null,
          subtotal, delivery_fee: deliveryFee, total,
          status: 'received'
        })
        .select().single()
      if (orderErr) throw orderErr

      const orderItems = items.map(it => ({
        order_id: order.id, product_id: it.id, product_name: it.name,
        product_price: it.price, quantity: it.quantity,
        subtotal: it.price * it.quantity
      }))
      const { error: itemsErr } = await supabase.from('order_items').insert(orderItems)
      if (itemsErr) throw itemsErr

      // Decrement stock for each product (best-effort)
      for (const it of items) {
        await supabase.rpc('decrement_stock', { p_id: it.id, p_qty: it.quantity }).catch(() => {
          // fallback if RPC isn't there — direct update
          supabase.from('products').update({ stock: it.stock - it.quantity }).eq('id', it.id)
        })
      }

      // Notification
      await supabase.from('notifications').insert({
        type: 'new_order',
        title: `New order ${orderCode}`,
        message: `${form.customer_name} placed an order totalling ${peso(total)}`,
        link: `/admin/orders`
      })

      clearCart()
      navigate(`/order-success/${orderCode}`)
    } catch (err) {
      console.error(err)
      setError(err.message || 'Could not place order. Please try again.')
      setSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="page">
        <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
          <i className="fas fa-shopping-bag" style={{ fontSize: '3.5rem', color: 'var(--gold)', opacity: .4, marginBottom: '1.5rem' }}></i>
          <h2>Your <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>cart</em> is empty</h2>
          <p style={{ margin: '1rem 0 2rem' }}>Browse our collection to find something extraordinary.</p>
          <Link to="/menu" className="btn btn-primary">Browse Menu</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="page-hero" style={{ padding: '4rem 2rem 2rem' }}>
        <span className="label-text">{showCheckout ? 'Checkout' : 'Your Cart'}</span>
        <h1><em>{showCheckout ? 'Complete' : 'Review'}</em> {showCheckout ? 'Order' : 'Cart'}</h1>
      </div>

      <div className="container" style={{ padding: '2.5rem 1.5rem 4rem' }}>
        {error && <div className="alert alert-error">{error}</div>}

        {!showCheckout ? (
          // CART REVIEW
          <div className="order-layout">
            <div className="order-items">
              {items.map(item => (
                <div key={item.id} className="order-item">
                  <div className="order-item-img">
                    {item.image ? <img src={item.image} alt="" /> : <i className="fas fa-mug-hot"></i>}
                  </div>
                  <div className="order-item-info">
                    <h3>{item.name}</h3>
                    <span className="order-item-price serif">{peso(item.price)}</span>
                  </div>
                  <div className="order-item-actions">
                    <div className="qty-control">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                    <div className="order-item-subtotal serif">
                      {peso(item.price * item.quantity)}
                    </div>
                    <button className="order-item-remove" onClick={() => removeItem(item.id)} aria-label="Remove">
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                </div>
              ))}
              <button className="order-clear" onClick={clearCart}>
                <i className="fas fa-trash"></i> Clear cart
              </button>
            </div>

            <aside className="order-summary">
              <h3>Order Summary</h3>
              <div className="gold-divider"><i className="fas fa-coffee"></i></div>
              <div className="summary-row">
                <span>Subtotal</span>
                <span className="serif">{peso(subtotal)}</span>
              </div>
              <div className="summary-row muted">
                <span>Delivery</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span className="serif">{peso(subtotal)}</span>
              </div>
              <button className="btn btn-primary btn-block" onClick={() => setShowCheckout(true)}>
                Proceed to Checkout <i className="fas fa-arrow-right"></i>
              </button>
              <Link to="/menu" className="order-continue">← Continue shopping</Link>
            </aside>
          </div>
        ) : (
          // CHECKOUT FORM
          <form onSubmit={handleSubmit} className="order-layout">
            <div className="checkout-form">
              <section className="form-section">
                <h3>Contact</h3>
                <div className="gold-divider"><i className="fas fa-coffee"></i></div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input type="text" name="customer_name" className="form-control"
                      value={form.customer_name} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>Phone *</label>
                    <input type="tel" name="customer_phone" className="form-control"
                      value={form.customer_phone} onChange={handleChange} required />
                  </div>
                </div>
                <div className="form-group">
                  <label>Email (optional)</label>
                  <input type="email" name="customer_email" className="form-control"
                    value={form.customer_email} onChange={handleChange} />
                </div>
              </section>

              <section className="form-section">
                <h3>Order Type</h3>
                <div className="gold-divider"><i className="fas fa-coffee"></i></div>
                <div className="radio-group">
                  <label className={`radio-card ${form.delivery_type === 'pickup' ? 'active' : ''}`}>
                    <input type="radio" name="delivery_type" value="pickup"
                      checked={form.delivery_type === 'pickup'} onChange={handleChange} />
                    <i className="fas fa-shopping-bag"></i>
                    <span>Pickup</span>
                    <small>Free · Ready in 15-20 min</small>
                  </label>
                  <label className={`radio-card ${form.delivery_type === 'delivery' ? 'active' : ''}`}>
                    <input type="radio" name="delivery_type" value="delivery"
                      checked={form.delivery_type === 'delivery'} onChange={handleChange} />
                    <i className="fas fa-motorcycle"></i>
                    <span>Delivery</span>
                    <small>+ ₱50 · 30-45 min</small>
                  </label>
                </div>
                {form.delivery_type === 'delivery' && (
                  <div className="form-group" style={{ marginTop: '1.2rem' }}>
                    <label>Delivery Address *</label>
                    <textarea name="delivery_address" className="form-control" rows="3"
                      value={form.delivery_address} onChange={handleChange}
                      placeholder="House #, street, barangay, landmark..." required />
                  </div>
                )}
              </section>

              <section className="form-section">
                <h3>Payment</h3>
                <div className="gold-divider"><i className="fas fa-coffee"></i></div>
                <div className="radio-group radio-group-3">
                  <label className={`radio-card ${form.payment_method === 'cash' ? 'active' : ''}`}>
                    <input type="radio" name="payment_method" value="cash"
                      checked={form.payment_method === 'cash'} onChange={handleChange} />
                    <i className="fas fa-money-bill-wave"></i>
                    <span>Cash</span>
                  </label>
                  <label className={`radio-card ${form.payment_method === 'gcash' ? 'active' : ''}`}>
                    <input type="radio" name="payment_method" value="gcash"
                      checked={form.payment_method === 'gcash'} onChange={handleChange} />
                    <i className="fas fa-mobile-alt"></i>
                    <span>GCash</span>
                  </label>
                  <label className={`radio-card ${form.payment_method === 'card' ? 'active' : ''}`}>
                    <input type="radio" name="payment_method" value="card"
                      checked={form.payment_method === 'card'} onChange={handleChange} />
                    <i className="fas fa-credit-card"></i>
                    <span>Card</span>
                  </label>
                </div>
              </section>

              <section className="form-section">
                <h3>Special Requests</h3>
                <div className="gold-divider"><i className="fas fa-coffee"></i></div>
                <div className="form-group">
                  <textarea name="special_requests" className="form-control" rows="3"
                    value={form.special_requests} onChange={handleChange}
                    placeholder="Brewing preferences, allergies, student ID for 10% off..." />
                </div>
              </section>

              <button type="button" className="order-back-btn" onClick={() => setShowCheckout(false)}>
                ← Back to cart
              </button>
            </div>

            <aside className="order-summary">
              <h3>Your Order</h3>
              <div className="gold-divider"><i className="fas fa-coffee"></i></div>
              <ul className="summary-items">
                {items.map(it => (
                  <li key={it.id}>
                    <span className="qty">×{it.quantity}</span>
                    <span className="name">{it.name}</span>
                    <span className="price serif">{peso(it.price * it.quantity)}</span>
                  </li>
                ))}
              </ul>
              <div className="summary-row">
                <span>Subtotal</span>
                <span className="serif">{peso(subtotal)}</span>
              </div>
              <div className="summary-row">
                <span>Delivery</span>
                <span className="serif">{deliveryFee === 0 ? 'Free' : peso(deliveryFee)}</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span className="serif">{peso(total)}</span>
              </div>
              <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
                {submitting ? 'Placing...' : <>Place Order <i className="fas fa-check"></i></>}
              </button>
            </aside>
          </form>
        )}
      </div>

      <style>{css}</style>
    </div>
  )
}

const css = `
.order-layout {
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 2.5rem;
  align-items: start;
}
@media (max-width: 900px) { .order-layout { grid-template-columns: 1fr; } }

.order-items { display: flex; flex-direction: column; gap: 1rem; }
.order-item {
  display: grid;
  grid-template-columns: 80px 1fr auto;
  gap: 1.25rem;
  align-items: center;
  padding: 1.2rem;
  background: var(--bean);
  border: 1px solid var(--border);
}
.order-item-img {
  width: 80px; height: 80px;
  background: linear-gradient(135deg, var(--crema), var(--mahogany));
  display: flex; align-items: center; justify-content: center;
  color: var(--gold);
  font-size: 1.6rem;
  overflow: hidden;
}
.order-item-img img { width: 100%; height: 100%; object-fit: cover; }
.order-item-info h3 { font-size: 1.2rem; color: var(--cream); margin-bottom: .35rem; }
.order-item-price { color: var(--gold); font-size: 1.1rem; }
.order-item-actions { display: flex; align-items: center; gap: 1.2rem; }
.qty-control {
  display: flex; align-items: center; gap: .25rem;
  border: 1px solid var(--border);
}
.qty-control button {
  width: 32px; height: 32px;
  color: var(--gold); font-size: 1rem;
  transition: background .2s;
}
.qty-control button:hover { background: var(--crema); }
.qty-control span {
  min-width: 32px; text-align: center;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  color: var(--cream);
}
.order-item-subtotal {
  color: var(--gold);
  font-size: 1.3rem;
  min-width: 90px; text-align: right;
}
.order-item-remove {
  color: var(--text-l);
  font-size: 1rem;
  padding: .35rem;
  transition: color .2s;
}
.order-item-remove:hover { color: var(--danger); }

.order-clear {
  align-self: flex-start;
  color: var(--text-l);
  font-family: 'Inter', sans-serif;
  font-size: .65rem;
  font-weight: 500;
  letter-spacing: .22em;
  text-transform: uppercase;
  padding: .6rem 0;
  margin-top: .5rem;
  transition: color .2s;
}
.order-clear:hover { color: var(--danger); }

.order-summary {
  padding: 2rem;
  background: var(--bean);
  border: 1px solid var(--border);
  position: sticky; top: 100px;
}
.order-summary h3 {
  font-family: 'Inter', sans-serif;
  font-size: .8rem;
  font-weight: 500;
  letter-spacing: .25em;
  text-transform: uppercase;
  color: var(--gold);
}
.summary-items {
  margin: 1rem 0;
  border-bottom: 1px solid var(--border-l);
  padding-bottom: 1rem;
}
.summary-items li {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: .8rem;
  padding: .5rem 0;
  font-size: .9rem;
}
.summary-items .qty { color: var(--gold); font-weight: 500; font-size: .85rem; }
.summary-items .name { color: var(--text); }
.summary-items .price { color: var(--gold); font-size: 1.05rem; }

.summary-row {
  display: flex; justify-content: space-between;
  padding: .65rem 0;
  font-size: .95rem;
}
.summary-row.muted { color: var(--text-l); font-size: .85rem; }
.summary-row.total {
  border-top: 1px solid var(--border);
  margin-top: .5rem; padding-top: 1.2rem;
  font-size: 1.4rem;
  color: var(--gold);
}
.order-continue {
  display: block; text-align: center; margin-top: 1rem;
  font-family: 'Inter', sans-serif;
  font-size: .65rem;
  font-weight: 500;
  letter-spacing: .22em;
  text-transform: uppercase;
  color: var(--text-m);
  transition: color .2s;
}
.order-continue:hover { color: var(--gold); }

.checkout-form { display: flex; flex-direction: column; gap: 1.5rem; }
.form-section {
  padding: 1.8rem;
  background: var(--bean);
  border: 1px solid var(--border);
}
.form-section h3 {
  font-family: 'Inter', sans-serif;
  font-size: .8rem;
  font-weight: 500;
  letter-spacing: .25em;
  text-transform: uppercase;
  color: var(--gold);
}
.radio-group { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.radio-group-3 { grid-template-columns: repeat(3, 1fr); }
.radio-card {
  display: flex; flex-direction: column; align-items: center; gap: .5rem;
  padding: 1.2rem 1rem;
  border: 1px solid var(--border);
  cursor: pointer;
  transition: all .25s;
  text-align: center;
  background: var(--crema);
}
.radio-card input { display: none; }
.radio-card i { font-size: 1.5rem; color: var(--gold); opacity: .6; transition: opacity .25s; }
.radio-card span {
  font-family: 'Inter', sans-serif;
  font-size: .68rem;
  font-weight: 500;
  letter-spacing: .22em;
  text-transform: uppercase;
  color: var(--text);
}
.radio-card small { color: var(--text-l); font-size: .72rem; }
.radio-card:hover { border-color: var(--gold); }
.radio-card.active {
  border-color: var(--gold);
  background: rgba(200,156,76,.08);
}
.radio-card.active i { opacity: 1; }
@media (max-width: 500px) {
  .radio-group, .radio-group-3 { grid-template-columns: 1fr; }
}

.order-back-btn {
  align-self: flex-start;
  color: var(--text-m);
  font-family: 'Inter', sans-serif;
  font-size: .68rem;
  font-weight: 500;
  letter-spacing: .22em;
  text-transform: uppercase;
  padding: .8rem 0;
  transition: color .2s;
}
.order-back-btn:hover { color: var(--gold); }

@media (max-width: 600px) {
  .order-item { grid-template-columns: 60px 1fr; }
  .order-item-actions { grid-column: 1 / -1; justify-content: space-between; }
}
`
