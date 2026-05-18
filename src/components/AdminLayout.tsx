import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { ReactNode } from 'react'

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (!user) {
    return null
  }

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const navLinks = [
    { label: 'Dashboard', to: '/admin', icon: 'fa-chart-line' },
    { label: 'Orders', to: '/admin/orders', icon: 'fa-receipt' },
    { label: 'Products', to: '/admin/products', icon: 'fa-coffee' },
  ]

  return (
    <div className="flex min-h-screen bg-bg-main">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-white/10 bg-bg-deep/95 backdrop-blur-xl transition-transform sm:static sm:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-gold-primary bg-white/5 text-gold-primary">
            <i className="fa-solid fa-mug-hot" />
          </span>
          <div>
            <p className="text-sm font-semibold text-cream">Knet's Brew</p>
            <p className="text-xs uppercase tracking-[0.28em] text-cream-muted">Admin</p>
          </div>
        </div>

        <nav className="space-y-1 px-4 py-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  isActive ? 'bg-gold-primary/15 text-gold-primary' : 'text-cream/70 hover:text-cream'
                }`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <i className={`fa-solid ${link.icon}`} />
              {link.label}
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
      <div className="flex flex-1 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-20 items-center gap-4 border-b border-white/10 bg-bg-deep/95 px-6 backdrop-blur-xl sm:justify-between">
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
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto px-6 py-8 sm:px-8">
          {children}
        </main>
      </div>
    </div>
  )
}
