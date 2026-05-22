import { FormEvent, useState } from 'react'
import { useParams } from 'react-router-dom'
import SectionHeading from '../components/SectionHeading'
import { formatCurrency } from '../lib/format'
import { useOrders } from '../context/OrdersContext'
import type { AdminOrder } from '../data/admin'

const STATUS_FLOW = ['Confirmed', 'Preparing', 'Ready'] as const

const ORDER_TYPE_CONFIG = {
  'dine-in':  { label: 'Dine-in',  icon: 'fa-utensils',    readyLabel: 'Ready to serve',    readyDesc: 'Your order is ready at your table. Enjoy!' },
  'pickup':   { label: 'Pickup',   icon: 'fa-bag-shopping', readyLabel: 'Ready for pickup',  readyDesc: 'Your order is waiting at the counter.' },
  'delivery': { label: 'Delivery', icon: 'fa-motorcycle',   readyLabel: 'Out for delivery',  readyDesc: 'Your order is on its way to your address.' },
} satisfies Record<NonNullable<AdminOrder['orderType']>, { label: string; icon: string; readyLabel: string; readyDesc: string }>

function getSteps(orderType?: AdminOrder['orderType']) {
  const cfg = orderType ? ORDER_TYPE_CONFIG[orderType] : ORDER_TYPE_CONFIG['pickup']
  return [
    { label: 'Confirmed',   description: 'Your order has been received and confirmed.' },
    { label: 'Preparing',   description: 'Our barista is carefully preparing your order.' },
    { label: cfg.readyLabel, description: cfg.readyDesc },
  ]
}

export default function Track() {
  const { code: routeCode } = useParams<{ code: string }>()
  const [code, setCode] = useState(routeCode ?? '')
  const [submitted, setSubmitted] = useState(!!routeCode)
  const { orders } = useOrders()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
  }

  const trimmed = code.trim().toUpperCase()
  const order = submitted ? orders.find((o) => o.id === trimmed) : null
  const notFound = submitted && !order

  const steps = getSteps(order?.orderType)
  const currentStep = order ? STATUS_FLOW.indexOf(order.status) : -1
  const orderTypeCfg = order?.orderType ? ORDER_TYPE_CONFIG[order.orderType] : ORDER_TYPE_CONFIG['pickup']

  return (
    <div className="space-y-16">
      <section className="space-y-6">
        <SectionHeading
          eyebrow="Track"
          title="Follow your order in real time."
          description="Enter your order code to view the current status — whether you're dining in, picking up, or waiting for delivery."
        />
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <input
            value={code}
            onChange={(e) => { setCode(e.target.value.toUpperCase()); setSubmitted(false) }}
            placeholder="Enter order code  (e.g. KB-20260522-ABC123)"
            className="min-w-0 flex-1 rounded-full border border-white/10 bg-white/5 px-5 py-4 text-cream outline-none transition focus:border-gold-primary"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full bg-gold-primary px-7 py-4 text-sm font-semibold uppercase tracking-[0.25em] text-bg-main transition hover:bg-gold-light"
          >
            Track order
          </button>
        </form>
      </section>

      {/* ── Found ── */}
      {order && (
        <section className="space-y-6 rounded-[3rem] border border-white/10 bg-bg-surface/90 p-7 shadow-soft sm:p-10">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-cream-muted">Order code</p>
              <p className="mt-1 text-2xl font-semibold text-cream sm:text-3xl">{order.id}</p>
              <p className="mt-1 text-sm text-cream-muted">{order.customer} · {order.contact}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {/* Order type badge */}
              <span className="inline-flex items-center gap-2 rounded-full border border-gold-primary/30 bg-gold-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-gold-primary">
                <i className={`fa-solid ${orderTypeCfg.icon} text-[0.65rem]`} />
                {orderTypeCfg.label}
              </span>
              {/* Status badge */}
              <span className={`inline-flex items-center rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] ${
                order.status === 'Ready'
                  ? 'bg-gold-primary/10 text-gold-primary'
                  : order.status === 'Preparing'
                  ? 'bg-blue-500/10 text-blue-400'
                  : 'bg-white/10 text-cream/70'
              }`}>
                {order.status === 'Ready' ? steps[2].label : order.status}
              </span>
            </div>
          </div>

          {/* Progress stepper */}
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 sm:p-6">
            <div className="flex items-center gap-1">
              {steps.map((step, idx) => {
                const isPast = idx < currentStep
                const isActive = idx === currentStep
                return (
                  <div key={step.label} className="flex flex-1 items-center">
                    <div className="flex flex-1 flex-col items-center gap-2">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-full border text-xs font-semibold transition ${
                        isActive ? 'border-gold-primary bg-gold-primary text-bg-main'
                        : isPast ? 'border-gold-primary/40 bg-gold-primary/10 text-gold-primary'
                        : 'border-white/10 bg-white/5 text-cream/25'
                      }`}>
                        {isPast ? <i className="fa-solid fa-check text-[0.6rem]" /> : idx + 1}
                      </div>
                      <span className={`text-center text-[0.6rem] uppercase leading-tight tracking-[0.2em] ${
                        isActive ? 'text-gold-primary' : isPast ? 'text-cream/50' : 'text-cream/25'
                      }`}>
                        {step.label}
                      </span>
                    </div>
                    {idx < steps.length - 1 && (
                      <div className={`mx-1 h-px flex-1 ${idx < currentStep ? 'bg-gold-primary/40' : 'bg-white/10'}`} />
                    )}
                  </div>
                )
              })}
            </div>
            <p className="mt-4 text-center text-sm text-cream-muted">{steps[currentStep]?.description}</p>
          </div>

          {/* Delivery address */}
          {order.orderType === 'delivery' && order.address && (
            <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm">
              <i className="fa-solid fa-location-dot mt-0.5 shrink-0 text-gold-primary/60" />
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-cream-muted">Delivery address</p>
                <p className="mt-1 text-cream">{order.address}</p>
              </div>
            </div>
          )}

          {/* Items + total */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-cream-muted">Items ordered</p>
              <ul className="mt-3 space-y-2">
                {order.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-cream">
                    <i className="fa-solid fa-mug-hot text-xs text-gold-primary/50" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-cream-muted">Payment</p>
              <p className="mt-3 text-sm text-cream">{order.paymentMethod}</p>
              <p className="mt-4 text-xs uppercase tracking-[0.3em] text-cream-muted">Total</p>
              <p className="mt-1 text-2xl font-semibold text-gold-primary">{formatCurrency(order.amount)}</p>
            </div>
          </div>
        </section>
      )}

      {/* ── Not found ── */}
      {notFound && (
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-10 text-center">
          <i className="fa-solid fa-circle-xmark text-3xl text-red-400/50" />
          <p className="mt-4 text-lg font-semibold text-cream">Order not found</p>
          <p className="mt-2 text-sm leading-7 text-cream-muted">
            Check your order code and try again. Codes look like <span className="text-cream">KB-20260522-ABC123</span>.
          </p>
        </div>
      )}
    </div>
  )
}
