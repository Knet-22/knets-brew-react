import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-bg-deep/90 px-6 py-12 text-cream sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-3">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.35em] text-cream-muted">Knet's Brew</p>
          <h2 className="max-w-md text-3xl font-semibold leading-tight text-cream">A refined coffee destination in Calape, Bohol.</h2>
          <p className="max-w-sm text-sm leading-7 text-cream-muted">
            Rare beans, patient brewing, and a modern dark lounge aesthetic designed for guests who love luxury, warmth, and a coffee story in every cup.
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.35em] text-cream-muted">Our location</p>
          <div className="space-y-2 text-sm leading-7 text-cream-muted">
            <p>Ulbujan, Calape, Bohol</p>
            <p>Open daily 8:00am – 10:00pm</p>
            <p><a href="tel:+639663640516" className="hover:text-gold-primary transition">(+63) 966-364-0516</a></p>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.35em] text-cream-muted">Explore</p>
          <div className="flex flex-col gap-3 text-sm">
            <Link to="/menu" className="transition hover:text-gold-primary">Menu</Link>
            <Link to="/order" className="transition hover:text-gold-primary">Reserve a cup</Link>
            <Link to="/track" className="transition hover:text-gold-primary">Track a brew</Link>
          </div>
        </div>
      </div>
      <div className="mt-12 border-t border-white/10 pt-6 text-center text-sm text-cream-muted">
        © {new Date().getFullYear()} Knet's Brew · Crafted luxury coffee in Calape
      </div>
    </footer>
  )
}
