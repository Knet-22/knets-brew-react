import { products } from '../../data/products'
import { getNotifications } from '../../data/admin'
import { useAuth } from '../../context/AuthContext'

export default function AdminDashboard() {
  const { user } = useAuth()
  const notifications = getNotifications(user?.role ?? 'admin')
  const totalProducts = products.length
  const totalOrders = 47
  const totalRevenue = 48320
  const pendingOrders = 8

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-cream-muted">Dashboard</p>
          <h1 className="mt-2 text-4xl font-semibold text-cream">Welcome back</h1>
        </div>
        <div className="text-sm text-cream-muted">
          <p>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="surface-glow rounded-[2rem] border border-white/10 bg-bg-surface/90 p-6 shadow-soft">
          <p className="text-xs uppercase tracking-[0.35em] text-cream-muted">Total orders</p>
          <p className="mt-4 text-4xl font-semibold text-cream">{totalOrders}</p>
          <p className="mt-2 text-sm text-cream-muted">+12 this week</p>
        </div>
        <div className="surface-glow rounded-[2rem] border border-white/10 bg-bg-surface/90 p-6 shadow-soft">
          <p className="text-xs uppercase tracking-[0.35em] text-cream-muted">Pending</p>
          <p className="mt-4 text-4xl font-semibold text-cream">{pendingOrders}</p>
          <p className="mt-2 text-sm text-cream-muted">Awaiting pickup</p>
        </div>
        <div className="surface-glow rounded-[2rem] border border-white/10 bg-bg-surface/90 p-6 shadow-soft">
          <p className="text-xs uppercase tracking-[0.35em] text-cream-muted">Products</p>
          <p className="mt-4 text-4xl font-semibold text-cream">{totalProducts}</p>
          <p className="mt-2 text-sm text-cream-muted">In inventory</p>
        </div>
        <div className="surface-glow rounded-[2rem] border border-white/10 bg-bg-surface/90 p-6 shadow-soft">
          <p className="text-xs uppercase tracking-[0.35em] text-cream-muted">Revenue</p>
          <p className="mt-4 text-4xl font-semibold text-cream">₱{(totalRevenue / 1000).toFixed(0)}k</p>
          <p className="mt-2 text-sm text-cream-muted">This month</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="col-span-2 surface-glow rounded-[2rem] border border-white/10 bg-bg-surface/90 p-8 shadow-soft">
          <h2 className="mb-6 text-2xl font-semibold text-cream">Recent orders</h2>
          <div className="space-y-4">
            {[
              { code: 'KB-A9X2M1', customer: 'Maria Santos', amount: 680, status: 'Ready' },
              { code: 'KB-F3K8L2', customer: 'Juan Dela Cruz', amount: 540, status: 'Preparing' },
              { code: 'KB-R7P5V9', customer: 'Rosa Garcia', amount: 360, status: 'Confirmed' },
              { code: 'KB-Q2W8T4', customer: 'Michael Lee', amount: 280, status: 'Ready' },
            ].map((order) => (
              <div key={order.code} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
                <div>
                  <p className="font-semibold text-cream">{order.code}</p>
                  <p className="text-sm text-cream-muted">{order.customer}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gold-primary">₱{order.amount}</p>
                  <span className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] ${
                    order.status === 'Ready' ? 'bg-gold-primary/10 text-gold-primary' :
                    order.status === 'Preparing' ? 'bg-blue-500/10 text-blue-400' :
                    'bg-white/10 text-cream/70'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="surface-glow rounded-[2rem] border border-white/10 bg-bg-surface/90 p-8 shadow-soft">
          <h2 className="mb-6 text-2xl font-semibold text-cream">Top products</h2>
          <div className="space-y-4">
            {products.slice(0, 4).map((product) => (
              <div key={product.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold text-cream">{product.name}</p>
                <p className="mt-1 text-xs text-cream-muted">12 sold this month</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="surface-glow rounded-[2rem] border border-white/10 bg-bg-surface/90 p-8 shadow-soft">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-cream-muted">Notifications</p>
            <h2 className="mt-2 text-2xl font-semibold text-cream">Latest alerts</h2>
          </div>
          <span className="rounded-full bg-gold-primary/10 px-3 py-1 text-sm font-semibold text-gold-primary">
            {notifications.length} new
          </span>
        </div>
        <div className="mt-6 space-y-4">
          {notifications.map((notification) => (
            <div key={notification.id} className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-semibold text-cream">{notification.title}</p>
                <span className="text-[0.65rem] uppercase tracking-[0.3em] text-cream-muted">{notification.date}</span>
              </div>
              <p className="mt-2 text-sm leading-6 text-cream-muted">{notification.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
