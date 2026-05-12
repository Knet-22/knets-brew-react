import { useEffect, useState } from 'react'
import { supabase, peso } from '../../lib/supabase.js'

const STATUSES = ['received','preparing','ready','out_for_delivery','completed','cancelled']

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [viewing, setViewing] = useState(null)
  const [viewingItems, setViewingItems] = useState([])

  const load = async () => {
    setLoading(true)
    let q = supabase.from('orders').select('*').order('created_at', { ascending: false })
    if (statusFilter) q = q.eq('status', statusFilter)
    if (dateFilter) {
      q = q.gte('created_at', dateFilter).lt('created_at', dateFilter + 'T23:59:59')
    }
    const { data } = await q
    let result = data || []
    if (search.trim()) {
      const s = search.trim().toLowerCase()
      result = result.filter(o =>
        o.customer_name.toLowerCase().includes(s) ||
        o.order_code.toLowerCase().includes(s) ||
        o.customer_phone.toLowerCase().includes(s)
      )
    }
    setOrders(result); setLoading(false)
  }

  useEffect(() => { load() }, [statusFilter, dateFilter]) // eslint-disable-line

  const openOrder = async (o) => {
    setViewing(o)
    const { data } = await supabase.from('order_items').select('*').eq('order_id', o.id)
    setViewingItems(data || [])
  }

  const updateStatus = async (id, newStatus) => {
    await supabase.from('orders').update({ status: newStatus, updated_at: new Date().toISOString() }).eq('id', id)

    // Add notification for status change
    const order = orders.find(o => o.id === id)
    if (order) {
      await supabase.from('notifications').insert({
        type: 'order_update',
        title: `Order ${order.order_code} → ${newStatus.replace('_', ' ')}`,
        message: `${order.customer_name}'s order status updated.`,
        link: `/admin/orders`
      })
    }

    if (viewing?.id === id) setViewing({ ...viewing, status: newStatus })
    load()
  }

  return (
    <>
      <div className="page-title-bar">
        <div>
          <h1>Orders</h1>
          <p>{orders.length} {orders.length === 1 ? 'order' : 'orders'} found</p>
        </div>
      </div>

      <div className="data-card">
        <div className="filter-bar">
          <input
            type="text" className="form-control" placeholder="Search name, code, phone..."
            value={search} onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && load()}
            style={{ flex: 1, minWidth: 200 }}
          />
          <select className="form-control" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">All Statuses</option>
            {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
          </select>
          <input type="date" className="form-control" value={dateFilter} onChange={e => setDateFilter(e.target.value)} />
          <button className="btn btn-primary btn-sm" onClick={load}><i className="fas fa-search"></i> Filter</button>
          <button className="btn btn-outline btn-sm" onClick={() => { setSearch(''); setStatusFilter(''); setDateFilter(''); }}>Clear</button>
        </div>

        <div className="table-wrap">
          {loading ? <div className="loader">Loading</div> :
           orders.length === 0 ? (
             <div className="empty-state"><i className="fas fa-receipt"></i><p>No orders match your filters.</p></div>
           ) : (
            <table className="data-table">
              <thead>
                <tr><th>Code</th><th>Customer</th><th>Type</th><th>Total</th><th>Status</th><th>Placed</th><th></th></tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id}>
                    <td style={{ color: 'var(--gold)', fontSize: '.8rem' }}>{o.order_code}</td>
                    <td>
                      <div>{o.customer_name}</div>
                      <div style={{ fontSize: '.78rem', color: 'var(--text-l)' }}>{o.customer_phone}</div>
                    </td>
                    <td style={{ textTransform: 'capitalize' }}>{o.delivery_type}</td>
                    <td>{peso(o.total)}</td>
                    <td><span className={`badge badge-${o.status}`}>{o.status.replace('_', ' ')}</span></td>
                    <td style={{ fontSize: '.8rem', color: 'var(--text-l)' }}>
                      {new Date(o.created_at).toLocaleString()}
                    </td>
                    <td>
                      <button className="action-icon" onClick={() => openOrder(o)} title="View"><i className="fas fa-eye"></i></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {viewing && (
        <div className="modal-backdrop" onClick={() => setViewing(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <h3><i className="fas fa-receipt"></i> {viewing.order_code}</h3>
              <button className="modal-close" onClick={() => setViewing(null)}><i className="fas fa-times"></i></button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                <div><span className="label-text">Customer</span><div>{viewing.customer_name}</div></div>
                <div><span className="label-text">Phone</span><div>{viewing.customer_phone}</div></div>
                <div><span className="label-text">Type</span><div style={{ textTransform: 'capitalize' }}>{viewing.delivery_type}</div></div>
                <div><span className="label-text">Payment</span><div style={{ textTransform: 'uppercase' }}>{viewing.payment_method}</div></div>
                {viewing.delivery_address && (
                  <div style={{ gridColumn: '1 / -1' }}>
                    <span className="label-text">Address</span><div>{viewing.delivery_address}</div>
                  </div>
                )}
                {viewing.special_requests && (
                  <div style={{ gridColumn: '1 / -1' }}>
                    <span className="label-text">Notes</span><div>{viewing.special_requests}</div>
                  </div>
                )}
              </div>

              <h4 style={{ marginTop: '1.5rem', color: 'var(--gold)', fontFamily: 'Inter, sans-serif', fontSize: '.72rem', letterSpacing: '.25em', textTransform: 'uppercase', fontWeight: 500 }}>Items</h4>
              <table className="data-table" style={{ marginTop: '.5rem' }}>
                <tbody>
                  {viewingItems.map(it => (
                    <tr key={it.id}>
                      <td style={{ color: 'var(--gold)' }}>×{it.quantity}</td>
                      <td>{it.product_name}</td>
                      <td style={{ textAlign: 'right', color: 'var(--gold)' }}>{peso(it.subtotal)}</td>
                    </tr>
                  ))}
                  <tr><td colSpan="3" style={{ textAlign: 'right', borderTop: '1px solid var(--border)', paddingTop: '.8rem', fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', color: 'var(--gold)' }}>
                    Total: {peso(viewing.total)}
                  </td></tr>
                </tbody>
              </table>

              <h4 style={{ marginTop: '1.5rem', color: 'var(--gold)', fontFamily: 'Inter, sans-serif', fontSize: '.72rem', letterSpacing: '.25em', textTransform: 'uppercase', fontWeight: 500 }}>Update Status</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem', marginTop: '.5rem' }}>
                {STATUSES.map(s => (
                  <button
                    key={s}
                    onClick={() => updateStatus(viewing.id, s)}
                    className={`btn btn-sm ${viewing.status === s ? 'btn-primary' : 'btn-outline'}`}
                  >
                    {s.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .detail-grid > div .label-text { display: block; margin-bottom: .2rem; }
        .detail-grid > div > div:last-child { color: var(--text); font-size: .92rem; }
        @media (max-width: 500px) { .detail-grid { grid-template-columns: 1fr; } }
      `}</style>
    </>
  )
}
