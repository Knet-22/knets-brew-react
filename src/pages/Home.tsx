import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import SectionHeading from '../components/SectionHeading'
import { CAFE_ADDRESS, CAFE_HOURS, CAFE_PHONE } from '../data/products'
import { useProducts } from '../context/ProductsContext'

export default function Home() {
  const { products } = useProducts()
  const featured = products.filter((p) => p.featured).slice(0, 3)

  return (
    <div className="space-y-24 sm:space-y-32">

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-[2rem] bg-hero-glow px-6 py-16 sm:rounded-[3rem] sm:px-10 sm:py-24">
        <div className="absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top_left,_rgba(166,124,82,0.16),_transparent_36%)]" />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-6 sm:space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold-primary/30 bg-gold-primary/10 px-4 py-2 text-xs uppercase tracking-[0.4em] text-gold-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-primary" />
              Calape, Bohol's Finest
            </div>
            <h1 className="text-4xl font-semibold leading-tight tracking-[-0.03em] text-cream sm:text-5xl lg:text-6xl">
              Knet's Brew —<br className="hidden sm:block" /> Crafted for Those<br className="hidden sm:block" /> Who Know the Difference
            </h1>
            <p className="max-w-xl text-base leading-8 text-cream/60 sm:text-lg">
              Rare, world-class coffee and artisanal pastries — proudly crafted in Calape, Bohol
            </p>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <Link
                to="/menu"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gold-light px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.28em] text-bg-main shadow-[0_0_24px_rgba(196,154,108,0.3)] transition hover:bg-gold-primary sm:px-7 sm:py-4"
              >
                <i className="fa-solid fa-mug-hot" />
                Explore menu
              </Link>
              <Link
                to="/order"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3.5 text-sm uppercase tracking-[0.28em] text-cream transition hover:border-gold-primary hover:text-gold-primary sm:px-7 sm:py-4"
              >
                <i className="fa-solid fa-shopping-bag" />
                View cart
              </Link>
            </div>

            {/* Quick info strip */}
            <div className="flex flex-wrap gap-4 border-t border-white/10 pt-6 text-xs uppercase tracking-[0.25em] text-cream/40">
              <span className="flex items-center gap-2">
                <i className="fa-solid fa-location-dot text-gold-primary/60" />
                {CAFE_ADDRESS}
              </span>
              <span className="flex items-center gap-2">
                <i className="fa-solid fa-clock text-gold-primary/60" />
                {CAFE_HOURS}
              </span>
            </div>
          </div>

          {/* Featured cards (desktop only) */}
          <div className="hidden grid-cols-1 gap-4 lg:grid lg:max-w-xs">
            {featured.slice(0, 2).map((product) => (
              <div
                key={product.id}
                className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-bg-surface/90 p-5 shadow-soft"
              >
                <p className="text-[0.65rem] uppercase tracking-[0.35em] text-cream/40">{product.category}</p>
                <h2 className="mt-3 text-xl font-semibold text-cream">{product.name}</h2>
                <p className="mt-2 text-sm leading-6 text-cream/55">{product.description}</p>
                <span className="mt-4 inline-flex rounded-full bg-gold-primary/10 px-4 py-1.5 text-sm font-semibold text-gold-primary">
                  ₱{product.price}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ──────────────────────────────────────────────────── */}
      <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-8 sm:space-y-10">
          <SectionHeading
            eyebrow="Signature Selection"
            title="Experience rare coffee that feels as crafted as jewelry."
            description="We bring premium beans from iconic origins, then serve them in an intimate dark-luxe atmosphere designed for quiet indulgence."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                label: 'Tasting notes',
                title: 'Silk, cherry, smoke, and citrus.',
                body: 'Each cup is balanced to highlight the origin and roasting signature. Expect quiet complexity, clean finishes, and a luxurious warmth.',
              },
              {
                label: 'The ritual',
                title: 'Slow brew, polished service.',
                body: 'From custom espresso to cold brew, our baristas curate every order with mindful precision and a premium presentation.',
              },
            ].map((card) => (
              <article key={card.label} className="surface-glow rounded-[2rem] border border-white/10 p-6 sm:p-8">
                <p className="text-xs uppercase tracking-[0.35em] text-cream/40">{card.label}</p>
                <h3 className="mt-3 text-xl font-semibold text-cream sm:text-2xl">{card.title}</h3>
                <p className="mt-3 text-sm leading-7 text-cream/60">{card.body}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="surface-glow rounded-[2.5rem] border border-white/10 bg-bg-surface/90 p-7 sm:rounded-[3rem] sm:p-10 lg:p-12">
          <p className="text-xs uppercase tracking-[0.35em] text-cream/40">Why choose Knet's Brew</p>
          <h3 className="mt-4 text-2xl font-semibold text-cream sm:text-3xl">A premium coffee destination for locals and travellers alike.</h3>
          <ul className="mt-7 space-y-5 text-sm text-cream/60">
            {[
              { n: '01', title: 'Crafted from rare beans', body: 'Hand-selected limited roasts including Black Ivory, Kopi Luwak and Panama Geisha.' },
              { n: '02', title: 'Elegant dark luxury', body: 'A calm modern lounge ambience with elevated service and curated details.' },
              { n: '03', title: 'Fast online ordering', body: 'Order ahead, then arrive with your coffee ready in minutes.' },
            ].map((item) => (
              <li key={item.n} className="flex gap-4">
                <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-gold-primary/10 text-xs font-semibold text-gold-primary">
                  {item.n}
                </span>
                <div>
                  <strong className="block text-cream">{item.title}</strong>
                  {item.body}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Featured Collection ─────────────────────────────────────────────── */}
      <section className="space-y-8 sm:space-y-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Featured Collection"
            title="Select from our curated rare roast menu."
            description="These premium classics and signature offerings are ready to be ordered for your next visit."
          />
          <Link
            to="/menu"
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm uppercase tracking-[0.2em] text-cream/70 transition hover:border-gold-primary hover:text-gold-primary"
          >
            Full menu
            <i className="fa-solid fa-arrow-right text-xs" />
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ── Our Story ──────────────────────────────────────────────────────── */}
      <section className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-bg-surface/90 shadow-soft sm:rounded-[3rem]">
        <div className="grid gap-0 lg:grid-cols-2">
          {/* Story text */}
          <div className="p-8 sm:p-12 lg:p-16">
            <p className="text-xs uppercase tracking-[0.4em] text-gold-primary/70">Our story</p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight text-cream sm:text-4xl">
              Born from a love of the world's rarest cups.
            </h2>
            <div className="mt-6 space-y-4 text-sm leading-7 text-cream/60">
              <p>
                Knet's Brew was founded with a single belief — that Calape, Bohol deserves a coffee experience on par with the world's finest lounges. Every product we serve is sourced from legendary origins, from Indonesian jungles to Panamanian highlands.
              </p>
              <p>
                We're more than a café. We're a destination for curious palates, quiet moments, and coffee stories worth telling. Our dark-luxe lounge is designed to slow you down — to let you savour every drop.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/menu"
                className="inline-flex items-center gap-2 rounded-full bg-gold-light px-6 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-bg-main shadow-[0_0_20px_rgba(196,154,108,0.25)] transition hover:bg-gold-primary"
              >
                Explore menu
              </Link>
              <a
                href={`tel:+63${CAFE_PHONE.replace(/\D/g, '').slice(1)}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm uppercase tracking-[0.25em] text-cream/70 transition hover:border-gold-primary hover:text-gold-primary"
              >
                <i className="fa-solid fa-phone text-xs" />
                Call us
              </a>
            </div>
          </div>

          {/* Atmosphere cards */}
          <div className="grid grid-cols-2 gap-px bg-white/10">
            {[
              { icon: 'fa-couch', label: 'The Lounge', desc: 'Dark luxury, warm light, quiet indulgence.' },
              { icon: 'fa-mortar-pestle', label: 'The Craft', desc: 'Precision-brewed by passionate baristas.' },
              { icon: 'fa-earth-asia', label: 'The Origin', desc: 'Beans sourced from 5 legendary regions.' },
              { icon: 'fa-star', label: 'The Experience', desc: 'Every visit is a curated ritual.' },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-start justify-end bg-bg-main p-6 sm:p-8">
                <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gold-primary/10 text-gold-primary">
                  <i className={`fa-solid ${item.icon} text-sm`} />
                </span>
                <p className="text-sm font-semibold text-cream">{item.label}</p>
                <p className="mt-1 text-xs leading-5 text-cream/50">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Location CTA ────────────────────────────────────────────────────── */}
      <section className="rounded-[2rem] border border-gold-primary/20 bg-gradient-to-br from-gold-primary/10 via-transparent to-transparent p-8 text-center sm:rounded-[3rem] sm:p-12">
        <p className="text-xs uppercase tracking-[0.4em] text-gold-primary/70">Visit us</p>
        <h2 className="mt-4 text-3xl font-semibold text-cream sm:text-4xl">Find us in Calape, Bohol</h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-cream/55">
          {CAFE_ADDRESS} · Open {CAFE_HOURS}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href={`tel:+63${CAFE_PHONE.replace(/\D/g, '').slice(1)}`}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm uppercase tracking-[0.25em] text-cream/70 transition hover:border-gold-primary hover:text-gold-primary"
          >
            <i className="fa-solid fa-phone text-xs" />
            {CAFE_PHONE}
          </a>
          <Link
            to="/order"
            className="inline-flex items-center gap-2 rounded-full bg-gold-light px-6 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-bg-main shadow-[0_0_20px_rgba(196,154,108,0.25)] transition hover:bg-gold-primary"
          >
            Order now
            <i className="fa-solid fa-arrow-right text-xs" />
          </Link>
        </div>
      </section>

    </div>
  )
}
