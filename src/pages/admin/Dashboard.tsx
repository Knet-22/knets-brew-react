import { getNotifications } from '../../data/admin'
import { useAuth } from '../../context/AuthContext'
import { useProducts } from '../../context/ProductsContext'
import { adminOrders } from '../../data/admin'

export default function AdminDashboard() {
  const { user } = useAuth()
  const { products } = useProducts()
  const notifications = getNotifications(user?.role ?? 'admin')

  const totalProducts = products.length
  const totalOrders = adminOrders.length + 42
  const totalRevenue = adminOrders.reduce((sum, o) => sum + o.amount, 0) + 46000
  const pendingOrders = adminOrders.filter((o) => o.status !== 'Ready').length

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-cream-muted">Dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold text-cream sm:text-4xl">
            Welcome back, {user?.name} 👋
          </h1>
        </div>
        <div className="text-sm text-cream-muted">
          {new Date().toLocaleDateString('en-PH', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total orders', value: totalOrders, sub: '+12 this week', icon: 'fa-receipt' },
          { label: 'Pending', value: pendingOrders, sub: 'Awaiting pickup', icon: 'fa-hourglass-half' },
          { label: 'Products', value: totalProducts, sub: 'In inventory', icon: 'fa-coffee' },
          {
            label: 'Revenue',
            value: `₱${(totalRevenue / 1000).toFixed(0)}k`,
            sub: 'This month',
            icon: 'fa-peso-sign',
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="surface-glow rounded-[2rem] border border-white/10 bg-bg-surface/90 p-5 shadow-soft sm:p-6"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs uppercase tracking-[0.3em] text-cream-muted">{stat.label}</p>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gold-primary/10 text-gold-primary">
                <i className={`fa-solid ${stat.icon} text-xs`} />
              </span>
            </div>
            <p className="mt-3 text-3xl font-semibold text-cream sm:text-4xl">{stat.value}</p>
            <p className="mt-1.5 text-xs text-cream-muted">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Recent orders + top products */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="col-span-1 surface-glow rounded-[2rem] border border-white/10 bg-bg-surface/90 p-6 shadow-soft lg:col-span-2 sm:p-8">
          <h2 className="mb-5 text-xl font-semibold text-cream sm:text-2xl">Recent orders</h2>
          <div className="space-y-3">
            {adminOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4"
              >
                <div>
                  <p className="text-sm font-semibold text-cream">{order.id}</p>
                  <p className="text-xs text-cream-muted">{order.customer}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gold-primary">₱{order.amount}</p>
                  <span
                    className={`mt-1 inline-block rounded-full px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] ${
                      order.status === 'Ready'
                        ? 'bg-gold-primary/10 text-gold-primary'
                        : order.status === 'Preparing'
                        ? 'bg-blue-500/10 text-blue-400'
                        : 'bg-white/10 text-cream/60'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="surface-glow rounded-[2rem] border border-white/10 bg-bg-surface/90 p-6 shadow-soft sm:p-8">
          <h2 className="mb-5 text-xl font-semibold text-cream sm:text-2xl">Top products</h2>
          <div className="space-y-3">
            {products.slice(0, 5).map((product) => (
              <div key={product.id} className="rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4">
                <p className="text-sm font-semibold text-cream">{product.name}</p>
                <div className="mt-1 flex items-center justify-between">
                  <p className="text-xs text-cream-muted">
                    Stock: {product.stock}
                    {product.stock <= 5 && (
                      <span className="ml-2 text-amber-400">Low</span>
                    )}
                  </p>
                  <p className="text-xs font-semibold text-gold-primary">₱{product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="surface-glow rounded-[2rem] border border-white/10 bg-bg-surface/90 p-6 shadow-soft sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-cream-muted">Notifications</p>
            <h2 className="mt-1.5 text-xl font-semibold text-cream sm:text-2xl">Latest alerts</h2>
          </div>
          <span className="rounded-full bg-gold-primary/10 px-3 py-1 text-sm font-semibold text-gold-primary">
            {notifications.length}
          </span>
        </div>
        <div className="mt-5 space-y-3">
          {notifications.map((n) => (
            <div key={n.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-start justify-between gap-4">
                <p className="text-sm font-semibold text-cream">{n.title}</p>
                <span className="shrink-0 text-[0.65rem] uppercase tracking-[0.25em] text-cream-muted">{n.date}</span>
              </div>
              <p className="mt-1.5 text-sm leading-6 text-cream-muted">{n.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
