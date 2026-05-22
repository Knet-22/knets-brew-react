import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="mx-auto max-w-lg space-y-6 rounded-[3rem] border border-white/10 bg-bg-surface/95 p-10 shadow-soft sm:p-14">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/5 text-4xl">
          ☕
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-gold-primary/60">404 — Not Found</p>
          <h1 className="mt-3 text-4xl font-semibold text-cream sm:text-5xl">Cup not found.</h1>
          <p className="mt-4 text-sm leading-7 text-cream/50">
            This page seems to have gone cold. Head back to the menu or resume your order.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3.5 text-sm uppercase tracking-[0.22em] text-cream transition hover:border-gold-primary hover:text-gold-primary"
          >
            <i className="fa-solid fa-house text-xs" />
            Home
          </Link>
          <Link
            to="/menu"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gold-light px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.22em] text-bg-main shadow-[0_0_18px_rgba(196,154,108,0.25)] transition hover:bg-gold-primary"
          >
            <i className="fa-solid fa-mug-hot text-xs" />
            Menu
          </Link>
        </div>
      </div>
    </div>
  )
}
