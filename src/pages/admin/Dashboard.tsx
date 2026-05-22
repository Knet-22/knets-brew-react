import { Link } from 'react-router-dom'
import { getNotifications, adminOrders, type OrderStatus } from '../../data/admin'
import { useAuth } from '../../context/AuthContext'
import { useProducts } from '../../context/ProductsContext'

const STATUS_STYLES: Record<OrderStatus, string> = {
  Confirmed: 'bg-white/10 text-cream/70',
  Preparing: 'bg-blue-500/10 text-blue-400',
  Ready: 'bg-gold-primary/10 text-gold-primary',
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const { products } = useProducts()
  const notifications = getNotifications(user?.role ?? 'staff')
  const isAdmin = user?.role === 'admin'

  const totalOrders = adminOrders.length + 42
  const totalRevenue = adminOrders.reduce((sum, o) => sum + o.amount, 0) + 46000
  const pendingOrders = adminOrders.filter((o) => o.status !== 'Ready').length
  const lowStock = products.filter((p) => p.stock <= 5)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-cream-muted">
            {isAdmin ? 'Admin Dashboard' : 'Staff Dashboard'}
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-cream sm:text-4xl">
            Welcome back, {user?.name}
          </h1>
        </div>
        <p className="text-sm text-cream-muted">
          {new Date().toLocaleDateString('en-PH', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </p>
      </div>

      {/* ── ADMIN VIEW ──────────────────────────────────────────────────────── */}
      {isAdmin && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              { label: 'Total orders', value: totalOrders, sub: '+12 this week', icon: 'fa-receipt', color: 'text-gold-primary' },
              { label: 'Pending', value: pendingOrders, sub: 'Awaiting pickup', icon: 'fa-hourglass-half', color: 'text-blue-400' },
              { label: 'Products', value: products.length, sub: `${lowStock.length} low stock`, icon: 'fa-coffee', color: 'text-cream' },
              { label: 'Revenue', value: `₱${(totalRevenue / 1000).toFixed(0)}k`, sub: 'This month', icon: 'fa-peso-sign', color: 'text-gold-primary' },
            ].map((stat) => (
              <div key={stat.label} className="surface-glow rounded-[2rem] border border-white/10 bg-bg-surface/90 p-5 shadow-soft">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs uppercase tracking-[0.28em] text-cream-muted">{stat.label}</p>
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gold-primary/10 text-gold-primary">
                    <i className={`fa-solid ${stat.icon} text-xs`} />
                  </span>
                </div>
                <p className={`mt-3 text-3xl font-semibold ${stat.color}`}>{stat.value}</p>
                <p className="mt-1 text-xs text-cream-muted">{stat.sub}</p>
              </div>
            ))}
          </div>

          {/* Recent orders + top products */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 surface-glow rounded-[2rem] border border-white/10 bg-bg-surface/90 p-5 shadow-soft sm:p-7">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-cream">Recent orders</h2>
                <Link to="/admin/orders" className="text-xs uppercase tracking-[0.25em] text-gold-primary transition hover:text-gold-light">
                  View all →
                </Link>
              </div>
              <div className="space-y-3">
                {adminOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4">
                    <div>
                      <p className="text-sm font-semibold text-cream">{order.id}</p>
                      <p className="text-xs text-cream-muted">{order.customer}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gold-primary">₱{order.amount}</p>
                      <span className={`mt-1 inline-block rounded-full px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.2em] ${STATUS_STYLES[order.status]}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="surface-glow rounded-[2rem] border border-white/10 bg-bg-surface/90 p-5 shadow-soft sm:p-7">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-cream">Inventory</h2>
                <Link to="/admin/products" className="text-xs uppercase tracking-[0.25em] text-gold-primary transition hover:text-gold-light">
                  Manage →
                </Link>
              </div>
              <div className="space-y-2.5">
                {products.slice(0, 6).map((p) => (
                  <div key={p.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
                    <p className="text-sm text-cream">{p.name}</p>
                    <span className={`text-xs font-semibold ${p.stock <= 5 ? 'text-amber-400' : 'text-cream-muted'}`}>
                      {p.stock <= 5 && <i className="fa-solid fa-triangle-exclamation mr-1" />}
                      {p.stock}
                    </span>
                  </div>
                ))}
              </div>
              {lowStock.length > 0 && (
                <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-400">
                  <i className="fa-solid fa-triangle-exclamation mr-2" />
                  {lowStock.length} item{lowStock.length > 1 ? 's' : ''} running low on stock
                </div>
              )}
            </div>
          </div>

          {/* Notifications preview */}
          <div className="surface-glow rounded-[2rem] border border-white/10 bg-bg-surface/90 p-5 shadow-soft sm:p-7">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-cream-muted">Notifications</p>
                <h2 className="mt-1 text-xl font-semibold text-cream">Latest alerts</h2>
              </div>
              <Link to="/admin/notifications" className="text-xs uppercase tracking-[0.25em] text-gold-primary transition hover:text-gold-light">
                View all →
              </Link>
            </div>
            <div className="space-y-3">
              {notifications.slice(0, 4).map((n) => (
                <div key={n.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-sm font-semibold text-cream">{n.title}</p>
                    <span className="shrink-0 text-[0.6rem] uppercase tracking-[0.2em] text-cream-muted">{n.date}</span>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-cream-muted">{n.description}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── STAFF VIEW ──────────────────────────────────────────────────────── */}
      {!isAdmin && (
        <>
          {/* Quick stats for staff */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {[
              { label: 'Active orders', value: pendingOrders, sub: 'Need attention', icon: 'fa-fire-burner', color: 'text-blue-400' },
              { label: 'Ready to pickup', value: adminOrders.filter((o) => o.status === 'Ready').length, sub: 'Waiting for customer', icon: 'fa-bell', color: 'text-gold-primary' },
              { label: "Today's orders", value: adminOrders.length, sub: 'Total received', icon: 'fa-receipt', color: 'text-cream' },
            ].map((stat) => (
              <div key={stat.label} className="surface-glow rounded-[2rem] border border-white/10 bg-bg-surface/90 p-5 shadow-soft">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs uppercase tracking-[0.28em] text-cream-muted">{stat.label}</p>
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gold-primary/10 text-gold-primary">
                    <i className={`fa-solid ${stat.icon} text-xs`} />
                  </span>
                </div>
                <p className={`mt-3 text-3xl font-semibold ${stat.color}`}>{stat.value}</p>
                <p className="mt-1 text-xs text-cream-muted">{stat.sub}</p>
              </div>
            ))}
          </div>

          {/* Active orders for staff to act on */}
          <div className="surface-glow rounded-[2rem] border border-white/10 bg-bg-surface/90 p-5 shadow-soft sm:p-7">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-cream-muted">Action needed</p>
                <h2 className="mt-1 text-xl font-semibold text-cream">Orders to prepare</h2>
              </div>
              <Link
                to="/admin/orders"
                className="inline-flex items-center gap-2 rounded-full bg-gold-light px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-bg-main shadow-[0_0_14px_rgba(196,154,108,0.3)] transition hover:bg-gold-primary"
              >
                Manage orders
                <i className="fa-solid fa-arrow-right text-[0.6rem]" />
              </Link>
            </div>
            <div className="space-y-3">
              {adminOrders
                .filter((o) => o.status !== 'Ready')
                .map((order) => (
                  <div key={order.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div>
                      <p className="text-sm font-semibold text-cream">{order.id}</p>
                      <p className="text-xs text-cream-muted">{order.customer}</p>
                      <p className="mt-1 text-xs text-cream-muted">{order.items.join(', ')}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`rounded-full px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.2em] ${STATUS_STYLES[order.status]}`}>
                        {order.status}
                      </span>
                      <p className="text-xs font-semibold text-gold-primary">₱{order.amount}</p>
                    </div>
                  </div>
                ))}
              {adminOrders.filter((o) => o.status !== 'Ready').length === 0 && (
                <p className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-sm text-cream-muted">
                  All caught up! No pending orders.
                </p>
              )}
            </div>
          </div>

          {/* Notifications for staff */}
          <div className="surface-glow rounded-[2rem] border border-white/10 bg-bg-surface/90 p-5 shadow-soft sm:p-7">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-cream-muted">Notifications</p>
                <h2 className="mt-1 text-xl font-semibold text-cream">New orders</h2>
              </div>
              <Link to="/admin/notifications" className="text-xs uppercase tracking-[0.25em] text-gold-primary transition hover:text-gold-light">
                View all →
              </Link>
            </div>
            <div className="space-y-3">
              {notifications.slice(0, 5).map((n) => (
                <div key={n.id} className="rounded-2xl border border-gold-primary/20 bg-gold-primary/5 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold-primary/10 text-gold-primary">
                        <i className="fa-solid fa-bell text-xs" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-cream">{n.title}</p>
                        <p className="text-xs text-cream-muted">{n.description}</p>
                      </div>
                    </div>
                    <span className="shrink-0 text-[0.6rem] uppercase tracking-[0.2em] text-cream-muted">{n.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
