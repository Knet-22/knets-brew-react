import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const links = [
  { label: 'Home', to: '/' },
  { label: 'Menu', to: '/menu' },
  { label: 'Order', to: '/order' },
  { label: 'Track', to: '/track' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { itemCount } = useCart()
  const menuRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    if (!open) return
    function onOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onOutside)
    return () => document.removeEventListener('mousedown', onOutside)
  }, [open])

  // Close on route change / scroll
  useEffect(() => {
    const onScroll = () => setOpen(false)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-bg-deep/90 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex shrink-0 items-center gap-3" aria-label="Knet's Brew home">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-gold-primary bg-white/5 text-gold-primary shadow-glow sm:h-11 sm:w-11">
            <i className="fa-solid fa-mug-hot text-base" />
          </span>
          <div className="hidden sm:block">
            <p className="text-[0.65rem] uppercase tracking-[0.35em] text-cream/50">Knet's Brew</p>
            <p className="text-base font-semibold tracking-[0.08em] text-cream sm:text-lg">Calape, Bohol</p>
          </div>
          <p className="text-base font-semibold tracking-[0.08em] text-cream sm:hidden">Knet's Brew</p>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `inline-flex items-center rounded-full px-4 py-2 text-sm font-medium uppercase tracking-[0.2em] transition ${
                  isActive ? 'bg-gold-primary/15 text-gold-primary' : 'text-cream/70 hover:text-gold-primary'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <Link
            to="/admin/login"
            className="ml-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm uppercase tracking-[0.2em] text-cream/60 transition hover:border-gold-primary hover:text-gold-primary"
          >
            <i className="fa-solid fa-lock text-xs" />
            Dashboard
          </Link>
        </nav>

        {/* Right: Cart + Hamburger */}
        <div className="flex items-center gap-2 sm:gap-3" ref={menuRef}>
          <Link
            to="/order"
            className="relative inline-flex h-10 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 text-sm uppercase tracking-[0.2em] text-cream transition hover:border-gold-primary hover:text-gold-primary sm:h-11 sm:px-4"
          >
            <i className="fa-solid fa-shopping-bag text-base" />
            <span className="hidden sm:inline">Cart</span>
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-1.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-gold-primary px-1.5 text-[0.6rem] font-bold text-bg-main">
                {itemCount}
              </span>
            )}
          </Link>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 text-cream transition hover:border-gold-primary hover:text-gold-primary focus:outline-none md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle navigation"
            aria-expanded={open}
          >
            <i className={`fa-solid ${open ? 'fa-xmark' : 'fa-bars'} text-base`} />
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <div
        className={`overflow-hidden transition-all duration-300 md:hidden ${open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <nav className="border-t border-white/10 bg-bg-deep/95 px-4 py-4 backdrop-blur-xl">
          <ul className="space-y-1">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `flex items-center rounded-2xl px-4 py-3 text-sm font-medium uppercase tracking-[0.2em] transition ${
                      isActive ? 'bg-gold-primary/15 text-gold-primary' : 'text-cream/70 hover:bg-white/5 hover:text-gold-primary'
                    }`
                  }
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
            <li>
              <Link
                to="/admin/login"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-2xl px-4 py-3 text-sm uppercase tracking-[0.2em] text-cream/50 transition hover:bg-white/5 hover:text-gold-primary"
              >
                <i className="fa-solid fa-lock text-xs" />
                Knet's Brew Dashboard
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
