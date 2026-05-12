import { useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { supabase } from '../lib/supabase.js'

export default function AdminLayout({ requireAdmin = false }) {
  const { session, staff, loading, signOut, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [notifs, setNotifs] = useState([])
  const [notifOpen, setNotifOpen] = useState(false)
  const bellRef = useRef(null)

  // Poll for notifications every 30s
  useEffect(() => {
    if (!session) return
    const load = async () => {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(15)
      setNotifs(data || [])
    }
    load()
    const interval = setInterval(load, 30000)
    return () => clearInterval(interval)
  }, [session])

  // Close notif dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) setNotifOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  if (loading) return <div className="loader" style={{ minHeight: '100vh' }}>Loading</div>
  if (!session || !staff) return <Navigate to="/admin/login" replace />
  if (requireAdmin && !isAdmin) return <Navigate to="/admin" replace />

  const unreadCount = notifs.filter(n => n.is_read === 0).length

  const handleSignOut = async () => { await signOut(); navigate('/admin/login') }

  const markAsRead = async (id) => {
    await supabase.from('notifications').update({ is_read: 1 }).eq('id', id)
    setNotifs(notifs.map(n => n.id === id ? { ...n, is_read: 1 } : n))
  }
  const markAllRead = async () => {
    await supabase.from('notifications').update({ is_read: 1 }).eq('is_read', 0)
    setNotifs(notifs.map(n => ({ ...n, is_read: 1 })))
  }

  const close = () => setOpen(false)

  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar ${open ? 'open' : ''}`}>
        <div className="admin-brand">
          <i className="fas fa-mug-hot"></i>
          <div>
            <div className="brand-name"><strong>Knet's</strong> Brew</div>
            <div className="brand-sub">{isAdmin ? 'Admin' : 'Staff'} Panel</div>
          </div>
        </div>

        <nav className="admin-nav">
          <NavLink to="/admin" end onClick={close}><i className="fas fa-th-large"></i> Dashboard</NavLink>
          <NavLink to="/admin/orders" onClick={close}><i className="fas fa-receipt"></i> Orders</NavLink>

          {isAdmin && (
            <>
              <div className="nav-section">Management</div>
              <NavLink to="/admin/products" onClick={close}><i className="fas fa-box-open"></i> Products</NavLink>
              <NavLink to="/admin/staff" onClick={close}><i className="fas fa-users"></i> Staff</NavLink>
            </>
          )}

          <div className="nav-section">Account</div>
          <NavLink to="/admin/profile" onClick={close}><i className="fas fa-user"></i> Profile</NavLink>
          <button onClick={handleSignOut} className="nav-signout">
            <i className="fas fa-sign-out-alt"></i> Sign Out
          </button>
        </nav>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <button className="admin-toggle" onClick={() => setOpen(!open)}>
            <i className={`fas ${open ? 'fa-times' : 'fa-bars'}`}></i>
          </button>

          {/* Notification bell */}
          <div className="notif-wrap" ref={bellRef} style={{ marginLeft: 'auto' }}>
            <button className="notif-bell" onClick={() => setNotifOpen(!notifOpen)}>
              <i className="fas fa-bell"></i>
              {unreadCount > 0 && <span className="notif-count">{unreadCount}</span>}
            </button>
            {notifOpen && (
              <div className="notif-dropdown">
                <div className="notif-head">
                  <span>Notifications</span>
                  {unreadCount > 0 && (
                    <button className="notif-mark-all" onClick={markAllRead}>Mark all read</button>
                  )}
                </div>
                <div className="notif-list">
                  {notifs.length === 0 ? (
                    <div className="notif-empty">
                      <i className="fas fa-bell-slash"></i>
                      <p>No notifications yet</p>
                    </div>
                  ) : (
                    notifs.map(n => (
                      <div key={n.id} className={`notif-item ${n.is_read === 0 ? 'unread' : ''}`}
                           onClick={() => {
                             markAsRead(n.id)
                             if (n.link) { navigate(n.link); setNotifOpen(false) }
                           }}>
                        <div className="notif-title">{n.title}</div>
                        {n.message && <div className="notif-msg">{n.message}</div>}
                        <div className="notif-time">{new Date(n.created_at).toLocaleString()}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="topbar-user">
            <span className="user-name">{staff.name}</span>
            <span className={`role-pill role-${staff.user_type}`}>{staff.user_type}</span>
          </div>
        </header>
        <main className="admin-content">
          <Outlet />
        </main>
      </div>

      <style>{css}</style>
    </div>
  )
}

const css = `
.admin-shell {
  display: grid;
  grid-template-columns: 260px 1fr;
  min-height: 100vh;
  background: var(--espresso);
}

/* Sidebar */
.admin-sidebar {
  background: var(--bean);
  border-right: 1px solid var(--border);
  position: sticky; top: 0;
  height: 100vh;
  overflow-y: auto;
  display: flex; flex-direction: column;
}
.admin-brand {
  padding: 1.5rem 1.25rem;
  display: flex; align-items: center; gap: .85rem;
  border-bottom: 1px solid var(--border-l);
}
.admin-brand i {
  font-size: 1.8rem;
  color: var(--gold);
}
.brand-name {
  font-family: 'Playfair Display', serif;
  font-size: 1.15rem;
  font-style: italic;
  color: var(--cream);
}
.brand-name strong { color: var(--gold); font-weight: 500; font-style: normal; }
.brand-sub {
  font-family: 'Inter', sans-serif;
  font-size: .58rem;
  font-weight: 500;
  letter-spacing: .25em;
  color: var(--text-l);
  margin-top: .15rem;
  text-transform: uppercase;
}

.admin-nav {
  display: flex; flex-direction: column;
  padding: 1rem 0;
  flex: 1;
}
.admin-nav a, .admin-nav button {
  display: flex; align-items: center; gap: .8rem;
  padding: .8rem 1.25rem;
  color: var(--text-m);
  font-family: 'Inter', sans-serif;
  font-size: .68rem;
  font-weight: 500;
  letter-spacing: .18em;
  text-transform: uppercase;
  border-left: 2px solid transparent;
  transition: all .2s;
  text-align: left;
  background: transparent;
  cursor: pointer;
}
.admin-nav a:hover, .admin-nav button:hover {
  color: var(--gold);
  background: rgba(200,156,76,.04);
}
.admin-nav a.active {
  color: var(--gold);
  background: rgba(200,156,76,.07);
  border-left-color: var(--gold);
}
.admin-nav a i, .admin-nav button i {
  font-size: .85rem;
  width: 16px;
  text-align: center;
  color: var(--gold);
  opacity: .7;
}
.admin-nav a.active i { opacity: 1; }
.nav-section {
  padding: 1.25rem 1.25rem .5rem;
  font-family: 'Inter', sans-serif;
  font-size: .56rem;
  font-weight: 500;
  letter-spacing: .3em;
  text-transform: uppercase;
  color: var(--text-l);
}
.nav-signout {
  color: var(--danger) !important;
  margin-top: auto;
}
.nav-signout i { color: var(--danger) !important; }

/* Topbar */
.admin-main { display: flex; flex-direction: column; min-width: 0; }
.admin-topbar {
  background: var(--bean);
  border-bottom: 1px solid var(--border-l);
  padding: 0 1.5rem;
  height: 64px;
  display: flex; align-items: center; gap: 1rem;
  position: sticky; top: 0; z-index: 50;
  backdrop-filter: blur(12px);
}
.admin-toggle { display: none; color: var(--gold); font-size: 1.2rem; }
.topbar-user {
  display: flex; align-items: center; gap: .75rem;
}
.user-name { color: var(--cream); font-size: .9rem; }

/* Notification bell */
.notif-wrap { position: relative; }
.notif-bell {
  width: 38px; height: 38px;
  display: flex; align-items: center; justify-content: center;
  color: var(--gold);
  position: relative;
  transition: background .2s;
  border-radius: 50%;
}
.notif-bell:hover { background: rgba(200,156,76,.1); }
.notif-count {
  position: absolute; top: 3px; right: 3px;
  background: var(--danger); color: white;
  font-family: 'Inter', sans-serif;
  font-size: .58rem; font-weight: 600;
  padding: 1px 5px; border-radius: 9px;
  min-width: 16px; text-align: center;
}
.notif-dropdown {
  position: absolute; top: calc(100% + 6px); right: 0;
  width: 360px; max-width: 92vw;
  background: var(--bean);
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
  max-height: 500px;
  display: flex; flex-direction: column;
  z-index: 100;
}
.notif-head {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border-l);
  display: flex; justify-content: space-between; align-items: center;
  font-family: 'Inter', sans-serif;
  font-size: .72rem;
  font-weight: 500;
  letter-spacing: .22em;
  text-transform: uppercase;
  color: var(--gold);
}
.notif-mark-all {
  font-family: 'Inter', sans-serif;
  font-size: .6rem;
  font-weight: 400;
  letter-spacing: .18em;
  text-transform: uppercase;
  color: var(--text-m);
  transition: color .2s;
}
.notif-mark-all:hover { color: var(--gold); }
.notif-list { overflow-y: auto; flex: 1; }
.notif-item {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border-l);
  cursor: pointer;
  transition: background .2s;
}
.notif-item:hover { background: rgba(200,156,76,.04); }
.notif-item.unread { background: rgba(200,156,76,.06); border-left: 3px solid var(--gold); padding-left: calc(1.25rem - 3px); }
.notif-title { color: var(--cream); font-size: .88rem; font-weight: 500; margin-bottom: .2rem; }
.notif-msg { color: var(--text-m); font-size: .8rem; margin-bottom: .3rem; }
.notif-time { color: var(--text-l); font-size: .7rem; }
.notif-empty {
  text-align: center; padding: 3rem 1rem;
  color: var(--text-l);
}
.notif-empty i { font-size: 2rem; color: var(--gold); opacity: .3; margin-bottom: .75rem; }

.admin-content { padding: 2rem 1.75rem; }

/* MOBILE */
@media (max-width: 900px) {
  .admin-shell { grid-template-columns: 1fr; }
  .admin-sidebar {
    position: fixed; top: 0; left: 0; bottom: 0;
    width: 260px;
    z-index: 100;
    transform: translateX(-100%);
    transition: transform .3s;
  }
  .admin-sidebar.open { transform: translateX(0); box-shadow: var(--shadow); }
  .admin-toggle { display: block; }
  .admin-content { padding: 1.25rem; }
  .notif-dropdown { right: -50px; }
}
`
