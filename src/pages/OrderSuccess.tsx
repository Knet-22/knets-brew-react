import { Link, useParams } from 'react-router-dom'

export default function OrderSuccess() {
  const { code } = useParams<{ code: string }>()

  return (
    <div className="mx-auto max-w-3xl space-y-10 rounded-[3rem] border border-white/10 bg-bg-surface/95 p-12 shadow-soft sm:p-14">
      <div className="space-y-4 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gold-primary/10 text-3xl text-gold-primary">
          <i className="fa-solid fa-check" />
        </div>
        <p className="text-xs uppercase tracking-[0.35em] text-cream-muted">Order confirmed</p>
        <h1 className="text-4xl font-semibold text-cream">Your reservation is ready for pickup.</h1>
        <p className="mx-auto max-w-xl text-sm leading-7 text-cream-muted">
          Thanks for choosing Knet’s Brew. Bring your reservation code to our lounge in Calape and enjoy the premium coffee experience we prepared for you.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-[2rem] border border-white/10 bg-black/10 p-6">
          <p className="text-xs uppercase tracking-[0.35em] text-cream-muted">Reservation code</p>
          <p className="mt-4 text-3xl font-semibold text-cream">{code ?? 'KB-XXXXXX'}</p>
        </div>
        <div className="rounded-[2rem] border border-white/10 bg-black/10 p-6">
          <p className="text-xs uppercase tracking-[0.35em] text-cream-muted">Pickup instructions</p>
          <p className="mt-4 text-sm leading-7 text-cream-muted">
            Visit our coffee lounge in Ulbujan, Calape. Show this code to the barista and your curated coffee order will be ready right away.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
        <Link
          to="/track"
          className="inline-flex w-full items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-4 text-sm uppercase tracking-[0.24em] text-cream transition hover:border-gold-primary hover:text-gold-primary sm:w-auto"
        >
          Track order
        </Link>
        <Link
          to="/menu"
          className="inline-flex w-full items-center justify-center rounded-full bg-gold-primary px-6 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-bg-main transition hover:bg-gold-light sm:w-auto"
        >
          Explore more roasts
        </Link>
      </div>
    </div>
  )
}
