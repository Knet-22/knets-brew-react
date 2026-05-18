import { useState, useEffect, useMemo } from 'react'
import { getNotifications, type NotificationItem } from '../../data/admin'
import { useAuth } from '../../context/AuthContext'

export default function AdminNotifications() {
  const { user } = useAuth()
  const notifications = useMemo(() => getNotifications(user?.role ?? 'staff'), [user?.role])
  const [readNotifications, setReadNotifications] = useState<string[]>([])

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
  }, [user])

  const unreadNotifications = notifications.filter((notification) => !readNotifications.includes(notification.id))

  const markAllRead = () => {
    if (!user) return
    const ids = notifications.map((notification) => notification.id)
    setReadNotifications(ids)
    localStorage.setItem(`knets_brew_notifications_${user.username}`, JSON.stringify(ids))
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-cream-muted">Management</p>
          <h1 className="mt-2 text-4xl font-semibold text-cream">Notifications</h1>
          <p className="mt-2 text-sm text-cream-muted">Latest activity for your role.</p>
        </div>
        {unreadNotifications.length > 0 && (
          <button
            type="button"
            onClick={markAllRead}
            className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-gold-primary/10 px-4 py-3 text-sm font-semibold text-gold-primary transition hover:bg-gold-primary/15"
          >
            Mark all read
          </button>
        )}
      </div>

      <div className="surface-glow rounded-[2rem] border border-white/10 bg-bg-surface/90 p-8 shadow-soft">
        {notifications.length === 0 ? (
          <p className="text-sm text-cream-muted">No notifications at the moment.</p>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => {
              const unread = !readNotifications.includes(notification.id)
              return (
                <div
                  key={notification.id}
                  className={`rounded-3xl border p-5 transition ${
                    unread ? 'border-gold-primary bg-gold-primary/10' : 'border-white/10 bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-cream">{notification.title}</p>
                      <p className="mt-2 text-sm leading-6 text-cream-muted">{notification.description}</p>
                    </div>
                    <span className="rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.25em] text-cream-muted">
                      {notification.date}
                    </span>
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
