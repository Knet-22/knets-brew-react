import { useState, useEffect, useMemo } from 'react'
import { getNotifications } from '../../data/admin'
import { useAuth } from '../../context/AuthContext'
import { useOrders } from '../../context/OrdersContext'

export default function AdminNotifications() {
  const { user } = useAuth()
  const { orders } = useOrders()
  const notifications = useMemo(
    () => getNotifications(user?.role ?? 'staff', orders),
    [user?.role, orders],
  )
  const [readIds, setReadIds] = useState<string[]>([])

  // Load stored read state
  useEffect(() => {
    if (!user) return
    try {
      const stored = localStorage.getItem(`knets_brew_notifications_${user.username}`)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) setReadIds(parsed)
      }
    } catch {}
  }, [user])

  // Mark all as read when this page is open
  useEffect(() => {
    if (!user || notifications.length === 0) return
    const ids = notifications.map((n) => n.id)
    setReadIds(ids)
    localStorage.setItem(`knets_brew_notifications_${user.username}`, JSON.stringify(ids))
  }, [notifications, user])

  const unreadCount = notifications.filter((n) => !readIds.includes(n.id)).length

  const markAllRead = () => {
    if (!user) return
    const ids = notifications.map((n) => n.id)
    setReadIds(ids)
    localStorage.setItem(`knets_brew_notifications_${user.username}`, JSON.stringify(ids))
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-cream-muted">Management</p>
          <h1 className="mt-2 text-4xl font-semibold text-cream">Notifications</h1>
          <p className="mt-2 text-sm text-cream-muted">
            {notifications.length} total · {unreadCount} unread
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllRead}
            className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-gold-primary/10 px-4 py-3 text-sm font-semibold text-gold-primary transition hover:bg-gold-primary/15"
          >
            Mark all read
          </button>
        )}
      </div>

      <div className="surface-glow rounded-[2rem] border border-white/10 bg-bg-surface/90 p-6 shadow-soft sm:p-8">
        {notifications.length === 0 ? (
          <p className="text-sm text-cream-muted">No notifications at the moment.</p>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => {
              const unread = !readIds.includes(notification.id)
              const isOrder = notification.type === 'order'
              return (
                <div
                  key={notification.id}
                  className={`rounded-3xl border p-5 transition ${
                    unread
                      ? isOrder
                        ? 'border-gold-primary bg-gold-primary/10'
                        : 'border-amber-500/30 bg-amber-500/5'
                      : 'border-white/10 bg-white/5'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <span className={`mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        isOrder ? 'bg-gold-primary/10 text-gold-primary' : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        <i className={`fa-solid ${isOrder ? 'fa-receipt' : 'fa-triangle-exclamation'} text-xs`} />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-cream">{notification.title}</p>
                        <p className="mt-1 text-sm leading-6 text-cream-muted">{notification.description}</p>
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-2">
                      <span className="rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.25em] text-cream-muted">
                        {notification.date}
                      </span>
                      {unread && (
                        <span className={`rounded-full px-2 py-0.5 text-[0.6rem] uppercase tracking-[0.2em] font-semibold ${
                          isOrder ? 'bg-gold-primary/20 text-gold-primary' : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          New
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
