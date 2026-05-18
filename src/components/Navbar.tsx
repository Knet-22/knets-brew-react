import { useState } from 'react'
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

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-bg-deep/90 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-6 py-4 sm:px-8">
        <Link to="/" className="flex items-center gap-3" aria-label="Knet's Brew home">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-gold-primary bg-white/5 text-gold-primary shadow-glow">
            <i className="fa-solid fa-mug-hot" />
          </span>
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-cream-muted">Knet’s Brew</p>
            <p className="text-xl font-semibold tracking-[0.1em] text-cream">Calape, Bohol</p>
          </div>
        </Link>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 text-cream transition hover:border-gold-primary hover:text-gold-primary focus:outline-none md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle navigation"
        >
          <i className={`fa-solid ${open ? 'fa-xmark' : 'fa-bars'}`} />
        </button>

        <nav className={`absolute inset-x-0 top-full mt-3 rounded-3xl border border-white/10 bg-bg-surface/95 p-5 shadow-soft backdrop-blur-xl transition duration-300 md:static md:mt-0 md:flex md:w-auto md:items-center md:bg-transparent md:p-0 md:shadow-none ${open ? 'block' : 'hidden'}`}>
          <ul className="space-y-4 md:flex md:space-x-8 md:space-y-0">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `inline-flex items-center rounded-full px-4 py-3 text-sm font-medium uppercase tracking-[0.22em] transition ${
                      isActive ? 'bg-gold-primary/15 text-gold-primary' : 'text-cream/75 hover:text-gold-primary'
                    }`
                  }
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <Link
          to="/order"
          className="relative inline-flex h-11 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 text-sm uppercase tracking-[0.25em] text-cream transition hover:border-gold-primary hover:text-gold-primary sm:px-5"
        >
          <i className="fa-solid fa-shopping-bag text-base" />
          <span>Cart</span>
          {itemCount > 0 && (
            <span className="absolute -right-2 top-1/2 -translate-y-1/2 rounded-full bg-gold-primary px-2 py-0.5 text-[0.65rem] font-semibold uppercase text-bg-main">
              {itemCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  )
}
