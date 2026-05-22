import { useState } from 'react'
import { adminOrders, type AdminOrder, type OrderStatus } from '../../data/admin'
import { useAuth } from '../../context/AuthContext'

const STATUS_FLOW: OrderStatus[] = ['Confirmed', 'Preparing', 'Ready']

const STATUS_STYLES: Record<OrderStatus, string> = {
  Confirmed: 'bg-white/10 text-cream/70',
  Preparing: 'bg-blue-500/10 text-blue-400',
  Ready: 'bg-gold-primary/10 text-gold-primary',
}

const STATUS_ICONS: Record<OrderStatus, string> = {
  Confirmed: 'fa-circle-check',
  Preparing: 'fa-fire-burner',
  Ready: 'fa-bell',
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  Confirmed: 'Confirmed',
  Preparing: 'Preparing',
  Ready: 'Ready for Pickup',
}

// Button label for advancing to next status
const ADVANCE_LABELS: Partial<Record<OrderStatus, string>> = {
  Confirmed: 'Start Preparing',
  Preparing: 'Mark Ready',
}

export default function AdminOrders() {
  const { user } = useAuth()
  const isStaff = user?.role === 'staff'

  // Local state for order statuses (staff can update these)
  const [statuses, setStatuses] = useState<Record<string, OrderStatus>>(
    () => Object.fromEntries(adminOrders.map((o) => [o.id, o.status])),
  )
  const [selectedId, setSelectedId] = useState<string | null>(adminOrders[0]?.id ?? null)

  const selectedOrder = adminOrders.find((o) => o.id === selectedId) ?? null
  const selectedStatus = selectedId ? statuses[selectedId] : null

  const advanceStatus = (id: string) => {
    const current = statuses[id]
    const idx = STATUS_FLOW.indexOf(current)
    if (idx < STATUS_FLOW.length - 1) {
      setStatuses((prev) => ({ ...prev, [id]: STATUS_FLOW[idx + 1] }))
    }
  }

  const setStatus = (id: string, status: OrderStatus) => {
    setStatuses((prev) => ({ ...prev, [id]: status }))
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-cream-muted">Management</p>
          <h1 className="mt-2 text-3xl font-semibold text-cream sm:text-4xl">Orders</h1>
          <p className="mt-1 text-sm text-cream-muted">
            {isStaff
              ? 'Tap an order to view details and update its status.'
              : 'View all incoming orders. Contact staff to update statuses.'}
          </p>
        </div>
        {/* Role badge */}
        <span
          className={`self-start rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] sm:self-auto ${
            isStaff
              ? 'border-blue-500/30 bg-blue-500/10 text-blue-400'
              : 'border-gold-primary/30 bg-gold-primary/10 text-gold-primary'
          }`}
        >
          <i className={`fa-solid ${isStaff ? 'fa-user-gear' : 'fa-crown'} mr-2`} />
          {isStaff ? 'Staff view' : 'Admin view'}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        {/* Order list */}
        <div className="surface-glow rounded-[2rem] border border-white/10 bg-bg-surface/90 p-4 shadow-soft sm:p-6">
          <div className="space-y-3">
            {adminOrders.map((order) => {
              const status = statuses[order.id]
              const isSelected = selectedId === order.id
              return (
                <button
                  key={order.id}
                  type="button"
                  onClick={() => setSelectedId(order.id)}
                  className={`w-full rounded-2xl border p-4 text-left transition sm:p-5 ${
                    isSelected
                      ? 'border-gold-primary bg-gold-primary/5'
                      : 'border-white/10 bg-white/5 hover:border-gold-primary/40 hover:bg-white/8'
                  }`}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-cream">{order.id}</p>
                        {isSelected && (
                          <span className="rounded-full bg-gold-primary/20 px-2 py-0.5 text-[0.6rem] uppercase tracking-[0.2em] text-gold-primary">
                            Selected
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-sm text-cream-muted">{order.customer}</p>
                      <p className="mt-1 truncate text-xs text-cream-muted">{order.items.join(', ')}</p>
                    </div>
                    <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-start">
                      <span className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] ${STATUS_STYLES[status]}`}>
                        <i className={`fa-solid ${STATUS_ICONS[status]} mr-1.5`} />
                        {STATUS_LABELS[status]}
                      </span>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gold-primary">₱{order.amount}</p>
                        <p className="text-xs text-cream-muted">{order.date}</p>
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Order detail panel */}
        {selectedOrder && selectedStatus ? (
          <div className="surface-glow h-fit rounded-[2rem] border border-white/10 bg-bg-surface/90 p-5 shadow-soft sm:p-7">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold text-cream">Order details</h2>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-cream transition hover:border-gold-primary hover:text-gold-primary"
              >
                <i className="fa-solid fa-xmark text-sm" />
              </button>
            </div>

            {/* Status stepper */}
            <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="mb-3 text-xs uppercase tracking-[0.3em] text-cream-muted">Status</p>
              <div className="flex items-center gap-1">
                {STATUS_FLOW.map((step, idx) => {
                  const currentIdx = STATUS_FLOW.indexOf(selectedStatus)
                  const isPast = idx < currentIdx
                  const isActive = idx === currentIdx
                  return (
                    <div key={step} className="flex flex-1 items-center">
                      <div className="flex flex-1 flex-col items-center gap-1.5">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs transition ${
                            isActive
                              ? 'border-gold-primary bg-gold-primary text-bg-main font-bold'
                              : isPast
                              ? 'border-gold-primary/40 bg-gold-primary/10 text-gold-primary'
                              : 'border-white/10 bg-white/5 text-cream/30'
                          }`}
                        >
                          {isPast ? <i className="fa-solid fa-check text-[0.6rem]" /> : idx + 1}
                        </div>
                        <span className={`text-center text-[0.6rem] uppercase tracking-[0.2em] leading-tight ${isActive ? 'text-gold-primary' : isPast ? 'text-cream/50' : 'text-cream/25'}`}>
                          {step === 'Ready' ? 'Ready' : step}
                        </span>
                      </div>
                      {idx < STATUS_FLOW.length - 1 && (
                        <div className={`h-px flex-1 mx-1 ${idx < currentIdx ? 'bg-gold-primary/40' : 'bg-white/10'}`} />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Staff status controls */}
            {isStaff && (
              <div className="mb-5 space-y-2">
                <p className="text-xs uppercase tracking-[0.3em] text-cream-muted">Update status</p>
                <div className="flex flex-col gap-2">
                  {STATUS_FLOW.map((step) => (
                    <button
                      key={step}
                      type="button"
                      onClick={() => setStatus(selectedOrder.id, step)}
                      className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                        selectedStatus === step
                          ? 'border-gold-primary bg-gold-primary/10 text-gold-primary'
                          : 'border-white/10 bg-white/5 text-cream/60 hover:border-gold-primary/40 hover:text-cream'
                      }`}
                    >
                      <i className={`fa-solid ${STATUS_ICONS[step]} w-4`} />
                      {STATUS_LABELS[step]}
                      {selectedStatus === step && (
                        <i className="fa-solid fa-circle-check ml-auto text-gold-primary" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Quick advance button */}
                {ADVANCE_LABELS[selectedStatus] && (
                  <button
                    type="button"
                    onClick={() => advanceStatus(selectedOrder.id)}
                    className="mt-2 w-full rounded-2xl bg-gold-light py-3 text-sm font-semibold uppercase tracking-[0.22em] text-bg-main shadow-[0_0_18px_rgba(196,154,108,0.3)] transition hover:bg-gold-primary"
                  >
                    <i className="fa-solid fa-arrow-right mr-2" />
                    {ADVANCE_LABELS[selectedStatus]}
                  </button>
                )}
              </div>
            )}

            {/* Order info */}
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <p className="text-xs uppercase tracking-[0.25em] text-cream-muted">Customer</p>
                  <p className="mt-1 font-semibold text-cream">{selectedOrder.customer}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <p className="text-xs uppercase tracking-[0.25em] text-cream-muted">Contact</p>
                  <p className="mt-1 text-cream-muted">{selectedOrder.contact}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <p className="text-xs uppercase tracking-[0.25em] text-cream-muted">Payment</p>
                  <p className="mt-1 font-semibold text-cream">{selectedOrder.paymentMethod}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <p className="text-xs uppercase tracking-[0.25em] text-cream-muted">Total</p>
                  <p className="mt-1 font-semibold text-gold-primary">₱{selectedOrder.amount}</p>
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="mb-2 text-xs uppercase tracking-[0.25em] text-cream-muted">Items ordered</p>
                <ul className="space-y-1.5">
                  {selectedOrder.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-cream">
                      <i className="fa-solid fa-mug-hot text-xs text-gold-primary/60" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Admin-only info */}
              {!isStaff && (
                <p className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-400/80">
                  <i className="fa-solid fa-circle-info mr-2" />
                  As admin, contact a staff member to update order statuses.
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="hidden lg:flex items-center justify-center rounded-[2rem] border border-dashed border-white/10 bg-white/5 p-12 text-center">
            <div>
              <i className="fa-solid fa-receipt text-3xl text-gold-primary/20" />
              <p className="mt-3 text-sm text-cream-muted">Select an order to view details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
