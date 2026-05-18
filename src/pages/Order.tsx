import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Modal from '../components/ui/Modal'
import SectionHeading from '../components/SectionHeading'
import { useCart } from '../context/CartContext'
import { createOrderCode, formatCurrency } from '../lib/format'

export default function Order() {
  const navigate = useNavigate()
  const { items, subtotal, updateQuantity, removeItem, clearCart } = useCart()
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [pickupName, setPickupName] = useState('')
  const [contact, setContact] = useState('')
  const [payment, setPayment] = useState('Cash')

  const hasItems = items.length > 0
  const total = subtotal

  const handleCheckout = () => {
    if (!pickupName || !contact) return
    const code = createOrderCode()
    clearCart()
    navigate(`/order-success/${code}`)
  }

  return (
    <div className="space-y-14">
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="surface-glow rounded-[3rem] border border-white/10 bg-bg-surface/90 p-10 shadow-soft">
          <SectionHeading
            eyebrow="Reserve"
            title="Complete your order and lock in your premium coffee pickup."
            description="Review your selection, choose a pick up method, and confirm a luxurious coffee experience in Calape."
          />
          <div className="mt-10 flow-root rounded-[2rem] border border-white/10 bg-bg-deep/95 p-6">
            {hasItems ? (
              <div className="space-y-6">
                {items.map((item) => (
                  <div key={item.id} className="flex flex-col gap-4 rounded-[1.75rem] border border-white/10 bg-white/5 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <img src={item.image} alt={item.name} className="h-20 w-20 rounded-3xl object-cover" />
                      <div>
                        <h3 className="text-lg font-semibold text-cream">{item.name}</h3>
                        <p className="text-sm text-cream-muted">{item.category}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-cream-muted sm:justify-end">
                      <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="rounded-full border border-white/10 px-2 text-cream transition hover:border-gold-primary hover:text-gold-primary"
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="rounded-full border border-white/10 px-2 text-cream transition hover:border-gold-primary hover:text-gold-primary"
                        >
                          +
                        </button>
                      </div>
                      <p className="text-sm font-semibold text-cream">{formatCurrency(item.price * item.quantity)}</p>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="rounded-full px-3 py-2 text-sm uppercase tracking-[0.25em] text-cream-muted transition hover:text-gold-primary"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-[2rem] border border-dashed border-white/10 bg-white/5 p-12 text-center text-cream-muted">
                <p className="text-lg font-semibold text-cream">Your cart is empty.</p>
                <p className="mt-3 text-sm leading-7">Discover our rare coffee selection and reserve a cup for pickup.</p>
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="surface-glow rounded-[3rem] border border-white/10 bg-bg-surface/90 p-8 shadow-soft">
            <p className="text-xs uppercase tracking-[0.35em] text-cream-muted">Order summary</p>
            <div className="mt-6 space-y-4 text-sm text-cream-muted">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Service fee</span>
                <span>Included</span>
              </div>
              <div className="flex items-center justify-between border-t border-white/10 pt-4 text-base font-semibold text-cream">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

          <div className="surface-glow rounded-[3rem] border border-white/10 bg-bg-surface/90 p-8 shadow-soft">
            <p className="text-xs uppercase tracking-[0.35em] text-cream-muted">Pickup details</p>
            <div className="mt-5 space-y-4">
              <label className="block text-sm text-cream-muted">
                <span className="mb-2 block text-cream">Name</span>
                <input
                  value={pickupName}
                  onChange={(event) => setPickupName(event.target.value)}
                  className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-cream outline-none transition focus:border-gold-primary"
                  placeholder="Your name"
                />
              </label>
              <label className="block text-sm text-cream-muted">
                <span className="mb-2 block text-cream">Contact</span>
                <input
                  value={contact}
                  onChange={(event) => setContact(event.target.value)}
                  className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-cream outline-none transition focus:border-gold-primary"
                  placeholder="Phone or email"
                />
              </label>
              <label className="block text-sm text-cream-muted">
                <span className="mb-2 block text-cream">Payment</span>
                <select
                  value={payment}
                  onChange={(event) => setPayment(event.target.value)}
                  className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-cream outline-none transition focus:border-gold-primary"
                >
                  <option>Cash</option>
                  <option>GCash</option>
                  <option>Card</option>
                </select>
              </label>
            </div>
          </div>

          <button
            type="button"
            disabled={!hasItems || !pickupName || !contact}
            onClick={() => setCheckoutOpen(true)}
            className="inline-flex w-full items-center justify-center rounded-full bg-gold-primary px-6 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-bg-main transition hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-50"
          >
            Proceed to checkout
          </button>
        </aside>
      </section>

      <Modal open={checkoutOpen} title="Confirm reservation" onClose={() => setCheckoutOpen(false)}>
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-bg-main/90 p-5 text-sm text-cream-muted">
            <p className="font-semibold text-cream">Pickup by</p>
            <p>{pickupName || 'Guest'}</p>
            <p>{contact || 'No contact provided'}</p>
            <p className="mt-3">Payment: {payment}</p>
          </div>
          <div className="space-y-3">
            {items.slice(0, 3).map((item) => (
              <div key={item.id} className="flex items-center justify-between text-sm text-cream-muted">
                <span>{item.quantity} × {item.name}</span>
                <span>{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
            {items.length > 3 && <p className="text-sm text-cream-muted">+ {items.length - 3} more items</p>}
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-4 text-sm text-cream">
            <div className="flex items-center justify-between">
              <span>Total</span>
              <strong>{formatCurrency(total)}</strong>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setCheckoutOpen(false)}
              className="inline-flex min-w-[160px] items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm uppercase tracking-[0.24em] text-cream transition hover:border-gold-primary hover:text-gold-primary"
            >
              Back to cart
            </button>
            <button
              type="button"
              onClick={handleCheckout}
              className="inline-flex min-w-[160px] items-center justify-center rounded-full bg-gold-primary px-5 py-3 text-sm font-semibold uppercase tracking-[0.24em] text-bg-main transition hover:bg-gold-light"
            >
              Confirm reservation
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
