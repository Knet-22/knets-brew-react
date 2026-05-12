import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase, peso } from '../../lib/supabase.js'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0, activeOrders: 0, todayRevenue: 0, totalRevenue: 0, productCount: 0, lowStock: 0
  })
  const [recentOrders, setRecentOrders] = useState([])
  const [topProducts, setTopProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const today = new Date().toISOString().split('T')[0]

      const [
        { count: totalOrders },
        { count: activeOrders },
        { data: todayOrders },
        { data: allCompleted },
        { count: productCount },
        { data: lowStockData },
        { data: recent }
      ] = await Promise.all([
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }).not('status', 'in', '("completed","cancelled")'),
        supabase.from('orders').select('total').eq('status', 'completed').gte('created_at', today).lt('created_at', today + 'T23:59:59'),
        supabase.from('orders').select('total').eq('status', 'completed'),
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('id').lte('stock', 5).eq('is_available', 1),
        supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(6)
      ])

      // Top products
      const { data: items } = await supabase.from('order_items')
        .select('product_name, quantity, subtotal').limit(500)
      const productMap = {}
      ;(items || []).forEach(it => {
        if (!productMap[it.product_name]) {
          productMap[it.product_name] = { name: it.product_name, qty: 0, revenue: 0 }
        }
        productMap[it.product_name].qty += it.quantity
        productMap[it.product_name].revenue += Number(it.subtotal)
      })
      const top = Object.values(productMap).sort((a, b) => b.qty - a.qty).slice(0, 5)

      setStats({
        totalOrders: totalOrders || 0,
        activeOrders: activeOrders || 0,
        todayRevenue: (todayOrders || []).reduce((s, o) => s + Number(o.total || 0), 0),
        totalRevenue: (allCompleted || []).reduce((s, o) => s + Number(o.total || 0), 0),
        productCount: productCount || 0,
        lowStock: (lowStockData || []).length
      })
      setRecentOrders(recent || [])
      setTopProducts(top)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div className="loader">Loading dashboard</div>

  return (
    <>
      <div className="page-title-bar">
        <div>
          <h1>Welcome <em>back</em></h1>
          <p>Here's what's happening at the bar today.</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card gold">
          <div className="stat-icon"><i className="fas fa-receipt"></i></div>
          <div className="stat-info">
            <p>Total Orders</p>
            <h3>{stats.totalOrders}</h3>
          </div>
        </div>
        <div className="stat-card warning">
          <div className="stat-icon"><i className="fas fa-clock"></i></div>
          <div className="stat-info">
            <p>Active Orders</p>
            <h3>{stats.activeOrders}</h3>
          </div>
        </div>
        <div className="stat-card success">
          <div className="stat-icon"><i className="fas fa-money-bill-wave"></i></div>
          <div className="stat-info">
            <p>Today's Revenue</p>
            <h3>{peso(stats.todayRevenue)}</h3>
          </div>
        </div>
        <div className="stat-card copper">
          <div className="stat-icon"><i className="fas fa-chart-line"></i></div>
          <div className="stat-info">
            <p>Total Revenue</p>
            <h3>{peso(stats.totalRevenue)}</h3>
          </div>
        </div>
        <div className="stat-card info">
          <div className="stat-icon"><i className="fas fa-box-open"></i></div>
          <div className="stat-info">
            <p>Products</p>
            <h3>{stats.productCount}</h3>
          </div>
        </div>
        <div className="stat-card warning">
          <div className="stat-icon"><i className="fas fa-exclamation-triangle"></i></div>
          <div className="stat-info">
            <p>Low Stock</p>
            <h3>{stats.lowStock}</h3>
          </div>
        </div>
      </div>

      <div className="dash-grid">
        <div className="data-card">
          <div className="data-card-header">
            <h3><i className="fas fa-receipt"></i> Recent Orders</h3>
            <Link to="/admin/orders" className="btn btn-outline btn-sm">View all</Link>
          </div>
          <div className="table-wrap">
            {recentOrders.length === 0 ? (
              <div className="empty-state"><i className="fas fa-receipt"></i><p>No orders yet.</p></div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr><th>Code</th><th>Customer</th><th>Total</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {recentOrders.map(o => (
                    <tr key={o.id}>
                      <td style={{ color: 'var(--gold)', fontSize: '.8rem' }}>{o.order_code}</td>
                      <td>{o.customer_name}</td>
                      <td>{peso(o.total)}</td>
                      <td><span className={`badge badge-${o.status}`}>{o.status.replace('_', ' ')}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="data-card">
          <div className="data-card-header">
            <h3><i className="fas fa-trophy"></i> Top Products</h3>
          </div>
          <div style={{ padding: '1rem 1.5rem 1.5rem' }}>
            {topProducts.length === 0 ? (
              <div className="empty-state"><i className="fas fa-trophy"></i><p>No sales data yet.</p></div>
            ) : (
              topProducts.map((p, i) => (
                <div key={p.name} className="top-row">
                  <span className="rank">#{i + 1}</span>
                  <div className="top-info">
                    <div className="top-name">{p.name}</div>
                    <div className="top-meta">{p.qty} sold · {peso(p.revenue)}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <style>{`
        .dash-grid {
          display: grid;
          grid-template-columns: 1.6fr 1fr;
          gap: 1.5rem;
        }
        @media (max-width: 1000px) { .dash-grid { grid-template-columns: 1fr; } }
        .top-row {
          display: flex; align-items: center; gap: 1rem;
          padding: .8rem 0;
          border-bottom: 1px solid var(--border-l);
        }
        .top-row:last-child { border-bottom: none; }
        .rank {
          font-family: 'Playfair Display', serif;
          font-size: 1.4rem;
          color: var(--gold);
          min-width: 36px;
        }
        .top-name { color: var(--cream); font-size: .9rem; }
        .top-meta { color: var(--text-l); font-size: .78rem; }
      `}</style>
    </>
  )
}
