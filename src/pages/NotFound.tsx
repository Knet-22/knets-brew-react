import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl rounded-[3rem] border border-white/10 bg-bg-surface/95 p-14 text-center shadow-soft">
      <p className="text-xs uppercase tracking-[0.35em] text-cream-muted">404</p>
      <h1 className="mt-6 text-5xl font-semibold text-cream">Page not found</h1>
      <p className="mt-6 text-sm leading-7 text-cream-muted">
        The page you’re looking for doesn’t exist. Return to the menu or resume your order.
      </p>
      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-4 text-sm uppercase tracking-[0.24em] text-cream transition hover:border-gold-primary hover:text-gold-primary"
        >
          Home
        </Link>
        <Link
          to="/menu"
          className="inline-flex items-center justify-center rounded-full bg-gold-primary px-6 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-bg-main transition hover:bg-gold-light"
        >
          Menu
        </Link>
      </div>
    </div>
  )
}
