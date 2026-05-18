import { useState } from 'react'

const mockOrders = [
  {
    id: 'KB-A9X2M1',
    customer: 'Maria Santos',
    contact: '0966 364 0516',
    items: ['Black Ivory', 'House Espresso'],
    amount: 680,
    status: 'Ready' as const,
    date: '2026-05-16',
    paymentMethod: 'Cash',
  },
  {
    id: 'KB-F3K8L2',
    customer: 'Juan Dela Cruz',
    contact: 'juan@email.com',
    items: ['Kopi Luwak'],
    amount: 540,
    status: 'Preparing' as const,
    date: '2026-05-16',
    paymentMethod: 'GCash',
  },
  {
    id: 'KB-R7P5V9',
    customer: 'Rosa Garcia',
    contact: '0917 555 2841',
    items: ['Panama Geisha', 'Gold Cold Brew'],
    amount: 360,
    status: 'Confirmed' as const,
    date: '2026-05-15',
    paymentMethod: 'Card',
  },
  {
    id: 'KB-Q2W8T4',
    customer: 'Michael Lee',
    contact: 'michael.lee@work.com',
    items: ['Blue Mountain'],
    amount: 280,
    status: 'Ready' as const,
    date: '2026-05-15',
    paymentMethod: 'Cash',
  },
  {
    id: 'KB-Z5L9M3',
    customer: 'Ana Rodriguez',
    contact: '0908 777 1234',
    items: ['Ethiopian Geisha', 'House Espresso'],
    amount: 320,
    status: 'Confirmed' as const,
    date: '2026-05-14',
    paymentMethod: 'GCash',
  },
]

const statusColors = {
  Ready: 'bg-gold-primary/10 text-gold-primary',
  Preparing: 'bg-blue-500/10 text-blue-400',
  Confirmed: 'bg-white/10 text-cream/70',
}

export default function AdminOrders() {
  const [selectedOrder, setSelectedOrder] = useState<typeof mockOrders[0] | null>(null)

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-cream-muted">Management</p>
        <h1 className="mt-2 text-4xl font-semibold text-cream">Orders</h1>
      </div>

      <div className="surface-glow rounded-[2rem] border border-white/10 bg-bg-surface/90 p-8 shadow-soft">
        <div className="space-y-6">
          {mockOrders.map((order) => (
            <button
              key={order.id}
              type="button"
              onClick={() => setSelectedOrder(order)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 p-6 text-left transition hover:border-gold-primary hover:bg-white/10"
            >
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <p className="font-semibold text-cream">{order.id}</p>
                  <p className="text-sm text-cream-muted">{order.customer}</p>
                  <p className="mt-2 text-xs text-cream-muted">{order.items.join(', ')}</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="font-semibold text-gold-primary">₱{order.amount}</p>
                    <p className="text-xs text-cream-muted">{order.date}</p>
                  </div>
                  <span className={`rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.25em] ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedOrder && (
        <div className="surface-glow rounded-[2rem] border border-white/10 bg-bg-surface/90 p-8 shadow-soft">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold text-cream">Order details</h2>
            <button
              type="button"
              onClick={() => setSelectedOrder(null)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-cream transition hover:border-gold-primary hover:text-gold-primary"
            >
              <i className="fa-solid fa-xmark" />
            </button>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-3">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-cream-muted">Code</p>
                <p className="mt-2 text-lg font-semibold text-cream">{selectedOrder.id}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-cream-muted">Customer</p>
                <p className="mt-2 text-lg font-semibold text-cream">{selectedOrder.customer}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-cream-muted">Contact</p>
                <p className="mt-2 text-sm text-cream-muted">{selectedOrder.contact}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-cream-muted">Status</p>
                <span className={`mt-2 inline-block rounded-full px-4 py-2 text-sm font-semibold uppercase tracking-[0.25em] ${statusColors[selectedOrder.status]}`}>
                  {selectedOrder.status}
                </span>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-cream-muted">Payment</p>
                <p className="mt-2 text-sm text-cream-muted">{selectedOrder.paymentMethod}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-cream-muted">Total</p>
                <p className="mt-2 text-lg font-semibold text-gold-primary">₱{selectedOrder.amount}</p>
              </div>
            </div>
          </div>
          <div className="mt-6 space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.35em] text-cream-muted">Items</p>
            <ul className="space-y-2">
              {selectedOrder.items.map((item) => (
                <li key={item} className="text-sm text-cream">• {item}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
