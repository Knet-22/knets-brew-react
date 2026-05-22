import { Link } from 'react-router-dom'
import { CAFE_ADDRESS, CAFE_HOURS, CAFE_PHONE } from '../data/products'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-bg-deep/90 px-4 py-12 text-cream sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-gold-primary bg-white/5 text-gold-primary">
                <i className="fa-solid fa-mug-hot" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-cream/40">Knet's Brew</p>
                <p className="text-sm font-semibold text-cream">Calape, Bohol</p>
              </div>
            </div>
            <p className="max-w-xs text-sm leading-7 text-cream/50">
              Rare beans, patient brewing, and a modern dark lounge aesthetic — designed for guests who appreciate luxury in every cup.
            </p>
            {/* Social links */}
            <div className="flex gap-3 pt-1">
              {[
                { icon: 'fa-facebook-f', href: 'https://facebook.com', label: 'Facebook' },
                { icon: 'fa-instagram', href: 'https://instagram.com', label: 'Instagram' },
                { icon: 'fa-tiktok', href: 'https://tiktok.com', label: 'TikTok' },
              ].map(({ icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-cream/50 transition hover:border-gold-primary hover:text-gold-primary"
                >
                  <i className={`fa-brands ${icon} text-sm`} />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.35em] text-cream/40">Explore</p>
            <div className="flex flex-col gap-2.5 text-sm">
              {[
                { label: 'Menu', to: '/menu' },
                { label: 'Order a cup', to: '/order' },
                { label: 'Track a brew', to: '/track' },
                { label: "Knet's Brew Dashboard", to: '/admin/login' },
              ].map(({ label, to }) => (
                <Link key={to} to={to} className="text-cream/55 transition hover:text-gold-primary">
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.35em] text-cream/40">Location</p>
            <div className="space-y-2 text-sm leading-7 text-cream/55">
              <p className="flex items-start gap-2">
                <i className="fa-solid fa-location-dot mt-1 shrink-0 text-gold-primary/60" />
                {CAFE_ADDRESS}
              </p>
              <p className="flex items-start gap-2">
                <i className="fa-solid fa-clock mt-1 shrink-0 text-gold-primary/60" />
                {CAFE_HOURS}
              </p>
              <p className="flex items-start gap-2">
                <i className="fa-solid fa-phone mt-1 shrink-0 text-gold-primary/60" />
                <a href={`tel:+63${CAFE_PHONE.slice(1)}`} className="transition hover:text-gold-primary">
                  (+63) {CAFE_PHONE.slice(1)}
                </a>
              </p>
            </div>
          </div>

          {/* Order CTA */}
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.35em] text-cream/40">Ready to order?</p>
            <p className="text-sm leading-7 text-cream/55">
              Skip the wait — reserve your premium coffee ahead of your visit.
            </p>
            <Link
              to="/order"
              className="inline-flex items-center gap-2 rounded-full bg-gold-light px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.22em] text-bg-main shadow-[0_0_18px_rgba(196,154,108,0.25)] transition hover:bg-gold-primary"
            >
              Order now
              <i className="fa-solid fa-arrow-right text-xs" />
            </Link>
          </div>

        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-center text-xs text-cream/30 sm:flex-row">
          <span>© {new Date().getFullYear()} Knet's Brew · Calape, Bohol</span>
          <span>Crafted with care for rare coffee lovers.</span>
        </div>
      </div>
    </footer>
  )
}
