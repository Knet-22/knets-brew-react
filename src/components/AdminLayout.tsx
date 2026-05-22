import { useState, useMemo, useEffect } from 'react'
import { NavLink, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getNotifications } from '../data/admin'
import type { ReactNode } from 'react'

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout, loading } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [readNotifications, setReadNotifications] = useState<string[]>([])

  // All hooks must run before any conditional return (Rules of Hooks)
  const notifications = useMemo(() => user ? getNotifications(user.role) : [], [user])

  useEffect(() => {
    if (!user) return
    const stored = localStorage.getItem(`knets_brew_notifications_${user.username}`)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          setReadNotifications(parsed)
        }
      } catch {
        localStorage.removeItem(`knets_brew_notifications_${user.username}`)
      }
    }
  }, [user?.username])

  // Wait for auth to resolve before deciding to redirect
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-main">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-gold-primary" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />
  }

  const unreadNotifications = notifications.filter((notification) => !readNotifications.includes(notification.id))
  const notificationCount = unreadNotifications.length

  const markAllRead = () => {
    const ids = notifications.map((notification) => notification.id)
    setReadNotifications(ids)
    localStorage.setItem(`knets_brew_notifications_${user.username}`, JSON.stringify(ids))
  }

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const navLinks = [
    { label: 'Dashboard', to: '/admin', icon: 'fa-chart-line', roles: ['admin', 'staff'] },
    { label: 'Notifications', to: '/admin/notifications', icon: 'fa-bell', roles: ['admin', 'staff'] },
    { label: 'Orders', to: '/admin/orders', icon: 'fa-receipt', roles: ['admin', 'staff'] },
    { label: 'Products', to: '/admin/products', icon: 'fa-coffee', roles: ['admin'] },
  ].filter((link) => link.roles.includes(user.role))

  return (
    <div className="flex bg-bg-main">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-white/10 bg-bg-deep/95 backdrop-blur-xl transition-transform sm:sticky sm:top-0 sm:h-screen sm:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-gold-primary bg-white/5 text-gold-primary">
            <i className="fa-solid fa-mug-hot" />
          </span>
          <div>
            <p className="text-sm font-semibold text-cream">Knet's Brew</p>
            <p className="text-xs uppercase tracking-[0.28em] text-cream-muted">
              {user.role === 'admin' ? 'Admin' : 'Staff'} Dashboard
            </p>
          </div>
        </div>

        <nav className="space-y-1 px-4 py-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center justify-between gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  isActive ? 'bg-gold-primary/15 text-gold-primary' : 'text-cream/70 hover:text-cream'
                }`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <span className="flex items-center gap-3">
                <i className={`fa-solid ${link.icon}`} />
                {link.label}
              </span>
              {link.label === 'Notifications' && notificationCount > 0 ? (
                <span className="inline-flex h-7 min-w-[1.75rem] items-center justify-center rounded-full bg-gold-primary px-2 text-xs font-semibold text-bg-main">
                  {notificationCount}
                </span>
              ) : null}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-bg-deep/95 p-4">
          <div className="mb-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm">
            <p className="text-xs uppercase tracking-[0.28em] text-cream-muted">Logged in as</p>
            <p className="mt-2 font-semibold text-cream">{user.name}</p>
            <p className="text-xs text-cream-muted">{user.username}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-cream/70 transition hover:border-gold-primary hover:text-gold-primary"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-h-screen flex-1 flex-col">
        {/* Topbar */}
        <header className="relative sticky top-0 z-30 flex h-20 items-center gap-4 border-b border-white/10 bg-bg-deep/95 px-6 backdrop-blur-xl sm:justify-between">
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 text-cream transition hover:border-gold-primary hover:text-gold-primary sm:hidden"
          >
            <i className={`fa-solid ${sidebarOpen ? 'fa-xmark' : 'fa-bars'}`} />
          </button>
          <div className="hidden text-sm text-cream-muted sm:block">
            <span className="font-semibold text-cream">{user.name}</span>
            <span className="mx-2">·</span>
            <span>{user.role === 'admin' ? 'Administrator' : 'Staff'}</span>
          </div>
          <div className="relative ml-auto flex items-center gap-3">
            <button
              type="button"
              onClick={() => setNotificationsOpen((value) => !value)}
              className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 text-cream transition hover:border-gold-primary hover:text-gold-primary"
              aria-label="View notifications"
            >
              <i className="fa-solid fa-bell" />
              {notificationCount > 0 && (
                <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-gold-primary px-1.5 text-[0.65rem] font-semibold text-bg-main">
                  {notificationCount}
                </span>
              )}
            </button>
          </div>
          {notificationsOpen && (
            <div className="absolute right-6 top-20 z-50 w-full max-w-sm rounded-[2rem] border border-white/10 bg-bg-surface/95 p-4 shadow-soft backdrop-blur-xl">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-cream">Notifications</p>
                  <p className="text-xs text-cream-muted">{notificationCount} unread</p>
                </div>
                <div className="flex items-center gap-2">
                  {notificationCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllRead}
                      className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-cream transition hover:border-gold-primary hover:text-gold-primary"
                    >
                      Mark all read
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setNotificationsOpen(false)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-cream transition hover:border-gold-primary hover:text-gold-primary"
                    aria-label="Close notifications"
                  >
                    <i className="fa-solid fa-xmark" />
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                {notifications.length === 0 ? (
                  <p className="text-sm text-cream-muted">No notifications right now.</p>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`rounded-3xl border p-4 ${
                        unreadNotifications.some((item) => item.id === notification.id)
                          ? 'border-gold-primary bg-gold-primary/10'
                          : 'border-white/10 bg-white/5'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-cream">{notification.title}</p>
                        <span className="text-[0.65rem] uppercase tracking-[0.3em] text-cream-muted">{notification.date}</span>
                      </div>
                      <p className="mt-2 text-sm text-cream-muted">{notification.description}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </header>

        {/* Content */}
        <main className="px-6 py-8 sm:px-8">
          {children}
        </main>
      </div>
    </div>
  )
}
