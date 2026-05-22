import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
  const canCheckout = hasItems && pickupName.trim().length > 0 && contact.trim().length > 0

  const handleCheckout = () => {
    if (!canCheckout) return
    const code = createOrderCode()
    clearCart()
    navigate(`/order-success/${code}`)
  }

  return (
    <div className="space-y-10 sm:space-y-14">
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">

        {/* Cart */}
        <div className="surface-glow rounded-[2.5rem] border border-white/10 bg-bg-surface/90 p-6 shadow-soft sm:p-10">
          <SectionHeading
            eyebrow="Order"
            title="Complete your order and lock in your premium coffee pickup."
            description="Review your selection, choose a payment method, and confirm a luxurious coffee experience in Calape."
          />
          <div className="mt-8 flow-root rounded-[1.75rem] border border-white/10 bg-bg-deep/95 p-4 sm:p-6">
            {hasItems ? (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-4 rounded-[1.5rem] border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-16 w-16 shrink-0 rounded-2xl object-cover sm:h-20 sm:w-20"
                        />
                      ) : (
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/5 text-2xl sm:h-20 sm:w-20">
                          ☕
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-cream">{item.name}</h3>
                        <p className="text-sm text-cream/50">{item.category}</p>
                        <p className="mt-1 text-sm font-semibold text-gold-primary">
                          {formatCurrency(item.price)}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-cream/60 sm:justify-end">
                      <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="flex h-6 w-6 items-center justify-center rounded-full border border-white/10 text-cream transition hover:border-gold-primary hover:text-gold-primary"
                        >
                          <i className="fa-solid fa-minus text-[0.6rem]" />
                        </button>
                        <span className="w-5 text-center font-semibold text-cream">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="flex h-6 w-6 items-center justify-center rounded-full border border-white/10 text-cream transition hover:border-gold-primary hover:text-gold-primary"
                        >
                          <i className="fa-solid fa-plus text-[0.6rem]" />
                        </button>
                      </div>
                      <p className="font-semibold text-cream">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="rounded-full px-3 py-2 text-xs uppercase tracking-[0.2em] text-cream/40 transition hover:text-red-400"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-[2rem] border border-dashed border-white/10 bg-white/5 p-10 text-center sm:p-14">
                <i className="fa-solid fa-mug-hot text-4xl text-gold-primary/20" />
                <p className="mt-4 text-lg font-semibold text-cream">Your cart is empty.</p>
                <p className="mt-2 text-sm leading-7 text-cream/50">
                  Discover our rare coffee selection and add a cup for pickup.
                </p>
                <Link
                  to="/menu"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold-light px-6 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-bg-main shadow-[0_0_16px_rgba(196,154,108,0.25)] transition hover:bg-gold-primary"
                >
                  Browse menu
                  <i className="fa-solid fa-arrow-right text-xs" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-5">
          {/* Summary */}
          <div className="surface-glow rounded-[2.5rem] border border-white/10 bg-bg-surface/90 p-6 shadow-soft sm:p-8">
            <p className="text-xs uppercase tracking-[0.35em] text-cream/40">Order summary</p>
            <div className="mt-5 space-y-3 text-sm text-cream/60">
              <div className="flex items-center justify-between">
                <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Service fee</span>
                <span className="text-green-400">Included</span>
              </div>
              <div className="flex items-center justify-between border-t border-white/10 pt-3 text-base font-semibold text-cream">
                <span>Total</span>
                <span className="text-gold-primary">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

          {/* Pickup details */}
          <div className="surface-glow rounded-[2.5rem] border border-white/10 bg-bg-surface/90 p-6 shadow-soft sm:p-8">
            <p className="text-xs uppercase tracking-[0.35em] text-cream/40">Pickup details</p>
            <div className="mt-5 space-y-4">
              <label className="block text-sm">
                <span className="mb-2 block text-cream">Name <span className="text-red-400">*</span></span>
                <input
                  value={pickupName}
                  onChange={(e) => setPickupName(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-cream outline-none transition focus:border-gold-primary"
                  placeholder="Your full name"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-2 block text-cream">Contact <span className="text-red-400">*</span></span>
                <input
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-cream outline-none transition focus:border-gold-primary"
                  placeholder="Phone or email"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-2 block text-cream">Payment</span>
                <select
                  value={payment}
                  onChange={(e) => setPayment(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-bg-surface px-4 py-3 text-cream outline-none transition focus:border-gold-primary"
                >
                  <option value="Cash">Cash</option>
                  <option value="GCash">GCash</option>
                  <option value="Card">Credit / Debit Card</option>
                </select>
              </label>
            </div>
          </div>

          <button
            type="button"
            disabled={!canCheckout}
            onClick={() => setCheckoutOpen(true)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold-light px-6 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-bg-main shadow-[0_0_20px_rgba(196,154,108,0.3)] transition hover:bg-gold-primary disabled:cursor-not-allowed disabled:opacity-40"
          >
            <i className="fa-solid fa-lock text-xs" />
            Proceed to checkout
          </button>
          {!hasItems && (
            <p className="text-center text-xs text-cream/30">Add items to your cart to continue</p>
          )}
        </aside>
      </section>

      {/* Checkout modal */}
      <Modal open={checkoutOpen} title="Confirm order" onClose={() => setCheckoutOpen(false)}>
        <div className="space-y-6">
          <div className="rounded-[1.75rem] border border-white/10 bg-bg-main/90 p-5 text-sm text-cream/60">
            <p className="font-semibold text-cream">Pickup by</p>
            <p>{pickupName || 'Guest'}</p>
            <p>{contact || 'No contact provided'}</p>
            <p className="mt-3 flex items-center gap-2">
              <i className="fa-solid fa-credit-card text-gold-primary/60" />
              Payment: {payment}
            </p>
          </div>
          <div className="space-y-2.5">
            {items.slice(0, 4).map((item) => (
              <div key={item.id} className="flex items-center justify-between text-sm text-cream/60">
                <span>
                  {item.quantity} × {item.name}
                </span>
                <span>{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
            {items.length > 4 && (
              <p className="text-sm text-cream/40">+ {items.length - 4} more items</p>
            )}
          </div>
          <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-4 text-sm text-cream">
            <div className="flex items-center justify-between">
              <span>Total</span>
              <strong className="text-gold-primary">{formatCurrency(total)}</strong>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setCheckoutOpen(false)}
              className="inline-flex min-w-[140px] items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm uppercase tracking-[0.22em] text-cream transition hover:border-gold-primary hover:text-gold-primary"
            >
              Back to cart
            </button>
            <button
              type="button"
              onClick={handleCheckout}
              className="inline-flex min-w-[140px] items-center justify-center gap-2 rounded-full bg-gold-light px-5 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-bg-main shadow-[0_0_18px_rgba(196,154,108,0.3)] transition hover:bg-gold-primary"
            >
              <i className="fa-solid fa-check text-xs" />
              Confirm order
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
